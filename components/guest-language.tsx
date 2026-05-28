"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { GUEST_LOCALES, type GuestLocale, type GuestMessages, getDefaultGuestLocale, getGuestMessages, isGuestLocale } from "@/lib/guest-i18n";

type GuestLanguageContextValue = {
  locale: GuestLocale;
  t: GuestMessages;
  setLocale: (locale: GuestLocale) => void;
};

const GuestLanguageContext = createContext<GuestLanguageContextValue | null>(null);

const STORAGE_KEY = "staynest_guest_locale";

function detectLocale(): GuestLocale {
  if (typeof window === "undefined") return getDefaultGuestLocale();

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && isGuestLocale(stored)) return stored;

  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const lang of languages) {
    const normalized = (lang || "").toLowerCase();
    const base = normalized.split("-")[0];
    if (isGuestLocale(base)) return base;
  }

  return getDefaultGuestLocale();
}

export function GuestLanguageProvider({
  children,
  availableLocales
}: {
  children: React.ReactNode;
  availableLocales?: string[];
}) {
  const allowed = useMemo(() => {
    if (!availableLocales?.length) return null;
    return new Set(availableLocales.map((value) => value.toLowerCase()));
  }, [availableLocales]);

  const [locale, setLocaleState] = useState<GuestLocale>(() => {
    const initial = detectLocale();
    if (!allowed) return initial;
    return allowed.has(initial) ? initial : getDefaultGuestLocale();
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore storage errors
    }
  }, [locale]);

  const t = useMemo(() => getGuestMessages(locale), [locale]);

  const setLocale = (next: GuestLocale) => {
    if (allowed && !allowed.has(next)) return;
    setLocaleState(next);
  };

  return <GuestLanguageContext.Provider value={{ locale, t, setLocale }}>{children}</GuestLanguageContext.Provider>;
}

export function useGuestLanguage() {
  const context = useContext(GuestLanguageContext);
  if (!context) {
    throw new Error("useGuestLanguage must be used within GuestLanguageProvider");
  }
  return context;
}

export function GuestLanguageMenu() {
  const { locale, setLocale } = useGuestLanguage();
  return (
    <div className="flex items-center gap-2">
      {GUEST_LOCALES.map((item) => {
        const active = item.code === locale;
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => setLocale(item.code)}
            aria-pressed={active}
            className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] backdrop-blur-xl transition ${
              active ? "border-[var(--guide-card-border)] bg-[var(--guide-elevated-bg)] text-[var(--guide-text)]" : "border-[var(--guide-card-border)]/70 text-[var(--guide-muted)] hover:text-[var(--guide-text)]"
            }`}
            style={{ background: active ? "var(--guide-elevated-bg)" : "transparent" }}
          >
            {item.short}
          </button>
        );
      })}
    </div>
  );
}
