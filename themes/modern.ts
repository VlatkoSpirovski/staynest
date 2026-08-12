import type { GuideTheme } from "./types";

export const modernTheme: GuideTheme = {
  id: "modern",
  name: "Modern",
  shortName: "Modern",
  atmosphere: "Minimal city apartment",
  layout: "modern",
  description: "White minimal layout with clean typography, quiet spacing and a refined city-apartment feel.",
  bestFor: "City apartments, modern Airbnb, business stays",
  palette: ["#FFFFFF", "#F4F6F8", "#111827", "#7E8A96"],
  accentOptions: ["#111827", "#65707C", "#447F84", "#6C7680"],
  defaults: {
    accentColor: "#111827",
    serifHeading: false,
    roundedCards: true
  },
  preview: {
    propertyName: "Cece's Home",
    logoText: "CH",
    eyebrow: "Arrival ready",
    heroBackground:
      "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(17,24,39,0.44)), radial-gradient(circle at 20% 20%, rgba(255,255,255,0.72), transparent 34%), linear-gradient(135deg, #F7F8F9 0%, #CED5DC 52%, #8C98A5 100%)"
  },
  css: {
    appBackground:
      "radial-gradient(circle at 18% 0%, rgba(255,255,255,0.82), transparent 26%), linear-gradient(145deg, #EEF2F6 0%, #DDE3EA 100%)",
    shellBackground:
      "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
    heroFallback:
      "radial-gradient(circle at 16% 18%, rgba(255,255,255,0.86), transparent 32%), linear-gradient(135deg, #F8FAFC 0%, #CDD5DE 54%, #8694A3 100%)",
    // Modern keeps dark hero text, so the scrim has to lighten the photo rather
    // than darken it. A dark scrim here made the title unreadable (1:1) on any
    // dark cover image; this keeps it above 13:1 on the worst-case photo.
    heroOverlay:
      "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.52) 46%, rgba(255,255,255,0.90) 100%)",
    text: "#111827",
    muted: "rgba(17,24,39,0.62)",
    cardBackground: "linear-gradient(145deg, rgba(255,255,255,0.94) 0%, rgba(247,249,252,0.88) 100%)",
    cardBorder: "rgba(17,24,39,0.065)",
    elevatedBackground: "rgba(255,255,255,0.78)",
    iconBackground: "linear-gradient(145deg, #FFFFFF 0%, #EEF2F6 100%)",
    accentSoft: "rgba(17,24,39,0.055)",
    cardInsetShadow: "inset 0 1px 0 rgba(255,255,255,1)",
    cardHoverShadow: "0 22px 56px rgba(17,24,39,0.11)",
    cardBackdrop: "blur(20px)",
    heroImageFilter: "saturate(0.9) contrast(1.02) brightness(1.04)",
    languageBackground: "rgba(255,255,255,0.72)",
    languageText: "#111827",
    buttonBackground: "#111827",
    buttonText: "#FFFFFF",
    headingFont: "Inter, ui-sans-serif, system-ui, sans-serif",
    bodyFont: "Inter, ui-sans-serif, system-ui, sans-serif",
    heroTextColor: "#111827",
    heroHeight: "278px",
    heroRadius: "30px",
    menuGap: "12px",
    menuPadding: "20px",
    cardMinHeight: "82px",
    cardPadding: "16px",
    iconRadius: "18px",
    iconShadow: "0 10px 28px rgba(17,24,39,0.06), inset 0 1px 0 rgba(255,255,255,1)",
    sectionDivider: "rgba(17,24,39,0.08)",
    radiusCard: "22px",
    radiusShell: "30px",
    radiusButton: "999px",
    shadowCard: "0 16px 44px rgba(17,24,39,0.07)",
    shadowShell: "0 30px 90px rgba(17,24,39,0.22)"
  }
};
