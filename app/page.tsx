import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  Copy,
  KeyRound,
  Languages,
  Link2,
  MessageCircle,
  Printer,
  QrCode,
  Star,
  Wifi
} from "lucide-react";

import { AppLegalLinks } from "@/components/app-legal-links";
import { PreviewForm } from "@/components/preview-form";
import { StickyMobileCta } from "@/components/sticky-mobile-cta";
import { getAppUrl } from "@/lib/utils";

export const metadata = {
  title: "Get more 5-star reviews from every stay.",
  description:
    "QR guest guide for Airbnb, Booking.com and villa hosts: Wi-Fi, check-in, local tips, AI guest answers and review links. 7 days free, no card.",
  keywords: [
    "get more 5-star reviews",
    "Airbnb 5-star reviews",
    "Booking.com guest reviews",
    "Google reviews for rentals",
    "vacation rental guest guide",
    "Airbnb guest guide QR code",
    "Booking.com host tools",
    "villa guest guide",
    "AI guest chat for rentals",
    "QR code guest guide",
    "review links for hosts"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "StayNest · Get more 5-star reviews from every stay.",
    description:
      "A QR guest guide for Airbnb, Booking.com and villa hosts that answers guest questions automatically, improves the stay, and sends happy guests to your Google, Booking.com or Airbnb review page.",
    url: "/"
  },
  twitter: {
    card: "summary_large_image",
    title: "Get more 5-star reviews from every stay",
    description:
      "Give guests one QR guide for Wi-Fi, check-in, checkout, AI answers and review links, then turn smoother stays into better reviews."
  }
};

const EXAMPLE_HREF = "/g/example";

const navItems = [
  { label: "Live demo", href: EXAMPLE_HREF },
  { label: "How it works", href: "#how" },
  { label: "Pricing", href: "#pricing" },
  { label: "Guides", href: "/guides" }
];

const hostNames = ["Villa Beti", "Cece's Home", "Villa Yeti"];

const steps = [
  {
    title: "Paste your Booking.com link",
    text: "StayNest reads your listing and fills in the guide for you. No listing? Start from a blank guide.",
    icon: Link2
  },
  {
    title: "Add Wi-Fi and check-in",
    text: "The two things every guest asks. Add your review link while you are there.",
    icon: KeyRound
  },
  {
    title: "Print one QR code",
    text: "Put it by the door. Edit anything later, the QR code never changes.",
    icon: Printer
  }
];

const planFeatures = [
  "Mobile guest guide with your photos",
  "Wi-Fi, check-in, house rules, local tips",
  "AI concierge that replies in the guest's language",
  "Google, Booking.com and Airbnb review links",
  "Booking.com import",
  "Unlimited edits, the QR code never changes"
];

const faqs = [
  {
    q: "Do I need a card to start?",
    a: "No. The 7-day free trial starts without a card. You only add payment details if you want to keep your guide live after the trial."
  },
  {
    q: "Do my guests need to install an app?",
    a: "No. Guests scan the QR code or open the link and the guide opens in their phone's browser."
  },
  {
    q: "What does the AI concierge know?",
    a: "Only what you put in your guide: Wi-Fi, check-in, house rules, your tips and the notes you add for it. It answers in the guest's own language and tells them to contact you for anything it does not know."
  },
  {
    q: "What happens after the trial?",
    a: "Your guide goes offline for guests and they see a short “temporarily unavailable” page. Everything you set up is saved, and you can subscribe at any time to put it back online. We email you two days before the trial ends."
  },
  {
    q: "Can I cancel?",
    a: "Any time, from the billing portal. Your guide stays live until the end of the paid year."
  }
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="StayNest home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/staynest-logo.png" alt="" className="h-9 w-9 object-contain" />
      <span className="text-[17px] font-bold tracking-tight">StayNest</span>
    </Link>
  );
}

function PrimaryCta({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-sn-ink px-6 text-[15px] font-semibold text-white shadow-[0_12px_32px_rgba(17,24,39,0.22)] transition hover:-translate-y-px hover:bg-sn-ink/90 ${className}`}
    >
      {children}
    </Link>
  );
}

function SecondaryCta({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-sn-line/12 bg-white px-6 text-[15px] font-semibold text-sn-ink transition hover:border-sn-line/25 ${className}`}
    >
      {children}
    </Link>
  );
}

