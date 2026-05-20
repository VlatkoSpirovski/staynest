import { ArrowRight, CheckCircle2, Globe2, Home, Mail, MessageSquareText, Phone, QrCode, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { title: "QR guide", text: "Place one QR code in the villa and guests always have the latest instructions.", icon: QrCode },
  { title: "Multilingual content", text: "Structure ready for future AI translation across guest languages.", icon: Globe2 },
  { title: "Review reminders", text: "Simple review buttons for Google, Booking and Airbnb at the right moment.", icon: Star },
  { title: "Guest instructions", text: "Wi-Fi, arrival, parking, house rules and emergency details in one clean link.", icon: Home },
  { title: "Local recommendations", text: "Show guests your trusted restaurants, cafes, beaches and viewpoints.", icon: MessageSquareText }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-mist text-ink">
      <section className="soft-grid">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-6">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/staynest-logo.png"
                alt="StayNest"
                className="h-28 w-28 object-contain drop-shadow-sm sm:h-32 sm:w-32"
              />
            </div>
            <Button href="/login" variant="secondary" className="hidden sm:inline-flex">
              Owner Login
            </Button>
          </header>

          <div className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-lagoon shadow-sm">
                €15/property/month
              </p>
              <h1 className="max-w-3xl text-5xl font-bold leading-[1.02] tracking-normal sm:text-6xl">
                Digital guest guide for villas, apartments and rentals
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-ink/70">
                StayNest gives rental owners one polished public guide with arrival details, Wi-Fi, rules,
                recommendations, review links and host contact info.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/login" className="gap-2">
                  Get Started <ArrowRight size={17} />
                </Button>
                <Button href="/stay/villa-beti" variant="secondary">
                  View Demo
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-[8px] bg-white shadow-soft ring-1 ring-ink/10">
                <div className="h-56 bg-[url('https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center" />
                <div className="space-y-5 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-lagoon">Guest guide</p>
                      <h2 className="text-2xl font-bold">StayNest Demo</h2>
                    </div>
                    <div className="grid h-14 w-14 place-items-center rounded-[8px] bg-mist">
                      <QrCode size={28} />
                    </div>
                  </div>
                  {["Wi-Fi details", "Check-in instructions", "Local recommendations"].map((item) => (
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

      <section className="border-y border-ink/10 bg-white py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-semibold text-lagoon">One simple plan</p>
              <h2 className="mt-2 text-3xl font-bold">Premium guest experience, lightweight owner workflow.</h2>
            </div>
            <div className="rounded-[8px] border border-ink/10 px-5 py-4">
              <span className="text-3xl font-bold">€15</span>
              <span className="text-ink/60"> / property / month</span>
            </div>
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
              <p className="font-semibold text-lagoon">Need a StayNest account?</p>
              <h2 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">Contact us and we will create it for you.</h2>
              <p className="mt-3 max-w-2xl leading-7 text-ink/65">
                Owner accounts are created by the StayNest team. Call us or email us and we will help you get started.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <a
                href="tel:+38978459001"
                className="focus-ring inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white shadow-soft transition hover:bg-ink/90 sm:w-auto"
              >
                <Phone size={17} />
                Call +389 78 459 001
              </a>
              <a
                href="mailto:staynest2026@gmail.com"
                className="focus-ring inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-ink ring-1 ring-ink/10 transition hover:bg-white/80 sm:w-auto"
              >
                <Mail size={17} />
                Email us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
