import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function SentinelRedirectPage() {
  redirect("/mike-mc/agent-ness");
}
