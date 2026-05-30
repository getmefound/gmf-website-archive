import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClientAccessRequired } from "@/components/client/ClientAccessRequired";
import { ReviewCustomerUploadForm } from "@/components/ReviewCustomerUploadForm";
import { CLIENT_HUBS } from "@/lib/client-hub";
import { clientAccessTokenFromSearchParams, verifyClientMagicLinkToken, withClientAccessParam } from "@/lib/client-magic-link";
import { getClientHubProfile } from "@/lib/client-profile-store";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return CLIENT_HUBS.map((client) => ({ slug: client.slug }));
}

export function generateMetadata(): Metadata {
  return {
    title: "Customer Upload",
    robots: { index: false, follow: false },
  };
}

export default async function ReviewCustomerUploadPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const client = await getClientHubProfile(slug);

  if (!client) notFound();

  const accessToken = clientAccessTokenFromSearchParams((await searchParams) ?? {});
  const access = verifyClientMagicLinkToken(accessToken, client.slug);
  if (!access.ok) return <ClientAccessRequired />;

  return (
    <main className="min-h-screen bg-[#f6f7f4] px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-4xl">
        <Link href={withClientAccessParam(`/client/${client.slug}`, accessToken)} className="text-sm font-semibold text-emerald-800 hover:text-emerald-700">
          Back to client hub
        </Link>
        <div className="mt-6">
          <ReviewCustomerUploadForm clientSlug={client.slug} clientName={client.businessName} />
        </div>
      </div>
    </main>
  );
}
