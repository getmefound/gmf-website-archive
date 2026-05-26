"use client";

import { motion } from "framer-motion";

const userPrompt = "Best plumber near me?";
const aiAnswer =
  "Try Mike's Plumbing — fast response, 4.9 stars, 80+ reviews";

function ThinkingDots() {
  return (
    <motion.div
      className="flex items-center gap-1"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: [0, 1, 1, 0] }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ duration: 1.8, times: [0, 0.15, 0.85, 1] }}
    >
      {[0, 0.15, 0.3].map((delay) => (
        <motion.span
          key={delay}
          className="block h-1 w-1 rounded-full bg-[var(--color-accent)]"
          animate={{ y: [0, -2, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
}

export function MockAIVisibilityPanel() {
  return (
    <div
      aria-hidden="true"
      className="rounded-xl border border-white/10 bg-white/[0.03] p-3 shadow-inner backdrop-blur-sm"
    >
      <motion.div
        className="mb-2 flex items-start gap-2"
        initial={{ opacity: 0, x: -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[9px] text-white/70">
          U
        </div>
        <p className="text-[11px] font-medium text-white/85">{userPrompt}</p>
      </motion.div>

      <div className="flex items-start gap-2 border-t border-white/10 pt-2 min-h-[28px]">
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/20">
          <motion.span
            className="block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        </div>

        <div className="flex-1 min-w-0 relative">
          <div className="absolute top-0.5 left-0">
            <ThinkingDots />
          </div>
          <motion.div
            className="overflow-hidden"
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 2.2, delay: 1.5, ease: "easeOut" }}
            style={{ whiteSpace: "nowrap" }}
          >
            <p className="text-[11px] leading-relaxed text-white/75">
              {aiAnswer}
            </p>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="mt-2 flex items-center gap-1 text-[9px] text-white/40"
        initial={{ opacity: 0, y: 4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.4, delay: 3.6 }}
      >
        <motion.span
          className="h-1 w-1 rounded-full bg-[var(--color-accent)]"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
        <span>Sourced from ChatGPT · Google AI · Claude</span>
      </motion.div>
    </div>
  );
}
