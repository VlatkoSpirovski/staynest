import { CheckCircle2 } from "lucide-react";
import { AppLegalLinks } from "@/components/app-legal-links";
import { Button } from "@/components/ui/button";
import { planOption } from "@/lib/billing";
import { getAppUrl } from "@/lib/utils";

export const metadata = {
  title: "Pricing for more 5-star guest reviews",
  description:
    "One plan for rental hosts who want more 5-star reviews: QR guest guide, Google review links, Booking.com review links, AI guest chat and unlimited updates for €20 a year.",
  keywords: [
    "vacation rental review tool",
    "Airbnb review tool pricing",
    "Google review link for hosts",
    "Booking.com host review links",
    "QR guest guide pricing"
  ],
  alternates: {
    canonical: "/pricing"
  },
  openGraph: {
    title: "StayNest · Pricing for more 5-star guest reviews",
    description:
      "One yearly plan with QR guide, AI guest chat and review links to help hosts create smoother stays and collect more reviews.",
    url: "/pricing"
  }
};

const features = [
  "Google, Booking.com and Airbnb review links in the guest guide",
  "Review-ready checkout section for happy guests",
  "Mobile QR guest guide with your own branding",
  "Secure public link and printable QR code",
  "Wi-Fi, arrival, parking, house rules and emergency info",
  "Local recommendations that improve the guest experience",
  "AI guest chat trained on your property",
  "Answers in your guest’s own language",
  "Booking.com listing import",
  "Unlimited updates — the printed QR never changes"
];

const faqs = [
  {
    q: "Do I need a card to start?",
    a: "Yes. Add a card to start the 7-day trial, but you are not charged until the trial ends."
  },
  {
    q: "What happens after the trial?",
    a: "Paddle starts the yearly subscription automatically after the 7-day trial unless you cancel during the trial."
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
          <h1 className="mt-2 text-4xl font-extrabold leading-tight">One plan to help every stay earn better reviews.</h1>
          <p className="mt-4 leading-7 text-ink/72">
            {plan.price} a year, billed once. Your QR guide, AI guest chat, Google review link, Booking.com review link and Airbnb review link are all included.
          </p>
        </div>

        <article className="mt-10 rounded-[28px] border border-ink/10 bg-white p-6 shadow-[0_18px_54px_rgba(23,32,51,0.06)] sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold">{plan.name}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/72">A single better review can be worth far more than the yearly cost.</p>
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
            Start improving your reviews
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
