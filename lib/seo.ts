import type { Metadata } from "next";

export type SeoLocale = "en" | "de" | "it";

export const LOCALIZED_HOME: Record<SeoLocale, string> = { en: "/", de: "/de", it: "/it" };

const OG_LOCALE: Record<SeoLocale, string> = { en: "en_US", de: "de_DE", it: "it_IT" };

export function pageMetadata({
  title,
  description,
  path,
  locale = "en",
  languages,
  absoluteTitle = false,
  keywords
}: {
  title: string;
  description: string;
  path: string;
  locale?: SeoLocale;
  languages?: Partial<Record<SeoLocale | "x-default", string>>;
  absoluteTitle?: boolean;
  keywords?: string[];
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} · StayNest`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: {
      canonical: path,
      languages
    },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: "StayNest",
      locale: OG_LOCALE[locale],
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description
    }
  };
}

export const HOME_LANGUAGES = { en: "/", de: "/de", it: "/it", "x-default": "/" } as const;
