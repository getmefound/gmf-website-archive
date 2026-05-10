"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = { className?: string };

const beams = [
  { left: "10%", delay: 0, duration: 8 },
  { left: "32%", delay: 1.4, duration: 10 },
  { left: "58%", delay: 2.8, duration: 9 },
  { left: "82%", delay: 4.2, duration: 11 },
];

export function BackgroundBeams({ className }: Props) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {beams.map((b, i) => (
        <motion.span
          key={i}
          className="absolute top-[-20%] h-[140%] w-px"
          style={{
            left: b.left,
            background:
              "linear-gradient(to bottom, transparent, rgba(45,106,79,0.45), transparent)",
          }}
          initial={{ y: "-30%", opacity: 0 }}
          animate={{ y: "30%", opacity: [0, 0.8, 0] }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
