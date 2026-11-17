"use client";

import { Globe } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { GUEST_LOCALES, type GuestLocale, type GuestMessages, detectGuestLocale, getGuestMessages, isGuestLocale } from "@/lib/guest-i18n";

const STORAGE_KEY = "staynest_guest_locale";

type GuestLanguageContextValue = {
  locale: GuestLocale;
  t: GuestMessages;
  setLocale: (locale: GuestLocale) => void;
};

const GuestLanguageContext = createContext<GuestLanguageContextValue | null>(null);

export function GuestLanguageProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<GuestLocale>("en");

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    setLocaleState(stored && isGuestLocale(stored) ? stored : detectGuestLocale(navigator.languages?.length ? navigator.languages : [navigator.language]));
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: GuestLocale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }, []);

  const value = useMemo(() => ({ locale, t: getGuestMessages(locale), setLocale }), [locale, setLocale]);
  return <GuestLanguageContext.Provider value={value}>{children}</GuestLanguageContext.Provider>;
}

export function useGuestLanguage() {
  const context = useContext(GuestLanguageContext);
  if (!context) {
    throw new Error("useGuestLanguage must be used within GuestLanguageProvider");
  }
  return context;
}

export function GuestLanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useGuestLanguage();
  return (
    <label className={`mx-auto flex w-fit items-center gap-2 rounded-full border border-[var(--guide-card-border)] px-3 py-1.5 text-xs font-semibold text-[var(--guide-muted)] ${className}`} style={{ background: "var(--guide-language-bg)" }}>
      <Globe size={14} aria-hidden="true" />
      <span className="sr-only">Language</span>
      <select
        value={locale}
        onChange={(event) => {
          if (isGuestLocale(event.target.value)) setLocale(event.target.value);
        }}
        className="cursor-pointer bg-transparent font-semibold text-[var(--guide-text)] outline-none"
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
