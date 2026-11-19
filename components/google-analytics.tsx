"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: any[]) => void;
  }
}

function pagePath(pathname: string) {
  if (typeof window === "undefined") return pathname;
  return `${pathname}${window.location.search || ""}`;
}

export function GoogleAnalytics() {
  const measurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
    (process.env.NODE_ENV === "production" ? "G-GBKCWG08GL" : undefined);
  const tagManagerId =
    process.env.NEXT_PUBLIC_GTM_ID ||
    (process.env.NODE_ENV === "production" ? "GTM-NLQL7MSQ" : undefined);
  const pathname = usePathname();

  useEffect(() => {
    if (!measurementId) return;
    if (!window.gtag) return;

    window.gtag("event", "page_view", {
      page_path: pagePath(pathname)
    });
  }, [measurementId, pathname]);

  useEffect(() => {
    if (!measurementId) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      const href = link.getAttribute("href") || "";
      const eventMap = href.includes("/register")
        ? { name: "signup_cta_click", cta: "register" }
        : href.includes("/g/example")
          ? { name: "example_guide_click", cta: "example_guide" }
          : href.includes("/pricing") || href === "#pricing"
            ? { name: "pricing_click", cta: "pricing" }
            : null;

      if (eventMap) trackEvent(eventMap.name, { cta: eventMap.cta, page_path: pagePath(pathname) });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [measurementId, pathname]);

  if (!measurementId && !tagManagerId) return null;

  return (
    <>
      {tagManagerId ? (
        <>
          <Script id="google-tag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
            `}
          </Script>
          <Script src={`https://www.googletagmanager.com/gtm.js?id=${tagManagerId}`} strategy="afterInteractive" />
        </>
      ) : null}
      {measurementId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${measurementId}', { send_page_view: false });
            `}
          </Script>
        </>
      ) : null}
    </>
  );
}
