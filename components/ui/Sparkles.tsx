"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = { className?: string; count?: number };

const FIXED_DOTS = [
  { x: 14, y: 22, r: 1.5, delay: 0, dur: 2.0 },
  { x: 52, y: 12, r: 2, delay: 0.4, dur: 2.4 },
  { x: 30, y: 48, r: 1.2, delay: 0.9, dur: 1.8 },
  { x: 64, y: 40, r: 1.8, delay: 1.3, dur: 2.6 },
  { x: 22, y: 64, r: 1.4, delay: 1.7, dur: 2.0 },
  { x: 58, y: 60, r: 1.6, delay: 2.1, dur: 2.2 },
];

export function Sparkles({ className, count = 5 }: Props) {
  const dots = FIXED_DOTS.slice(0, count);

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute", className)}
    >
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        {dots.map((d, i) => (
          <motion.circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={d.r}
            fill="currentColor"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
            transition={{
              duration: d.dur,
              delay: d.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
}
