import Link from "next/link";
import { redirect } from "next/navigation";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import QRCode from "qrcode";
import { ArrowLeft } from "lucide-react";
import { PrintButton } from "@/components/print-button";
import { requireReadyUser } from "@/lib/auth";
import { hasBillingAccess } from "@/lib/billing";
import { GUEST_LOCALES, getGuestMessages, type GuestLocale } from "@/lib/guest-i18n";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/utils";
import { wifiQrPayload } from "@/lib/wifi-qr";
import {
  WELCOME_CARD_LAYOUTS,
  extractCardTime,
  getWelcomeCardCopy,
  safeAccentColor,
  welcomeCardLayout,
  welcomeCardLocale,
  type WelcomeCardLayout
} from "@/lib/welcome-card";

export const dynamic = "force-dynamic";
export const preferredRegion = "fra1";
export const metadata = {
  title: "Welcome card",
  robots: { index: false, follow: false }
};

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--wc-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500"], variable: "--wc-mono" });

type WelcomeCardPageProps = {
  searchParams?: { size?: string; lang?: string };
};

type CardProperty = {
  name: string;
  logoUrl: string | null;
  coverImageUrl: string | null;
  accentColor: string;
  wifiName: string | null;
  wifiPassword: string | null;
  checkInInfo: string | null;
  checkOutInfo: string | null;
  hostContactName: string | null;
  hostPhone: string | null;
};

async function qrSvgDataUri(text: string) {
  const svg = await QRCode.toString(text, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#0B1220", light: "#00000000" }
  });
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function cardHref(size: string, lang: string) {
  return `/dashboard/welcome-card?size=${size}&lang=${lang}`;
}

