import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InternalAccessPrompt } from "@/components/control/InternalAccessPrompt";
import { growthProductBySlug } from "@/lib/control/growth-products";
import { hasInternalToolSession } from "@/lib/internal-tool-session";
import { GrowthProductPage } from "../_components/GrowthProductPage";

export const metadata: Metadata = {
  title: "Presence Refresh - The Hub",
  description: "One-time GMF Reach add-on for refreshing stale social and website presence.",
  robots: { index: false, follow: false },
};

export const revalidate = 60;

export default async function PresenceRefreshPage() {
  const auth = await hasInternalToolSession();
  if (!auth.ok) return <InternalAccessPrompt message={auth.message} />;

  const product = growthProductBySlug("presence-refresh");
  if (!product) notFound();
  return <GrowthProductPage product={product} />;
}
