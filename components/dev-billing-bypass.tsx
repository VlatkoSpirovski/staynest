"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

export function DevBillingBypass({ plan, successUrl }: { plan: string; successUrl: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const didStart = useRef(false);

  function activateLocalTrial() {
    setBusy(true);
    setError("");
    fetch("/api/billing/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan })
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = (await response.json().catch(() => ({}))) as { error?: string };
          throw new Error(data.error || "Could not activate local trial.");
        }

        window.location.href = successUrl;
      })
      .catch((err) => {
        setBusy(false);
        setError(err instanceof Error ? err.message : "Could not activate local trial.");
      });
  }

  useEffect(() => {
    if (didStart.current) return;
    didStart.current = true;
    activateLocalTrial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-6">
      <div className="mb-3 rounded-[8px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
        Paddle is not configured for local development. Activating a local trial now.
      </div>
      {error ? <div className="mb-3 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div> : null}
      <button
        type="button"
        disabled={busy}
        onClick={activateLocalTrial}
        className="focus-ring inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white shadow-soft transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? <Loader2 className="animate-spin" size={16} /> : null}
        {busy ? "Activating local trial..." : "Retry local activation"}
      </button>
    </div>
  );
}
