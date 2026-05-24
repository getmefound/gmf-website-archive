import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReviewCustomerUploadForm } from "@/components/ReviewCustomerUploadForm";
import { CLIENT_HUBS } from "@/lib/client-hub";
import { getClientHubProfile } from "@/lib/client-profile-store";

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
    title: client ? `${client.businessName} Customer Upload` : "Customer Upload",
    robots: { index: false, follow: false },
  };
}

export default async function ReviewCustomerUploadPage({ params }: PageProps) {
  const { slug } = await params;
  const client = await getClientHubProfile(slug);

  if (!client) notFound();

  return (
    <main className="min-h-screen bg-[#f6f7f4] px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-4xl">
        <Link href={`/client/${client.slug}`} className="text-sm font-semibold text-emerald-800 hover:text-emerald-700">
          Back to client hub
        </Link>
        <div className="mt-6">
          <ReviewCustomerUploadForm clientSlug={client.slug} clientName={client.businessName} />
        </div>
      </div>
    </main>
  );
}
