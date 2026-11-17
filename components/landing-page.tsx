import Link from "next/link";
import { ArrowRight, Bot, Check, ChevronDown, Copy, KeyRound, Languages, Link2, MessageCircle, Printer, QrCode, Star, Wifi } from "lucide-react";

import { AppLegalLinks } from "@/components/app-legal-links";
import { HtmlLang } from "@/components/html-lang";
import { PreviewForm } from "@/components/preview-form";
import { JsonLd } from "@/components/seo-jsonld";
import { StickyMobileCta } from "@/components/sticky-mobile-cta";
import type { LandingCopy } from "@/lib/landing-copy";
import { LOCALIZED_HOME, type SeoLocale } from "@/lib/seo";
import { getAppUrl } from "@/lib/utils";

const EXAMPLE_HREF = "/g/example";
const hostNames = ["Villa Beti", "Cece's Home", "Villa Yeti"];
const LANGUAGE_NAMES: Record<SeoLocale, string> = { en: "English", de: "Deutsch", it: "Italiano" };

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

function SecondaryCta({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-sn-line/12 bg-white px-6 text-[15px] font-semibold text-sn-ink transition hover:border-sn-line/25"
    >
      {children}
    </Link>
  );
}

function Stars({ size }: { size: number }) {
  return (
    <span className="flex text-amber-400" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={size} fill="currentColor" />
      ))}
    </span>
  );
}

function LanguageLinks({ current, label }: { current: SeoLocale; label: string }) {
  return (
    <nav aria-label={label} className="flex items-center gap-1 text-xs font-semibold">
      {(Object.keys(LOCALIZED_HOME) as SeoLocale[]).map((locale) => (
        <Link
          key={locale}
          href={LOCALIZED_HOME[locale]}
          hrefLang={locale}
          lang={locale}
          aria-current={locale === current ? "page" : undefined}
          className={`rounded-full px-2 py-1 uppercase transition ${locale === current ? "bg-sn-ink text-white" : "text-sn-muted hover:text-sn-ink"}`}
          title={LANGUAGE_NAMES[locale]}
        >
          {locale}
        </Link>
      ))}
    </nav>
  );
}

function LiveDemoPhone({ copy }: { copy: LandingCopy }) {
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
          <Link href={EXAMPLE_HREF} className="absolute inset-0 lg:hidden" aria-label={copy.phone.openDemo} />
        </div>
      </div>
      <div className="absolute -left-16 top-[42%] hidden rounded-2xl bg-white px-4 py-3 shadow-[0_18px_44px_rgba(17,24,39,0.14)] sm:block" aria-hidden="true">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sn-muted">{copy.phone.guestAsks}</p>
        <p className="mt-1 text-sm font-semibold">{copy.phone.question}</p>
      </div>
      <div className="absolute -right-10 bottom-24 hidden items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-[0_18px_44px_rgba(17,24,39,0.14)] sm:flex" aria-hidden="true">
        <Stars size={14} />
        <span className="text-sm font-semibold">{copy.phone.review}</span>
      </div>
      <p className="mt-6 text-center text-sm font-medium text-sn-muted">
        <span className="hidden lg:inline">{copy.phone.tapAround}</span>
        <Link href={EXAMPLE_HREF} className="font-semibold text-sn-accent underline-offset-4 hover:underline lg:hidden">
          {copy.phone.openDemo}
        </Link>
      </p>
    </div>
  );
}

