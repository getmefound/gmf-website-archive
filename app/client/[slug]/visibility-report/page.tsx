import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CLIENT_HUBS } from "@/lib/client-hub";
import { getClientHubProfile } from "@/lib/client-profile-store";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return CLIENT_HUBS.map((client) => ({ slug: client.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const client = await getClientHubProfile(slug);

  return {
    title: client ? `${client.businessName} Client Dashboard` : "Client Dashboard",
    description: client ? `GMF client dashboard for ${client.businessName}.` : "GMF client dashboard.",
    robots: { index: false, follow: false },
  };
}

export default async function ClientVisibilityReportPage({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/client/${slug}#visibility-report`);
}
