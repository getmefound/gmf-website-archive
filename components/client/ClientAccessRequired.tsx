export function ClientAccessRequired() {
  return (
    <main className="min-h-screen bg-[#f6f7f4] px-6 py-12 text-slate-950">
      <section className="mx-auto max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
          Secure client hub
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Access link required
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-700">
          This client hub opens from the private GetMeFound access link sent by email. If the link expired, reply to the latest GetMeFound message and we will issue a new one.
        </p>
      </section>
    </main>
  );
}
