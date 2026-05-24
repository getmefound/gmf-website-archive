import { redirect } from "next/navigation";
import { ControlShell } from "@/components/control/ControlPrimitives";
import { startInternalToolSession } from "@/lib/internal-tool-session";

export function InternalAccessPrompt({ message = "Access required." }: { message?: string }) {
  return (
    <ControlShell>
      <section className="mx-auto flex min-h-[62vh] max-w-xl flex-col justify-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/70">
          Internal access
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
          Open The Hub
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Enter the internal API token to access Mike Command Center, workflows, agents, and client operations.
        </p>
        <form action={openMikeCommandCenter} className="mt-6 rounded-lg border border-zinc-800/70 bg-zinc-950 p-5">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              Internal token
            </span>
            <input
              name="token"
              type="password"
              autoComplete="off"
              className="mt-2 w-full rounded-md border border-zinc-800 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-500/60"
            />
          </label>
          <button className="mt-4 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-500/20">
            Open Hub
          </button>
          <p className="mt-3 text-xs leading-relaxed text-zinc-500">{message}</p>
        </form>
      </section>
    </ControlShell>
  );
}

async function openMikeCommandCenter(formData: FormData) {
  "use server";

  const token = String(formData.get("token") ?? "").trim();
  const ok = await startInternalToolSession(token);

  if (!ok) redirect("/internal-access?error=Unauthorized");
  redirect("/mike-mc");
}
