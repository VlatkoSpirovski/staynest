import { classicTheme } from "./classic";
import { darkLuxuryTheme } from "./darkLuxury";
import { mediterraneanTheme } from "./mediterranean";
import { modernTheme } from "./modern";
import type { GuideTheme, GuideThemeId, GuideThemeOptions } from "./types";

export type { GuideTheme, GuideThemeId, GuideThemeOptions } from "./types";

export const guideThemes: GuideTheme[] = [classicTheme, modernTheme, darkLuxuryTheme, mediterraneanTheme];

export function isGuideThemeId(value: unknown): value is GuideThemeId {
  return typeof value === "string" && guideThemes.some((theme) => theme.id === value);
}

export function getGuideTheme(value: unknown): GuideTheme {
  return guideThemes.find((theme) => theme.id === value) || classicTheme;
}

export function curatedAccentForTheme(theme: GuideTheme, accentColor?: string | null) {
  return accentColor && theme.accentOptions.includes(accentColor) ? accentColor : theme.defaults.accentColor;
}

export function guideThemeStyle(themeOrId: GuideTheme | GuideThemeId | string | null | undefined, options: GuideThemeOptions = {}) {
  const theme = typeof themeOrId === "object" && themeOrId ? themeOrId : getGuideTheme(themeOrId);
  const accent = curatedAccentForTheme(theme, options.accentColor);
  const rounded = options.designRounded ?? theme.defaults.roundedCards;
  const serif = options.designSerif ?? theme.defaults.serifHeading;
  const headingFont = serif ? theme.css.headingFont : theme.css.bodyFont;

  return {
    "--accent": accent,
    "--guide-accent": accent,
    "--guide-app-bg": theme.css.appBackground,
    "--guide-shell-bg": theme.css.shellBackground,
    "--guide-hero-fallback": theme.css.heroFallback,
    "--guide-hero-overlay": theme.css.heroOverlay,
    "--guide-text": theme.css.text,
    "--guide-muted": theme.css.muted,
    "--guide-card-bg": theme.css.cardBackground,
    "--guide-card-border": theme.css.cardBorder,
    "--guide-elevated-bg": theme.css.elevatedBackground,
    "--guide-icon-bg": theme.css.iconBackground,
    "--guide-button-bg": theme.css.buttonBackground,
    "--guide-button-text": theme.css.buttonText,
    "--guide-heading-font": headingFont,
    "--guide-body-font": theme.css.bodyFont,
    "--guide-hero-text": theme.css.heroTextColor,
    "--guide-language-bg": theme.layout === "modern" ? "#FFFFFF" : "rgba(255,255,255,0.16)",
    "--guide-language-text": theme.layout === "modern" ? theme.css.text : theme.css.heroTextColor,
    "--guide-language-icon-bg": theme.layout === "darkLuxury" ? "rgba(214,175,111,0.14)" : "#FFFFFF",
    "--guide-language-icon-text": theme.layout === "darkLuxury" ? accent : theme.css.text,
    "--guide-hero-height": theme.css.heroHeight,
    "--guide-hero-radius": theme.css.heroRadius,
    "--guide-menu-gap": theme.css.menuGap,
    "--guide-menu-padding": theme.css.menuPadding,
    "--guide-card-min-height": theme.css.cardMinHeight,
    "--guide-card-padding": theme.css.cardPadding,
    "--guide-icon-radius": theme.css.iconRadius,
    "--guide-icon-shadow": theme.css.iconShadow,
    "--guide-section-divider": theme.css.sectionDivider,
    "--guide-card-radius": rounded ? theme.css.radiusCard : "14px",
    "--guide-shell-radius": rounded ? theme.css.radiusShell : "20px",
    "--guide-button-radius": rounded ? theme.css.radiusButton : "14px",
    "--guide-card-shadow": theme.css.shadowCard,
    "--guide-shell-shadow": theme.css.shadowShell
  };
}
