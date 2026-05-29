import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const LEDGER_DIR = "docs/client-ops-ledger";
const OUTBOX_DIR = `${LEDGER_DIR}/outbox`;
const CURRENT_BRIEF_PATH = `${LEDGER_DIR}/morning-brief-current.md`;
const OUTREACH_STATS_PATH = `${LEDGER_DIR}/outreach-email-stats-current.csv`;
const BUSINESS_AUDIT_PATH = `${LEDGER_DIR}/business-improvement-audit-current.md`;
const OWNER_CONTEXT_PATH = `${LEDGER_DIR}/owner-morning-context-current.md`;
const DEFAULT_OWNER_DM_CHANNEL_ID = "D0ATLRTCP2P";
const DEFAULT_WEATHER_LOCATION = {
  label: "Madison, CT",
  latitude: 41.27954,
  longitude: -72.59843,
};

export type BriefArchiveItem = {
  date: string;
  file: string;
  title: string;
  summary: string;
};

export type OutreachEmailStat = {
  lane: string;
  workflow: string;
  sent: number;
  delivered: number;
  deliveredPct: number;
  opened: number;
  openedPct: number;
  replied: number;
  bounced: number;
  bouncePct: number;
  unsubscribed: number;
};

export type BusinessAuditSummary = {
  date: string;
  efficiencyScore: string;
  ownerNeededJobs: number;
  watchedActiveJobs: number;
  timerOverdueJobs: number;
  manualAuditQueue: number;
  systemsBuildQueue: number;
  mainConstraint: string;
  processImprovements: string[];
  ownerDecisions: string[];
  sourceFile: string;
};

export type SlackOwnerSignal = {
  title: string;
  action: string;
  timestamp: string;
  source: string;
};

export type SlackOwnerSignals = {
  ok: boolean;
  source: string;
  error?: string;
  signals: SlackOwnerSignal[];
};

export type OwnerMorningContext = {
  date: string;
  email: {
    inboxTotal: number;
    inboxUnread: number;
    focused24h: number;
    focusedUnread24h: number;
    summary: string;
    source: string;
  };
  calendar: {
    todayEvents: number;
    status: string;
    summary: string;
    source: string;
  };
  sourceFile: string;
};

export type MorningWeather = {
  ok: boolean;
  location: string;
  tempF?: number;
  feelsLikeF?: number;
  condition?: string;
  highF?: number;
  lowF?: number;
  windMph?: number;
  error?: string;
};

export type MorningBriefData = {
  date: string;
  commercialBrief: string[];
  customLayer: string[];
  needsMike: string[];
  marketSignals: string[];
  recommendedMove: string;
  sourceStatus: string[];
  proofUsed: string[];
  stats: OutreachEmailStat[];
  businessAudit: BusinessAuditSummary;
  ownerContext: OwnerMorningContext;
  archive: BriefArchiveItem[];
  currentFile: string;
  statsFile: string;
};

export function getMorningBriefData(): MorningBriefData {
  const current = readText(CURRENT_BRIEF_PATH);
  const stats = readCsv(OUTREACH_STATS_PATH).map(toOutreachEmailStat);
  const businessAudit = readBusinessAudit();
  const ownerContext = readOwnerMorningContext();
  const archive = getBriefArchive();

  return {
    date: firstMatch(current, /^Date:\s*(.+)$/m) || todayEastern(),
    commercialBrief: readBullets(readSection(current, "Commercial Brief")),
    customLayer: readBullets(readSection(current, "Custom Layer")),
    needsMike: readBullets(readSection(current, "Needs Mike Today")),
    marketSignals: readBullets(readSection(current, "Market Signal")),
    recommendedMove: readSection(current, "Recommended Move").trim() || "No recommendation found yet.",
    sourceStatus: readBullets(readSection(current, "Source Status")),
    proofUsed: readBullets(readSection(current, "Proof Used")),
    stats,
    businessAudit,
    ownerContext,
    archive,
    currentFile: CURRENT_BRIEF_PATH,
    statsFile: OUTREACH_STATS_PATH,
  };
}

