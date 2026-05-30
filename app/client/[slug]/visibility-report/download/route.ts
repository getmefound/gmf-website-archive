import { notFound } from "next/navigation";
import { getClientHubActivity } from "@/lib/client-hub-activity";
import { verifyClientMagicLinkToken } from "@/lib/client-magic-link";
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

  const url = new URL(request.url);
  const access = verifyClientMagicLinkToken(url.searchParams.get("access") ?? undefined, client.slug);
  if (!access.ok) {
    return new Response("Access link required.", {
      status: 401,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const activity = await getClientHubActivity(client.slug);
  const report = buildClientVisibilityReportArtifact({ client, activity });
  const sectionParam = url.searchParams.get("section");
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
