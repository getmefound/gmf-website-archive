"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M6 18L18 6" />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const isOperator =
    pathname === "/mike-mc" ||
    pathname.startsWith("/mike-mc/") ||
    pathname === "/control" ||
    pathname.startsWith("/control/");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  // Scroll-aware behavior: transparent → frosted bg, hide on scroll-down, show on scroll-up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      // hide only when scrolling DOWN past a threshold + not in mobile menu
      if (y > lastY.current && y > 120 && !mobileOpen) {
        setHidden(true);
      } else if (y < lastY.current) {
        setHidden(false);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileOpen]);

  if (isOperator) return null;

  const linkColor = scrolled
    ? "text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]"
    : "text-[var(--color-hero-subtext)] hover:text-[var(--color-hero-text)]";

  const isSpanish = pathname === "/es" || pathname.startsWith("/es/");
  const withLocale = (path: string) => {
    if (!isSpanish) return path;
    if (path === "/") return "/es";
    return `/es${path}`;
  };
  const normalizedPath = (() => {
    if (pathname === "/es") return "/";
    if (pathname.startsWith("/es/")) return pathname.replace(/^\/es/, "") || "/";
    return pathname;
  })();
  const enHref = normalizedPath;
  const esHref = normalizedPath === "/" ? "/es" : `/es${normalizedPath}`;

  return (
    <>
      <motion.nav
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[var(--color-bg-page)]/85 backdrop-blur-xl py-2 border-b border-[var(--color-border)] shadow-sm"
            : "bg-[var(--color-hero-bg)] py-4 border-b border-[var(--color-hero-border)]"
        }`}
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between gap-6">
            <Link
              href={withLocale("/")}
              className={`shrink-0 pl-1 text-xl font-black tracking-tight transition-colors md:pl-2 ${
                scrolled ? "text-[var(--color-text-body)]" : "text-[var(--color-hero-text)]"
              }`}
              aria-label="GetMeFound home"
            >
              GetMeFound
            </Link>

            <div className={`hidden md:flex items-center gap-8 text-sm font-medium ${linkColor} transition-colors duration-500`}>
              <Link href={withLocale("/#how-it-works")} className="transition-colors">
                {"How It Works"}
              </Link>
              <Link href={withLocale("/pricing")} className="transition-colors">
                {"Pricing"}
              </Link>
              <Link href={withLocale("/calculator")} className="transition-colors">
                {"Revenue Potential"}
              </Link>
              <Link href={withLocale("/blog")} className="transition-colors">
                Blog
              </Link>
              <Link href={withLocale("/about")} className="transition-colors">
                {"About"}
              </Link>
            </div>

            <Link
              href={withLocale("/contact")}
              className="group hidden md:inline-flex items-center gap-1.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-text)] px-5 py-2 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[var(--color-accent)]/30 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              {"See if AI recommends you"}
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>

            <button
              type="button"
              className={`md:hidden -mr-1 p-1 rounded transition-colors ${
                scrolled
                  ? "text-[var(--color-text-body)] hover:bg-black/5"
                  : "text-[var(--color-hero-text)] hover:bg-white/5"
              }`}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.button
                type="button"
                aria-label="Close menu overlay"
                tabIndex={-1}
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="md:hidden fixed inset-0 top-[calc(theme(spacing.16)+1px)] z-40 bg-black/40 backdrop-blur-sm"
              />
              <motion.div
                id="mobile-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Site navigation"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                className="md:hidden absolute left-0 right-0 top-full z-50 border-b border-[var(--color-hero-border)] bg-[var(--color-hero-bg)] shadow-2xl"
              >
                <div className="mx-auto max-w-6xl px-6 py-4 space-y-1 text-sm">
                  <Link
                    href={withLocale("/#how-it-works")}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg text-[var(--color-hero-subtext)] hover:bg-white/5 hover:text-[var(--color-hero-text)] transition-colors"
                  >
                    {"How It Works"}
                  </Link>
                  <Link
                    href={withLocale("/pricing")}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg text-[var(--color-hero-subtext)] hover:bg-white/5 hover:text-[var(--color-hero-text)] transition-colors"
                  >
                    {"Pricing"}
                  </Link>
                  <Link
                    href={withLocale("/calculator")}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg text-[var(--color-hero-subtext)] hover:bg-white/5 hover:text-[var(--color-hero-text)] transition-colors"
                  >
                    {"Revenue Potential"}
                  </Link>
                  <Link
                    href={withLocale("/blog")}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg text-[var(--color-hero-subtext)] hover:bg-white/5 hover:text-[var(--color-hero-text)] transition-colors"
                  >
                    Blog
                  </Link>
                  <Link
                    href={withLocale("/about")}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg text-[var(--color-hero-subtext)] hover:bg-white/5 hover:text-[var(--color-hero-text)] transition-colors"
                  >
                    {"About"}
                  </Link>
                  <Link
                    href={withLocale("/contact")}
                    onClick={() => setMobileOpen(false)}
                    className="mt-3 block w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-text)] px-4 py-3 rounded-lg font-semibold text-center transition-colors"
                  >
                    {"See if AI recommends you"}
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>

    </>
  );
}