export async function getMorningWeather(): Promise<MorningWeather> {
  const latitude = Number(process.env.MORNING_BRIEF_WEATHER_LAT ?? DEFAULT_WEATHER_LOCATION.latitude);
  const longitude = Number(process.env.MORNING_BRIEF_WEATHER_LON ?? DEFAULT_WEATHER_LOCATION.longitude);
  const location = process.env.MORNING_BRIEF_WEATHER_LABEL?.trim() || DEFAULT_WEATHER_LOCATION.label;

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return { ok: false, location, error: "Weather coordinates are invalid." };
  }

  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(latitude));
    url.searchParams.set("longitude", String(longitude));
    url.searchParams.set("current", "temperature_2m,apparent_temperature,weather_code,wind_speed_10m");
    url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min");
    url.searchParams.set("temperature_unit", "fahrenheit");
    url.searchParams.set("wind_speed_unit", "mph");
    url.searchParams.set("timezone", "America/New_York");
    url.searchParams.set("forecast_days", "1");

    const response = await fetch(url, { next: { revalidate: 900 } });
    const body = (await response.json()) as {
      current?: {
        temperature_2m?: number;
        apparent_temperature?: number;
        weather_code?: number;
        wind_speed_10m?: number;
      };
      daily?: {
        temperature_2m_max?: number[];
        temperature_2m_min?: number[];
      };
    };
    if (!response.ok) return { ok: false, location, error: `Weather fetch failed with ${response.status}.` };

    return {
      ok: true,
      location,
      tempF: round(body.current?.temperature_2m ?? 0),
      feelsLikeF: round(body.current?.apparent_temperature ?? 0),
      condition: weatherCodeLabel(body.current?.weather_code),
      highF: round(body.daily?.temperature_2m_max?.[0] ?? 0),
      lowF: round(body.daily?.temperature_2m_min?.[0] ?? 0),
      windMph: round(body.current?.wind_speed_10m ?? 0),
    };
  } catch (error) {
    return {
      ok: false,
      location,
      error: error instanceof Error ? error.message : "Weather fetch failed.",
    };
  }
}

