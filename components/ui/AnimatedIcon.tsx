"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  paths: readonly string[];
  size?: number;
  strokeWidth?: number;
  className?: string;
  duration?: number;
};

export function AnimatedIcon({
  paths,
  size = 28,
  strokeWidth = 1.75,
  className,
  duration = 1.2,
}: Props) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: {
                pathLength: { duration, delay: i * 0.15, ease: "easeInOut" },
                opacity: { duration: 0.2, delay: i * 0.15 },
              },
            },
          }}
        />
      ))}
    </motion.svg>
  );
}

export { ICON_PATHS } from "@/lib/icon-paths";
