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
    appBackground:
      "radial-gradient(circle at 70% -8%, rgba(214,175,111,0.14), transparent 28%), linear-gradient(145deg, #010306 0%, #050B10 48%, #0B1218 100%)",
    shellBackground:
      "radial-gradient(circle at 72% 0%, rgba(214,175,111,0.12), transparent 28%), linear-gradient(180deg, #0D151D 0%, #070B10 100%)",
    heroFallback:
      "radial-gradient(circle at 70% 24%, rgba(201,154,78,0.30), transparent 30%), linear-gradient(145deg, #17212A 0%, #090E13 56%, #020405 100%)",
    heroOverlay:
      "radial-gradient(circle at 70% 18%, rgba(214,175,111,0.18), transparent 28%), linear-gradient(180deg, rgba(2,5,8,0.14) 0%, rgba(2,5,8,0.54) 44%, rgba(2,5,8,0.96) 100%)",
    text: "#F7F0E2",
    muted: "rgba(247,240,226,0.66)",
    cardBackground: "linear-gradient(145deg, rgba(22,33,43,0.88) 0%, rgba(9,14,20,0.82) 100%)",
    cardBorder: "rgba(214,175,111,0.26)",
    elevatedBackground: "linear-gradient(145deg, rgba(27,39,49,0.94), rgba(10,15,21,0.92))",
    iconBackground: "radial-gradient(circle at 34% 20%, rgba(214,175,111,0.32), rgba(214,175,111,0.10) 60%, rgba(255,255,255,0.04) 100%)",
    accentSoft: "rgba(214,175,111,0.16)",
    cardInsetShadow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -22px 42px rgba(0,0,0,0.22)",
    cardHoverShadow: "0 0 0 1px rgba(214,175,111,0.24), 0 28px 78px rgba(0,0,0,0.52), 0 0 46px rgba(214,175,111,0.10)",
    cardBackdrop: "blur(22px)",
    heroImageFilter: "saturate(0.82) contrast(1.16) brightness(0.82)",
    languageBackground: "rgba(255,255,255,0.08)",
    languageText: "#F7F0E2",
    buttonBackground: "#D6AF6F",
    buttonText: "#0B1218",
    headingFont: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
    bodyFont: "Inter, ui-sans-serif, system-ui, sans-serif",
    heroTextColor: "#F7F0E2",
    heroHeight: "428px",
    heroRadius: "0px",
    menuGap: "14px",
    menuPadding: "20px",
    cardMinHeight: "166px",
    cardPadding: "22px 15px",
    iconRadius: "20px",
    iconShadow: "0 0 34px rgba(214,175,111,0.22), inset 0 1px 0 rgba(255,255,255,0.10)",
    sectionDivider: "rgba(214,175,111,0.16)",
    radiusCard: "24px",
    radiusShell: "34px",
    radiusButton: "999px",
    shadowCard: "0 22px 62px rgba(0,0,0,0.42), 0 0 30px rgba(214,175,111,0.055)",
    shadowShell: "0 42px 128px rgba(0,0,0,0.62)"
  }
};
