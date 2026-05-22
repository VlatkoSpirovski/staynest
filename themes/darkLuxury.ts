import type { GuideTheme } from "./types";

export const darkLuxuryTheme: GuideTheme = {
  id: "darkLuxury",
  name: "Dark Luxury",
  shortName: "Dark",
  atmosphere: "Private hotel after dark",
  layout: "darkLuxury",
  description: "Cinematic charcoal surfaces with gold accents and a premium hotel-after-dark atmosphere.",
  bestFor: "Luxury stays, jacuzzis, cabins, premium apartments",
  palette: ["#0B1218", "#141C24", "#C99A4E", "#F3E5C8"],
  accentOptions: ["#C99A4E", "#D6AF6F", "#B88A44", "#D1C0A0"],
  defaults: {
    accentColor: "#C99A4E",
    serifHeading: true,
    roundedCards: true
  },
  preview: {
    propertyName: "Villa Yeti",
    logoText: "VY",
    eyebrow: "Private retreat",
    heroBackground:
      "linear-gradient(180deg, rgba(3,7,10,0.10), rgba(3,7,10,0.90)), radial-gradient(circle at 64% 24%, rgba(201,154,78,0.34), transparent 28%), linear-gradient(145deg, #17212A 0%, #090E13 54%, #010306 100%)"
  },
  css: {
    appBackground: "#05080B",
    shellBackground: "#0B1218",
    heroFallback:
      "radial-gradient(circle at 70% 24%, rgba(201,154,78,0.30), transparent 30%), linear-gradient(145deg, #17212A 0%, #090E13 56%, #020405 100%)",
    heroOverlay: "linear-gradient(180deg, rgba(2,5,8,0.12) 0%, rgba(2,5,8,0.46) 42%, rgba(2,5,8,0.92) 100%)",
    text: "#F7F0E2",
    muted: "rgba(247,240,226,0.66)",
    cardBackground: "rgba(16,25,32,0.86)",
    cardBorder: "rgba(214,175,111,0.22)",
    elevatedBackground: "#101922",
    iconBackground: "rgba(214,175,111,0.10)",
    buttonBackground: "#D6AF6F",
    buttonText: "#0B1218",
    headingFont: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
    bodyFont: "Inter, ui-sans-serif, system-ui, sans-serif",
    heroTextColor: "#F7F0E2",
    heroHeight: "408px",
    heroRadius: "0px",
    menuGap: "12px",
    menuPadding: "18px",
    cardMinHeight: "156px",
    cardPadding: "20px 14px",
    iconRadius: "18px",
    iconShadow: "0 0 30px rgba(214,175,111,0.18)",
    sectionDivider: "rgba(214,175,111,0.16)",
    radiusCard: "18px",
    radiusShell: "28px",
    radiusButton: "999px",
    shadowCard: "0 18px 48px rgba(0,0,0,0.34)",
    shadowShell: "0 36px 118px rgba(0,0,0,0.54)"
  }
};
