"use client";

import { Copy, ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function detectInAppBrowser(userAgent: string) {
  const normalized = userAgent.toLowerCase();
  return /instagram|fbav|fban|fb_iab|messenger|line|tiktok|musical_ly|snapchat|pinterest/.test(normalized);
}

function isAndroid(userAgent: string) {
  return /android/i.test(userAgent);
}

function chromeIntentUrl(url: string) {
  const target = new URL(url);
  return `intent://${target.host}${target.pathname}${target.search}#Intent;scheme=${target.protocol.replace(":", "")};package=com.android.chrome;end`;
}

export function InAppBrowserNotice() {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [android, setAndroid] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || "";
    setVisible(detectInAppBrowser(userAgent));
    setAndroid(isAndroid(userAgent));
    setCurrentUrl(window.location.href);
  }, []);

  const browserUrl = useMemo(() => (currentUrl && android ? chromeIntentUrl(currentUrl) : currentUrl), [android, currentUrl]);

  if (!visible || !currentUrl) return null;

  return (
    <div className="mb-5 rounded-[16px] border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
      <p className="font-extrabold">Google login is blocked in this browser.</p>
      <p className="mt-1 text-amber-950/78">
        Instagram, Facebook and Messenger open links inside their own browser, and Google blocks sign-in there. Open this page in Safari or Chrome, or use email login below.
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard?.writeText(currentUrl);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          }}
          className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-bold text-ink ring-1 ring-amber-200 transition hover:bg-white/80"
        >
          <Copy size={15} />
          {copied ? "Link copied" : "Copy link"}
        </button>
        <a
          href={browserUrl}
          className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-4 text-sm font-bold text-white transition hover:bg-ink/90"
        >
          <ExternalLink size={15} />
          {android ? "Open in Chrome" : "Open in browser"}
        </a>
      </div>
      <p className="mt-3 text-xs font-semibold text-amber-950/64">On iPhone, tap the three dots and choose “Open in browser” if the button stays inside this app.</p>
    </div>
  );
}
