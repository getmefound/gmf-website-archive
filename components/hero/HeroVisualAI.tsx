"use client";

import { motion, useReducedMotion } from "framer-motion";

const BUSINESS = "Austin's Best Plumbing";

type AiBrand = {
  name: string;
  color: string;
  glow: string;
};

const BRANDS: Record<string, AiBrand> = {
  chatgpt: { name: "ChatGPT", color: "#10A37F", glow: "rgba(16,163,127,0.18)" },
  gemini: { name: "Google AI", color: "#4285F4", glow: "rgba(66,133,244,0.18)" },
  claude: { name: "Claude", color: "#DA7756", glow: "rgba(218,119,86,0.18)" },
};

type Item = {
  brand: AiBrand;
  question: string;
  answer: React.ReactNode;
  meta?: string;
};

function highlight(text: string) {
  return (
    <span
      className="rounded px-1 font-semibold"
      style={{ color: "#2D6A4F", backgroundColor: "rgba(45,106,79,0.18)" }}
    >
      {text}
    </span>
  );
}

const ITEMS: Item[] = [
  {
    brand: BRANDS.chatgpt,
    question: "best plumber near Austin",
    answer: (
      <>
        I recommend {highlight(BUSINESS)} — 47 five-star reviews and same-day
        service.
      </>
    ),
    meta: "Cited 3 sources",
  },
  {
    brand: BRANDS.gemini,
    question: "top-rated plumbers Austin TX",
    answer: (
      <>
        Top-rated locally is {highlight(BUSINESS)}, known for fast response and
        200+ verified reviews.
      </>
    ),
    meta: "AI Overview · Google",
  },
  {
    brand: BRANDS.claude,
    question: "who should I call for a plumber in Austin?",
    answer: (
      <>
        {highlight(BUSINESS)} comes highly recommended by locals — consistent
        5-star reviews, same-day availability.
      </>
    ),
    meta: "claude.ai",
  },
  {
    brand: BRANDS.chatgpt,
    question: "emergency plumber Austin same day",
    answer: (
      <>
        For same-day work, {highlight(BUSINESS)} is consistently top-rated —
        fast response, strong reviews.
      </>
    ),
    meta: "ChatGPT",
  },
  {
    brand: BRANDS.gemini,
    question: "trusted plumbing services Austin",
    answer: (
      <>
        Customers rank {highlight(BUSINESS)} at the top — strong reputation,
        fast scheduling.
      </>
    ),
    meta: "AI Overview · Google",
  },
];

function ResponseCard({ item }: { item: Item }) {
  return (
    <div
      className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2.5 backdrop-blur-sm"
      style={{ boxShadow: `inset 0 0 0 1px ${item.brand.glow}` }}
    >
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: item.brand.color }}
          />
          <p
            className="font-mono text-[9px] uppercase tracking-[0.18em]"
            style={{ color: item.brand.color }}
          >
            {item.brand.name}
          </p>
        </div>
        {item.meta && (
          <p className="font-mono text-[8px] text-[var(--color-hero-subtext)]/55">
            {item.meta}
          </p>
        )}
      </div>

      <p className="mb-1 text-[10px] text-[var(--color-hero-subtext)]/75">
        <span className="opacity-50">› </span>
        {item.question}
      </p>

      <p className="font-mono text-[11.5px] leading-snug text-[var(--color-hero-text)]">
        {item.answer}
      </p>
    </div>
  );
}

export function HeroVisualAI() {
  const reduce = useReducedMotion();

  return (
    <div
      className="relative w-full h-[280px] md:h-full md:min-h-[380px] md:max-h-[420px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A1628]"
      aria-label="AI search visibility loop"
    >
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(45,106,79,0.15)" }}
      />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-white/[0.04] blur-3xl" />

      <div className="relative flex h-full flex-col px-5 pt-3 md:px-6 md:pt-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
            </span>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-hero-text)]">
              Live across AI search
            </p>
          </div>
          <p className="font-mono text-[10px] text-[var(--color-hero-subtext)]/60">
            3 platforms
          </p>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-[#0A1628] to-transparent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-[#0A1628] to-transparent"
            aria-hidden="true"
          />

          {reduce ? (
            <div className="space-y-2 pb-4">
              {ITEMS.slice(0, 3).map((item, i) => (
                <ResponseCard key={i} item={item} />
              ))}
            </div>
          ) : (
            <motion.div
              className="space-y-2"
              animate={{ y: ["0%", "-50%"] }}
              transition={{
                duration: 36,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              {[...ITEMS, ...ITEMS].map((item, i) => (
                <ResponseCard key={i} item={item} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
