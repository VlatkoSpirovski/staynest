import { CreditCard, ShieldCheck } from "lucide-react";
import { AppLegalLinks } from "@/components/app-legal-links";
import { Button } from "@/components/ui/button";
import { DevBillingBypass } from "@/components/dev-billing-bypass";
import { PaddleCheckoutButton } from "@/components/paddle-checkout-button";
import { Panel } from "@/components/ui/panel";
import { requireReadyUser } from "@/lib/auth";
import {
  hasBillingAccess,
  normalizePlanKey,
  planOption,
  priceIdForPlan
} from "@/lib/billing";
import { getAppUrl, getPaymentUrl } from "@/lib/utils";

export const preferredRegion = "fra1";
export const metadata = {
  title: "Keep collecting guest reviews",
  robots: {
    index: false,
    follow: false
  }
};

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
  const currentPlanKey = normalizePlanKey(user.selectedPlan);
  const currentPlan = planOption(currentPlanKey);
  const billingReady = hasBillingAccess(user);
  const currentStatus = user.subscriptionStatus?.toUpperCase() ?? null;

  const selectedPlan = currentPlanKey;
  const plan = planOption(selectedPlan);
  const trialDate = user.trialEndsAt?.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
  const priceId = priceIdForPlan(selectedPlan);
  const clientToken = process.env.PADDLE_CLIENT_TOKEN || "";
  const paddleEnvironment = process.env.PADDLE_ENV === "sandbox" ? "sandbox" : "production";
  const paddleError = paddleConfigError({ clientToken, priceId, environment: paddleEnvironment });
  const successUrl = `${getPaymentUrl()}/billing/complete`;
  const dashboardUrl = `${getAppUrl()}/dashboard`;
  const isDev = process.env.NODE_ENV !== "production";

  return (
    <main className="grid min-h-screen place-items-center bg-mist px-5 py-10 text-ink">
      <Panel className="w-full max-w-xl">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-lagoon text-white">
            <CreditCard size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold">
              {currentStatus === "ACTIVE" ? "Your review growth plan" : "Keep your review-ready guide online"}
            </h1>
            <p className="text-sm text-ink/72">
              {currentPlan.name} · {currentPlan.price} per year
            </p>
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
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-lagoon">Everything for better guest reviews</p>
              <p className="mt-2 text-sm leading-6 text-ink/72">
                The QR guest guide, Google/Booking/Airbnb review links and AI guest chat, billed once a year. Your guide stays live for the whole trial, and nothing is charged until it ends.
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{plan.price}</p>
              <p className="text-xs font-semibold text-ink/72">/year</p>
            </div>
          </div>
          <div className="mt-4 flex gap-3 rounded-[8px] bg-mist p-3 text-sm font-medium text-ink/70">
            <ShieldCheck className="mt-0.5 shrink-0 text-olive" size={18} />
            {trialDate ? `Your free trial runs until ${trialDate}.` : "Paddle will activate your subscription after checkout completes."}
          </div>
          <p className="mt-3 text-sm leading-6 text-ink/60">
            Paddle handles secure checkout, tax, invoicing and recurring billing on staynest.site. After checkout, your review-ready guide stays live for guests.
          </p>
        </div>

        {billingReady && currentStatus === "ACTIVE" ? (
          <Button href={dashboardUrl} className="mt-6 w-full">
            Open dashboard
          </Button>
        ) : !paddleError && priceId ? (
          <PaddleCheckoutButton
            clientToken={clientToken}
            environment={paddleEnvironment}
            plan={selectedPlan}
            successUrl={successUrl}
          />
        ) : isDev ? (
          <DevBillingBypass plan={selectedPlan} successUrl={successUrl} />
        ) : (
          <div className="mt-6 rounded-[8px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
            {paddleError}
          </div>
        )}

        <p className="mt-4 text-center text-xs leading-5 text-ink/50">
          By continuing, you agree to the StayNest Terms, Privacy Policy and Refund Policy. Paddle.com is the Merchant
          of Record for this order.
        </p>
        <AppLegalLinks className="mt-6 border-t border-ink/10 pt-5" />
      </Panel>
    </main>
  );
}
