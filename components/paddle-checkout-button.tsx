"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type PaddleCheckoutButtonProps = {
  clientToken: string;
  environment: string;
  priceId: string;
  email: string;
  userId: string;
  plan: string;
  successUrl: string;
};

type PaddleWindow = Window & {
  Paddle?: {
    Environment?: {
      set(environment: string): void;
    };
    Initialize(options: { token: string; eventCallback?: (event: PaddleEvent) => void }): void;
    Checkout: {
      open(options: {
        settings: {
          displayMode: "overlay";
          variant: "one-page";
          theme: "light";
          successUrl: string;
        };
        items: Array<{ priceId: string; quantity: number }>;
        customer: { email: string };
        customData: Record<string, string>;
      }): void;
    };
  };
};

type PaddleEvent = {
  name?: string;
  event?: string;
};

function loadPaddleScript() {
  return new Promise<void>((resolve, reject) => {
    if ((window as PaddleWindow).Paddle) {
      resolve();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://cdn.paddle.com/paddle/v2/paddle.js"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", () => reject(new Error("Could not load Paddle.")));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Paddle."));
    document.body.appendChild(script);
  });
}

export function PaddleCheckoutButton({
  clientToken,
  environment,
  priceId,
  email,
  userId,
  plan,
  successUrl
}: PaddleCheckoutButtonProps) {
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    loadPaddleScript()
      .then(() => {
        if (!mounted) return;
        const paddle = (window as PaddleWindow).Paddle;
        if (!paddle) throw new Error("Paddle is unavailable.");
        if (environment === "sandbox") {
          paddle.Environment?.set("sandbox");
        }
        paddle.Initialize({
          token: clientToken,
          eventCallback: (event) => {
            if (event.name === "checkout.completed" || event.event === "checkout.completed") {
              window.location.href = successUrl;
            }
          }
        });
        setReady(true);
      })
      .catch((loadError) => {
        if (mounted) setError(loadError instanceof Error ? loadError.message : "Could not load Paddle.");
      });

    return () => {
      mounted = false;
    };
  }, [clientToken, environment, successUrl]);

  return (
    <div className="mt-6">
      {error ? <div className="mb-3 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div> : null}
      <button
        type="button"
        disabled={!ready || busy}
        onClick={() => {
          const paddle = (window as PaddleWindow).Paddle;
          if (!paddle) {
            setError("Paddle is still loading. Try again in a moment.");
            return;
          }
          setBusy(true);
          paddle.Checkout.open({
            settings: {
              displayMode: "overlay",
              variant: "one-page",
              theme: "light",
              successUrl
            },
            items: [{ priceId, quantity: 1 }],
            customer: { email },
            customData: {
              userId,
              plan
            }
          });
          setTimeout(() => setBusy(false), 1500);
        }}
        className="focus-ring inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white shadow-soft transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {!ready || busy ? <Loader2 className="animate-spin" size={16} /> : null}
        {ready ? "Continue to secure checkout" : "Loading checkout..."}
      </button>
    </div>
  );
}
