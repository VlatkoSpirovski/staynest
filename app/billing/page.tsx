import { CreditCard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { requireReadyUser } from "@/lib/auth";

const planCopy = {
  basic: { name: "Basic", price: "€10/month" },
  ai: { name: "Full AI", price: "€15/month" }
};

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
  const paypalReady = Boolean(
    process.env.PAYPAL_CLIENT_ID &&
      process.env.PAYPAL_CLIENT_SECRET &&
      (selectedPlan === "ai" ? process.env.PAYPAL_AI_PLAN_ID : process.env.PAYPAL_BASIC_PLAN_ID)
  );

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
                Use StayNest now. Connect PayPal before the trial ends so the subscription can continue automatically.
              </p>
            </div>
            <p className="text-right text-2xl font-bold">{plan.price}</p>
          </div>
          <div className="mt-4 flex gap-3 rounded-[8px] bg-mist p-3 text-sm font-medium text-ink/70">
            <ShieldCheck className="mt-0.5 shrink-0 text-olive" size={18} />
            {trialDate ? `Trial runs until ${trialDate}. PayPal must also have a 7-day trial on this plan.` : "Trial started today."}
          </div>
          <p className="mt-3 text-sm leading-6 text-ink/60">
            If PayPal is connected to a plan with a 7-day trial, PayPal charges automatically after day 7. If PayPal is not connected, there is no automatic charge.
          </p>
        </div>

        {paypalReady ? (
          <Button href={`/api/paypal/subscribe?plan=${selectedPlan}`} className="mt-6 w-full">
            Continue to PayPal
          </Button>
        ) : (
          <div className="mt-6 rounded-[8px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
            PayPal is ready in the app, but the PayPal environment values still need to be added in Vercel before live subscriptions can open.
          </div>
        )}

        <Button href="/dashboard" variant="secondary" className="mt-3 w-full">
          Go to dashboard
        </Button>
      </Panel>
    </main>
  );
}
