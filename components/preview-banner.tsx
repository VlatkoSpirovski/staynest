"use client";

import Link from "next/link";
import { Info } from "lucide-react";

export function PreviewBanner({ token }: { token: string }) {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between gap-3 bg-ink px-4 py-3 text-sm text-mist shadow-md">
      <div className="flex items-center gap-2">
        <Info className="text-clay" size={18} />
        <div>
          <p className="font-semibold text-white">This is a temporary preview.</p>
          <p className="text-xs text-mist/70 hidden sm:block">Create a free account to save, customize and publish your guide.</p>
        </div>
      </div>
      <Link
        href={`/preview/${token}/claim`}
        className="shrink-0 rounded-full bg-clay px-4 py-2 font-bold text-white shadow-sm transition-colors hover:bg-clay/90"
      >
        Claim This Guide
      </Link>
    </div>
  );
}
