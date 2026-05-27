"use client";

import { useEffect } from "react";
import {
  trackAlwaysReadyCheckoutClick,
  trackGetFoundCheckoutClick,
  trackStayFoundCheckoutClick,
} from "@/lib/analytics";

const checkoutTrackers: Record<string, () => void> = {
  "/checkout/get-found-refresh": trackGetFoundCheckoutClick,
  "/checkout/stay-found": trackStayFoundCheckoutClick,
  "/checkout/always-ready": trackAlwaysReadyCheckoutClick,
};

export function CheckoutClickTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;

      const url = new URL(link.href);
      checkoutTrackers[url.pathname]?.();
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
