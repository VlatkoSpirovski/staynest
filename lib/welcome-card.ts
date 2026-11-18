import { GUEST_LOCALES, isGuestLocale, type GuestLocale } from "@/lib/guest-i18n";

export const WELCOME_CARD_LAYOUTS = [
  { key: "a6", label: "A6 card", hint: "105 × 148 mm", pageWidth: 105, pageHeight: 148, scale: 1, cards: 1 },
  { key: "a5", label: "A5 card", hint: "148 × 210 mm", pageWidth: 148, pageHeight: 210, scale: 148 / 105, cards: 1 },
  { key: "a4", label: "4 on A4", hint: "Print at home, cut on the lines", pageWidth: 210, pageHeight: 297, scale: 0.94, cards: 4 }
] as const;

export type WelcomeCardLayout = (typeof WELCOME_CARD_LAYOUTS)[number];
export type WelcomeCardLayoutKey = WelcomeCardLayout["key"];

export type WelcomeCardCopy = {
  welcome: string;
  scanGuide: string;
  guideHint: string;
  wifi: string;
  network: string;
  password: string;
  noPassword: string;
  scanToJoin: string;
  seeGuide: string;
};

const copy: Record<GuestLocale, WelcomeCardCopy> = {
  en: {
    welcome: "Welcome",
    scanGuide: "Scan for your guest guide",
    guideHint: "Wi-Fi, house info, local tips and your host, in your language.",
    wifi: "Wi-Fi",
    network: "Network",
    password: "Password",
    noPassword: "No password",
    scanToJoin: "Scan to join",
    seeGuide: "See guide"
  },
  de: {
    welcome: "Willkommen",
    scanGuide: "Scannen für Ihren Gästeguide",
    guideHint: "WLAN, Hausinfos, Tipps in der Nähe und Ihr Gastgeber, in Ihrer Sprache.",
    wifi: "WLAN",
    network: "Netzwerk",
    password: "Passwort",
    noPassword: "Kein Passwort",
    scanToJoin: "Scannen & verbinden",
    seeGuide: "Siehe Guide"
  },
  fr: {
    welcome: "Bienvenue",
    scanGuide: "Scannez pour votre guide",
    guideHint: "Wi-Fi, infos pratiques, bonnes adresses et votre hôte, dans votre langue.",
    wifi: "Wi-Fi",
    network: "Réseau",
    password: "Mot de passe",
    noPassword: "Sans mot de passe",
    scanToJoin: "Scannez pour vous connecter",
    seeGuide: "Voir le guide"
  },
  it: {
    welcome: "Benvenuti",
    scanGuide: "Scansiona per la tua guida",
    guideHint: "Wi-Fi, info sulla casa, consigli locali e il tuo host, nella tua lingua.",
    wifi: "Wi-Fi",
    network: "Rete",
    password: "Password",
    noPassword: "Nessuna password",
    scanToJoin: "Scansiona per connetterti",
    seeGuide: "Vedi la guida"
  },
  es: {
    welcome: "Bienvenidos",
    scanGuide: "Escanea tu guía",
    guideHint: "Wi-Fi, información de la casa, recomendaciones y tu anfitrión, en tu idioma.",
    wifi: "Wi-Fi",
    network: "Red",
    password: "Contraseña",
    noPassword: "Sin contraseña",
    scanToJoin: "Escanea para conectarte",
    seeGuide: "Ver la guía"
  },
  nl: {
    welcome: "Welkom",
    scanGuide: "Scan voor je gastengids",
    guideHint: "Wifi, huisinfo, lokale tips en je host, in je eigen taal.",
    wifi: "Wifi",
    network: "Netwerk",
    password: "Wachtwoord",
    noPassword: "Geen wachtwoord",
    scanToJoin: "Scan om te verbinden",
    seeGuide: "Zie gids"
  }
};

export function getWelcomeCardCopy(locale: GuestLocale) {
  return copy[locale] ?? copy.en;
}

export function welcomeCardLayout(value: string | undefined): WelcomeCardLayout {
  return WELCOME_CARD_LAYOUTS.find((layout) => layout.key === value) ?? WELCOME_CARD_LAYOUTS[0];
}

export function welcomeCardLocale(value: string | undefined, propertyLocales: readonly string[]): GuestLocale {
  if (value && isGuestLocale(value)) return value;
  const first = propertyLocales.find(isGuestLocale);
  return first ?? GUEST_LOCALES[0].code;
}

export function safeAccentColor(value: string | null | undefined, fallback = "#4a8a8f") {
  return value && /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
}

const TIME = String.raw`(?:(?:[01]?\d|2[0-3])[:.][0-5]\d\s*(?:am|pm)?|(?:[01]?\d|2[0-3])h[0-5]\d|(?:1[0-2]|0?[1-9])\s*(?:am|pm)|(?:[01]?\d|2[0-3])\s*(?:h|uhr)(?![a-z]))`;
const TIME_RANGE = new RegExp(String.raw`(?<![\d.:])(${TIME})(?![\d.:])(?:\s*(?:-|–|—|to|bis|à|a|al|tot)\s*(${TIME}))?`, "i");

function normalizeTime(raw: string) {
  const value = raw.trim().toLowerCase().replace(/\s+/g, " ");
  const clock = value.match(/^(\d{1,2})[:.](\d{2})\s*(am|pm)?$/);
  if (clock) {
    const hour = clock[3] ? clock[1] : clock[1].padStart(2, "0");
    return clock[3] ? `${hour}:${clock[2]} ${clock[3]}` : `${hour}:${clock[2]}`;
  }
  const french = value.match(/^(\d{1,2})h(\d{2})$/);
  if (french) return `${french[1].padStart(2, "0")}:${french[2]}`;
  const meridiem = value.match(/^(\d{1,2})\s*(am|pm)$/);
  if (meridiem) return `${meridiem[1]} ${meridiem[2]}`;
  const hours = value.match(/^(\d{1,2})\s*(?:h|uhr)$/);
  if (hours) return `${hours[1].padStart(2, "0")}:00`;
  return value;
}

/**
 * Pulls the time (or time range) out of a free-text check-in/out note, so the
 * printed card shows "15:00–22:00" whatever language the note is written in.
 */
export function extractCardTime(text: string | null | undefined) {
  if (!text) return null;
  const match = text.match(TIME_RANGE);
  if (!match) return null;
  const start = normalizeTime(match[1]);
  return match[2] ? `${start}–${normalizeTime(match[2])}` : start;
}