function LiveDemoPhone() {
  return (
    <div className="relative mx-auto w-[300px] sm:w-[330px]">
      <div className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(47,110,106,0.20),transparent)] blur-2xl" aria-hidden="true" />
      <div className="rounded-[46px] bg-sn-ink p-[10px] shadow-[0_40px_100px_rgba(17,24,39,0.28)]">
        <div className="relative h-[600px] overflow-hidden rounded-[37px] bg-white sm:h-[660px]">
          <iframe
            src={EXAMPLE_HREF}
            title="Live StayNest example guide"
            className="pointer-events-none absolute left-0 top-0 h-[750px] w-[390px] origin-top-left scale-[0.7385] border-0 sm:h-[748px] sm:scale-[0.8205] lg:pointer-events-auto"
            loading="eager"
          />
          <Link
            href={EXAMPLE_HREF}
            className="absolute inset-0 lg:hidden"
            aria-label="Open the live example guide"
          />
        </div>
      </div>
      <div className="absolute -left-16 top-[42%] hidden rounded-2xl bg-white px-4 py-3 shadow-[0_18px_44px_rgba(17,24,39,0.14)] sm:block">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sn-muted">Guest asks</p>
        <p className="mt-1 text-sm font-semibold">&ldquo;Wo ist der Schlüssel?&rdquo;</p>
      </div>
      <div className="absolute -right-10 bottom-2 hidden items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-[0_18px_44px_rgba(17,24,39,0.14)] sm:flex">
        <span className="flex text-amber-400" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={14} fill="currentColor" />
          ))}
        </span>
        <span className="text-sm font-semibold">Review link inside</span>
      </div>
      <p className="mt-5 text-center text-sm font-medium text-sn-muted">
        <span className="hidden lg:inline">This is the real guide. Tap around.</span>
        <Link href={EXAMPLE_HREF} className="font-semibold text-sn-accent underline-offset-4 hover:underline lg:hidden">
          Open the live demo
        </Link>
      </p>
    </div>
  );
}

function WifiCard() {
  return (
    <article className="flex flex-col justify-between rounded-[28px] border border-sn-line/8 bg-white p-6 sm:p-7">
      <div>
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sn-accent-soft text-sn-accent">
          <Wifi size={20} aria-hidden="true" />
        </span>
        <h3 className="mt-5 text-xl font-bold tracking-tight">Wi-Fi in one tap</h3>
        <p className="mt-2 text-[15px] leading-7 text-sn-muted">The question you get on every arrival, answered before anyone texts you.</p>
      </div>
      <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl bg-sn-canvas px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Lakeview_Guest</p>
          <p className="truncate font-mono text-xs text-sn-muted">Lakeview2026!</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-sn-ink px-3 py-1.5 text-xs font-semibold text-white">
          <Copy size={12} aria-hidden="true" /> Copy
        </span>
      </div>
    </article>
  );
}

function ChatCard() {
  return (
    <article className="flex flex-col justify-between rounded-[28px] bg-sn-ink p-6 text-white sm:p-7 md:row-span-2">
      <div>
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10">
          <Bot size={20} aria-hidden="true" />
        </span>
        <h3 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">An AI concierge that knows your place</h3>
        <p className="mt-3 text-[15px] leading-7 text-white/70">
          Guests ask at 2 a.m., in their own language. It answers from your guide only, and sends them to you for anything else.
        </p>
      </div>
      <div className="mt-8 space-y-3 text-sm">
        <p className="ml-auto w-fit max-w-[85%] rounded-[20px] rounded-br-md bg-white px-4 py-2.5 font-medium text-sn-ink">
          Bis wann ist der Check-out?
        </p>
        <p className="w-fit max-w-[85%] rounded-[20px] rounded-bl-md bg-white/10 px-4 py-2.5 leading-6 text-white/90">
          Check-out ist bis 10:00. Bitte legt die Schlüssel zurück in die Schlüsselbox. Gute Heimreise!
        </p>
        <p className="ml-auto w-fit max-w-[85%] rounded-[20px] rounded-br-md bg-white px-4 py-2.5 font-medium text-sn-ink">
          Gdzie zjemy dobrą rybę?
        </p>
        <p className="w-fit max-w-[85%] rounded-[20px] rounded-bl-md bg-white/10 px-4 py-2.5 leading-6 text-white/90">
          Polecamy Harbor Grill, świeża ryba z jeziora. Zarezerwujcie stolik na zachód słońca.
        </p>
      </div>
    </article>
  );
}

