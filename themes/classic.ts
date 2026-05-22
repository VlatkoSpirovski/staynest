import type { GuideTheme } from "./types";

export const classicTheme: GuideTheme = {
  id: "classic",
  name: "Classic",
  shortName: "Classic",
  atmosphere: "Warm mountain villa",
  layout: "classic",
  description: "Warm boutique-hotel styling with ivory surfaces, cinematic imagery and soft hospitality details.",
  bestFor: "Villas, mountain stays, boutique rentals",
  palette: ["#F7EFE3", "#FFFFFF", "#9B7C4B", "#2A2B28"],
  accentOptions: ["#9B7C4B", "#B08B57", "#7C8A5A", "#5F7D78"],
  defaults: {
    accentColor: "#9B7C4B",
    serifHeading: true,
    roundedCards: true
  },
  preview: {
    propertyName: "Villa Aurora",
    logoText: "VA",
    eyebrow: "Good afternoon",
    heroBackground:
      "linear-gradient(160deg, rgba(39,35,28,0.18), rgba(39,35,28,0.82)), radial-gradient(circle at 72% 18%, rgba(255,240,210,0.34), transparent 34%), linear-gradient(135deg, #D1B890 0%, #7C6A55 46%, #28302E 100%)"
  },
  css: {
    appBackground: "#2F302E",
    shellBackground: "#F4E9D9",
    heroFallback:
      "radial-gradient(circle at 70% 20%, rgba(255,242,213,0.34), transparent 30%), linear-gradient(145deg, #D6BE96 0%, #776751 48%, #26312F 100%)",
    heroOverlay: "linear-gradient(180deg, rgba(17,24,39,0.20) 0%, rgba(17,24,39,0.50) 48%, rgba(17,24,39,0.84) 100%)",
    text: "#1F2326",
    muted: "rgba(31,35,38,0.62)",
    cardBackground: "rgba(255,249,239,0.78)",
    cardBorder: "rgba(255,255,255,0.68)",
    elevatedBackground: "#FFFFFF",
    iconBackground: "#FFFFFF",
    buttonBackground: "#1F2326",
    buttonText: "#FFFFFF",
    headingFont: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
    bodyFont: "Inter, ui-sans-serif, system-ui, sans-serif",
    heroTextColor: "#FFFFFF",
    heroHeight: "430px",
    heroRadius: "0px",
    menuGap: "12px",
    menuPadding: "20px",
    cardMinHeight: "176px",
    cardPadding: "24px 16px",
    iconRadius: "999px",
    iconShadow: "0 8px 20px rgba(76,55,37,0.12)",
    sectionDivider: "rgba(76,55,37,0.10)",
    radiusCard: "20px",
    radiusShell: "28px",
    radiusButton: "999px",
    shadowCard: "0 16px 42px rgba(76,55,37,0.10)",
    shadowShell: "0 32px 100px rgba(17,24,39,0.32)"
  }
};
