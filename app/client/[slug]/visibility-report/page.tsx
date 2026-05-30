import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CLIENT_HUBS } from "@/lib/client-hub";
import { clientAccessTokenFromSearchParams, withClientAccessParam } from "@/lib/client-magic-link";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return CLIENT_HUBS.map((client) => ({ slug: client.slug }));
}

export function generateMetadata(): Metadata {
  return {
    title: "Client Dashboard",
    description: "Secure GetMeFound client dashboard.",
    robots: { index: false, follow: false },
  };
}

export default async function ClientVisibilityReportPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const accessToken = clientAccessTokenFromSearchParams((await searchParams) ?? {});
  redirect(`${withClientAccessParam(`/client/${slug}`, accessToken)}#visibility-report`);
}
