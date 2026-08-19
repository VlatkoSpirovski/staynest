"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

export function LoadingLink({
  href,
  children,
  loadingText,
  className,
  eventName,
  eventParams
}: {
  href: string;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
  eventName?: string;
  eventParams?: Record<string, string | number | boolean | null | undefined>;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <a
      href={href}
      onClick={() => {
        if (eventName) trackEvent(eventName, eventParams);
        setLoading(true);
      }}
      aria-busy={loading}
      className={className}
    >
      {loading ? <Loader2 className="animate-spin" size={16} /> : null}
      {loading ? loadingText || "Loading..." : children}
    </a>
  );
}
