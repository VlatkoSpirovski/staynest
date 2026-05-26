import { CreditCard, ShieldCheck } from "lucide-react";
import { AppLegalLinks } from "@/components/app-legal-links";
import { Button } from "@/components/ui/button";
import { PaddleCheckoutButton } from "@/components/paddle-checkout-button";
import { Panel } from "@/components/ui/panel";
import { requireReadyUser } from "@/lib/auth";
import {
  billingUrl,
  hasBillingAccess,
  normalizePlanKey,
  planOption,
  priceIdForPlan,
  type PlanTier
} from "@/lib/billing";
import { getAppUrl, getPaymentUrl } from "@/lib/utils";

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
  const currentPlanKey = normalizePlanKey(user.selectedPlan);
  const currentPlan = planOption(currentPlanKey);
  const billingReady = hasBillingAccess(user);

  const selectedPlanFromQuery = searchParams?.plan ? normalizePlanKey(searchParams.plan) : undefined;
  const isSwitching = billingReady && Boolean(selectedPlanFromQuery) && selectedPlanFromQuery !== currentPlanKey;
  const targetTier: PlanTier = isSwitching && selectedPlanFromQuery ? planOption(selectedPlanFromQuery).tier : currentPlan.tier;

  const defaultSelectedPlanKey = `${targetTier}-${currentPlan.interval}`;

  const selectedPlan = (() => {
    if (!isSwitching) {
      return selectedPlanFromQuery ?? normalizePlanKey(defaultSelectedPlanKey);
    }

    // While switching an active/trialing subscription, force the tier to the opposite.
    const queryTier = selectedPlanFromQuery ? planOption(selectedPlanFromQuery).tier : targetTier;
    if (queryTier === targetTier) return selectedPlanFromQuery ?? normalizePlanKey(defaultSelectedPlanKey);

    const queryInterval = selectedPlanFromQuery ? planOption(selectedPlanFromQuery).interval : currentPlan.interval;
    return normalizePlanKey(`${targetTier}-${queryInterval}`);
  })();

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
  const optionsTier: PlanTier = isSwitching ? targetTier : plan.tier;

  return (
    <main className="grid min-h-screen place-items-center bg-mist px-5 py-10 text-ink">
      <Panel className="w-full max-w-xl">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-lagoon text-white">
            <CreditCard size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold">
              {billingReady ? "Update your subscription" : "Start your 7-day trial"}
            </h1>
            <p className="text-sm text-ink/60">
              {isSwitching ? "Current plan" : "Selected plan"}: {currentPlan.shortName} ·{" "}
              {currentPlan.cadence === "yearly" ? "Yearly" : "Monthly"}
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
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-lagoon">
                {isSwitching ? (targetTier === "ai" ? "Upgrade to Full AI" : "Switch to Basic") : "Choose your cadence"}
              </p>
              <p className="mt-2 text-sm leading-6 text-ink/62">
                {isSwitching
                  ? "Switch your tier. We’ll keep your existing cadence by default, and you can change monthly/yearly below."
                  : "Add your payment method with Paddle to activate the free trial. You will not be charged until the trial ends."}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{plan.price}</p>
              <p className="text-xs font-semibold text-ink/45">/{plan.cadence === "yearly" ? "year" : "month"}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              planOption(optionsTier === "ai" ? "ai-monthly" : "basic-monthly"),
              planOption(optionsTier === "ai" ? "ai-yearly" : "basic-yearly")
            ].map((option) => (
              <a
                key={option.key}
                href={billingUrl(option.key)}
                className={`rounded-[8px] border px-3 py-2 text-sm font-bold transition ${
                  option.key === selectedPlan ? "border-ink bg-ink text-white" : "border-ink/10 bg-mist text-ink/70 hover:border-ink/25"
                }`}
              >
                <span>{option.cadence === "yearly" ? "Yearly" : "Monthly"} · {option.price}</span>
                {option.savings ? <span className={`ml-2 text-xs ${option.key === selectedPlan ? "text-white/70" : "text-olive"}`}>{option.savings}</span> : null}
              </a>
            ))}
          </div>
          <div className="mt-4 flex gap-3 rounded-[8px] bg-mist p-3 text-sm font-medium text-ink/70">
            <ShieldCheck className="mt-0.5 shrink-0 text-olive" size={18} />
            {trialDate
              ? `Trial runs until ${trialDate}.`
              : isSwitching
                ? "Paddle will update your subscription after checkout completes."
                : `${plan.comparison ? `${plan.comparison}. ` : ""}Paddle starts the 7-day trial during checkout.`}
          </div>
          <p className="mt-3 text-sm leading-6 text-ink/60">
            Paddle handles secure checkout, tax, invoicing and recurring billing on staynest.site. After
            checkout, webhooks update your StayNest subscription status.
          </p>
        </div>

        {billingReady && !isSwitching ? (
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
