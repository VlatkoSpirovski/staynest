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
 * Paddle's webhook is the only thing that can flip subscriptionStatus to ACTIVE,
 * so this page cannot treat "not yet ACTIVE" as failure — webhook delivery is
 * asynchronous and may be delayed or misconfigured. It polls briefly for the
 * confirmation, then resolves to a reassuring state either way. The owner already
 * has access through their trial, so there is nothing to gate on here.
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
          if (data.status?.toUpperCase() === "ACTIVE" && mounted) {
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
      title: "Confirming your subscription…",
      body: "Paddle is processing your payment. This usually takes a few seconds."
    },
    confirmed: {
      title: "You're all set!",
      body: "Your subscription is active. Redirecting to the dashboard…"
    },
    pending: {
      title: "Payment received",
      body:
        "Paddle has your payment and your subscription is being activated in the background. Your guide stays live the whole time — open the dashboard and carry on."
    },
    signedOut: {
      title: "Payment received",
      body: "Your payment went through. Sign in again to pick up where you left off."
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
