"use client";

import { createContext, useContext } from "react";
import { type GuestLocale, type GuestMessages, getGuestMessages } from "@/lib/guest-i18n";

type GuestLanguageContextValue = {
  locale: GuestLocale;
  t: GuestMessages;
};

const GuestLanguageContext = createContext<GuestLanguageContextValue | null>(null);

export function GuestLanguageProvider({ children }: { children: React.ReactNode; availableLocales?: string[] }) {
  return <GuestLanguageContext.Provider value={{ locale: "en", t: getGuestMessages() }}>{children}</GuestLanguageContext.Provider>;
}

export function useGuestLanguage() {
  const context = useContext(GuestLanguageContext);
  if (!context) {
    throw new Error("useGuestLanguage must be used within GuestLanguageProvider");
  }
  return context;
}

export function GuestLanguageMenu() {
  return null;
}
