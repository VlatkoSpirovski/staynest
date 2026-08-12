import { CheckCircle2 } from "lucide-react";
import { AppLegalLinks } from "@/components/app-legal-links";
import { Button } from "@/components/ui/button";
import { planOption } from "@/lib/billing";
import { getAppUrl } from "@/lib/utils";

export const metadata = {
  title: "Pricing",
  description:
    "One plan for rental hosts: everything included for €20 a year. Start with a 7-day free trial, no card required.",
  alternates: {
    canonical: "/pricing"
  },
  openGraph: {
    title: "StayNest · Pricing",
    description:
      "One plan for rental hosts: everything included for €20 a year. Start with a 7-day free trial, no card required.",
    url: "/pricing"
  }
};

const features = [
  "Mobile QR guest guide with your own branding",
  "Secure public link and printable QR code",
  "Wi-Fi, arrival, parking, house rules and emergency info",
  "Local recommendations and review links",
  "AI guest chat trained on your property",
  "Answers in your guest’s own language",
  "Booking.com listing import",
  "Unlimited updates — the printed QR never changes"
];

const faqs = [
  {
    q: "Do I need a card to start?",
    a: "No. The 7-day trial starts as soon as you register and you can build and publish your guide without entering payment details."
  },
  {
    q: "What happens after the trial?",
    a: "Add a payment method to keep your guide online. If you do nothing, the guide simply goes offline — nothing is charged automatically."
  },
  {
    q: "Is there a cheaper plan without AI?",
    a: "No. There is one plan and the AI guest chat is part of it, because splitting it out only made the choice harder without making the product better."
  },
  {
    q: "Can I cancel?",
    a: "Any time, from the billing portal. Your guide stays live until the end of the paid year."
  }
];

export default function PricingPage() {
  const appUrl = getAppUrl();
  const plan = planOption();

  return (
    <main className="min-h-screen bg-mist text-ink">
      <section className="mx-auto max-w-4xl px-5 py-10">
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
          <h1 className="mt-2 text-4xl font-extrabold leading-tight">One plan. Everything included.</h1>
          <p className="mt-4 leading-7 text-ink/72">
            {plan.price} a year, billed once. No tiers, no add-ons, and nothing held back to sell you later.
          </p>
        </div>

        <article className="mt-10 rounded-[28px] border border-ink/10 bg-white p-6 shadow-[0_18px_54px_rgba(23,32,51,0.06)] sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold">{plan.name}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/72">Rentals are seasonal — one payment a year fits how you actually run the property.</p>
            </div>
            <div className="text-right">
              <p className="text-5xl font-extrabold tracking-tight">{plan.price}</p>
              <p className="text-sm font-semibold text-ink/72">per year</p>
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {features.map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm font-medium leading-6 text-ink/80">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-lagoon" />
                {item}
              </div>
            ))}
          </div>

          <Button href={`${appUrl}/register`} className="mt-8 w-full">
            Start 7 days free
          </Button>
          <p className="mt-3 text-center text-xs font-semibold text-ink/72">No card needed to start. Cancel any time.</p>
        </article>

        <section className="mt-12">
          <h2 className="text-2xl font-extrabold">Questions</h2>
          <dl className="mt-5 grid gap-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-[20px] border border-ink/10 bg-white p-5">
                <dt className="text-sm font-extrabold">{faq.q}</dt>
                <dd className="mt-2 text-sm leading-6 text-ink/72">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <AppLegalLinks className="mt-12 border-t border-ink/10 pt-6" />
      </section>
    </main>
  );
}
