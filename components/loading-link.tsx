"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

export function LoadingLink({
  href,
  children,
  loadingText,
  className
}: {
  href: string;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <a
      href={href}
      onClick={() => setLoading(true)}
      aria-busy={loading}
      className={className}
    >
      {loading ? <Loader2 className="animate-spin" size={16} /> : null}
      {loading ? loadingText || "Loading..." : children}
    </a>
  );
}
