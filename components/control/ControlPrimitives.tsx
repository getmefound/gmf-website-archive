import type { ReactNode } from "react";

export function ControlShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-200">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        {children}
      </div>
    </main>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`rounded-2xl border border-zinc-800/60 bg-zinc-900/30 shadow-2xl shadow-black/40 backdrop-blur ${className ?? ""}`}
    >
      {children}
    </article>
  );
}

export function CardHeader({
  label,
  right,
}: {
  label: string;
  right?: ReactNode;
}) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-zinc-800/60 px-5 py-3.5">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400">
        {label}
      </p>
      {right}
    </header>
  );
}

export function CardBody({ children }: { children: ReactNode }) {
  return <div className="px-5 py-4">{children}</div>;
}

export function Pill({
  tone = "default",
  children,
}: {
  tone?: "default" | "accent" | "warm" | "hot" | "warn" | "ok";
  children: ReactNode;
}) {
  const toneClass = {
    default: "border-zinc-700/60 bg-zinc-800/40 text-zinc-300",
    accent: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    warm: "border-amber-500/40 bg-amber-500/10 text-amber-300",
    hot: "border-rose-500/40 bg-rose-500/10 text-rose-300",
    warn: "border-amber-500/40 bg-amber-500/10 text-amber-300",
    ok: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400",
  }[tone];

  return (
    <span
      className={`rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${toneClass}`}
    >
      {children}
    </span>
  );
}

export function Stat({
  value,
  unit,
  label,
}: {
  value: string;
  unit?: string;
  label?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800/70 bg-zinc-900/40 px-4 py-3">
      <p className="leading-none">
        <span className="font-mono text-3xl font-bold text-zinc-50">
          {value}
        </span>
        {unit && (
          <span className="ml-1.5 font-mono text-xs uppercase tracking-wider text-zinc-500">
            {unit}
          </span>
        )}
      </p>
      {label && (
        <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          {label}
        </p>
      )}
    </div>
  );
}

export function Row({
  label,
  values,
  todayIdx,
  accent,
}: {
  label: string;
  values: number[];
  todayIdx: number;
  accent?: boolean;
}) {
  return (
    <tr className="border-b border-zinc-800/40 last:border-0">
      <td className="py-2.5 pr-4 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
        {label}
      </td>
      {values.map((v, i) => {
        const isToday = i === todayIdx;
        const isHighlight = accent && v > 0;
        return (
          <td
            key={i}
            className={`px-3 py-2.5 text-center font-mono text-base ${
              isToday
                ? "font-bold text-zinc-50"
                : isHighlight
                  ? "font-semibold text-emerald-300"
                  : v === 0
                    ? "text-zinc-600"
                    : "text-zinc-300"
            }`}
          >
            {v}
          </td>
        );
      })}
    </tr>
  );
}

export function EmptyHint({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/20 px-4 py-6 text-center text-sm text-zinc-500">
      {children}
    </p>
  );
}
