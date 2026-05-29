import { notFound } from "next/navigation";
import { getClientHubActivity } from "@/lib/client-hub-activity";
import { getClientHubProfile } from "@/lib/client-profile-store";
import {
  buildClientVisibilityReportArtifact,
  getClientReportSectionFilename,
  renderClientVisibilityReportMarkdown,
  type ClientReportSectionId,
} from "@/lib/visibility-report-artifacts";

export const dynamic = "force-dynamic";

const SECTION_IDS = new Set<ClientReportSectionId>(["baseline", "before-after", "monthly-recap"]);

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const client = await getClientHubProfile(slug);

  if (!client) notFound();

  const activity = await getClientHubActivity(client.slug);
  const report = buildClientVisibilityReportArtifact({ client, activity });
  const sectionParam = new URL(request.url).searchParams.get("section");
  const section = SECTION_IDS.has(sectionParam as ClientReportSectionId)
    ? (sectionParam as ClientReportSectionId)
    : "full";
  const body = renderClientVisibilityReportMarkdown(report, section);
  const filename = `${client.slug}-${getClientReportSectionFilename(section)}.md`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
