"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

/**
 * Cloudflare Turnstile widget.
 *
 * Renders nothing when NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset, so forms keep
 * working in environments where the captcha has not been configured. The server
 * side in lib/captcha.ts makes the same allowance.
 */
export function TurnstileWidget({ className }: { className?: string }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (!siteKey || !scriptReady || !containerRef.current || widgetId.current) return;

    const turnstile = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
    if (!turnstile) return;

    widgetId.current = turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "light",
      action: "signup"
    });

    return () => {
      if (widgetId.current) {
        turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, [siteKey, scriptReady]);

  if (!siteKey) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onLoad={() => setScriptReady(true)}
      />
      <div ref={containerRef} className={className} />
    </>
  );
}

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};
