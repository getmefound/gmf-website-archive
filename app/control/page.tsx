import type { Metadata } from "next";
import {
  ControlShell,
  Card,
  CardHeader,
  CardBody,
  Stat,
  Pill,
  Row,
  EmptyHint,
} from "@/components/control/ControlPrimitives";

export const metadata: Metadata = {
  title: "Mission Control",
  description: "AOH operator console.",
  robots: { index: false, follow: false },
};

/**
 * SLICE 1 — STATIC SHELL
 * All data below is mock. Slice 2 wires GHL + Vercel APIs.
 */

const MOCK = {
  refreshedAgo: "2m ago",
  warmCalls: [
    {
      id: "1",
      business: "Cherrydale Lawn",
      contact: "Owner · replied yesterday",
      reason: 'Replied "interested in pricing"',
      open: '"Saw you replied — got a few minutes to walk through pricing?"',
      score: "hot",
    },
    {
      id: "2",
      business: "Bill, Southington Lawn",
      contact: "Owner · 3 site visits this week",
      reason: "Clicked /pricing 3 times in 48h",
      open: '"You looked at pricing a few times — any questions I can clear up?"',
      score: "warm",
    },
    {
      id: "3",
      business: "Hartford Insurance Brokers",
      contact: "Sales Manager · ran calculator",
      reason: "Used /#calculator + viewed AI Visibility",
      open: '"Saw you ran the calculator — want me to walk through your numbers?"',
      score: "warm",
    },
  ],
  hiddenCalls: 1,

  schedule: {
    today: [
      { time: "11:00am", in: "in 2h 15m", what: "Demo", with: "Cherrydale Lawn", kind: "demo" },
      { time: "3:30pm", in: "in 6h 45m", what: "Internal", with: "Kip review", kind: "internal" },
    ],
    tomorrow: 1,
  },

  week: {
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    warm: [2, 1, 0, 3, 1],
    demos: [1, 2, 0, 1, 0],
    calls: [4, 3, 1, 5, 2],
    todayIdx: 4,
  },

  inbox: {
    waiting: 7,
    oldestDays: 2,
    bySource: [
      { label: "support@", n: 3 },
      { label: "GHL inbox", n: 4 },
    ],
  },

  stuck: {
    count: 5,
    rows: [
      { biz: "Veterinary Care of NoVA", since: "May 9", days: 7 },
      { biz: "Hartford Cleaning Co", since: "May 8", days: 8 },
    ],
    hidden: 3,
  },

  pipelines: [
    {
      name: "Reviews Outreach",
      enrolled: 182,
      engaged: 47,
      warm: 8,
      booked: 2,
    },
    {
      name: "AI Visibility Outreach",
      enrolled: 91,
      engaged: 18,
      warm: 3,
      booked: 1,
    },
  ],

  site: {
    calculatorRuns: 8,
    contactSubmits: 2,
    latestDeploy: {
      sha: "716d279",
      message: "feat(catalog): drop Studio + Full Service; add FOUND100 coupon",
      ago: "23m ago",
    },
  },
};

