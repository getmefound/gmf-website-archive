/**
 * Server-only data fetchers for /mike-mc (The Hub).
 * Each fetcher returns `T | null` — null means "credentials missing or upstream errored,
 * fall back to mock". Caller decides how to surface that.
 *
 * Env vars required (set in Vercel project settings):
 *   VERCEL_TOKEN          - api.vercel.com bearer, full account scope
 *   VERCEL_PROJECT_ID     - prj_xxx for the GetMeFound project
 *   GITHUB_PAT            - github.com fine-grained token, repo:read on mje-gmf/website
 *   GHL_PIT_TOKEN           - Hub360ai PIT (Bearer pit-xxx)
 *   GHL_LOCATION_ID       - sub-account id (visible in Hub360 admin URL)
 *
 * All fetchers cache for 60s via Next's `next: { revalidate: 60 }`.
 */

const REVAL = { next: { revalidate: 60 } };

// ─────────────────────────────────────────────────────────────────────────────
// Vercel — latest deploy
// ─────────────────────────────────────────────────────────────────────────────

export type LatestDeploy = {
  sha: string;
  message: string;
  createdAtIso: string;
  url: string;
  state: string;
};

export async function getLatestDeploy(): Promise<LatestDeploy | null> {
  const token = process.env.VERCEL_TOKEN;
  // Known project id for the active GetMeFound Vercel project — fallback so this works without
  // needing VERCEL_PROJECT_ID set explicitly.
  const projectId = process.env.VERCEL_PROJECT_ID ?? "prj_Wz2r5ZCXt8NyKVKQo2cbAdGCd7rw";
  if (!token) return null;

  try {
    const res = await fetch(
      `https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=1&target=production`,
      {
        headers: { Authorization: `Bearer ${token}` },
        ...REVAL,
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      deployments?: Array<{
        meta?: { githubCommitSha?: string; githubCommitMessage?: string };
        createdAt?: number;
        url?: string;
        state?: string;
      }>;
    };
    const d = data.deployments?.[0];
    if (!d) return null;
    return {
      sha: d.meta?.githubCommitSha?.slice(0, 7) ?? "unknown",
      message: d.meta?.githubCommitMessage ?? "",
      createdAtIso: new Date(d.createdAt ?? Date.now()).toISOString(),
      url: d.url ? `https://${d.url}` : "",
      state: d.state ?? "unknown",
    };
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GitHub — recent commits across a repo
// ─────────────────────────────────────────────────────────────────────────────

export type GitCommit = {
  sha: string;
  message: string;
  author: string;
  dateIso: string;
};

type GitHubRepoKey = "website" | "aoh-tooling";

const GITHUB_REPOS: Record<GitHubRepoKey, { owner: string; repo: string }> = {
  website: { owner: "mje-gmf", repo: "website" },
  "aoh-tooling": { owner: "aoh-inc", repo: "aoh-tooling" },
};

export async function getRecentCommits(repoKey: GitHubRepoKey, limit = 5): Promise<GitCommit[] | null> {
  const repo = GITHUB_REPOS[repoKey];
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "getmefound-control",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_PAT) {
    headers.Authorization = `Bearer ${process.env.GITHUB_PAT}`;
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo.owner}/${repo.repo}/commits?per_page=${limit}`,
      { headers, ...REVAL },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{
      sha: string;
      commit: { message: string; author: { name: string; date: string } };
    }>;
    return data.map((c) => ({
      sha: c.sha.slice(0, 7),
      message: c.commit.message.split("\n")[0],
      author: c.commit.author.name,
      dateIso: c.commit.author.date,
    }));
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GHL — pipelines + opportunities + calendar (services.leadconnectorhq.com v2)
// ─────────────────────────────────────────────────────────────────────────────

const GHL_BASE = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";
const DISCOVERY_CALENDAR_ID = "1Xq9XMNFjvxgxQj9kNLY";

function ghlHeaders(): Record<string, string> | null {
  const key = process.env.GHL_PIT_TOKEN;
  if (!key) return null;
  return {
    Authorization: `Bearer ${key}`,
    Version: GHL_VERSION,
    Accept: "application/json",
  };
}

export type Pipeline = {
  id: string;
  name: string;
  stages: { id: string; name: string; position: number }[];
};

export type Calendar = {
  id: string;
  name: string;
  calendarType?: string;
  isActive?: boolean;
};

export async function getPipelines(): Promise<Pipeline[] | null> {
  const headers = ghlHeaders();
  const locationId = process.env.GHL_LOCATION_ID;
  if (!headers || !locationId) return null;

  try {
    const res = await fetch(
      `${GHL_BASE}/opportunities/pipelines?locationId=${locationId}`,
      { headers, ...REVAL },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { pipelines?: Pipeline[] };
    return data.pipelines ?? [];
  } catch {
    return null;
  }
}

export async function getCalendars(): Promise<Calendar[] | null> {
  const headers = ghlHeaders();
  const locationId = process.env.GHL_LOCATION_ID;
  if (!headers || !locationId) return null;

  try {
    const res = await fetch(`${GHL_BASE}/calendars/?locationId=${locationId}`, {
      headers,
      ...REVAL,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { calendars?: Calendar[] };
    return data.calendars ?? [];
  } catch {
    return null;
  }
}

export type Opportunity = {
  id: string;
  name: string;
  pipelineId: string;
  pipelineStageId: string;
  status: string;
  contactId?: string;
  monetaryValue?: number;
  updatedAt?: string;
};

export async function searchOpportunities(
  pipelineId: string,
  limit = 50,
): Promise<Opportunity[] | null> {
  const headers = ghlHeaders();
  const locationId = process.env.GHL_LOCATION_ID;
  if (!headers || !locationId) return null;

  try {
    const url = new URL(`${GHL_BASE}/opportunities/search`);
    url.searchParams.set("location_id", locationId);
    url.searchParams.set("pipeline_id", pipelineId);
    url.searchParams.set("limit", limit.toString());
    const res = await fetch(url, { headers, ...REVAL });
    if (!res.ok) return null;
    const data = (await res.json()) as { opportunities?: Opportunity[] };
    return data.opportunities ?? [];
  } catch {
    return null;
  }
}

export type CalEvent = {
  id: string;
  title: string;
  calendarId?: string;
  startTimeIso: string;
  endTimeIso: string;
  contactId?: string;
  kind: "appointment" | "blocked";
};

export async function getCalendarEventsRange(
  startTimeIso: string,
  endTimeIso: string,
  calendarId: string,
): Promise<CalEvent[] | null> {
  const headers = ghlHeaders();
  const locationId = process.env.GHL_LOCATION_ID;
  if (!headers || !locationId || !calendarId) return null;

  try {
    const url = new URL(`${GHL_BASE}/calendars/events`);
    url.searchParams.set("locationId", locationId);
    url.searchParams.set("calendarId", calendarId);
    url.searchParams.set("startTime", String(new Date(startTimeIso).getTime()));
    url.searchParams.set("endTime", String(new Date(endTimeIso).getTime()));
    const res = await fetch(url, { headers, ...REVAL });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      events?: Array<{
        id: string;
        title?: string;
        name?: string;
        eventType?: string;
        calendarId?: string;
        startTime: string;
        endTime: string;
        contactId?: string;
      }>;
    };
    return (
      data.events?.map((e) => ({
        id: e.id,
        title: e.title ?? e.name ?? "GMF appointment",
        calendarId: e.calendarId,
        startTimeIso: e.startTime,
        endTimeIso: e.endTime,
        contactId: e.contactId,
        kind: "appointment",
      })) ?? []
    );
  } catch {
    return null;
  }
}

export async function getBlockedSlotsRange(
  startTimeIso: string,
  endTimeIso: string,
  calendarId: string,
): Promise<CalEvent[] | null> {
  const headers = ghlHeaders();
  const locationId = process.env.GHL_LOCATION_ID;
  if (!headers || !locationId || !calendarId) return null;

  try {
    const url = new URL(`${GHL_BASE}/calendars/blocked-slots`);
    url.searchParams.set("locationId", locationId);
    url.searchParams.set("calendarId", calendarId);
    url.searchParams.set("startTime", String(new Date(startTimeIso).getTime()));
    url.searchParams.set("endTime", String(new Date(endTimeIso).getTime()));
    const res = await fetch(url, { headers, ...REVAL });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      events?: Array<{
        id: string;
        title?: string;
        name?: string;
        calendarId?: string;
        startTime: string;
        endTime: string;
      }>;
    };
    return (
      data.events?.map((e) => ({
        id: e.id,
        title: e.title ?? e.name ?? "Blocked time",
        calendarId: e.calendarId,
        startTimeIso: e.startTime,
        endTimeIso: e.endTime,
        kind: "blocked",
      })) ?? []
    );
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Aggregated /mike-mc payload
// ─────────────────────────────────────────────────────────────────────────────

export type ControlData = {
  deploy: LatestDeploy | null;
  commitsWebsite: GitCommit[] | null;
  commitsTooling: GitCommit[] | null;
  pipelines: Pipeline[] | null;
  todaysEvents: CalEvent[] | null;
  discoveryCalendar: Calendar | null;
  reviewsOutreach: { pipeline: Pipeline | null; opportunities: Opportunity[] | null };
  aiVisOutreach: { pipeline: Pipeline | null; opportunities: Opportunity[] | null };
};

function pickPipelineByName(pipelines: Pipeline[] | null, needle: string) {
  if (!pipelines) return null;
  return (
    pipelines.find((p) => p.name.toLowerCase().includes(needle.toLowerCase())) ??
    null
  );
}

function pickDiscoveryCalendar(calendars: Calendar[] | null) {
  const configuredId = process.env.GHL_DISCOVERY_CALENDAR_ID ?? DISCOVERY_CALENDAR_ID;
  if (!calendars) {
    return { id: configuredId, name: "Discovery - Round Robin" };
  }
  const configured = calendars.find((calendar) => calendar.id === configuredId);
  if (configured) return configured;
  return (
    calendars.find((calendar) =>
      /discovery.*round robin|see if (aoh|gmf|getmefound) fits/i.test(calendar.name),
    ) ?? { id: configuredId, name: "Discovery - Round Robin" }
  );
}

function getUtcTimeForNewYorkDay(
  date: Date,
  hour: number,
  minute: number,
  second: number,
  millisecond: number,
) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  const utcGuess = Date.UTC(
    value("year"),
    value("month") - 1,
    value("day"),
    hour,
    minute,
    second,
    millisecond,
  );
  const zonedParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(utcGuess));
  const zonedValue = (type: string) =>
    Number(zonedParts.find((part) => part.type === type)?.value);
  const zonedAsUtc = Date.UTC(
    zonedValue("year"),
    zonedValue("month") - 1,
    zonedValue("day"),
    zonedValue("hour"),
    zonedValue("minute"),
    zonedValue("second"),
    millisecond,
  );
  return new Date(utcGuess - (zonedAsUtc - utcGuess));
}

export async function getControlData(): Promise<ControlData> {
  const [deploy, commitsWebsite, commitsTooling, pipelines, calendars] = await Promise.all([
    getLatestDeploy(),
    getRecentCommits("website", 3),
    getRecentCommits("aoh-tooling", 3),
    getPipelines(),
    getCalendars(),
  ]);

  const reviewsPipeline = pickPipelineByName(pipelines, "review");
  const aiVisPipeline = pickPipelineByName(pipelines, "ai visibility");
  const discoveryCalendar = pickDiscoveryCalendar(calendars);

  const now = new Date();
  const startOfDay = getUtcTimeForNewYorkDay(now, 0, 0, 0, 0);
  const endOfDay = getUtcTimeForNewYorkDay(now, 23, 59, 59, 999);

  const [reviewsOpps, aiVisOpps, appointments, blockedSlots] = await Promise.all([
    reviewsPipeline
      ? searchOpportunities(reviewsPipeline.id, 100)
      : Promise.resolve(null),
    aiVisPipeline
      ? searchOpportunities(aiVisPipeline.id, 100)
      : Promise.resolve(null),
    discoveryCalendar
      ? getCalendarEventsRange(
          startOfDay.toISOString(),
          endOfDay.toISOString(),
          discoveryCalendar.id,
        )
      : Promise.resolve(null),
    discoveryCalendar
      ? getBlockedSlotsRange(
          startOfDay.toISOString(),
          endOfDay.toISOString(),
          discoveryCalendar.id,
        )
      : Promise.resolve(null),
  ]);
  const todaysEvents =
    appointments || blockedSlots
      ? [...(appointments ?? []), ...(blockedSlots ?? [])].sort(
          (a, b) => new Date(a.startTimeIso).getTime() - new Date(b.startTimeIso).getTime(),
        )
      : null;

  return {
    deploy,
    commitsWebsite,
    commitsTooling,
    pipelines,
    todaysEvents,
    discoveryCalendar,
    reviewsOutreach: { pipeline: reviewsPipeline, opportunities: reviewsOpps },
    aiVisOutreach: { pipeline: aiVisPipeline, opportunities: aiVisOpps },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers for the page
// ─────────────────────────────────────────────────────────────────────────────

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = now - then;
  const min = Math.round(diffMs / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

export function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function timeUntil(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = then - now;
  if (diffMs < 0) return "passed";
  const min = Math.round(diffMs / 60000);
  if (min < 60) return `in ${min}m`;
  const h = Math.floor(min / 60);
  const remMin = min % 60;
  return remMin > 0 ? `in ${h}h ${remMin}m` : `in ${h}h`;
}

export function pipelineFunnel(
  pipeline: Pipeline | null,
  opportunities: Opportunity[] | null,
): {
  enrolled: number;
  engaged: number;
  warm: number;
  booked: number;
} | null {
  if (!pipeline || !opportunities) return null;

  // Heuristic: stage names map to funnel buckets.
  // Adjust the matching as pipeline stages evolve in GHL.
  const enrolled = opportunities.length;
  let engaged = 0;
  let warm = 0;
  let booked = 0;

  const stageById = new Map(pipeline.stages.map((s) => [s.id, s.name.toLowerCase()]));

  for (const opp of opportunities) {
    const stageName = stageById.get(opp.pipelineStageId) ?? "";
    if (/booked|appointment|demo|call.scheduled/.test(stageName)) booked += 1;
    else if (/warm|engaged.*reply|replied|hot/.test(stageName)) warm += 1;
    else if (/engaged|opened|clicked/.test(stageName)) engaged += 1;
  }

  return { enrolled, engaged, warm, booked };
}
