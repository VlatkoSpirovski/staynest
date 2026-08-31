"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type BillingCompleteClientProps = {
  dashboardUrl: string;
  loginUrl: string;
};

type Phase = "checking" | "confirmed" | "pending" | "signedOut";

/**
 * Post-checkout confirmation.
 *
 * Paddle's webhook or reconciliation flips subscriptionStatus to TRIALING for a
 * card-required trial, then ACTIVE after the first paid billing period starts.
 * Webhook delivery is asynchronous, so this polls briefly before falling back to
 * a reassuring pending state.
 */
export function BillingCompleteClient({ dashboardUrl, loginUrl }: BillingCompleteClientProps) {
  const [phase, setPhase] = useState<Phase>("checking");
  const attempts = useRef(0);
  const maxAttempts = 8; // ~16s, short enough that nobody watches a spinner stall

  useEffect(() => {
    let mounted = true;
    let timer: ReturnType<typeof setTimeout>;

    function scheduleNext() {
      attempts.current += 1;
      if (attempts.current >= maxAttempts) {
        // Checkout succeeded on Paddle's side; the webhook just has not landed yet.
        if (mounted) setPhase("pending");
        return;
      }
      if (mounted) timer = setTimeout(checkStatus, 2000);
    }

    async function checkStatus() {
      try {
        const response = await fetch("/api/billing/status", { cache: "no-store" });

        if (response.status === 401) {
          // No session on this domain. Spinning forever helps nobody.
          if (mounted) setPhase("signedOut");
          return;
        }

        if (response.ok) {
          const data = (await response.json()) as { status?: string | null };
          if ((data.status?.toUpperCase() === "ACTIVE" || data.status?.toUpperCase() === "TRIALING") && mounted) {
            setPhase("confirmed");
            return;
          }
        }
      } catch {
        // Network blips fall through to the retry below rather than dead-ending.
      }

      scheduleNext();
    }

    checkStatus();
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (phase !== "confirmed") return;
    const timer = setTimeout(() => {
      window.location.href = dashboardUrl;
    }, 1500);
    return () => clearTimeout(timer);
  }, [phase, dashboardUrl]);

  const copy = {
    checking: {
      title: "Starting your trial...",
      body: "Paddle is saving your payment method and activating your 7-day trial."
    },
    confirmed: {
      title: "You're all set!",
      body: "Your trial is active. Your first charge is after the trial ends. Redirecting to the dashboard..."
    },
    pending: {
      title: "Card saved",
      body:
        "Paddle has your payment method and your trial is being activated in the background. Open the dashboard and carry on."
    },
    signedOut: {
      title: "Card saved",
      body: "Your checkout went through. Sign in again to pick up where you left off."
    }
  }[phase];

  const isSpinner = phase === "checking";
  const href = phase === "signedOut" ? loginUrl : dashboardUrl;

  return (
    <div className="text-center">
      <div
        className={`mx-auto grid h-12 w-12 place-items-center rounded-[8px] text-white ${
          isSpinner ? "bg-lagoon" : "bg-olive"
        }`}
      >
        {isSpinner ? <Loader2 size={22} className="animate-spin" /> : <CheckCircle2 size={22} />}
      </div>

      <h1 className="mt-5 text-2xl font-bold">{copy.title}</h1>
      <p className="mt-3 text-sm leading-6 text-ink/70">{copy.body}</p>

      <a
        href={href}
        className="focus-ring mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white shadow-soft transition hover:bg-ink/90"
      >
        {phase === "confirmed" ? "Opening dashboard…" : phase === "signedOut" ? "Sign in" : "Open dashboard"}
      </a>
    </div>
  );
}
