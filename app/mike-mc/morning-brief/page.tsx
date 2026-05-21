import type { Metadata } from "next";
import { getMorningBriefData, statTotals } from "@/lib/control/morning-brief";
import { MorningBriefExperience } from "./MorningBriefExperience";

export const metadata: Metadata = {
  title: "Mike's Morning Brief",
  description: "Mike's live owner morning brief for AOH Mission Control.",
  robots: { index: false, follow: false },
};

export const revalidate = 60;

export default function MorningBriefPage() {
  const brief = getMorningBriefData();
  const totals = statTotals(brief.stats);

  return <MorningBriefExperience brief={brief} totals={totals} />;
}
