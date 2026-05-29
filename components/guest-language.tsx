"use client";

import { createContext, useContext, useMemo } from "react";
import { type GuestLocale, type GuestMessages, getGuestMessages } from "@/lib/guest-i18n";

type GuestLanguageContextValue = {
  locale: GuestLocale;
  t: GuestMessages;
};

const GuestLanguageContext = createContext<GuestLanguageContextValue | null>(null);

export function GuestLanguageProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const locale: GuestLocale = "en";
  const t = useMemo(() => getGuestMessages(locale), [locale]);
  return <GuestLanguageContext.Provider value={{ locale, t }}>{children}</GuestLanguageContext.Provider>;
}

export function useGuestLanguage() {
  const context = useContext(GuestLanguageContext);
  if (!context) {
    throw new Error("useGuestLanguage must be used within GuestLanguageProvider");
  }
  return context;
}
