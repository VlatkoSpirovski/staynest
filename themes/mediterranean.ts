import type { GuideTheme } from "./types";

export const mediterraneanTheme: GuideTheme = {
  id: "mediterranean",
  name: "Mediterranean",
  shortName: "Coastal",
  atmosphere: "Airy coastal escape",
  layout: "mediterranean",
  description: "Airy ivory layout with sea-blue and sage accents for a calm coastal guest experience.",
  bestFor: "Sea apartments, Greece/Croatia rentals, vacation stays",
  palette: ["#FBFAF4", "#D8EEF2", "#6FA1AD", "#7B9A7A"],
  accentOptions: ["#43707C", "#4E7A57", "#3D6875", "#5E7A4E"],
  defaults: {
    accentColor: "#43707C",
    serifHeading: true,
    roundedCards: true
  },
  preview: {
    propertyName: "Blue View",
    logoText: "BV",
    eyebrow: "Welcome by the sea",
    heroBackground:
      "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(25,70,85,0.54)), radial-gradient(circle at 78% 16%, rgba(255,255,255,0.78), transparent 26%), linear-gradient(145deg, #CBEAF0 0%, #7FB2BF 48%, #F6F1E8 100%)"
  },
  css: {
    appBackground:
      "radial-gradient(circle at 72% -6%, rgba(255,255,255,0.78), transparent 26%), linear-gradient(145deg, #DDEFF0 0%, #EEF5EF 48%, #F6ECD8 100%)",
    shellBackground:
      "radial-gradient(circle at 80% 0%, rgba(216,238,242,0.58), transparent 28%), linear-gradient(180deg, #FFFCF5 0%, #F3F8F5 100%)",
    heroFallback:
      "radial-gradient(circle at 80% 12%, rgba(255,255,255,0.82), transparent 30%), linear-gradient(145deg, #CBEAF0 0%, #7FB2BF 46%, #F3EBDD 100%)",
    heroOverlay:
      "radial-gradient(circle at 82% 8%, rgba(255,255,255,0.24), transparent 26%), linear-gradient(180deg, rgba(20,68,84,0.06) 0%, rgba(20,68,84,0.38) 42%, rgba(20,68,84,0.78) 100%)",
    text: "#18313A",
    muted: "rgba(24,49,58,0.68)",
    cardBackground: "linear-gradient(145deg, rgba(255,255,255,0.82) 0%, rgba(239,248,247,0.70) 100%)",
    cardBorder: "rgba(111,161,173,0.18)",
    elevatedBackground: "linear-gradient(145deg, #FFFFFF 0%, #F3FAF8 100%)",
    iconBackground: "linear-gradient(145deg, #FFFFFF 0%, #E7F4F3 100%)",
    accentSoft: "rgba(111,161,173,0.14)",
    cardInsetShadow: "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -18px 36px rgba(111,161,173,0.045)",
    cardHoverShadow: "0 24px 64px rgba(64,99,112,0.16)",
    cardBackdrop: "blur(18px)",
    heroImageFilter: "saturate(0.96) contrast(1.02) brightness(1.06)",
    languageBackground: "rgba(255,255,255,0.34)",
    languageText: "#FFFFFF",
    buttonBackground: "#18313A",
    buttonText: "#FFFFFF",
    headingFont: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
    bodyFont: "Inter, ui-sans-serif, system-ui, sans-serif",
    heroTextColor: "#FFFFFF",
    heroHeight: "356px",
    heroRadius: "34px",
    menuGap: "16px",
    menuPadding: "24px",
    cardMinHeight: "154px",
    cardPadding: "24px 16px",
    iconRadius: "24px",
    iconShadow: "0 14px 34px rgba(64,99,112,0.12), inset 0 1px 0 rgba(255,255,255,0.92)",
    sectionDivider: "rgba(111,161,173,0.14)",
    radiusCard: "28px",
    radiusShell: "34px",
    radiusButton: "999px",
    shadowCard: "0 18px 54px rgba(64,99,112,0.12)",
    shadowShell: "0 34px 112px rgba(64,99,112,0.26)"
  }
};