export async function getSlackOwnerSignals(): Promise<SlackOwnerSignals> {
  const token = process.env.SLACK_BOT_TOKEN?.trim();
  const channel = process.env.MANAGER_OWNER_DM_CHANNEL_ID?.trim() || DEFAULT_OWNER_DM_CHANNEL_ID;
  const source = "Manager Slack DM";
  if (!token) {
    return {
      ok: false,
      source,
      error: "SLACK_BOT_TOKEN is not configured for this runtime.",
      signals: [],
    };
  }

  try {
    const url = new URL("https://slack.com/api/conversations.history");
    url.searchParams.set("channel", channel);
    url.searchParams.set("limit", "20");
    const response = await fetch(url, {
      headers: { authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    });
    const body = (await response.json()) as {
      ok?: boolean;
      error?: string;
      messages?: Array<{ text?: string; ts?: string }>;
    };
    if (!response.ok || !body.ok) {
      return {
        ok: false,
        source,
        error: body.error || `Slack API failed with ${response.status}`,
        signals: [],
      };
    }

    const signals = (body.messages ?? [])
      .map((message) => toSlackOwnerSignal(message.text ?? "", message.ts ?? "", source))
      .filter((signal): signal is SlackOwnerSignal => Boolean(signal))
      .slice(0, 5);

    return { ok: true, source, signals };
  } catch (error) {
    return {
      ok: false,
      source,
      error: error instanceof Error ? error.message : "Slack signal fetch failed.",
      signals: [],
    };
  }
}

export function statTotals(stats: OutreachEmailStat[]) {
  const sent = stats.reduce((sum, item) => sum + item.sent, 0);
  const delivered = stats.reduce((sum, item) => sum + item.delivered, 0);
  const opened = stats.reduce((sum, item) => sum + item.opened, 0);
  const replied = stats.reduce((sum, item) => sum + item.replied, 0);
  const bounced = stats.reduce((sum, item) => sum + item.bounced, 0);
  const unsubscribed = stats.reduce((sum, item) => sum + item.unsubscribed, 0);

  return {
    sent,
    delivered,
    deliveredPct: sent > 0 ? round((delivered / sent) * 100) : 0,
    opened,
    openedPct: delivered > 0 ? round((opened / delivered) * 100) : 0,
    replied,
    bounced,
    bouncePct: sent > 0 ? round((bounced / sent) * 100) : 0,
    unsubscribed,
  };
}

function getBriefArchive(): BriefArchiveItem[] {
  const absolute = resolve(OUTBOX_DIR);
  if (!existsSync(absolute)) return [];

  return readdirSync(absolute)
    .filter((file) => /^morning-brief-\d{4}-\d{2}-\d{2}\.md$/.test(file))
    .sort()
    .reverse()
    .slice(0, 390)
    .map((file) => {
      const text = readText(join(OUTBOX_DIR, file));
      const date = firstMatch(text, /^Date:\s*(.+)$/m) || file.replace("morning-brief-", "").replace(".md", "");
      const ownerLine = readBullets(readSection(text, "Commercial Brief"))[0] || "No owner summary found.";
      return {
        date,
        file: join(OUTBOX_DIR, file).replace(/\\/g, "/"),
        title: basename(file, ".md"),
        summary: ownerLine,
      };
    });
}

function toOutreachEmailStat(row: Record<string, string>): OutreachEmailStat {
  return {
    lane: row.lane || "unknown",
    workflow: row.workflow || "unknown",
    sent: number(row.sent || row.total),
    delivered: number(row.delivered),
    deliveredPct: number(row.delivered_pct),
    opened: number(row.opened),
    openedPct: number(row.opened_pct),
    replied: number(row.replied),
    bounced: number(row.bounced),
    bouncePct: number(row.bounce_pct),
    unsubscribed: number(row.unsubscribed),
  };
}

function readBusinessAudit(): BusinessAuditSummary {
  const text = readText(BUSINESS_AUDIT_PATH);
  return {
    date: firstMatch(text, /^Date:\s*(.+)$/m),
    efficiencyScore: firstMatch(text, /^- Agent efficiency score:\s*(.+)$/m) || "n/a",
    ownerNeededJobs: number(firstMatch(text, /^- Owner-needed jobs:\s*(.+)$/m)),
    watchedActiveJobs: number(firstMatch(text, /^- Watched active jobs:\s*(.+)$/m)),
    timerOverdueJobs: number(firstMatch(text, /^- Timer overdue jobs:\s*(.+)$/m)),
    manualAuditQueue: number(firstMatch(text, /^- Manual audit queue:\s*(.+)$/m)),
    systemsBuildQueue: number(firstMatch(text, /^- Systems build queue:\s*(.+)$/m)),
    mainConstraint: firstMatch(text, /^- Main constraint:\s*(.+)$/m) || "No current audit constraint found.",
    processImprovements: readNumberedItems(readSection(text, "Process Improvements")).slice(0, 5),
    ownerDecisions: readBullets(readSection(text, "Owner Decisions")),
    sourceFile: BUSINESS_AUDIT_PATH,
  };
}

function readOwnerMorningContext(): OwnerMorningContext {
  const text = readText(OWNER_CONTEXT_PATH);
  const emailSection = readSection(text, "Email");
  const calendarSection = readSection(text, "Calendar");

  return {
    date: firstMatch(text, /^Date:\s*(.+)$/m),
    email: {
      inboxTotal: number(readBulletValue(emailSection, "Primary inbox total")),
      inboxUnread: number(readBulletValue(emailSection, "Primary inbox unread")),
      focused24h: number(readBulletValue(emailSection, "Last 24h focused inbox items")),
      focusedUnread24h: number(readBulletValue(emailSection, "Last 24h focused unread")),
      summary: readBulletValue(emailSection, "Summary") || "No email snapshot found yet.",
      source: readBulletValue(emailSection, "Source") || "Owner morning context file.",
    },
    calendar: {
      todayEvents: number(readBulletValue(calendarSection, "Today known events")),
      status: readBulletValue(calendarSection, "Status") || "Calendar sync pending",
      summary: readBulletValue(calendarSection, "Summary") || "No calendar snapshot found yet.",
      source: readBulletValue(calendarSection, "Source") || "Owner morning context file.",
    },
    sourceFile: OWNER_CONTEXT_PATH,
  };
}

function toSlackOwnerSignal(text: string, ts: string, source: string): SlackOwnerSignal | null {
  const clean = text.trim();
  if (!/\bowner-needed\b/i.test(clean)) return null;
  if (/temporary password/i.test(clean) && /SN>|password is/i.test(clean)) return null;

  const title = firstMatch(clean, /^\*([^*]+)\*/m) || "Owner-needed Slack ask";
  const remaining = clean
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith("*Sent using*"));
  const actionStart = remaining.findIndex((line) => /^1\.|^Remaining step|^Please|^What I need/i.test(line));
  const actionLines = (actionStart >= 0 ? remaining.slice(actionStart) : remaining.slice(1))
    .filter((line) => !/^Systems Director handled/i.test(line))
    .slice(0, 5);

  return {
    title,
    action: actionLines.join(" ").replace(/\s+/g, " ").trim() || "Review the Slack DM and complete the owner-needed step.",
    timestamp: slackTimestamp(ts),
    source,
  };
}

