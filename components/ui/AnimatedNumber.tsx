"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  thousandsSeparator?: boolean;
};

export function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  duration = 1400,
  className,
  thousandsSeparator = true,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  // Fallback: if InView never fires (e.g. slow mobile, reduced-motion), show value after duration + 500ms
  useEffect(() => {
    const timer = setTimeout(() => setDisplay(value), duration + 500);
    return () => clearTimeout(timer);
  }, [value, duration]);

  const formatted = thousandsSeparator
    ? display.toLocaleString("en-US")
    : String(display);

  return (
    <span ref={ref} className={cn(className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
