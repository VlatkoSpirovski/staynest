import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { AppLegalLinks } from "@/components/app-legal-links";
import { JsonLd } from "@/components/seo-jsonld";
import type { SolutionPage } from "@/lib/solution-pages";
import { getAppUrl, getSiteUrl } from "@/lib/utils";

export function SolutionPageView({ page }: { page: SolutionPage }) {
  const appUrl = getAppUrl();
  const siteUrl = getSiteUrl();
  const startHref = `${appUrl}/register?plan=ai`;

  return (
    <main className="min-h-screen bg-sn-canvas text-sn-ink">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "StayNest", item: siteUrl },
              { "@type": "ListItem", position: 2, name: page.title, item: `${siteUrl}${page.path}` }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: page.faq.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } }))
          }
        ]}
      />
      <header className="border-b border-sn-line/6 bg-sn-canvas/80">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-5">
          <Link href="/" className="flex items-center gap-2.5" aria-label="StayNest home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/staynest-logo.png" alt="" width={36} height={36} className="h-9 w-9 object-contain" />
            <span className="text-[17px] font-bold tracking-tight">StayNest</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/guides" className="hidden rounded-full px-3 py-2 text-sm font-medium text-sn-muted hover:text-sn-ink sm:inline-flex">Guides</Link>
            <Link href={startHref} className="rounded-full bg-sn-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-sn-ink/90">Start free</Link>
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-5 pb-16 pt-10 sm:pt-14">
        <nav aria-label="Breadcrumb" className="text-sm text-sn-muted">
          <ol className="flex flex-wrap gap-1">
            <li><Link href="/" className="hover:text-sn-ink">StayNest</Link> /</li>
            <li aria-current="page" className="text-sn-ink">{page.eyebrow}</li>
          </ol>
        </nav>
        <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-5xl">{page.h1}</h1>
        <p className="mt-5 text-lg leading-8 text-sn-muted">{page.intro}</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link href={startHref} className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-sn-ink px-6 text-[15px] font-semibold text-white transition hover:bg-sn-ink/90">
            Create my guide free <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link href="/g/example" className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full border border-sn-line/12 bg-white px-6 text-[15px] font-semibold transition hover:border-sn-line/25">
            See the live demo
          </Link>
        </div>
        <p className="mt-3 text-sm text-sn-muted">7 days free, no card needed. Then €20 per year.</p>

        <section className="mt-10 rounded-[24px] border border-sn-line/8 bg-white p-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-sn-accent">In short</h2>
          <p className="mt-2 text-[15px] leading-7">{page.answer}</p>
        </section>

        {page.sections.map((section) => (
          <section key={section.h2} className="mt-12">
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{section.h2}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-[16px] leading-8 text-sn-ink/85">{paragraph}</p>
            ))}
            {section.list ? (
              <ul className="mt-4 grid gap-2.5">
                {section.list.map((item) => (
                  <li key={item} className="flex gap-3 text-[16px] leading-7 text-sn-ink/85">
                    <Check size={18} className="mt-1 shrink-0 text-sn-accent" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
            {section.steps ? (
              <ol className="mt-5 grid gap-3 sm:grid-cols-3">
                {section.steps.map((step, index) => (
                  <li key={step.title} className="rounded-[22px] border border-sn-line/8 bg-white p-5">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-sn-ink text-sm font-bold text-white" aria-hidden="true">{index + 1}</span>
                    <h3 className="mt-4 font-bold">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-sn-muted">{step.text}</p>
                  </li>
                ))}
              </ol>
            ) : null}
          </section>
        ))}

        <section className="mt-14">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Frequently asked questions</h2>
          <dl className="mt-5 divide-y divide-sn-line/8 rounded-[24px] border border-sn-line/8 bg-white">
            {page.faq.map((item) => (
              <div key={item.q} className="px-6 py-5">
                <dt className="font-semibold">{item.q}</dt>
                <dd className="mt-2 text-[15px] leading-7 text-sn-muted">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-14 rounded-[28px] bg-sn-ink p-8 text-white sm:p-10">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Try it with your own place</h2>
          <p className="mt-3 text-white/70">Set up your guide in minutes and print the QR code before the next check-in.</p>
          <Link href={startHref} className="focus-ring mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-sn-ink">
            Create my guide free <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-extrabold tracking-tight">Related</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {page.related.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="flex h-full items-center justify-between gap-3 rounded-2xl border border-sn-line/8 bg-white px-5 py-4 text-sm font-semibold transition hover:border-sn-line/25">
                  {link.label}
                  <ArrowRight size={16} className="shrink-0 text-sn-muted" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </article>
      <AppLegalLinks className="mx-auto max-w-5xl px-5 pb-10 text-sn-muted" />
    </main>
  );
}
