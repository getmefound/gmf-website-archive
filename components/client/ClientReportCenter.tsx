"use client";

import { useMemo, useState } from "react";
import type {
  ClientReportSectionId,
  ClientReportSignal,
  ClientVisibilityReportArtifact,
  StatusLabel,
} from "@/lib/visibility-report-artifacts";

type ClientReportCenterProps = {
  report: ClientVisibilityReportArtifact;
  client: {
    businessName: string;
    plan: string;
    statusLabel: string;
    location: string;
    category: string;
    logoText: string;
  };
  clientActionCount: number;
  downloadHref: string;
};

export function ClientReportCenter({
  report,
  client,
  clientActionCount,
  downloadHref,
}: ClientReportCenterProps) {
  const [selectedReportId, setSelectedReportId] = useState<ClientReportSectionId>(
    report.reports[2]?.id ?? report.reports[0]?.id ?? "baseline",
  );
  const [selectedSignalName, setSelectedSignalName] = useState(report.signals[0]?.signal ?? "");
  const selectedReport = useMemo(
    () => report.reports.find((item) => item.id === selectedReportId) ?? report.reports[0],
    [report.reports, selectedReportId],
  );
  const selectedSignal = useMemo(
    () => report.signals.find((signal) => signal.signal === selectedSignalName) ?? report.signals[0],
    [report.signals, selectedSignalName],
  );
  const selectedReportDownloadHref = selectedReport
    ? `${downloadHref}?section=${selectedReport.id}`
    : downloadHref;

  return (
    <div className="grid gap-4">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-900 text-base font-bold text-white">
              {client.logoText}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                {report.periodLabel}
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                {client.businessName} visibility center
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                {client.category} in {client.location}. {client.plan} is {client.statusLabel.toLowerCase()}.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={selectedReportDownloadHref}
              className="rounded-lg bg-emerald-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Download selected
            </a>
            <a
              href={downloadHref}
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:border-emerald-300 hover:bg-emerald-100"
            >
              Download full report
            </a>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <ScoreTile label="Current score" value={`${report.currentScore}/100`} tone="emerald" />
          <ScoreTile label="Baseline" value={`${report.baselineScore}/100`} tone="slate" />
          <ScoreTile label="Movement" value={`+${report.movement}`} tone="emerald" />
          <ScoreTile label="Client actions" value={String(clientActionCount)} tone={clientActionCount ? "amber" : "emerald"} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Report library
          </p>
          <div className="mt-4 grid gap-2" role="tablist" aria-label="Visibility reports">
            {report.reports.map((item) => {
              const selected = item.id === selectedReportId;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setSelectedReportId(item.id)}
                  className={`min-h-20 rounded-lg border p-4 text-left transition ${
                    selected
                      ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{item.label}</span>
                    <span className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-600">
                      {item.status}
                    </span>
                  </span>
                  <span className="mt-2 block text-sm leading-6">{item.detail}</span>
                </button>
              );
            })}
          </div>
        </div>

        <ReportPreview
          report={report}
          selectedReportId={selectedReportId}
          selectedReportLabel={selectedReport?.label ?? "Report"}
          selectedReportStatus={selectedReport?.status ?? "Ready"}
          selectedReportDetail={selectedReport?.detail ?? report.statusSummary}
          downloadHref={selectedReportDownloadHref}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Signal explorer
          </p>
          <div className="mt-4 grid gap-2 md:grid-cols-[0.8fr_1.2fr]">
            <div className="grid gap-2">
              {report.signals.map((signal) => {
                const selected = signal.signal === selectedSignal?.signal;
                return (
                  <button
                    key={signal.signal}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setSelectedSignalName(signal.signal)}
                    className={`min-h-14 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition ${
                      selected
                        ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
                    }`}
                  >
                    {signal.signal}
                  </button>
                );
              })}
            </div>

            {selectedSignal ? <SignalDetail signal={selectedSignal} /> : null}
          </div>
        </div>

        <div className="grid gap-4">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              Competitor gap
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-700">{report.competitorGap}</p>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              Next actions
            </p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
              {report.nextActions.map((action) => (
                <li key={action} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-700" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>
    </div>
  );
}

function ReportPreview({
  report,
  selectedReportId,
  selectedReportLabel,
  selectedReportStatus,
  selectedReportDetail,
  downloadHref,
}: {
  report: ClientVisibilityReportArtifact;
  selectedReportId: ClientReportSectionId;
  selectedReportLabel: string;
  selectedReportStatus: string;
  selectedReportDetail: string;
  downloadHref: string;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
            {selectedReportStatus}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">{selectedReportLabel}</h3>
        </div>
        <a
          href={downloadHref}
          className="w-fit rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-900"
        >
          Download this
        </a>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-700">{selectedReportDetail}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {selectedReportId === "baseline" ? (
          <>
            <ScoreTile label="Starting point" value={`${report.baselineScore}/100`} tone="slate" />
            <ScoreTile label="Current" value={`${report.currentScore}/100`} tone="emerald" />
            <ScoreTile label="Signals" value={String(report.signals.length)} tone="slate" />
          </>
        ) : null}
        {selectedReportId === "before-after" ? (
          <>
            <ScoreTile label="Before" value={`${report.baselineScore}/100`} tone="slate" />
            <ScoreTile label="After" value={`${report.currentScore}/100`} tone="emerald" />
            <ScoreTile label="Movement" value={`+${report.movement}`} tone="emerald" />
          </>
        ) : null}
        {selectedReportId === "monthly-recap"
          ? report.stats.slice(0, 3).map((stat) => (
              <ScoreTile key={stat.label} label={stat.label} value={stat.value} tone="slate" />
            ))
          : null}
      </div>
    </article>
  );
}

function SignalDetail({ signal }: { signal: ClientReportSignal }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-5">
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={signal.status} />
        <p className="text-sm font-semibold text-slate-700">{signal.score}/20</p>
      </div>
      <h3 className="mt-4 text-xl font-semibold text-slate-950">{signal.signal}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-700">{signal.evidence}</p>
      <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-900">
          Next action
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-700">{signal.nextAction}</p>
      </div>
    </article>
  );
}

function ScoreTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "emerald" | "amber" | "slate";
}) {
  const toneClass = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-900",
    amber: "border-amber-200 bg-amber-50 text-amber-900",
    slate: "border-slate-200 bg-slate-50 text-slate-900",
  }[tone];

  return (
    <div className={`min-h-24 rounded-lg border p-4 ${toneClass}`}>
      <p className="text-xs font-bold uppercase tracking-[0.12em] opacity-75">{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: StatusLabel }) {
  const tone = {
    Strong: "border-emerald-200 bg-emerald-50 text-emerald-800",
    Fair: "border-amber-200 bg-amber-50 text-amber-900",
    Weak: "border-red-200 bg-red-50 text-red-800",
    Missing: "border-slate-200 bg-slate-100 text-slate-600",
  }[status];

  return (
    <span className={`w-fit rounded-md border px-2.5 py-1 text-xs font-bold uppercase tracking-[0.12em] ${tone}`}>
      {status}
    </span>
  );
}
