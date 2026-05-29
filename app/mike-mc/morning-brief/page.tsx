import type { Metadata } from "next";
import { InternalAccessPrompt } from "@/components/control/InternalAccessPrompt";
import { getMondayAgentJobsOverview } from "@/lib/control/monday-agent-jobs";
import { getMorningBriefData, getSlackOwnerSignals, statTotals } from "@/lib/control/morning-brief";
import { hasInternalToolSession } from "@/lib/internal-tool-session";
import { MorningBriefExperience } from "./MorningBriefExperience";

export const metadata: Metadata = {
  title: "Mike's Morning Brief",
  description: "Mike's live owner morning brief for GMF Mission Control.",
  robots: { index: false, follow: false },
};

export const revalidate = 60;

export default async function MorningBriefPage() {
  const auth = await hasInternalToolSession();
  if (!auth.ok) return <InternalAccessPrompt message={auth.message} />;

  const [brief, mondayOverview, slackSignals] = await Promise.all([
    Promise.resolve(getMorningBriefData()),
    getMondayAgentJobsOverview(),
    getSlackOwnerSignals(),
  ]);
  const totals = statTotals(brief.stats);

  return <MorningBriefExperience brief={brief} totals={totals} mondayOverview={mondayOverview} slackSignals={slackSignals} />;
}