function ReviewCard() {
  return (
    <article className="flex flex-col justify-between rounded-[28px] border border-sn-line/8 bg-white p-6 sm:p-7">
      <div>
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-50 text-amber-500">
          <Star size={20} aria-hidden="true" />
        </span>
        <h3 className="mt-5 text-xl font-bold tracking-tight">More 5-star reviews</h3>
        <p className="mt-2 text-[15px] leading-7 text-sn-muted">Smoother stays, then your review link right where happy guests already look.</p>
      </div>
      <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl bg-sn-canvas px-4 py-3">
        <div>
          <p className="text-sm font-semibold">Enjoyed your stay?</p>
          <p className="text-xs text-sn-muted">Leave a Google review</p>
        </div>
        <span className="flex text-amber-400" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={15} fill="currentColor" />
          ))}
        </span>
      </div>
    </article>
  );
}

function SmallFeature({ icon: Icon, title, text }: { icon: typeof Wifi; title: string; text: string }) {
  return (
    <div className="flex gap-4 rounded-[24px] border border-sn-line/8 bg-white p-5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sn-canvas text-sn-ink">
        <Icon size={18} aria-hidden="true" />
      </span>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-sn-muted">{text}</p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const appUrl = getAppUrl();
  const startTrialHref = `${appUrl}/register?plan=ai`;

  return (
    <main className="min-h-screen overflow-x-hidden bg-sn-canvas pb-24 text-sn-ink sm:pb-0">
      <header className="sticky top-0 z-50 border-b border-sn-line/6 bg-sn-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="text-sm font-medium text-sn-muted transition hover:text-sn-ink">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href={`${appUrl}/login`} className="rounded-full px-4 py-2 text-sm font-semibold text-sn-ink/80 transition hover:text-sn-ink">
              Log in
            </Link>
            <Link
              href={startTrialHref}
              className="hidden rounded-full bg-sn-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-sn-ink/90 sm:inline-flex"
            >
              Start free
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-12 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-28 lg:pt-20">
        <div className="text-center lg:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-sn-line/10 bg-white px-3.5 py-1.5 text-[13px] font-medium text-sn-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-sn-accent" aria-hidden="true" />
            For Airbnb, Booking.com and villa hosts
          </p>
          <h1 className="mx-auto mt-6 max-w-2xl text-[2.6rem] font-extrabold leading-[1.04] tracking-[-0.035em] sm:text-6xl lg:mx-0 lg:text-[3.6rem] xl:text-[4rem]">
            Fewer guest messages.
            <span className="block text-sn-accent">More 5-star reviews.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-sn-muted lg:mx-0">
            One QR code gives guests Wi-Fi, check-in, house rules, your local tips and an AI concierge that replies in their language. Then it points happy guests to your review page.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <PrimaryCta href={startTrialHref}>
              Create my guide free <ArrowRight size={17} aria-hidden="true" />
            </PrimaryCta>
            <SecondaryCta href={EXAMPLE_HREF}>See the live demo</SecondaryCta>
          </div>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-sn-muted lg:justify-start">
            {["7 days free", "No card needed", "Ready in minutes"].map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <Check size={15} className="text-sn-accent" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <LiveDemoPhone />
      </section>

      <section className="border-y border-sn-line/6 bg-white py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-3 px-5 text-sm text-sn-muted sm:flex-row sm:gap-8">
          <span>Guests already use it at</span>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {hostNames.map((name) => (
              <span key={name} className="text-base font-semibold tracking-tight text-sn-ink/80">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl">Guests ask. StayNest answers.</h2>
          <p className="mt-4 text-lg leading-8 text-sn-muted">Everything a guest needs, on their phone, in one place.</p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ChatCard />
          <WifiCard />
          <ReviewCard />
          <div className="grid gap-4 md:col-span-2">
            <div className="grid gap-4 sm:grid-cols-3">
              <SmallFeature icon={KeyRound} title="Check-in" text="Arrival steps, parking and check-out in plain words." />
              <SmallFeature icon={MessageCircle} title="Your tips" text="Restaurants, beaches and the pharmacy, with maps." />
              <SmallFeature icon={Languages} title="Any language" text="Guests ask in their language and get answers in it." />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl">See your own place in StayNest.</h2>
            <p className="mt-4 max-w-lg text-lg leading-8 text-sn-muted">
              Paste your Booking.com link and get a preview of your guide in about a minute.
            </p>
          </div>
          <PreviewForm />
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl">Live in three steps</h2>
          <p className="mt-4 text-lg leading-8 text-sn-muted">Most hosts finish before their coffee gets cold.</p>
        </div>
        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="rounded-[28px] border border-sn-line/8 bg-white p-7">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sn-ink text-white">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <span className="text-4xl font-extrabold tracking-tight text-sn-line/10">{index + 1}</span>
                </div>
                <h3 className="mt-6 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-7 text-sn-muted">{step.text}</p>
              </li>
            );
          })}
        </ol>
        <div className="mt-10 flex justify-center">
          <PrimaryCta href={startTrialHref}>
            Start my free week <ArrowRight size={17} aria-hidden="true" />
          </PrimaryCta>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-20 bg-white py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl">One plan. Everything in.</h2>
            <p className="mt-4 max-w-lg text-lg leading-8 text-sn-muted">
              No tiers to compare and no per-guest fees. Try it for a week, then keep it for less than one cleaning fee a year.
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm text-sn-muted">
              <QrCode size={18} className="text-sn-accent" aria-hidden="true" />
              Your printed QR code keeps working for as long as you are subscribed.
            </div>
          </div>
          <article className="rounded-[32px] bg-sn-ink p-8 text-white shadow-[0_40px_100px_rgba(17,24,39,0.25)] sm:p-10">
            <p className="text-sm font-semibold text-white/60">StayNest</p>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-6xl font-extrabold tracking-tight">€20</span>
              <span className="pb-2 text-white/60">per year</span>
            </div>
            <p className="mt-2 text-sm text-white/60">About €1.70 a month, billed once a year.</p>
            <ul className="mt-8 grid gap-3">
              {planFeatures.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-white/85">
                  <Check size={18} className="mt-0.5 shrink-0 text-[#8FD3C9]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href={startTrialHref}
              className="focus-ring mt-9 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-[15px] font-semibold text-sn-ink transition hover:bg-white/90"
            >
              Start 7 days free <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <p className="mt-3 text-center text-xs text-white/55">No card needed. Cancel any time.</p>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-20 lg:py-28">
        <h2 className="text-center text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">Questions</h2>
        <div className="mt-10 divide-y divide-sn-line/8 rounded-[28px] border border-sn-line/8 bg-white">
          {faqs.map((faq) => (
            <details key={faq.q} className="group px-6 py-1">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
                {faq.q}
                <ChevronDown size={18} className="shrink-0 text-sn-muted transition group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="pb-5 text-[15px] leading-7 text-sn-muted">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="px-5 pb-16 lg:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-sn-ink px-6 py-16 text-center text-white sm:px-12 lg:py-20">
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl">Your next guest arrives soon. Be ready.</h2>
          <p className="mx-auto mt-4 max-w-lg text-lg leading-8 text-white/65">Set up your guide today and print the QR code before check-in.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={startTrialHref}
              className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-sn-ink transition hover:bg-white/90"
            >
              Create my guide free <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link
              href={EXAMPLE_HREF}
              className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-6 text-[15px] font-semibold text-white transition hover:border-white/40"
            >
              See the live demo
            </Link>
          </div>
        </div>
      </section>

      <AppLegalLinks className="mx-auto max-w-6xl px-5 pb-10 text-sn-muted lg:px-8" />

      <StickyMobileCta href={startTrialHref} label="Create my guide free" />
    </main>
  );
}
