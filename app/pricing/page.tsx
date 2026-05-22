import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAppUrl } from "@/lib/utils";

const plans = [
  {
    name: "Basic",
    price: "€10",
    description: "For rental owners who need a polished mobile guest guide without AI.",
    href: "/register?plan=basic",
    features: ["7-day free trial", "Mobile guest guide", "Secure public link and QR code", "Wi-Fi, arrival, house rules and recommendations", "Review links"]
  },
  {
    name: "Full AI",
    price: "€15",
    description: "For premium stays that want guest chat and faster setup.",
    href: "/register?plan=ai",
    features: ["7-day free trial", "Everything in Basic", "AI guest assistant", "AI listing import support", "Property-specific assistant knowledge"]
  }
];

export default function PricingPage() {
  const appUrl = getAppUrl();

  return (
    <main className="min-h-screen bg-mist text-ink">
      <section className="mx-auto max-w-6xl px-5 py-10">
        <header className="mb-10 flex items-center justify-between gap-4">
          <a href="/" className="text-lg font-extrabold">
            StayNest
          </a>
          <Button href={`${appUrl}/login`} variant="secondary">
            Login
          </Button>
        </header>
        <div className="max-w-2xl">
          <p className="font-semibold text-lagoon">Pricing</p>
          <h1 className="mt-2 text-4xl font-extrabold leading-tight">Simple monthly plans for rental hosts.</h1>
          <p className="mt-4 leading-7 text-ink/65">Start with a 7-day free trial. After the trial, continue on the plan that fits your property workflow.</p>
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
                  <p className="text-4xl font-extrabold">{plan.price}</p>
                  <p className="text-sm font-semibold text-ink/50">/ month</p>
                </div>
              </div>
              <div className="mt-6 grid gap-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex gap-2 text-sm font-medium text-ink/70">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-olive" size={17} />
                    {feature}
                  </div>
                ))}
              </div>
              <Button href={`${appUrl}${plan.href}`} className="mt-7 w-full">
                Start {plan.name}
              </Button>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-[8px] border border-ink/10 bg-white p-5 text-sm leading-7 text-ink/65">
          Prices are shown in EUR and billed monthly. StayNest is a digital SaaS product for rental owners and hosts.
        </div>
      </section>
    </main>
  );
}
