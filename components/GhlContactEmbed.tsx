"use client";

type GhlContactEmbedProps = {
  src: string;
};

export function GhlContactEmbed({ src }: GhlContactEmbedProps) {
  return (
    <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-4">Send a message</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">
        This secure form sends directly into our CRM.
      </p>
      <div className="w-full overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
        <iframe
          title="GMF Contact Form"
          src={src}
          className="w-full min-h-[760px]"
          loading="lazy"
        />
      </div>
    </div>
  );
}

