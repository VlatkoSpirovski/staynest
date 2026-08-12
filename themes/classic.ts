import type { GuideTheme } from "./types";

export const classicTheme: GuideTheme = {
  id: "classic",
  name: "Classic",
  shortName: "Classic",
  atmosphere: "Warm mountain villa",
  layout: "classic",
  description: "Warm boutique-hotel styling with champagne surfaces, cinematic imagery and soft hospitality details.",
  bestFor: "Villas, mountain stays, boutique rentals",
  palette: ["#F7EFE3", "#FFFFFF", "#9B7C4B", "#2A2B28"],
  accentOptions: ["#8A6C3E", "#8A6C45", "#69754D", "#57736E"],
  defaults: {
    accentColor: "#8A6C3E",
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
    appBackground:
      "radial-gradient(circle at 50% -8%, rgba(255,239,208,0.18), transparent 32%), linear-gradient(145deg, #3B332A 0%, #252722 58%, #171A17 100%)",
    shellBackground:
      "radial-gradient(circle at 18% 0%, rgba(255,255,255,0.78), transparent 28%), radial-gradient(circle at 84% 20%, rgba(224,190,133,0.18), transparent 26%), linear-gradient(180deg, #F8F0E2 0%, #EFE1CD 100%)",
    heroFallback:
      "radial-gradient(circle at 68% 14%, rgba(255,238,204,0.38), transparent 30%), linear-gradient(145deg, #D8BE91 0%, #7B6A51 48%, #26312F 100%)",
    heroOverlay:
      "radial-gradient(circle at 50% 18%, rgba(255,232,190,0.14), transparent 30%), linear-gradient(180deg, rgba(32,27,22,0.18) 0%, rgba(32,27,22,0.48) 46%, rgba(24,22,19,0.88) 100%)",
    text: "#1F2326",
    muted: "rgba(31,35,38,0.66)",
    cardBackground: "linear-gradient(145deg, rgba(255,250,241,0.86) 0%, rgba(239,224,201,0.70) 100%)",
    cardBorder: "rgba(255,255,255,0.74)",
    elevatedBackground: "linear-gradient(145deg, #FFFFFF 0%, #F8EFE1 100%)",
    iconBackground: "linear-gradient(145deg, #FFFFFF 0%, #FFF3DC 100%)",
    accentSoft: "rgba(155,124,75,0.14)",
    cardInsetShadow: "inset 0 1px 0 rgba(255,255,255,0.92), inset 0 -18px 38px rgba(155,124,75,0.045)",
    cardHoverShadow: "0 24px 62px rgba(76,55,37,0.18)",
    cardBackdrop: "blur(18px)",
    heroImageFilter: "saturate(0.96) contrast(1.04) sepia(0.06)",
    languageBackground: "rgba(255,248,236,0.22)",
    languageText: "#FFFFFF",
    buttonBackground: "#1F2326",
    buttonText: "#FFFFFF",
    headingFont: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
    bodyFont: "Inter, ui-sans-serif, system-ui, sans-serif",
    heroTextColor: "#FFFFFF",
    heroHeight: "440px",
    heroRadius: "32px",
    menuGap: "14px",
    menuPadding: "22px",
    cardMinHeight: "184px",
    cardPadding: "26px 16px",
    iconRadius: "999px",
    iconShadow: "0 14px 34px rgba(155,124,75,0.16), inset 0 1px 0 rgba(255,255,255,0.92)",
    sectionDivider: "rgba(76,55,37,0.10)",
    radiusCard: "28px",
    radiusShell: "34px",
    radiusButton: "999px",
    shadowCard: "0 18px 54px rgba(76,55,37,0.13)",
    shadowShell: "0 34px 110px rgba(17,24,39,0.34)"
  }
};
