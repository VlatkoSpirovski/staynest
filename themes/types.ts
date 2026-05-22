export type GuideThemeId = "classic" | "modern" | "darkLuxury" | "mediterranean";

export type GuideTheme = {
  id: GuideThemeId;
  name: string;
  shortName: string;
  atmosphere: string;
  layout: "classic" | "modern" | "darkLuxury" | "mediterranean";
  description: string;
  bestFor: string;
  palette: string[];
  accentOptions: string[];
  defaults: {
    accentColor: string;
    serifHeading: boolean;
    roundedCards: boolean;
  };
  preview: {
    propertyName: string;
    logoText: string;
    eyebrow: string;
    heroBackground: string;
  };
  css: {
    appBackground: string;
    shellBackground: string;
    heroFallback: string;
    heroOverlay: string;
    text: string;
    muted: string;
    cardBackground: string;
    cardBorder: string;
    elevatedBackground: string;
    iconBackground: string;
    buttonBackground: string;
    buttonText: string;
    headingFont: string;
    bodyFont: string;
    heroTextColor: string;
    heroHeight: string;
    heroRadius: string;
    menuGap: string;
    menuPadding: string;
    cardMinHeight: string;
    cardPadding: string;
    iconRadius: string;
    iconShadow: string;
    sectionDivider: string;
    radiusCard: string;
    radiusShell: string;
    radiusButton: string;
    shadowCard: string;
    shadowShell: string;
  };
};

export type GuideThemeOptions = {
  accentColor?: string | null;
  designSerif?: boolean | null;
  designRounded?: boolean | null;
};
