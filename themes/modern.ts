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
  accentOptions: ["#111827", "#65707C", "#4A8A8F", "#75808B"],
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
    appBackground: "#E9EDF1",
    shellBackground: "#FFFFFF",
    heroFallback:
      "radial-gradient(circle at 16% 18%, rgba(255,255,255,0.86), transparent 32%), linear-gradient(135deg, #F8FAFC 0%, #CDD5DE 54%, #8694A3 100%)",
    heroOverlay: "linear-gradient(180deg, rgba(17,24,39,0.04) 0%, rgba(17,24,39,0.22) 48%, rgba(17,24,39,0.58) 100%)",
    text: "#111827",
    muted: "rgba(17,24,39,0.56)",
    cardBackground: "#FFFFFF",
    cardBorder: "rgba(17,24,39,0.08)",
    elevatedBackground: "#F7F8FA",
    iconBackground: "#F4F6F8",
    buttonBackground: "#111827",
    buttonText: "#FFFFFF",
    headingFont: "Inter, ui-sans-serif, system-ui, sans-serif",
    bodyFont: "Inter, ui-sans-serif, system-ui, sans-serif",
    heroTextColor: "#111827",
    heroHeight: "260px",
    heroRadius: "24px",
    menuGap: "10px",
    menuPadding: "18px",
    cardMinHeight: "74px",
    cardPadding: "14px",
    iconRadius: "14px",
    iconShadow: "none",
    sectionDivider: "rgba(17,24,39,0.08)",
    radiusCard: "16px",
    radiusShell: "24px",
    radiusButton: "999px",
    shadowCard: "0 14px 38px rgba(17,24,39,0.075)",
    shadowShell: "0 30px 90px rgba(17,24,39,0.22)"
  }
};
