type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

export function trackEvent(name: string, params?: AnalyticsParams) {
  if (typeof window === "undefined") return;
  const gtag = (window as Window & {
    gtag?: (command: "event", name: string, params?: AnalyticsParams) => void;
  }).gtag;
  gtag?.("event", name, params);
}
