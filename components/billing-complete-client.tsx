"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type BillingCompleteClientProps = {
  dashboardUrl: string;
};

export function BillingCompleteClient({ dashboardUrl }: BillingCompleteClientProps) {
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const attempts = useRef(0);
  const maxAttempts = 30; // ~60 seconds of polling

  useEffect(() => {
    let mounted = true;
    let timer: ReturnType<typeof setTimeout>;

    async function checkStatus() {
      try {
        const response = await fetch("/api/billing/status");
        if (!response.ok) return;

        const data = (await response.json()) as { ready?: boolean };
        if (data.ready && mounted) {
          setReady(true);
          setChecking(false);
          return;
        }
      } catch {
        // ignore fetch errors, keep polling
      }

      attempts.current += 1;
      if (attempts.current >= maxAttempts) {
        if (mounted) setChecking(false);
        return;
      }

      if (mounted) {
        timer = setTimeout(checkStatus, 2000);
      }
    }

    checkStatus();
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (ready) {
      const timer = setTimeout(() => {
        window.location.href = dashboardUrl;
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [ready, dashboardUrl]);

  return (
    <div className="text-center">
      {ready ? (
        <>
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-[8px] bg-olive text-white">
            <CheckCircle2 size={22} />
          </div>
          <h1 className="mt-5 text-2xl font-bold">You&apos;re all set!</h1>
          <p className="mt-3 text-sm leading-6 text-ink/65">
            Your subscription is active. Redirecting to the dashboard…
          </p>
        </>
      ) : checking ? (
        <>
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-[8px] bg-lagoon text-white">
            <Loader2 size={22} className="animate-spin" />
          </div>
          <h1 className="mt-5 text-2xl font-bold">Confirming your subscription…</h1>
          <p className="mt-3 text-sm leading-6 text-ink/65">
            Paddle is processing your payment. This usually takes a few seconds.
          </p>
        </>
      ) : (
        <>
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-[8px] bg-olive text-white">
            <CheckCircle2 size={22} />
          </div>
          <h1 className="mt-5 text-2xl font-bold">Checkout complete</h1>
          <p className="mt-3 text-sm leading-6 text-ink/65">
            The confirmation is taking longer than usual. Click below to open the dashboard — it
            may take a moment to activate.
          </p>
        </>
      )}

      <a
        href={dashboardUrl}
        className="focus-ring mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white shadow-soft transition hover:bg-ink/90"
      >
        {ready ? "Opening dashboard…" : "Open dashboard"}
      </a>
    </div>
  );
}
