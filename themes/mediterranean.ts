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
  accentOptions: ["#6FA1AD", "#7B9A7A", "#4F8793", "#8AA88A"],
  defaults: {
    accentColor: "#6FA1AD",
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
    appBackground: "#EAF3F1",
    shellBackground: "#FBFAF4",
    heroFallback:
      "radial-gradient(circle at 80% 12%, rgba(255,255,255,0.82), transparent 30%), linear-gradient(145deg, #CBEAF0 0%, #7FB2BF 46%, #F3EBDD 100%)",
    heroOverlay: "linear-gradient(180deg, rgba(20,68,84,0.04) 0%, rgba(20,68,84,0.26) 46%, rgba(20,68,84,0.62) 100%)",
    text: "#18313A",
    muted: "rgba(24,49,58,0.60)",
    cardBackground: "rgba(255,255,255,0.72)",
    cardBorder: "rgba(111,161,173,0.16)",
    elevatedBackground: "#FFFFFF",
    iconBackground: "#F7FBFA",
    buttonBackground: "#18313A",
    buttonText: "#FFFFFF",
    headingFont: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
    bodyFont: "Inter, ui-sans-serif, system-ui, sans-serif",
    heroTextColor: "#FFFFFF",
    heroHeight: "340px",
    heroRadius: "28px",
    menuGap: "14px",
    menuPadding: "22px",
    cardMinHeight: "148px",
    cardPadding: "22px 15px",
    iconRadius: "22px",
    iconShadow: "0 12px 28px rgba(64,99,112,0.10)",
    sectionDivider: "rgba(111,161,173,0.14)",
    radiusCard: "22px",
    radiusShell: "30px",
    radiusButton: "999px",
    shadowCard: "0 16px 44px rgba(64,99,112,0.10)",
    shadowShell: "0 32px 104px rgba(64,99,112,0.26)"
  }
};