function FeatureGrid({ copy }: { copy: LandingCopy }) {
  const f = copy.features;
  const smallIcons = [KeyRound, MessageCircle, Languages];
  return (
    <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <article className="flex flex-col justify-between rounded-[28px] bg-sn-ink p-6 text-white sm:p-7 md:row-span-2">
        <div>
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10">
            <Bot size={20} aria-hidden="true" />
          </span>
          <h3 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">{f.chatTitle}</h3>
          <p className="mt-3 text-[15px] leading-7 text-white/70">{f.chatText}</p>
        </div>
        <div className="mt-8 space-y-3 text-sm" aria-hidden="true">
          {f.chat.map((line, index) => (
            <p
              key={line}
              className={
                index % 2 === 0
                  ? "ml-auto w-fit max-w-[85%] rounded-[20px] rounded-br-md bg-white px-4 py-2.5 font-medium text-sn-ink"
                  : "w-fit max-w-[85%] rounded-[20px] rounded-bl-md bg-white/10 px-4 py-2.5 leading-6 text-white/90"
              }
            >
              {line}
            </p>
          ))}
        </div>
      </article>

      <article className="flex flex-col justify-between rounded-[28px] border border-sn-line/8 bg-white p-6 sm:p-7">
        <div>
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sn-accent-soft text-sn-accent">
            <Wifi size={20} aria-hidden="true" />
          </span>
          <h3 className="mt-5 text-xl font-bold tracking-tight">{f.wifiTitle}</h3>
          <p className="mt-2 text-[15px] leading-7 text-sn-muted">{f.wifiText}</p>
        </div>
        <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl bg-sn-canvas px-4 py-3" aria-hidden="true">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Lakeview_Guest</p>
            <p className="truncate font-mono text-xs text-sn-muted">••••••••••••</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-sn-ink px-3 py-1.5 text-xs font-semibold text-white">
            <Copy size={12} /> {f.copy}
          </span>
        </div>
      </article>

      <article className="flex flex-col justify-between rounded-[28px] border border-sn-line/8 bg-white p-6 sm:p-7">
        <div>
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-50 text-amber-500">
            <Star size={20} aria-hidden="true" />
          </span>
          <h3 className="mt-5 text-xl font-bold tracking-tight">{f.reviewTitle}</h3>
          <p className="mt-2 text-[15px] leading-7 text-sn-muted">{f.reviewText}</p>
        </div>
        <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl bg-sn-canvas px-4 py-3" aria-hidden="true">
          <div>
            <p className="text-sm font-semibold">{f.reviewPrompt}</p>
            <p className="text-xs text-sn-muted">{f.reviewOn}</p>
          </div>
          <Stars size={15} />
        </div>
      </article>

      <div className="grid gap-4 sm:grid-cols-3 md:col-span-2">
        {f.small.map((item, index) => {
          const Icon = smallIcons[index];
          return (
            <div key={item.title} className="flex gap-4 rounded-[24px] border border-sn-line/8 bg-white p-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sn-canvas text-sn-ink">
                <Icon size={18} aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-sn-muted">{item.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LandingPage({ copy }: { copy: LandingCopy }) {
  const appUrl = getAppUrl();
  const startTrialHref = `${appUrl}/register?plan=ai`;
  const stepIcons = [Link2, KeyRound, Printer];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: copy.locale,
    mainEntity: copy.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a }
    }))
  };

  return (
    <main lang={copy.locale} className="min-h-screen overflow-x-hidden bg-sn-canvas pb-24 text-sn-ink sm:pb-0">
      {copy.locale !== "en" ? <HtmlLang locale={copy.locale} /> : null}
      <JsonLd data={faqJsonLd} />

      <header className="sticky top-0 z-50 border-b border-sn-line/6 bg-sn-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5 lg:px-8">
          <Link href={LOCALIZED_HOME[copy.locale]} className="flex items-center gap-2.5" aria-label="StayNest">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/staynest-logo.png" alt="" width={36} height={36} className="h-9 w-9 object-contain" />
            <span className="text-[17px] font-bold tracking-tight">StayNest</span>
          </Link>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
            <Link href={EXAMPLE_HREF} className="text-sm font-medium text-sn-muted transition hover:text-sn-ink">{copy.nav.demo}</Link>
            <a href="#how" className="text-sm font-medium text-sn-muted transition hover:text-sn-ink">{copy.nav.how}</a>
            <a href="#pricing" className="text-sm font-medium text-sn-muted transition hover:text-sn-ink">{copy.nav.pricing}</a>
            {copy.nav.guides ? <Link href="/guides" className="text-sm font-medium text-sn-muted transition hover:text-sn-ink">{copy.nav.guides}</Link> : null}
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <LanguageLinks current={copy.locale} label={copy.languageLabel} />
            </div>
            <Link href={`${appUrl}/login`} className="rounded-full px-3 py-2 text-sm font-semibold text-sn-ink/80 transition hover:text-sn-ink">
              {copy.nav.login}
            </Link>
            <Link href={startTrialHref} className="hidden rounded-full bg-sn-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-sn-ink/90 sm:inline-flex">
              {copy.nav.start}
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-12 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-28 lg:pt-20">
        <div className="text-center lg:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-sn-line/10 bg-white px-3.5 py-1.5 text-[13px] font-medium text-sn-muted">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sn-accent" aria-hidden="true" />
            {copy.hero.pill}
          </p>
          <h1 className="mx-auto mt-6 max-w-2xl break-words text-[2.4rem] font-extrabold leading-[1.06] tracking-[-0.035em] sm:text-[3.4rem] lg:mx-0 lg:text-[3.6rem]">
            {copy.hero.h1Lead}
            <span className="block text-sn-accent">{copy.hero.h1Accent}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-sn-muted lg:mx-0">{copy.hero.sub}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <PrimaryCta href={startTrialHref}>
              {copy.hero.cta} <ArrowRight size={17} aria-hidden="true" />
            </PrimaryCta>
            <SecondaryCta href={EXAMPLE_HREF}>{copy.hero.demo}</SecondaryCta>
          </div>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-sn-muted lg:justify-start">
            {copy.hero.checks.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <Check size={15} className="text-sn-accent" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-center sm:hidden">
            <LanguageLinks current={copy.locale} label={copy.languageLabel} />
          </div>
        </div>
        <LiveDemoPhone copy={copy} />
      </section>

      <section className="border-y border-sn-line/6 bg-white py-6" aria-label={copy.proof}>
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-3 px-5 text-sm text-sn-muted sm:flex-row sm:gap-8">
          <span>{copy.proof}</span>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {hostNames.map((name) => (
              <span key={name} className="text-base font-semibold tracking-tight text-sn-ink/80">{name}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl">{copy.features.h2}</h2>
          <p className="mt-4 text-lg leading-8 text-sn-muted">{copy.features.sub}</p>
        </div>
        <FeatureGrid copy={copy} />
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl">{copy.compare.h2}</h2>
            <p className="mt-4 text-lg leading-8 text-sn-muted">{copy.compare.sub}</p>
          </div>
          <div className="mt-12 overflow-x-auto rounded-[28px] border border-sn-line/8">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-sn-canvas">
                  <th scope="col" className="w-1/4 px-5 py-4"><span className="sr-only">—</span></th>
                  {copy.compare.columns.map((column, index) => (
                    <th key={column} scope="col" className={`px-5 py-4 text-[15px] font-bold ${index === 2 ? "text-sn-accent" : ""}`}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {copy.compare.rows.map((row) => (
                  <tr key={row.label} className="border-t border-sn-line/8">
                    <th scope="row" className="px-5 py-4 font-semibold">{row.label}</th>
                    {row.values.map((value, index) => (
                      <td key={value} className={`px-5 py-4 leading-6 ${index === 2 ? "font-semibold text-sn-ink" : "text-sn-muted"}`}>
                        {index === 2 ? <Check size={15} className="mr-1.5 inline text-sn-accent" aria-hidden="true" /> : null}
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {copy.preview ? (
        <section className="py-20 lg:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 lg:grid-cols-2 lg:px-8">
            <div>
              <h2 className="text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl">{copy.preview.h2}</h2>
              <p className="mt-4 max-w-lg text-lg leading-8 text-sn-muted">{copy.preview.sub}</p>
            </div>
            <PreviewForm />
          </div>
        </section>
      ) : null}

      <section id="how" className={`scroll-mt-20 ${copy.preview ? "bg-white" : ""} py-20 lg:py-28`}>
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl">{copy.how.h2}</h2>
            <p className="mt-4 text-lg leading-8 text-sn-muted">{copy.how.sub}</p>
          </div>
          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {copy.how.steps.map((step, index) => {
              const Icon = stepIcons[index];
              return (
                <li key={step.title} className="rounded-[28px] border border-sn-line/8 bg-white p-7">
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sn-ink text-white">
                      <Icon size={19} aria-hidden="true" />
                    </span>
                    <span className="text-4xl font-extrabold tracking-tight text-sn-line/10" aria-hidden="true">{index + 1}</span>
                  </div>
                  <h3 className="mt-6 text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-7 text-sn-muted">{step.text}</p>
                </li>
              );
            })}
          </ol>
          <div className="mt-10 flex justify-center">
            <PrimaryCta href={startTrialHref}>
              {copy.how.cta} <ArrowRight size={17} aria-hidden="true" />
            </PrimaryCta>
          </div>
        </div>
      </section>

      <section id="pricing" className={`scroll-mt-20 ${copy.preview ? "" : "bg-white"} py-20 lg:py-28`}>
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl">{copy.pricing.h2}</h2>
            <p className="mt-4 max-w-lg text-lg leading-8 text-sn-muted">{copy.pricing.sub}</p>
            <div className="mt-8 flex items-center gap-3 text-sm text-sn-muted">
              <QrCode size={18} className="shrink-0 text-sn-accent" aria-hidden="true" />
              {copy.pricing.qr}
            </div>
          </div>
          <article className="rounded-[32px] bg-sn-ink p-8 text-white shadow-[0_40px_100px_rgba(17,24,39,0.25)] sm:p-10">
            <p className="text-sm font-semibold text-white/60">StayNest</p>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-6xl font-extrabold tracking-tight">{copy.pricing.price}</span>
              <span className="pb-2 text-white/60">{copy.pricing.perYear}</span>
            </div>
            <p className="mt-2 text-sm text-white/60">{copy.pricing.monthly}</p>
            <ul className="mt-8 grid gap-3">
              {copy.pricing.features.map((item) => (
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
              {copy.pricing.cta} <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <p className="mt-3 text-center text-xs text-white/55">{copy.pricing.noCard}</p>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-20 lg:py-28">
        <h2 className="text-center text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">{copy.faq.h2}</h2>
        <div className="mt-10 divide-y divide-sn-line/8 rounded-[28px] border border-sn-line/8 bg-white">
          {copy.faq.items.map((item, index) => (
            <details key={item.q} className="group px-6 py-1" open={index === 0}>
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
                <h3>{item.q}</h3>
                <ChevronDown size={18} className="shrink-0 text-sn-muted transition group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="pb-5 text-[15px] leading-7 text-sn-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {copy.guides ? (
        <section className="mx-auto max-w-6xl px-5 pb-20 lg:px-8">
          <h2 className="text-2xl font-extrabold tracking-tight">{copy.guides.h2}</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {copy.guides.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="flex h-full items-center justify-between gap-3 rounded-2xl border border-sn-line/8 bg-white px-5 py-4 text-sm font-semibold transition hover:border-sn-line/25">
                  {link.label}
                  <ArrowRight size={16} className="shrink-0 text-sn-muted" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="px-5 pb-16 lg:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[36px] bg-sn-ink px-6 py-16 text-center text-white sm:px-12 lg:py-20">
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl">{copy.final.h2}</h2>
          <p className="mx-auto mt-4 max-w-lg text-lg leading-8 text-white/65">{copy.final.sub}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href={startTrialHref} className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-sn-ink transition hover:bg-white/90">
              {copy.final.cta} <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link href={EXAMPLE_HREF} className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-6 text-[15px] font-semibold text-white transition hover:border-white/40">
              {copy.final.demo}
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl justify-center px-5 pb-4">
        <LanguageLinks current={copy.locale} label={copy.languageLabel} />
      </div>
      <AppLegalLinks className="mx-auto max-w-6xl px-5 pb-10 text-sn-muted lg:px-8" />
      <StickyMobileCta href={startTrialHref} label={copy.sticky} />
    </main>
  );
}
