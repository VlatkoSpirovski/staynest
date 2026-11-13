import Link from "next/link";
import { JsonLd } from "@/components/seo-jsonld";
import { MarketingShell, TrialCallout } from "@/components/marketing-shell";
import { guides } from "@/lib/guides-content";
import { getSiteUrl } from "@/lib/utils";

export const metadata = {
  title: "Host guides: welcome books, house manuals and guest guides",
  description:
    "Free guides and templates for Airbnb, Booking.com and villa hosts: welcome book, house manual, check-in instructions, house rules, Wi-Fi QR codes and getting more 5-star reviews.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Host guides and templates · StayNest",
    description: "Free guides and templates for holiday rental hosts.",
    url: "/guides"
  }
};

export default function GuidesIndexPage() {
  const siteUrl = getSiteUrl();

  return (
    <MarketingShell>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Host guides and templates",
          url: `${siteUrl}/guides`,
          hasPart: guides.map((guide) => ({ "@type": "Article", headline: guide.title, url: `${siteUrl}/guides/${guide.slug}` }))
        }}
      />
      <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6F9287]">Free host resources</p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold tracking-tight sm:text-5xl">Guides and templates for holiday rental hosts</h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[#172033]/72">
          Practical, copy-ready help for the parts of hosting that cause the most questions: arrival, Wi-Fi, house rules, local tips and reviews.
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <li key={guide.slug}>
              <Link
                href={`/guides/${guide.slug}`}
                className="flex h-full flex-col rounded-[22px] border border-[#D8D1C4]/60 bg-white p-6 shadow-[0_14px_40px_rgba(23,32,51,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(23,32,51,0.09)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6F9287]"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6F9287]">{guide.category}</span>
                <span className="mt-2 text-lg font-bold leading-snug">{guide.title}</span>
                <span className="mt-2 text-sm leading-6 text-[#172033]/68">{guide.description}</span>
                <span className="mt-auto pt-4 text-xs font-semibold text-[#172033]/55">{guide.readMinutes} min read</span>
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/tools/wifi-qr-code"
              className="flex h-full flex-col rounded-[22px] border border-[#6F9287]/40 bg-[#F1F5F1] p-6 shadow-[0_14px_40px_rgba(23,32,51,0.05)] transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6F9287]"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6F9287]">Free tool</span>
              <span className="mt-2 text-lg font-bold leading-snug">Wi-Fi QR code generator</span>
              <span className="mt-2 text-sm leading-6 text-[#172033]/68">Create a QR code guests scan to join your Wi-Fi. Runs in your browser; your password never leaves your device.</span>
            </Link>
          </li>
        </ul>

        <TrialCallout />
      </div>
    </MarketingShell>
  );
}
