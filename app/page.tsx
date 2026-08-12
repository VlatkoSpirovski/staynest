import {
  ArrowRight,
  Bot,
  CheckCircle2,
  FileText,
  Globe2,
  Home,
  Import,
  KeyRound,
  LayoutGrid,
  Link2,
  Menu,
  Palette,
  MessageCircle,
  QrCode,
  Sparkles,
  Star,
  Wifi
} from "lucide-react";

import { AppLegalLinks } from "@/components/app-legal-links";
import { Button } from "@/components/ui/button";
import { PreviewForm } from "@/components/preview-form";
import { getAppUrl } from "@/lib/utils";

export const metadata = {
  title: "Get more 5-star reviews. Answer fewer guest questions.",
  description:
    "StayNest gives Airbnb and Booking.com hosts a QR guest guide that answers arrival, Wi-Fi and checkout questions automatically, then asks happy guests for a review at the right moment. Build yours free in two minutes.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "StayNest · Get more 5-star reviews. Answer fewer guest questions.",
    description:
      "A QR guest guide for Airbnb and Booking.com hosts that answers arrival, Wi-Fi and checkout questions automatically, then asks happy guests for a review at the right moment.",
    url: "/"
  }
};

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Example", href: "/g/example" },
  { label: "For Hosts", href: "#for-hosts" }
];

const heroHighlights = ["Live in under 5 minutes", "Answers in your guest's language", "No app for guests to install"];

const hostNames = ["Villa Beti", "Cece's Home", "Villa Yeti"];

const steps = [
  {
    title: "Import your listing",
    text: "Paste your Booking.com link and prepare your guide faster.",
    icon: Import
  },
  {
    title: "Customize the guide",
    text: "Add Wi-Fi, check-in, house rules, recommendations and review links.",
    icon: FileText
  },
  {
    title: "Print one QR code",
    text: "Place it in the property and guests always see the latest version.",
    icon: QrCode
  },
  {
    title: "Stop repeating yourself",
    text: "Guests ask at 2am and get an answer trained only on your property, in their own language.",
    icon: Bot
  }
];

const hostDashboardPanels = [
  {
    label: "Smart prefill",
    title: "Import from Booking.com",
    text: "Paste a listing link. StayNest pulls the public details it can read.",
    icon: Import
  },
  {
    label: "Modules",
    title: "Wi-Fi, rules and check-in",
    text: "Turn on essentials and add more modules whenever you need them.",
    icon: LayoutGrid
  },
  {
    label: "Design",
    title: "Choose your guide style",
    text: "Preview the mobile guest guide and match it to your property.",
    icon: Palette
  },
  {
    label: "QR code",
    title: "Ready to share",
    text: "Copy the guest link, download the QR, or open the live preview.",
    icon: QrCode
  }
];

const hostDashboardHighlights = [
  {
    title: "Import from Booking.com",
    text: "Save hours of manual work.",
    icon: Link2
  },
  {
    title: "All modules in one place",
    text: "Wi-Fi, rules, tips, reviews and more.",
    icon: LayoutGrid
  },
  {
    title: "One QR code, always live",
    text: "Update anytime. Guests always see it.",
    icon: QrCode
  }
];

const features = [
  {
    title: "AI guest chat",
    text: "Give guests instant answers about arrival, Wi-Fi, checkout, parking and local recommendations using only your property knowledge.",
    icon: Bot,
    featured: true
  },
  {
    title: "QR guide",
    text: "Print one QR code and keep the guide live, polished and always up to date.",
    icon: QrCode
  },
  {
    title: "Booking.com import",
    text: "Use a listing link to prepare the first version faster, then refine it for your guests.",
    icon: Import
  },
  {
    title: "Guest instructions",
    text: "Check-in, Wi-Fi, parking, house rules and emergency details in one mobile guide.",
    icon: KeyRound
  },
  {
    title: "Review reminders",
    text: "Prompt happy guests toward your Google, Booking or Airbnb review page at checkout, while the stay is still fresh.",
    icon: Star
  },
  {
    title: "Multi-language ready",
    text: "Guests ask in German, Dutch, French or Polish and the assistant answers in the same language.",
    icon: Globe2
  }
];