export default async function WelcomeCardPage({ searchParams }: WelcomeCardPageProps) {
  const user = await requireReadyUser();
  if (!hasBillingAccess(user)) redirect("/dashboard");

  const property = await prisma.property.findFirst({
    where: { ownerId: user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      name: true,
      slug: true,
      publicCode: true,
      logoUrl: true,
      coverImageUrl: true,
      accentColor: true,
      wifiName: true,
      wifiPassword: true,
      checkInInfo: true,
      checkOutInfo: true,
      hostContactName: true,
      hostPhone: true,
      translationLocales: true
    }
  });
  if (!property) redirect("/dashboard");

  const layout = welcomeCardLayout(searchParams?.size);
  const locale = welcomeCardLocale(searchParams?.lang, property.translationLocales);
  const publicUrl = property.publicCode
    ? `${getSiteUrl()}/g/${property.publicCode}`
    : `${getSiteUrl()}/stay/${property.slug}`;
  const wifiName = property.wifiName?.trim() || null;
  const wifiPassword = property.wifiPassword?.trim() || null;

  const [guideQr, wifiQr] = await Promise.all([
    qrSvgDataUri(publicUrl),
    wifiName
      ? qrSvgDataUri(wifiQrPayload({ ssid: wifiName, password: wifiPassword ?? "", security: wifiPassword ? "WPA" : "nopass", hidden: false }))
      : Promise.resolve(null)
  ]);

  const card = (
    <WelcomeCard
      property={{ ...property, wifiName, wifiPassword }}
      locale={locale}
      guideQr={guideQr}
      wifiQr={wifiQr}
      shortUrl={publicUrl.replace(/^https?:\/\//, "")}
    />
  );

  return (
    <main className={`${display.variable} ${mono.variable} wc-page min-h-screen bg-sn-canvas`}>
      <style dangerouslySetInnerHTML={{ __html: welcomeCardCss(layout) }} />

      <header className="wc-no-print border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-4 px-4 py-4 sm:px-6">
          <Link href="/dashboard" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-sn-muted hover:text-sn-ink">
            <ArrowLeft size={16} aria-hidden="true" /> Dashboard
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-extrabold tracking-tight text-sn-ink">Welcome card</h1>
            <p className="text-sm text-sn-muted">Print it and put it by the door, on the fridge or next to the router.</p>
          </div>
          <PrintButton label="Print" event="welcome_card_printed" />
        </div>
        <div className="mx-auto flex max-w-5xl flex-wrap gap-x-8 gap-y-3 px-4 pb-4 sm:px-6">
          <nav aria-label="Size" className="flex flex-wrap gap-1 rounded-full bg-sn-canvas p-1">
            {WELCOME_CARD_LAYOUTS.map((option) => (
              <Link
                key={option.key}
                href={cardHref(option.key, locale)}
                aria-current={option.key === layout.key ? "page" : undefined}
                title={option.hint}
                className={`inline-flex min-h-9 items-center rounded-full px-4 text-sm font-semibold transition ${
                  option.key === layout.key ? "bg-white text-sn-ink shadow-sm" : "text-sn-muted hover:text-sn-ink"
                }`}
              >
                {option.label}
              </Link>
            ))}
          </nav>
          <nav aria-label="Language" className="flex flex-wrap gap-1 rounded-full bg-sn-canvas p-1">
            {GUEST_LOCALES.map((option) => (
              <Link
                key={option.code}
                href={cardHref(layout.key, option.code)}
                aria-current={option.code === locale ? "page" : undefined}
                title={option.label}
                className={`inline-flex min-h-9 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition ${
                  option.code === locale ? "bg-white text-sn-ink shadow-sm" : "text-sn-muted hover:text-sn-ink"
                }`}
              >
                {option.short}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mx-auto max-w-5xl px-4 pb-4 text-xs text-sn-muted sm:px-6">
          {layout.hint}. In the print dialog choose &ldquo;Actual size&rdquo; (100 %) and turn on background graphics.
        </p>
      </header>

      <div className="wc-stage">
        <div className="wc-sheet">
          {Array.from({ length: layout.cards }, (_, index) => (
            <div key={index} className="wc-slot">
              {card}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function WelcomeCard({
  property,
  locale,
  guideQr,
  wifiQr,
  shortUrl
}: {
  property: CardProperty;
  locale: GuestLocale;
  guideQr: string;
  wifiQr: string | null;
  shortUrl: string;
}) {
  const text = getWelcomeCardCopy(locale);
  const guest = getGuestMessages(locale);
  const accent = safeAccentColor(property.accentColor);
  const checkIn = extractCardTime(property.checkInInfo);
  const checkOut = extractCardTime(property.checkOutInfo);
  const hostLine = [property.hostContactName?.trim(), property.hostPhone?.trim()].filter(Boolean).join("  ·  ");

  return (
    <article className="wc-card" style={{ ["--accent" as string]: accent }} lang={locale}>
      <div className={`wc-hero ${property.coverImageUrl ? "wc-hero--photo" : "wc-hero--mesh"}`}>
        {property.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={property.coverImageUrl} alt="" className="wc-cover" />
        ) : (
          <>
            <span className="wc-orb wc-orb--a" />
            <span className="wc-orb wc-orb--b" />
            <span className="wc-ring" />
          </>
        )}
        <span className="wc-scrim" />
        <div className="wc-hero-top">
          <span className="wc-pill">
            <span className="wc-dot" />
            {text.welcome}
          </span>
          {property.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={property.logoUrl} alt="" className="wc-logo" />
          ) : null}
        </div>
        <h2 className={`wc-name ${nameSizeClass(property.name)}`}>{property.name}</h2>
      </div>

      <div className="wc-body">
        <section className="wc-scan">
          <div className="wc-qr">
            <span className="wc-corner wc-corner--tl" />
            <span className="wc-corner wc-corner--tr" />
            <span className="wc-corner wc-corner--bl" />
            <span className="wc-corner wc-corner--br" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={guideQr} alt="" />
          </div>
          <div className="wc-scan-text">
            <p className="wc-kicker">01 · {guest.guestGuide}</p>
            <p className="wc-title">{text.scanGuide}</p>
            <p className="wc-hint">{text.guideHint}</p>
            <p className="wc-url">{shortUrl}</p>
          </div>
        </section>

        {property.wifiName ? (
          <section className="wc-wifi">
            <div className="wc-wifi-text">
              <p className="wc-kicker">02 · {text.wifi}</p>
              <p className="wc-label">{text.network}</p>
              <p className="wc-value">{property.wifiName}</p>
              <p className="wc-label">{text.password}</p>
              <p className="wc-secret">{property.wifiPassword ?? text.noPassword}</p>
            </div>
            {wifiQr ? (
              <div className="wc-wifi-qr">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={wifiQr} alt="" />
                <span>{text.scanToJoin}</span>
              </div>
            ) : null}
          </section>
        ) : null}

        <section className="wc-times">
          <div className="wc-time">
            <p className="wc-label">{guest.content.checkIn}</p>
            <p className={checkIn ? "wc-time-value" : "wc-time-value wc-time-value--soft"}>{checkIn ?? text.seeGuide}</p>
          </div>
          <div className="wc-time">
            <p className="wc-label">{guest.content.checkOut}</p>
            <p className={checkOut ? "wc-time-value" : "wc-time-value wc-time-value--soft"}>{checkOut ?? text.seeGuide}</p>
          </div>
        </section>

        <footer className="wc-foot">
          <span className="wc-host">{hostLine ? `${guest.content.yourHost}: ${hostLine}` : ""}</span>
          <span className="wc-brand">StayNest</span>
        </footer>
      </div>
    </article>
  );
}

function nameSizeClass(name: string) {
  const length = name.trim().length;
  if (length <= 16) return "";
  if (length <= 28) return "wc-name--md";
  return "wc-name--sm";
}

function welcomeCardCss(layout: WelcomeCardLayout) {
  const pageSize = layout.key === "a6" ? "105mm 148mm" : layout.key === "a5" ? "A5 portrait" : "A4 portrait";
  const sheet =
    layout.cards === 1
      ? `.wc-sheet { display: block; }`
      : `.wc-sheet { width: ${layout.pageWidth}mm; height: ${layout.pageHeight}mm; display: grid; grid-template-columns: repeat(2, auto); align-content: center; justify-content: center; gap: 4mm; background: #fff; }
         .wc-slot .wc-card { outline: 0.2mm dashed #c7ccd4; outline-offset: 1.2mm; }`;

  return `
.wc-stage { display: flex; justify-content: center; overflow-x: auto; padding: 32px 16px 64px; }
.wc-card {
  --ink: #0B1220;
  --soft: #5B6474;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 105em;
  height: 148em;
  font-size: ${layout.scale}mm;
  overflow: hidden;
  background: #fff;
  color: var(--ink);
  font-family: var(--wc-display), ui-sans-serif, system-ui, sans-serif;
  border-radius: ${layout.cards === 1 ? "0" : "3em"};
  box-shadow: 0 30px 80px -30px rgba(11, 18, 32, 0.45), 0 0 0 1px rgba(11, 18, 32, 0.06);
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.wc-card p { margin: 0; }
.wc-hero { position: relative; height: 42em; flex: none; overflow: hidden; color: #fff; padding: 5.5em 6.5em; display: flex; flex-direction: column; justify-content: space-between; isolation: isolate; }
.wc-hero--mesh {
  background:
    radial-gradient(60em 45em at 12% 8%, color-mix(in srgb, var(--accent) 70%, #ffffff) 0%, transparent 60%),
    radial-gradient(55em 50em at 100% 30%, color-mix(in srgb, var(--accent) 55%, #ff8a5c) 0%, transparent 62%),
    linear-gradient(150deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 35%, #0B1220) 100%);
}
.wc-cover { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: -2; }
.wc-scrim { position: absolute; inset: 0; z-index: -1; }
.wc-hero--photo .wc-scrim { background: linear-gradient(180deg, rgba(11,18,32,0.35) 0%, rgba(11,18,32,0) 35%, rgba(11,18,32,0.82) 100%), linear-gradient(60deg, color-mix(in srgb, var(--accent) 45%, transparent) 0%, transparent 55%); }
.wc-hero--mesh .wc-scrim { background-image: radial-gradient(rgba(255,255,255,0.22) 0.35em, transparent 0.4em); background-size: 4.2em 4.2em; mask-image: linear-gradient(200deg, #000 0%, transparent 60%); -webkit-mask-image: linear-gradient(200deg, #000 0%, transparent 60%); }
.wc-orb { position: absolute; border-radius: 999em; z-index: -1; }
.wc-orb--a { width: 46em; height: 46em; right: -14em; top: -18em; background: radial-gradient(circle at 35% 35%, rgba(255,255,255,0.55), rgba(255,255,255,0) 65%); }
.wc-orb--b { width: 30em; height: 30em; left: -10em; bottom: -16em; background: radial-gradient(circle, rgba(11,18,32,0.35), transparent 70%); }
.wc-ring { position: absolute; z-index: -1; width: 62em; height: 62em; right: -26em; bottom: -38em; border-radius: 999em; border: 0.35em solid rgba(255,255,255,0.28); box-shadow: 0 0 0 7em rgba(255,255,255,0.06); }
.wc-hero-top { display: flex; align-items: center; justify-content: space-between; gap: 3em; }
.wc-pill { display: inline-flex; align-items: center; gap: 1.6em; padding: 1.5em 3.2em; border-radius: 999em; background: rgba(255,255,255,0.16); border: 0.25em solid rgba(255,255,255,0.35); font-size: 2.5em; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; }
.wc-dot { width: 0.55em; height: 0.55em; border-radius: 999em; background: #fff; box-shadow: 0 0 0 0.3em rgba(255,255,255,0.3); }
.wc-logo { max-height: 9em; max-width: 26em; object-fit: contain; border-radius: 2em; background: rgba(255,255,255,0.92); padding: 1.2em 2em; }
.wc-name { margin: 0; font-size: 9em; line-height: 0.98; font-weight: 700; letter-spacing: -0.035em; text-wrap: balance; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-shadow: 0 0.08em 0.5em rgba(11,18,32,0.25); }
.wc-name--md { font-size: 7.4em; }
.wc-name--sm { font-size: 6em; line-height: 1.02; -webkit-line-clamp: 3; }
.wc-body { flex: 1; display: flex; flex-direction: column; justify-content: space-between; gap: 3em; padding: 5.5em 6.5em 4.5em; background: linear-gradient(180deg, #fff 0%, color-mix(in srgb, var(--accent) 6%, #fff) 100%); }
.wc-kicker { font-size: 2.3em; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--accent); }
.wc-scan { display: grid; grid-template-columns: 29em 1fr; gap: 5em; align-items: center; }
.wc-qr { position: relative; width: 29em; height: 29em; padding: 3em; border-radius: 4em; background: #fff; box-shadow: 0 1.2em 4em -1.2em color-mix(in srgb, var(--accent) 55%, transparent), 0 0 0 0.25em rgba(11,18,32,0.06); }
.wc-qr img { width: 100%; height: 100%; display: block; }
.wc-corner { position: absolute; width: 5em; height: 5em; border: 0 solid var(--accent); }
.wc-corner--tl { top: 1.2em; left: 1.2em; border-top-width: 0.6em; border-left-width: 0.6em; border-top-left-radius: 2.6em; }
.wc-corner--tr { top: 1.2em; right: 1.2em; border-top-width: 0.6em; border-right-width: 0.6em; border-top-right-radius: 2.6em; }
.wc-corner--bl { bottom: 1.2em; left: 1.2em; border-bottom-width: 0.6em; border-left-width: 0.6em; border-bottom-left-radius: 2.6em; }
.wc-corner--br { bottom: 1.2em; right: 1.2em; border-bottom-width: 0.6em; border-right-width: 0.6em; border-bottom-right-radius: 2.6em; }
.wc-scan-text { display: grid; gap: 1.6em; min-width: 0; }
.wc-title { font-size: 4.6em; line-height: 1.06; font-weight: 700; letter-spacing: -0.025em; text-wrap: balance; }
.wc-hint { font-size: 2.5em; line-height: 1.35; color: var(--soft); }
.wc-url { font-family: var(--wc-mono), ui-monospace, monospace; font-size: 2.2em; color: var(--soft); overflow-wrap: anywhere; }
.wc-wifi { display: grid; grid-template-columns: 1fr auto; gap: 4em; align-items: center; padding: 3.4em 4em; border-radius: 4em; background: var(--ink); color: #fff; position: relative; overflow: hidden; }
.wc-wifi::before { content: ""; position: absolute; width: 40em; height: 40em; right: -18em; top: -22em; border-radius: 999em; background: radial-gradient(circle, color-mix(in srgb, var(--accent) 70%, transparent), transparent 68%); }
.wc-wifi > * { position: relative; }
.wc-wifi .wc-kicker { color: color-mix(in srgb, var(--accent) 45%, #ffffff); margin-bottom: 1.2em; }
.wc-wifi-text { min-width: 0; }
.wc-wifi .wc-label { color: rgba(255,255,255,0.55); }
.wc-label { font-size: 2.2em; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: var(--soft); }
.wc-value { font-size: 3.6em; font-weight: 700; letter-spacing: -0.01em; margin: 0.2em 0 0.55em !important; overflow-wrap: anywhere; line-height: 1.1; }
.wc-secret { display: inline-block; margin-top: 0.4em !important; font-family: var(--wc-mono), ui-monospace, monospace; font-size: 3.2em; font-weight: 500; line-height: 1.25; padding: 0.35em 0.7em; border-radius: 0.6em; background: rgba(255,255,255,0.1); border: 0.07em solid rgba(255,255,255,0.18); overflow-wrap: anywhere; max-width: 100%; }
.wc-wifi-qr { display: grid; justify-items: center; gap: 1.2em; }
.wc-wifi-qr img { width: 17em; height: 17em; padding: 1.4em; border-radius: 2.6em; background: #fff; }
.wc-wifi-qr span { font-size: 2em; font-weight: 500; color: rgba(255,255,255,0.7); text-align: center; max-width: 22em; line-height: 1.2; }
.wc-times { display: grid; grid-template-columns: 1fr 1fr; gap: 3em; }
.wc-time { padding: 2.4em 3.6em; border-radius: 3.6em; background: #fff; box-shadow: 0 0 0 0.25em rgba(11,18,32,0.07); }
.wc-time-value { font-size: 5.4em; font-weight: 700; letter-spacing: -0.03em; line-height: 1.1; margin-top: 0.15em !important; font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wc-time-value--soft { font-size: 4em; color: var(--soft); font-weight: 500; letter-spacing: -0.01em; }
.wc-foot { display: flex; align-items: center; justify-content: space-between; gap: 3em; font-size: 2.3em; color: var(--soft); }
.wc-host { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.wc-brand { flex: none; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: color-mix(in srgb, var(--ink) 35%, #fff); }
${sheet}
@page { size: ${pageSize}; margin: 0; }
@media print {
  html, body { background: #fff !important; margin: 0 !important; padding: 0 !important; }
  .wc-no-print { display: none !important; }
  .wc-page { min-height: 0 !important; background: #fff !important; }
  .wc-stage { padding: 0 !important; overflow: visible !important; display: block !important; }
  .wc-card { box-shadow: none !important; }
  .wc-qr { box-shadow: 0 0 0 0.3em color-mix(in srgb, var(--accent) 35%, #ffffff) !important; }
  .wc-hero--mesh .wc-scrim { display: none; }
  .wc-sheet { break-inside: avoid; }
}
@media screen {
  .wc-sheet > .wc-slot:only-child .wc-card { border-radius: 4em; }
}
@media screen and (max-width: 520px) {
  .wc-stage { justify-content: flex-start; }
}
`;
}
