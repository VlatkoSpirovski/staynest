import { CheckCircle2 } from "lucide-react";
import { AppLegalLinks } from "@/components/app-legal-links";
import { Button } from "@/components/ui/button";
import { getAppUrl } from "@/lib/utils";

export const metadata = {
  title: "Pricing",
  description: "Simple plans for rental hosts. Start with a 7-day free trial and choose monthly or discounted yearly billing.",
  alternates: {
    canonical: "/pricing"
  },
  openGraph: {
    title: "StayNest · Pricing",
    description: "Simple plans for rental hosts. Start with a 7-day free trial and choose monthly or discounted yearly billing.",
    url: "/pricing"
  }
};

const plans = [
  {
    name: "Basic",
    monthly: "€10",
    yearly: "€60",
    yearlyNote: "Save €60 vs monthly",
    description: "For rental owners who need a polished mobile guest guide without AI.",
    monthlyHref: "/register?plan=basic-monthly",
    yearlyHref: "/register?plan=basic-yearly",
    features: ["7-day free trial", "Mobile guest guide", "Secure public link and QR code", "Wi-Fi, arrival, house rules and recommendations", "Review links"]
  },
  {
    name: "Full AI",
    monthly: "€15",
    yearly: "€80",
    yearlyNote: "Save €100 vs monthly",
    description: "For premium stays that want guest chat and faster setup.",
    monthlyHref: "/register?plan=ai-monthly",
    yearlyHref: "/register?plan=ai-yearly",
    features: ["7-day free trial", "Everything in Basic", "AI guest assistant", "AI listing import support", "Property-specific assistant knowledge"]
  }
];

export default function PricingPage() {
  const appUrl = getAppUrl();

  return (
    <main className="min-h-screen bg-mist text-ink">
      <section className="mx-auto max-w-6xl px-5 py-10">
        <header className="mb-10 flex items-center justify-between gap-4">
          <a href={appUrl} className="text-lg font-extrabold">
            StayNest
          </a>
          <Button href={`${appUrl}/login`} variant="secondary">
            Login
          </Button>
        </header>
        <div className="max-w-2xl">
          <p className="font-semibold text-lagoon">Pricing</p>
          <h1 className="mt-2 text-4xl font-extrabold leading-tight">Simple plans for rental hosts.</h1>
          <p className="mt-4 leading-7 text-ink/65">Start with a 7-day free trial. Choose monthly flexibility or a discounted yearly plan.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <article key={plan.name} className="rounded-[8px] border border-ink/10 bg-white p-6 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-lagoon">{plan.name}</p>
                  <p className="mt-2 text-sm leading-6 text-ink/60">{plan.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-extrabold">{plan.monthly}</p>
                  <p className="text-sm font-semibold text-ink/50">/ month</p>
                </div>
              </div>
              <div className="mt-5 rounded-[8px] border border-olive/20 bg-olive/10 p-3">
                <p className="text-sm font-extrabold text-ink">{plan.yearly} / year</p>
                <p className="mt-1 text-xs font-bold text-olive">{plan.yearlyNote}</p>
              </div>
              <div className="mt-6 grid gap-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex gap-2 text-sm font-medium text-ink/70">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-olive" size={17} />
                    {feature}
                  </div>
                ))}
              </div>
              <Button href={`${appUrl}${plan.yearlyHref}`} className="mt-7 w-full">
                Start yearly
              </Button>
              <Button href={`${appUrl}${plan.monthlyHref}`} variant="secondary" className="mt-3 w-full">
                Start monthly
              </Button>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-[8px] border border-ink/10 bg-white p-5 text-sm leading-7 text-ink/65">
          Prices are shown in EUR and billed after the 7-day free trial. StayNest is a digital SaaS product for
          rental owners and hosts. Payments, taxes, invoicing, subscription renewals and refunds are handled by
          Paddle.com as Merchant of Record. You can cancel any time from your dashboard or by contacting support.
        </div>
        <AppLegalLinks className="mt-8" />
      </section>
    </main>
  );
}
