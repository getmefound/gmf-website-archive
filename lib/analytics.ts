type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

const gtag = (...args: unknown[]) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag(...args);
  }
};

export const trackAuditFormSubmit = () => gtag("event", "audit_form_submit");
export const trackContactFormSubmit = () => gtag("event", "contact_form_submit");
export const trackGetFoundCheckoutClick = () => gtag("event", "get_found_checkout_click");
export const trackStayFoundCheckoutClick = () => gtag("event", "stay_found_checkout_click");
export const trackAlwaysReadyCheckoutClick = () => gtag("event", "always_ready_checkout_click");
export const trackVisibilityCheckSlide = (slide: number) =>
  gtag("event", "visibility_check_slide", { slide });
export const trackBeforeAfterInteraction = () => gtag("event", "before_after_interaction");
