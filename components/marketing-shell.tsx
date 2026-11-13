import Link from "next/link";
import { AppLegalLinks } from "@/components/app-legal-links";
import { Button } from "@/components/ui/button";
import { getAppUrl } from "@/lib/utils";

const nav = [
  { label: "Guides", href: "/guides" },
  { label: "Wi-Fi QR code", href: "/tools/wifi-qr-code" },
  { label: "Example", href: "/g/example" },
  { label: "Pricing", href: "/pricing" }
];

export function MarketingShell({ children }: { children: React.ReactNode }) {
  const appUrl = getAppUrl();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#172033]">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold">
        Skip to content
      </a>
      <header className="border-b border-[#D8D1C4]/50 bg-[#FAF7F2]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 lg:px-8">
          <Link href="/" className="text-lg font-extrabold tracking-tight">
            StayNest
          </Link>
          <nav aria-label="Main" className="order-3 flex w-full gap-1 overflow-x-auto text-sm font-semibold sm:order-none sm:w-auto">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-full px-3 py-2 text-[#172033]/78 transition hover:bg-[#172033]/5 hover:text-[#172033]">
                {item.label}
              </Link>
            ))}
          </nav>
          <Button href={`${appUrl}/register`} className="min-h-10 rounded-full px-4 text-sm">
            Start free trial
          </Button>
        </div>
      </header>
      <main id="main">{children}</main>
      <AppLegalLinks className="mx-auto max-w-6xl px-5 pb-10 pt-6 text-[#172033]/72 lg:px-8" />
    </div>
  );
}

export function TrialCallout({ title = "Put this guide on your guests' phones" }: { title?: string }) {
  const appUrl = getAppUrl();

  return (
    <aside className="mt-12 rounded-[24px] border border-[#D8D1C4]/60 bg-white p-6 shadow-[0_18px_50px_rgba(23,32,51,0.06)] sm:p-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6F9287]">StayNest</p>
      <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-base leading-7 text-[#172033]/72">
        Build a mobile guest guide with Wi-Fi, check-in, house rules, local tips and review links, then print one QR code. Free for 7 days, no card needed, then EUR 20 per year.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button href={`${appUrl}/register`} className="min-h-12 rounded-full">
          Start free trial
        </Button>
        <Button href="/g/example" variant="secondary" className="min-h-12 rounded-full">
          See an example guide
        </Button>
      </div>
    </aside>
  );
}
