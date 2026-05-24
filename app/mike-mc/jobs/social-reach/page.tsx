import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InternalAccessPrompt } from "@/components/control/InternalAccessPrompt";
import { growthProductBySlug } from "@/lib/control/growth-products";
import { hasInternalToolSession } from "@/lib/internal-tool-session";
import { GrowthProductPage } from "../_components/GrowthProductPage";

export const metadata: Metadata = {
  title: "Social Reach - The Hub",
  description: "GMF guarded pilot for social listening and helpful engagement.",
  robots: { index: false, follow: false },
};

export const revalidate = 60;

export default async function SocialReachPage() {
  const auth = await hasInternalToolSession();
  if (!auth.ok) return <InternalAccessPrompt message={auth.message} />;

  const product = growthProductBySlug("social-reach");
  if (!product) notFound();
  return <GrowthProductPage product={product} />;
}
