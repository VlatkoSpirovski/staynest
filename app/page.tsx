import { ArrowRight, Bot, CheckCircle2, FileText, Home, QrCode, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { title: "QR guide", text: "Place one QR code in the property and guests always have the latest instructions.", icon: QrCode },
  { title: "AI guest chat", text: "Guests ask questions from their phone and get property-specific answers.", icon: Bot },
  { title: "Review reminders", text: "Simple review buttons for Google, Booking and Airbnb at the right moment.", icon: Star },
  { title: "Guest instructions", text: "Wi-Fi, arrival, parking, house rules and emergency details in one clean link.", icon: Home },
  { title: "Booking import", text: "Turn Booking or Airbnb links into a ready guide faster.", icon: FileText }
];

const mobileHighlights = [
  { title: "AI chat for guests", text: "Answers Wi-Fi, checkout, parking and local questions from the property guide.", icon: Bot },
  { title: "Import from listing", text: "Use one Booking or Airbnb link to prepare the guide faster.", icon: FileText },
  { title: "One QR, always live", text: "Update once and every guest sees the latest guide instantly.", icon: QrCode }
];

const plans = [
  {
    name: "Basic",
    price: "€10",
    text: "For owners who need a clean QR guest guide without AI.",
    items: ["Mobile guest guide", "QR code and public link", "Wi-Fi, rules and recommendations", "Review links"],
    href: "/register?plan=basic"
  },
  {
    name: "Full AI",
    price: "€15",
    text: "For premium stays that want guest chat and faster setup.",
    items: ["Everything in Basic", "AI guest assistant", "Property knowledge training", "Booking/Airbnb import support"],
    href: "/register?plan=ai"
  }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-mist text-ink">
      <section className="soft-grid overflow-hidden">
        <div className="mx-auto flex min-h-[100svh] max-w-6xl flex-col px-5 py-4 sm:py-6">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/staynest-logo.png"
                alt="StayNest"
                className="h-20 w-20 object-contain drop-shadow-sm sm:h-32 sm:w-32"
              />
            </div>
            <Button href="/login" variant="secondary" className="px-4 text-xs sm:inline-flex sm:px-5 sm:text-sm">
              Owner Login
            </Button>
          </header>

          <div className="grid flex-1 items-start gap-7 py-5 sm:gap-10 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-lagoon shadow-sm ring-1 ring-ink/5">
                Built for mobile-first guests
              </p>
              <h1 className="max-w-3xl text-[2.6rem] font-extrabold leading-[0.95] tracking-normal sm:text-6xl">
                A mobile concierge for every guest
              </h1>
              <p className="mt-4 max-w-xl text-[15px] leading-7 text-ink/68 sm:mt-6 sm:text-lg sm:leading-8">
                Give guests a beautiful QR guide with arrival details, Wi-Fi, house rules, local tips, reviews and an AI chat trained only on that property.
              </p>
              <div className="mt-5 grid gap-3">
                {mobileHighlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex gap-3 rounded-[8px] border border-ink/10 bg-white/85 p-3 shadow-[0_12px_36px_rgba(31,41,51,0.06)]">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-ink text-white">
                        <Icon size={17} />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold">{item.title}</h2>
                        <p className="mt-1 text-xs leading-5 text-ink/60">{item.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:mt-8 sm:flex-row">
                <Button href="#plans" className="min-h-14 gap-2 text-base sm:min-h-11 sm:text-sm">
                  View Plans <ArrowRight size={17} />
                </Button>
                <Button href="/stay/example-stay" variant="secondary" className="min-h-14 text-base sm:min-h-11 sm:text-sm">
                  View Example
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-[8px] bg-ink shadow-soft ring-1 ring-ink/10">
                <div className="h-44 bg-[url('https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center sm:h-56" />
                <div className="space-y-4 bg-white p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-lagoon">Guest guide</p>
                      <h2 className="text-2xl font-bold">StayNest Example</h2>
                    </div>
                    <div className="grid h-14 w-14 place-items-center rounded-[8px] bg-ink text-white">
                      <QrCode size={28} />
                    </div>
                  </div>
                  {["AI guest chat", "Wi-Fi and check-in", "Booking/Airbnb import"].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-[8px] border border-ink/10 p-3">
                      <CheckCircle2 className="text-olive" size={18} />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="plans" className="border-y border-ink/10 bg-white py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-semibold text-lagoon">Plans</p>
              <h2 className="mt-2 text-3xl font-bold">Start simple, upgrade when you want AI.</h2>
            </div>
          </div>

          <div className="mb-10 grid gap-4 md:grid-cols-2">
            {plans.map((plan) => (
              <article key={plan.name} className="rounded-[8px] border border-ink/10 bg-mist p-5 shadow-[0_12px_36px_rgba(31,41,51,0.06)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-lagoon">{plan.name}</p>
                    <p className="mt-2 text-sm leading-6 text-ink/60">{plan.text}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <p className="text-xs font-semibold text-ink/50">/ month</p>
                  </div>
                </div>
                <p className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold text-lagoon ring-1 ring-ink/10">
                  7-day free trial
                </p>
                <div className="mt-5 grid gap-2">
                  {plan.items.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm font-medium text-ink/70">
                      <CheckCircle2 size={16} className="text-olive" />
                      {item}
                    </div>
                  ))}
                </div>
                <a href={plan.href} className="focus-ring mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white shadow-soft transition hover:bg-ink/90">
                  Choose {plan.name}
                </a>
              </article>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="rounded-[8px] border border-ink/10 bg-mist p-5">
                  <Icon className="text-lagoon" size={22} />
                  <h3 className="mt-4 font-bold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/65">{feature.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-mist py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-6 rounded-[8px] border border-ink/10 bg-white p-5 shadow-soft sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="font-semibold text-lagoon">Ready to start?</p>
              <h2 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">Create your account and start the free trial.</h2>
              <p className="mt-3 max-w-2xl leading-7 text-ink/65">
                Register yourself, choose Basic or Full AI, then connect PayPal subscription after the trial is active.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <a href="/register?plan=basic" className="focus-ring inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white shadow-soft transition hover:bg-ink/90 sm:w-auto">
                Start Basic
              </a>
              <a href="/register?plan=ai" className="focus-ring inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-ink ring-1 ring-ink/10 transition hover:bg-white/80 sm:w-auto">
                Start Full AI
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
