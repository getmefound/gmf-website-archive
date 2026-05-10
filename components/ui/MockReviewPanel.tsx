"use client";

import { motion } from "framer-motion";

const aiReply =
  "Thanks Sarah — glad we could fix the leak fast. Anytime!";

export function MockReviewPanel() {
  return (
    <div
      aria-hidden="true"
      className="rounded-xl border border-white/10 bg-white/[0.03] p-3 shadow-inner backdrop-blur-sm"
    >
      <div className="mb-2 flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-amber-300 to-amber-500" />
        <div>
          <p className="text-[11px] font-semibold text-white/90">Sarah K.</p>
          <p className="text-[9px] text-white/50">★★★★★ · just now</p>
        </div>
      </div>
      <p className="mb-3 text-[11px] leading-relaxed text-white/80">
        Mike showed up in 30 minutes and fixed the leak. Best plumber in town.
      </p>

      <div className="flex items-start gap-2 border-t border-white/10 pt-2">
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[var(--color-accent)]/20 text-[9px] font-bold text-[var(--color-accent)]">
          AI
        </div>
        <div className="flex-1 overflow-hidden">
          <motion.p
            className="text-[11px] leading-relaxed text-white/70"
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{ whiteSpace: "nowrap", overflow: "hidden" }}
          >
            {aiReply}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