export default function ControlPage() {
  const m = MOCK;
  const now = new Date();
  const dateLine = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <ControlShell>
      {/* Header */}
      <header className="mb-8 flex items-end justify-between gap-4 border-b border-zinc-800/60 pb-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">
            AOH · Mission Control
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50 md:text-3xl">
            Your day, in one screen.
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {dateLine} · Last refresh {m.refreshedAgo}
          </p>
        </div>
        <div className="hidden md:block">
          <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-amber-300">
            slice 1 · mock data
          </span>
        </div>
      </header>

      {/* Top zone — calls + schedule */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Today's calls — wider (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader
            label="Today's calls"
            right={<Pill tone="accent">{m.warmCalls.length} warm</Pill>}
          />
          <CardBody>
            <ul className="space-y-3">
              {m.warmCalls.map((c) => (
                <li
                  key={c.id}
                  className="group rounded-xl border border-zinc-800/70 bg-zinc-900/40 p-4 transition hover:border-zinc-700 hover:bg-zinc-900/70"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-zinc-100">
                        {c.business}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-500">{c.contact}</p>
                    </div>
                    <Pill tone={c.score === "hot" ? "hot" : "warm"}>
                      {c.score}
                    </Pill>
                  </div>
                  <p className="mt-2 text-xs text-zinc-400">
                    <span className="text-zinc-500">why:</span> {c.reason}
                  </p>
                  <p className="mt-2 rounded-md border border-zinc-800 bg-zinc-950/50 px-2.5 py-1.5 font-mono text-[11px] leading-relaxed text-zinc-300">
                    {c.open}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-300 hover:bg-emerald-500/20">
                      mark called
                    </button>
                    <button className="rounded-md border border-zinc-800 bg-zinc-900/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-zinc-400 hover:bg-zinc-900/80">
                      open in GHL
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {m.hiddenCalls > 0 && (
              <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                + {m.hiddenCalls} more — view full list
              </p>
            )}
          </CardBody>
        </Card>

        {/* On the schedule */}
        <Card>
          <CardHeader
            label="On the schedule"
            right={<Pill tone="default">{m.schedule.today.length} today</Pill>}
          />
          <CardBody>
            <ul className="space-y-2.5">
              {m.schedule.today.map((s, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-zinc-800/70 bg-zinc-900/40 px-3 py-2.5"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-mono text-sm font-semibold text-zinc-100">
                      {s.time}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                      {s.in}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-300">
                    <span
                      className={
                        s.kind === "demo"
                          ? "text-emerald-400"
                          : "text-zinc-500"
                      }
                    >
                      {s.what}
                    </span>{" "}
                    · {s.with}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-3 border-t border-zinc-800/60 pt-3 text-xs text-zinc-500">
              Tomorrow: <span className="text-zinc-300">{m.schedule.tomorrow} booked</span>
            </p>
          </CardBody>
        </Card>
      </section>

      {/* Week strip */}
      <section className="mt-5">
        <Card>
          <CardHeader label="This week" />
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800/60">
                    <th className="py-2 pr-4 text-left font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                      &nbsp;
                    </th>
                    {m.week.days.map((d, i) => (
                      <th
                        key={d}
                        className={`py-2 px-3 text-center font-mono text-[10px] uppercase tracking-wider ${
                          i === m.week.todayIdx
                            ? "text-emerald-400"
                            : "text-zinc-500"
                        }`}
                      >
                        {d}
                        {i === m.week.todayIdx && (
                          <span className="ml-1 text-[8px] tracking-normal">●</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <Row label="Warm" values={m.week.warm} todayIdx={m.week.todayIdx} accent />
                  <Row label="Demos" values={m.week.demos} todayIdx={m.week.todayIdx} />
                  <Row label="Calls" values={m.week.calls} todayIdx={m.week.todayIdx} />
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Mid zone — inbox + stuck */}
      <section className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader
            label="Inbox demands"
            right={<Pill tone="warn">{m.inbox.waiting} waiting</Pill>}
          />
          <CardBody>
            <Stat
              value={m.inbox.waiting.toString()}
              unit="emails"
              label={`oldest ${m.inbox.oldestDays} days`}
            />
            <ul className="mt-4 space-y-1.5">
              {m.inbox.bySource.map((s) => (
                <li
                  key={s.label}
                  className="flex items-baseline justify-between text-xs text-zinc-400"
                >
                  <span className="font-mono">{s.label}</span>
                  <span className="font-mono font-semibold text-zinc-200">
                    {s.n}
                  </span>
                </li>
              ))}
            </ul>
            <button className="mt-4 w-full rounded-md border border-zinc-800 bg-zinc-900/50 py-2 font-mono text-[10px] uppercase tracking-wider text-zinc-400 transition hover:bg-zinc-900">
              open GHL inbox
            </button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            label="Stuck deals"
            right={
              <Pill tone={m.stuck.count > 0 ? "warn" : "ok"}>
                {m.stuck.count > 0 ? `${m.stuck.count} stuck` : "all flowing"}
              </Pill>
            }
          />
          <CardBody>
            {m.stuck.count === 0 ? (
              <EmptyHint>No stuck deals. You're caught up.</EmptyHint>
            ) : (
              <>
                <p className="text-xs text-zinc-400">
                  Warm leads not called in 7+ days
                </p>
                <ul className="mt-3 space-y-2">
                  {m.stuck.rows.map((r) => (
                    <li
                      key={r.biz}
                      className="flex items-center justify-between rounded-lg border border-zinc-800/70 bg-zinc-900/40 px-3 py-2"
                    >
                      <span className="truncate text-sm text-zinc-200">
                        {r.biz}
                      </span>
                      <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-amber-300">
                        warm since {r.since}
                      </span>
                    </li>
                  ))}
                </ul>
                {m.stuck.hidden > 0 && (
                  <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                    + {m.stuck.hidden} more
                  </p>
                )}
              </>
            )}
          </CardBody>
        </Card>
      </section>

      {/* Pipelines */}
      <section className="mt-5">
        <Card>
          <CardHeader label="Campaign pipelines" />
          <CardBody>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {m.pipelines.map((p) => (
                <div key={p.name} className="space-y-3">
                  <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                    {p.name}
                  </p>
                  <ul className="space-y-2">
                    <FunnelRow label="Enrolled" n={p.enrolled} />
                    <FunnelRow label="Engaged" n={p.engaged} />
                    <FunnelRow label="Warm" n={p.warm} highlight />
                    <FunnelRow label="Booked" n={p.booked} />
                  </ul>
                  <button className="mt-2 w-full rounded-md border border-emerald-500/30 bg-emerald-500/5 py-2 font-mono text-[10px] uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-500/15">
                    view {p.warm} warm →
                  </button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Site signals */}
      <section className="mt-5 mb-12">
        <Card>
          <CardHeader label="Site signals" />
          <CardBody>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Stat
                value={m.site.calculatorRuns.toString()}
                unit="runs"
                label="calculator today"
              />
              <Stat
                value={m.site.contactSubmits.toString()}
                unit="submits"
                label="contact form today"
              />
              <div className="rounded-xl border border-zinc-800/70 bg-zinc-900/40 px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  latest deploy · {m.site.latestDeploy.ago}
                </p>
                <p className="mt-1.5 font-mono text-sm font-semibold text-emerald-300">
                  {m.site.latestDeploy.sha}
                </p>
                <p className="mt-1 truncate text-xs text-zinc-400">
                  {m.site.latestDeploy.message}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>
    </ControlShell>
  );
}

function FunnelRow({
  label,
  n,
  highlight,
}: {
  label: string;
  n: number;
  highlight?: boolean;
}) {
  return (
    <li
      className={`flex items-baseline justify-between rounded-md px-2.5 py-1.5 ${
        highlight
          ? "border border-emerald-500/30 bg-emerald-500/10"
          : "border border-zinc-800/70 bg-zinc-900/40"
      }`}
    >
      <span
        className={`text-sm ${
          highlight ? "font-semibold text-emerald-300" : "text-zinc-300"
        }`}
      >
        {label}
        {highlight && <span className="ml-1.5 text-[10px]">★</span>}
      </span>
      <span
        className={`font-mono text-base font-bold ${
          highlight ? "text-emerald-200" : "text-zinc-100"
        }`}
      >
        {n}
      </span>
    </li>
  );
}
