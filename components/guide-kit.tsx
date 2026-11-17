"use client";

import Link from "next/link";
import { Check, ChevronRight, Copy, Eye, EyeOff, Globe, Home, Sparkles, Wifi } from "lucide-react";
import { useState } from "react";
import { useGuestLanguage } from "@/components/guest-language";
import { GUEST_LOCALES, isGuestLocale } from "@/lib/guest-i18n";

const cardSurface = {
  background: "var(--guide-card-bg)",
  boxShadow: "var(--guide-card-shadow), var(--guide-card-inset-shadow)"
} as const;

export function GuideLogo({ logoUrl, name, size = 40 }: { logoUrl: string | null; name: string; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center overflow-hidden rounded-[30%] border border-[var(--guide-card-border)] text-[var(--guide-accent)]"
      style={{ width: size, height: size, background: "var(--guide-elevated-bg)" }}
    >
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt={`${name} logo`} className="h-full w-full object-cover" width={size} height={size} />
      ) : (
        <Home size={Math.round(size * 0.45)} aria-hidden="true" />
      )}
    </span>
  );
}

export function GuideLanguageSelect() {
  const { locale, setLocale } = useGuestLanguage();
  const current = GUEST_LOCALES.find((option) => option.code === locale);
  return (
    <label className="relative inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border border-[var(--guide-card-border)] px-3 text-xs font-bold text-[var(--guide-text)]" style={{ background: "var(--guide-elevated-bg)" }}>
      <Globe size={14} aria-hidden="true" className="text-[var(--guide-muted)]" />
      <span aria-hidden="true">{current?.short ?? "EN"}</span>
      <span className="sr-only">Language</span>
      <select
        value={locale}
        onChange={(event) => {
          if (isGuestLocale(event.target.value)) setLocale(event.target.value);
        }}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        {GUEST_LOCALES.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function GuideTopBar({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  const { t } = useGuestLanguage();
  return (
    <header className="flex items-center justify-between gap-3 px-4 pb-3 pt-4 sm:px-5">
      <div className="flex min-w-0 items-center gap-2.5">
        <GuideLogo logoUrl={logoUrl} name={name} size={38} />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold leading-tight text-[var(--guide-text)]">{name}</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--guide-muted)]">{t.guestGuide}</p>
        </div>
      </div>
      <GuideLanguageSelect />
    </header>
  );
}

type CardProps = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  href: string;
  onNavigate?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

const focusRing = "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--guide-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--guide-focus-offset,transparent)]";

export function GuideRowCard({ icon, title, subtitle, eyebrow, href, onNavigate }: CardProps) {
  return (
    <Link
      href={href}
      prefetch
      onClick={onNavigate}
      className={`group flex min-h-[72px] w-full min-w-0 items-center gap-3 rounded-[var(--guide-card-radius)] border border-[var(--guide-card-border)] px-4 py-3 text-left text-[var(--guide-text)] transition duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${focusRing}`}
      style={cardSurface}
    >
      <GuideIcon>{icon}</GuideIcon>
      <span className="min-w-0 flex-1">
        {eyebrow ? <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--guide-accent)]">{eyebrow}</span> : null}
        <span className="line-clamp-2 break-words text-[15px] font-bold leading-snug tracking-tight">{title}</span>
        {subtitle ? <span className="block truncate text-xs text-[var(--guide-muted)]">{subtitle}</span> : null}
      </span>
      <ChevronRight size={18} aria-hidden="true" className="shrink-0 text-[var(--guide-muted)] transition group-hover:translate-x-0.5 motion-reduce:transition-none" />
    </Link>
  );
}

export function GuideTileCard({ icon, title, href, onNavigate }: CardProps) {
  return (
    <Link
      href={href}
      prefetch
      onClick={onNavigate}
      className={`flex min-h-[88px] w-full min-w-0 flex-col items-center justify-center gap-2 rounded-[var(--guide-card-radius)] border border-[var(--guide-card-border)] px-2 py-3 text-center text-[var(--guide-text)] transition duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${focusRing}`}
      style={cardSurface}
    >
      <GuideIcon small>{icon}</GuideIcon>
      <span className="line-clamp-2 w-full break-words text-[13px] font-bold leading-tight tracking-tight [hyphens:auto]">{title}</span>
    </Link>
  );
}

export function GuideIcon({ children, small = false }: { children: React.ReactNode; small?: boolean }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-[var(--guide-icon-radius)] text-[var(--guide-accent)] ${small ? "h-9 w-9" : "h-11 w-11"}`}
      style={{ background: "var(--guide-icon-bg)", boxShadow: "var(--guide-icon-shadow)" }}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

export function GuideWifiCard({ network, password }: { network: string; password: string | null }) {
  const { t } = useGuestLanguage();
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
    } catch {
      const area = document.createElement("textarea");
      area.value = password;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section aria-label={t.menu.wifi.title} className="min-w-0 rounded-[var(--guide-card-radius)] border border-[var(--guide-card-border)] p-4 text-[var(--guide-text)]" style={cardSurface}>
      <div className="flex items-center gap-3">
        <GuideIcon>
          <Wifi size={20} />
        </GuideIcon>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--guide-accent)]">{t.menu.wifi.title}</p>
          <p className="truncate text-[15px] font-bold tracking-tight">{network}</p>
          {password ? (
            <p className="flex min-w-0 items-center gap-2 text-[13px] text-[var(--guide-muted)]">
              <span className="truncate font-mono" aria-label={visible ? undefined : t.content.password}>
                {visible ? password : "•".repeat(Math.min(Math.max(password.length, 8), 14))}
              </span>
              <button
                type="button"
                onClick={() => setVisible((value) => !value)}
                aria-pressed={visible}
                className={`inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-bold text-[var(--guide-muted)] hover:text-[var(--guide-text)] ${focusRing}`}
              >
                {visible ? <EyeOff size={13} aria-hidden="true" /> : <Eye size={13} aria-hidden="true" />}
                {visible ? t.content.hidePassword : t.content.showPassword}
              </button>
            </p>
          ) : (
            <p className="text-[13px] text-[var(--guide-muted)]">{t.content.askHost}</p>
          )}
        </div>
      </div>
      {password ? (
        <button
          type="button"
          onClick={copy}
          className={`mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--guide-button-radius)] text-sm font-bold transition active:scale-[0.98] motion-reduce:transition-none ${focusRing}`}
          style={{ background: "var(--guide-button-bg)", color: "var(--guide-button-text)" }}
        >
          {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
          {copied ? t.content.passwordCopied : t.content.copyWifiPassword}
        </button>
      ) : null}
      <span className="sr-only" aria-live="polite">
        {copied ? t.content.passwordCopied : ""}
      </span>
    </section>
  );
}

export function GuideConciergeButton({ label, hint, onClick, expanded }: { label: string; hint: string; onClick: () => void; expanded: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      className={`flex min-h-14 w-full items-center gap-3 rounded-[var(--guide-button-radius)] py-2 pl-2 pr-4 text-left shadow-[0_16px_40px_rgba(17,24,39,0.22)] transition active:scale-[0.99] motion-reduce:transition-none ${focusRing}`}
      style={{ background: "var(--guide-button-bg)", color: "var(--guide-button-text)" }}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15" aria-hidden="true">
        <Sparkles size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold">{label}</span>
        <span className="block truncate text-[11px] opacity-75">{hint}</span>
      </span>
      <ChevronRight size={18} aria-hidden="true" className={`shrink-0 opacity-70 transition ${expanded ? "-rotate-90" : ""}`} />
    </button>
  );
}

export function GuideConciergeDock({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[430px] px-4" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
      <div className="pointer-events-auto grid gap-2">{children}</div>
    </div>
  );
}