function readSection(text: string, title: string): string {
  const heading = new RegExp(`^## ${escapeRegExp(title)}\\s*$`, "m");
  const match = heading.exec(text);
  if (!match) return "";

  const sectionStart = match.index + match[0].length;
  const afterHeading = text.slice(sectionStart);
  const nextHeading = afterHeading.search(/\r?\n##\s+/);
  return (nextHeading === -1 ? afterHeading : afterHeading.slice(0, nextHeading)).trim();
}

function readBullets(section: string): string[] {
  return section
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim())
    .filter(Boolean);
}

function readNumberedItems(section: string): string[] {
  return section
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^\d+\.\s+/.test(line))
    .map((line) => line.replace(/^\d+\.\s+/, "").trim())
    .filter(Boolean);
}

function readBulletValue(section: string, label: string): string {
  const pattern = new RegExp(`^-\\s+${escapeRegExp(label)}:\\s*(.+)$`, "im");
  return section.match(pattern)?.[1]?.trim() ?? "";
}

function readCsv(path: string) {
  const raw = readText(path);
  if (!raw) return [];
  return parseCsv(raw);
}

function parseCsv(raw: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    const next = raw[i + 1];
    if (quoted && c === '"' && next === '"') {
      field += '"';
      i++;
    } else if (c === '"') {
      quoted = !quoted;
    } else if (!quoted && c === ",") {
      row.push(field);
      field = "";
    } else if (!quoted && (c === "\n" || c === "\r")) {
      if (c === "\r" && next === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }

  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }

  const [headers, ...dataRows] = rows.filter((cells) => cells.some((cell) => cell.trim()));
  if (!headers) return [];
  return dataRows.map((cells) =>
    Object.fromEntries(headers.map((header, index) => [header.trim(), String(cells[index] ?? "").trim()])),
  );
}

function readText(path: string): string {
  const absolute = resolve(path);
  return existsSync(absolute) ? readFileSync(absolute, "utf8") : "";
}

function firstMatch(text: string, pattern: RegExp): string {
  return text.match(pattern)?.[1]?.trim() ?? "";
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function number(value: string | number | undefined): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function weatherCodeLabel(code: number | undefined): string {
  if (code === undefined) return "Weather unavailable";
  if (code === 0) return "Clear";
  if ([1, 2].includes(code)) return "Partly cloudy";
  if (code === 3) return "Cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Thunderstorms";
  return "Mixed";
}

function slackTimestamp(ts: string) {
  const seconds = Number(String(ts).split(".")[0]);
  if (!Number.isFinite(seconds) || seconds <= 0) return "";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(seconds * 1000));
}

function todayEastern() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value ?? "1970";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";
  return `${year}-${month}-${day}`;
}
