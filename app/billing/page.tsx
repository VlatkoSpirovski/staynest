import { CreditCard, ShieldCheck } from "lucide-react";
import { AppLegalLinks } from "@/components/app-legal-links";
import { Button } from "@/components/ui/button";
import { PaddleCheckoutButton } from "@/components/paddle-checkout-button";
import { Panel } from "@/components/ui/panel";
import { requireReadyUser } from "@/lib/auth";
import { getAppUrl } from "@/lib/utils";

const planCopy = {
  basic: { name: "Basic", price: "€10/month" },
  ai: { name: "Full AI", price: "€15/month" }
};

export const preferredRegion = "fra1";

function paddleConfigError({ clientToken, priceId, environment }: { clientToken: string; priceId?: string; environment: string }) {
  if (!clientToken || !priceId) return "Paddle checkout needs PADDLE_CLIENT_TOKEN and the selected plan price ID in Vercel.";
  if (!priceId.startsWith("pri_")) return "The selected Paddle price ID must start with pri_.";
  if (environment === "production" && clientToken.startsWith("test_")) return "PADDLE_ENV is production, but PADDLE_CLIENT_TOKEN is a sandbox token. Use a live_ client token.";
  if (environment === "sandbox" && clientToken.startsWith("live_")) return "PADDLE_ENV is sandbox, but PADDLE_CLIENT_TOKEN is a live token. Use a test_ client token.";
  if (!clientToken.startsWith("live_") && !clientToken.startsWith("test_")) return "PADDLE_CLIENT_TOKEN must be a client-side token, not an API key.";
  return "";
}

type BillingPageProps = {
  searchParams?: {
    plan?: string;
    error?: string;
  };
};

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const user = await requireReadyUser();
  const selectedPlan = searchParams?.plan === "ai" || user.selectedPlan === "ai" ? "ai" : "basic";
  const plan = planCopy[selectedPlan];
  const trialDate = user.trialEndsAt?.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
  const priceId = selectedPlan === "ai" ? process.env.PADDLE_AI_PRICE_ID : process.env.PADDLE_BASIC_PRICE_ID;
  const clientToken = process.env.PADDLE_CLIENT_TOKEN || "";
  const paddleEnvironment = process.env.PADDLE_ENV === "sandbox" ? "sandbox" : "production";
  const paddleError = paddleConfigError({ clientToken, priceId, environment: paddleEnvironment });
  const successUrl = `${getAppUrl()}/billing/complete`;

  return (
    <main className="grid min-h-screen place-items-center bg-mist px-5 py-10 text-ink">
      <Panel className="w-full max-w-xl">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-lagoon text-white">
            <CreditCard size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold">Your 7-day trial is active</h1>
            <p className="text-sm text-ink/60">Plan: {plan.name}</p>
          </div>
        </div>

        {searchParams?.error ? (
          <div className="mt-5 rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {searchParams.error}
          </div>
        ) : null}

        <div className="mt-6 rounded-[8px] border border-ink/10 bg-white p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-lagoon">{plan.name}</p>
              <p className="mt-2 text-sm leading-6 text-ink/62">
                Use StayNest now. Connect Paddle checkout before the trial ends so the subscription can continue automatically.
              </p>
            </div>
            <p className="text-right text-2xl font-bold">{plan.price}</p>
          </div>
          <div className="mt-4 flex gap-3 rounded-[8px] bg-mist p-3 text-sm font-medium text-ink/70">
            <ShieldCheck className="mt-0.5 shrink-0 text-olive" size={18} />
            {trialDate ? `Trial runs until ${trialDate}. Paddle prices include the 7-day trial.` : "Trial started today."}
          </div>
          <p className="mt-3 text-sm leading-6 text-ink/60">
            Paddle handles tax, checkout and recurring billing. After checkout, webhooks update your StayNest subscription status.
          </p>
        </div>

        {!paddleError && priceId ? (
          <PaddleCheckoutButton
            clientToken={clientToken}
            environment={paddleEnvironment}
            plan={selectedPlan}
            successUrl={successUrl}
          />
        ) : (
          <div className="mt-6 rounded-[8px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
            {paddleError}
          </div>
        )}

        <Button href="/dashboard" variant="secondary" className="mt-3 w-full">
          Go to dashboard
        </Button>
        <AppLegalLinks className="mt-6 border-t border-ink/10 pt-5" />
      </Panel>
    </main>
  );
}
