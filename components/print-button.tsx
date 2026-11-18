"use client";

import { Printer } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function PrintButton({ label, event }: { label: string; event?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (event) trackEvent(event);
        window.print();
      }}
      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-sn-ink px-5 text-sm font-semibold text-white transition hover:bg-sn-ink/90"
    >
      <Printer size={16} aria-hidden="true" /> {label}
    </button>
  );
}
