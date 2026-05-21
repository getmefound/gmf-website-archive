import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReviewFeedbackForm } from "@/components/ReviewFeedbackForm";
import { CLIENT_HUBS, getClientHub } from "@/lib/client-hub";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return CLIENT_HUBS.map((client) => ({ slug: client.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const client = getClientHub(slug);

  return {
    title: client ? `Feedback for ${client.businessName}` : "Feedback",
    robots: { index: false, follow: false },
  };
}

export default async function ReviewFeedbackPage({ params }: PageProps) {
  const { slug } = await params;
  const client = getClientHub(slug);

  if (!client) notFound();

  return (
    <main className="min-h-screen bg-[#f6f7f4] px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-3xl">
        <ReviewFeedbackForm clientSlug={client.slug} clientName={client.businessName} />
      </div>
    </main>
  );
}
