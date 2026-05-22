"use client";

import { ChevronDown, Languages } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  GUEST_LOCALES,
  GUEST_LOCALE_STORAGE_KEY,
  type GuestLocale,
  type GuestMessages,
  getDefaultGuestLocale,
  getGuestMessages,
  isGuestLocale
} from "@/lib/guest-i18n";

type GuestLanguageContextValue = {
  locale: GuestLocale;
  setLocale: (locale: GuestLocale) => void;
  t: GuestMessages;
  availableLocales: GuestLocale[];
};

const GuestLanguageContext = createContext<GuestLanguageContextValue | null>(null);

export function GuestLanguageProvider({ children, availableLocales }: { children: React.ReactNode; availableLocales?: string[] }) {
  const enabledLocales = useMemo(() => {
    const valid = (availableLocales || ["en"]).filter((locale): locale is GuestLocale => isGuestLocale(locale));
    return Array.from(new Set<GuestLocale>(["en", ...valid]));
  }, [availableLocales]);
  const [locale, setLocaleState] = useState<GuestLocale>(getDefaultGuestLocale());

  useEffect(() => {
    const stored = window.localStorage.getItem(GUEST_LOCALE_STORAGE_KEY);
    if (stored && isGuestLocale(stored)) {
      setLocaleState(enabledLocales.includes(stored) ? stored : "en");
    }
  }, [enabledLocales]);

  const setLocale = useCallback((next: GuestLocale) => {
    const safeLocale = enabledLocales.includes(next) ? next : "en";
    setLocaleState(safeLocale);
    window.localStorage.setItem(GUEST_LOCALE_STORAGE_KEY, safeLocale);
  }, [enabledLocales]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: getGuestMessages(locale),
      availableLocales: enabledLocales
    }),
    [enabledLocales, locale, setLocale]
  );

  return <GuestLanguageContext.Provider value={value}>{children}</GuestLanguageContext.Provider>;
}

export function useGuestLanguage() {
  const context = useContext(GuestLanguageContext);
  if (!context) {
    throw new Error("useGuestLanguage must be used within GuestLanguageProvider");
  }
  return context;
}

export function GuestLanguageMenu() {
  const { locale, setLocale, availableLocales } = useGuestLanguage();
  const [open, setOpen] = useState(false);
  const active = GUEST_LOCALES.find((item) => item.code === locale) ?? GUEST_LOCALES[0];

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 items-center gap-1.5 rounded-full border border-white/25 bg-white/14 py-1.5 pl-2 pr-2 text-xs font-black text-white shadow-[0_14px_40px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl transition hover:bg-white/22"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Choose guide language"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-ink shadow-[0_8px_22px_rgba(0,0,0,0.16)]">
          <Languages size={14} />
        </span>
        <span>{active.short}</span>
        <ChevronDown size={14} className={`text-white/72 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <>
          <button type="button" className="fixed inset-0 z-40" aria-label="Close language menu" onClick={() => setOpen(false)} />
          <ul
            role="listbox"
            className="absolute right-0 top-[calc(100%+6px)] z-50 max-h-64 w-44 overflow-y-auto rounded-[14px] border border-ink/10 bg-white py-1 shadow-[0_18px_50px_rgba(31,41,51,0.18)]"
          >
            {GUEST_LOCALES.filter((item) => availableLocales.includes(item.code)).map((item) => (
              <li key={item.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={locale === item.code}
                  onClick={() => {
                    setLocale(item.code);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-semibold transition ${
                    locale === item.code ? "bg-[var(--accent)]/12 text-ink" : "text-ink/80 hover:bg-[#f8f1e8]"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs font-bold text-ink/45">{item.short}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