const plans = [
  {
    name: "Basic",
    price: "€10",
    yearly: "€60",
    savings: "Save €60 yearly",
    text: "For owners who need a clean QR guest guide without AI.",
    items: ["Mobile guest guide", "QR code and public link", "Wi-Fi, rules and recommendations", "Review links"],
    plan: "basic-yearly",
    cta: "Choose Basic"
  },
  {
    name: "Full AI",
    price: "€15",
    yearly: "€80",
    savings: "Save €100 yearly",
    text: "For premium stays that want guest chat and faster setup.",
    items: ["Everything in Basic", "AI guest assistant", "Property knowledge training", "Booking.com import support"],
    plan: "ai-yearly",
    cta: "Choose Full AI",
    popular: true
  }
];

function Logo() {
  return (
    <a href="/" className="flex items-center gap-3" aria-label="StayNest home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/staynest-logo.png" alt="StayNest" className="h-12 w-12 object-contain drop-shadow-sm sm:h-14 sm:w-14" />
      <span className="hidden text-lg font-semibold tracking-tight text-[#172033] sm:inline">StayNest</span>
    </a>
  );
}

function HostDashboardShowcase() {
  return (
    <div className="mx-auto mt-16 max-w-5xl lg:mt-20">
      <div className="hidden md:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/landing-dashboard-for-hosts.png"
          alt="StayNest host dashboard: import listings, manage guide modules, customize design, and share with QR"
          className="h-auto w-full"
          width={1024}
          height={576}
          loading="lazy"
        />
      </div>

      <div className="md:hidden">
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6F9287]">Built for hosts</p>
          <h3 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-[#172033]">Everything you need in one dashboard</h3>
          <p className="mx-auto mt-4 max-w-md text-sm font-medium leading-7 text-[#172033]/72">
            Manage your guide, content and AI concierge from one simple dashboard.
          </p>
        </div>

        {/* Horizontal screenshot carousel */}
        <div className="-mx-5 mt-10 overflow-x-auto px-5 pb-4 scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
          <div className="flex gap-4" style={{ width: "max-content" }}>
            {[
              { src: "/landing-mobile-modules.png", label: "Modules", caption: "Build your guide fast" },
              { src: "/landing-mobile-settings.png", label: "Settings", caption: "Share link and QR code" },
              { src: "/landing-mobile-ai.png", label: "AI Chat", caption: "Train your AI assistant" }
            ].map((screen) => (
              <div key={screen.label} className="w-[220px] shrink-0 sm:w-[260px]">
                <div className="overflow-hidden rounded-[24px] border border-[#172033]/10 bg-[#172033] p-[5px] shadow-[0_20px_60px_rgba(23,32,51,0.18)]">
                  <div className="overflow-hidden rounded-[20px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={screen.src}
                      alt={`StayNest host app – ${screen.caption}`}
                      className="block h-auto w-full"
                      width={520}
                      height={1000}
                      loading="lazy"
                      style={{ imageRendering: "auto" }}
                    />
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6F9287]">{screen.label}</p>
                  <p className="mt-1 text-sm font-semibold text-[#172033]">{screen.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 space-y-7 border-t border-[#D8D1C4]/45 pt-10">
          {hostDashboardHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[15px] border border-[#C9D8D2] bg-[#F1F5F1] text-[#6F9287]">
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-[#172033]">{item.title}</h4>
                  <p className="mt-1.5 text-sm font-medium leading-6 text-[#172033]/72">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PhoneMockup() {
  const guideItems = [
    { label: "AI Guest Chat", icon: MessageCircle, active: true },
    { label: "Check-in & Wi-Fi", icon: Wifi },
    { label: "House Rules", icon: Home },
    { label: "Local Tips", icon: Sparkles },
    { label: "Reviews", icon: Star }
  ];

  return (
    <div className="relative mx-auto w-full max-w-[315px] sm:max-w-[350px] lg:max-w-[370px]">
      <div className="absolute inset-x-4 bottom-8 top-8 rounded-full bg-[#AFC8BD]/30 blur-[70px]" />
      <div className="relative rounded-[36px] border border-[#172234]/14 bg-[#172033] p-2 shadow-[0_28px_80px_rgba(31,40,44,0.16)] sm:p-2.5">
        <div className="overflow-hidden rounded-[28px] bg-[#FBFAF6]">
          <div className="flex items-center justify-between border-b border-[#D8D1C4]/45 bg-white px-5 py-4">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#6F9287]">StayNest Example</p>
              <h2 className="mt-1 font-serif text-xl font-semibold leading-none text-[#172033]">Guest Guide</h2>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#172033] text-white shadow-[0_12px_26px_rgba(23,32,51,0.16)]">
              <QrCode size={20} />
            </div>
          </div>

          <div className="p-3 sm:p-3.5">
            <div className="relative h-32 overflow-hidden rounded-[22px] bg-[#172033] sm:h-40">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/88 via-[#172033]/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/70">Welcome</p>
                <h3 className="mt-1 font-serif text-2xl font-semibold leading-tight text-white">Mountain villa stay</h3>
              </div>
            </div>

            <div className="mt-3 rounded-[20px] border border-[#C9D8D2] bg-[#EFF5F1] p-3.5 text-[#172033] shadow-[0_12px_32px_rgba(23,32,51,0.055)]">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-[13px] bg-white text-[#6F9287]">
                  <Bot size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold">AI Guest Chat</p>
                  <p className="mt-0.5 text-xs font-medium text-[#172033]/72">Ask anything about the stay</p>
                </div>
              </div>
            </div>

            <div className="mt-3 grid gap-2">
              {guideItems.slice(1).map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex min-h-11 items-center gap-3 rounded-[16px] border border-[#D8D1C4]/50 bg-white px-3 shadow-[0_10px_24px_rgba(23,32,51,0.035)] sm:min-h-12">
                    <div className="grid h-8 w-8 place-items-center rounded-[11px] bg-[#F1F5F1] text-[#6F9287]">
                      <Icon size={15} />
                    </div>
                    <span className="text-sm font-semibold text-[#172033]">{item.label}</span>
                    <ArrowRight className="ml-auto text-[#172033]/45" size={15} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const appUrl = getAppUrl();
  const startTrialHref = `${appUrl}/register?plan=ai`;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FBFAF6] text-[#172033]">
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(rgba(116,103,84,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(116,103,84,0.022)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <header className="sticky top-0 z-50 border-b border-[#D8D1C4]/45 bg-[#FBFAF6]/88 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:h-[72px] lg:px-8">
          <Logo />

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="text-sm font-semibold text-[#172033]/72 transition hover:text-[#172033]">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Button href={`${appUrl}/login`} variant="ghost" className="rounded-full px-4 font-semibold text-[#172033]/72">
              Owner Login
            </Button>
            <Button href={startTrialHref} className="gap-2 rounded-full px-5 shadow-[0_14px_34px_rgba(23,32,51,0.16)]">
              Start Free Trial <ArrowRight size={16} />
            </Button>
          </div>

          <details className="group relative lg:hidden">
            <summary className="grid h-11 w-11 cursor-pointer list-none place-items-center rounded-full border border-[#D8D1C4]/70 bg-white text-[#172033] shadow-[0_12px_30px_rgba(23,32,51,0.08)] marker:hidden">
              <Menu size={20} />
            </summary>
            <div className="absolute right-0 top-14 w-[min(300px,calc(100vw-40px))] rounded-[22px] border border-[#D8D1C4]/60 bg-white p-3 shadow-[0_24px_64px_rgba(23,32,51,0.12)]">
              {navItems.map((item) => (
                <a key={item.label} href={item.href} className="block rounded-[14px] px-4 py-3 text-sm font-semibold text-[#172033]/72 hover:bg-[#FBFAF6]">
                  {item.label}
                </a>
              ))}
              <div className="mt-2 grid gap-2 border-t border-[#D8D1C4]/55 pt-3">
                <Button href={`${appUrl}/login`} variant="secondary" className="w-full rounded-full">
                  Owner Login
                </Button>
                <Button href={startTrialHref} className="w-full rounded-full">
                  Start Free Trial
                </Button>
              </div>
            </div>
          </details>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-12 sm:pt-16 lg:grid-cols-[1.03fr_0.97fr] lg:items-center lg:px-8 lg:pb-24 lg:pt-20">
          <div>
            <p className="inline-flex rounded-full border border-[#C9D8D2] bg-white/82 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#6F9287] shadow-[0_10px_26px_rgba(23,32,51,0.035)]">
              Built by hosts, for hosts
            </p>
            <h1 className="mt-6 max-w-4xl font-serif text-[2.75rem] font-semibold leading-[1.05] tracking-tight text-[#172033] sm:text-5xl lg:text-[3.75rem]">
              Stop answering the same guest questions. Start collecting more <span className="text-[#5C8377]">5-star reviews</span>.
            </h1>
            <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-[#172033]/72 sm:text-lg sm:leading-9">
              One QR code in your property answers Wi-Fi, check-in, parking and checkout questions around the clock — in your guest&rsquo;s own language — then points happy guests to your review page at exactly the right moment. Built for Airbnb and Booking.com hosts.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={startTrialHref} className="min-h-12 w-full gap-2 rounded-full px-6 text-sm shadow-[0_14px_34px_rgba(23,32,51,0.16)] sm:w-auto">
                Start Free Trial <ArrowRight size={18} />
              </Button>
              <Button href="/g/example" variant="secondary" className="min-h-12 w-full rounded-full border-[#D8D1C4]/70 px-6 text-sm shadow-[0_10px_24px_rgba(23,32,51,0.045)] sm:w-auto">
                See Example Guide
              </Button>
            </div>

            <PreviewForm />

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {heroHighlights.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm font-semibold text-[#172033]/72">
                  <span className="grid h-7 w-7 place-items-center rounded-full border border-[#D8D1C4]/70 bg-white text-[#6F9287]">
                    <CheckCircle2 size={14} />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <PhoneMockup />
        </div>
      </section>

      <section id="for-hosts" className="border-y border-[#D8D1C4]/45 bg-white/64 py-14 lg:py-[72px]">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6F9287]">Trusted by hosts in Mavrovo</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-[#172033] sm:text-4xl">Built by hosts, for hosts</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-7 text-[#172033]/72 sm:text-base">
              StayNest was created from real short-term rental experience to make every guest stay easier.
            </p>
          </div>

          <div className="mx-auto mt-9 grid max-w-4xl gap-3 sm:grid-cols-3">
            {hostNames.map((name) => (
              <div key={name} className="flex min-h-16 items-center justify-center gap-3 rounded-[20px] border border-[#D8D1C4]/60 bg-white px-4 text-center text-base font-semibold text-[#172033] shadow-[0_12px_32px_rgba(23,32,51,0.04)]">
                <Home size={17} className="text-[#6F9287]" />
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6F9287]">How it works</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-[#172033] sm:text-4xl lg:text-5xl">From listing to live guest guide in minutes</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="rounded-[24px] border border-[#D8D1C4]/55 bg-white p-5 shadow-[0_14px_42px_rgba(23,32,51,0.045)]">
                  <div className="flex items-center justify-between">
                    <div className="grid h-11 w-11 place-items-center rounded-[15px] border border-[#C9D8D2] bg-[#F1F5F1] text-[#6F9287]">
                      <Icon size={19} />
                    </div>
                    <span className="font-serif text-lg font-semibold text-[#B2A995]">0{index + 1}</span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-[#172033]">{step.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-7 text-[#172033]/72">{step.text}</p>
                </article>
              );
            })}
          </div>

          <HostDashboardShowcase />
        </div>
      </section>

      <section id="features" className="border-y border-[#D8D1C4]/45 bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6F9287]">Features</p>
              <h2 className="mt-3 max-w-3xl font-serif text-3xl font-semibold tracking-tight text-[#172033] sm:text-4xl lg:text-5xl">Everything your guests need, all in one place</h2>
            </div>
            <Button href="/g/example" variant="secondary" className="w-full rounded-full border-[#D8D1C4]/70 shadow-[0_10px_24px_rgba(23,32,51,0.045)] sm:w-fit">
              See Example Guide
            </Button>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className={`rounded-[24px] border p-6 shadow-[0_14px_42px_rgba(23,32,51,0.045)] ${
                    feature.featured
                      ? "border-[#C9D8D2] bg-[linear-gradient(145deg,#FFFFFF_0%,#F0F6F2_100%)] text-[#172033] lg:row-span-2"
                      : "border-[#D8D1C4]/55 bg-[#FBFAF6] text-[#172033]"
                  }`}
                >
                  <div className={`grid h-11 w-11 place-items-center rounded-[15px] ${feature.featured ? "bg-white text-[#6F9287] shadow-[0_10px_24px_rgba(23,32,51,0.045)]" : "bg-white text-[#6F9287]"}`}>
                    <Icon size={20} />
                  </div>
                  <h3 className={`${feature.featured ? "mt-9 font-serif text-3xl font-semibold" : "mt-6 text-lg font-semibold"} tracking-tight`}>{feature.title}</h3>
                  <p className={`${feature.featured ? "mt-4 text-base leading-8 text-[#172033]/72" : "mt-3 text-sm leading-7 text-[#172033]/72"} font-medium`}>{feature.text}</p>
                  {feature.featured ? (
                    <div className="mt-9 rounded-[20px] border border-[#D8D1C4]/55 bg-white/78 p-4">
                      <p className="text-sm font-semibold">Trained only on your property</p>
                      <p className="mt-2 text-sm font-medium leading-6 text-[#172033]/72">Keep answers focused on your real house rules, contact details and local tips.</p>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6F9287]">Pricing</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-[#172033] sm:text-4xl lg:text-5xl">Simple plans with a 7-day free trial</h2>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-5 lg:grid-cols-2">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`relative rounded-[28px] border p-6 shadow-[0_18px_54px_rgba(23,32,51,0.055)] sm:p-8 ${
                  plan.popular ? "border-[#AFC8BD] bg-white ring-1 ring-[#AFC8BD]/60" : "border-[#D8D1C4]/55 bg-white/82"
                }`}
              >
                {plan.popular ? (
                  <p className="absolute right-6 top-6 rounded-full bg-[#EFF5F1] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#6F9287] ring-1 ring-[#C9D8D2]">
                    Most popular
                  </p>
                ) : null}
                <div className="pr-28">
                  <h3 className="font-serif text-3xl font-semibold text-[#172033]">{plan.name}</h3>
                  <p className="mt-3 min-h-12 text-sm font-medium leading-6 text-[#172033]/72">{plan.text}</p>
                </div>
                <div className="mt-7 flex items-end gap-2">
                  <span className="text-5xl font-semibold tracking-tight text-[#172033]">{plan.price}</span>
                  <span className="pb-2 text-sm font-semibold text-[#172033]/72">/month</span>
                </div>
                <p className="mt-4 inline-flex rounded-full bg-[#F1F5F1] px-3 py-1 text-xs font-semibold text-[#6F9287] ring-1 ring-[#C9D8D2]/70">
                  Yearly {plan.yearly} · {plan.savings}
                </p>
                <div className="mt-7 grid gap-3">
                  {plan.items.map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm font-medium text-[#172033]/72">
                      <CheckCircle2 size={18} className="text-[#6F9287]" />
                      {item}
                    </div>
                  ))}
                </div>
                <Button href={`${appUrl}/register?plan=${plan.plan}`} className="mt-8 w-full rounded-full shadow-[0_14px_34px_rgba(23,32,51,0.14)]">
                  {plan.cta} yearly
                </Button>
                <Button href={`${appUrl}/register?plan=${plan.plan.replace("yearly", "monthly")}`} variant="secondary" className="mt-3 w-full rounded-full">
                  Monthly option
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 lg:px-8 lg:pb-24">
        <div className="mx-auto grid max-w-7xl gap-8 overflow-hidden rounded-[32px] border border-[#D8D1C4]/55 bg-white p-6 shadow-[0_22px_70px_rgba(23,32,51,0.06)] sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6F9287]">Start hosting smarter</p>
            <h2 className="mt-3 max-w-2xl font-serif text-3xl font-semibold tracking-tight text-[#172033] sm:text-4xl lg:text-5xl">Ready to give every guest a better stay?</h2>
            <p className="mt-4 max-w-2xl text-base font-medium leading-8 text-[#172033]/72">
              Create your guide, print one QR code and let StayNest handle the repeated questions.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Button href={startTrialHref} className="min-h-12 w-full rounded-full shadow-[0_14px_34px_rgba(23,32,51,0.14)] sm:w-auto">
              Start Free Trial
            </Button>
            <Button href="/g/example" variant="secondary" className="min-h-12 w-full rounded-full border-[#D8D1C4]/70 shadow-[0_10px_24px_rgba(23,32,51,0.045)] sm:w-auto">
              See Example Guide
            </Button>
          </div>
        </div>
      </section>
      <AppLegalLinks className="mx-auto max-w-7xl px-5 pb-10 text-[#172033]/72 lg:px-8" />
    </main>
  );
}
