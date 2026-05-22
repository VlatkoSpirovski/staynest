"use client";

import { useEffect, useMemo, useState } from "react";
import { useGuestLanguage } from "@/components/guest-language";

type TranslatedTextProps = {
  slug: string;
  text?: string | null;
  fallback?: string;
  className?: string;
};

function cacheKey(slug: string, locale: string, text: string) {
  return `staynest-translation:${slug}:${locale}:${encodeURIComponent(text).slice(0, 900)}`;
}

export function TranslatedText({ slug, text, fallback = "", className }: TranslatedTextProps) {
  const { locale } = useGuestLanguage();
  const sourceText = text?.trim() || fallback;
  const [translated, setTranslated] = useState(sourceText);

  const key = useMemo(() => cacheKey(slug, locale, sourceText), [locale, slug, sourceText]);

  useEffect(() => {
    let mounted = true;

    if (!sourceText || locale === "en") {
      setTranslated(sourceText);
      return () => {
        mounted = false;
      };
    }

    const cached = window.sessionStorage.getItem(key);
    if (cached) {
      setTranslated(cached);
      return () => {
        mounted = false;
      };
    }

    setTranslated(sourceText);

    fetch(`/api/stay/${slug}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ locale, text: sourceText })
    })
      .then(async (response) => {
        const data = (await response.json().catch(() => ({}))) as { text?: string };
        return data.text || sourceText;
      })
      .then((nextText) => {
        if (!mounted) return;
        window.sessionStorage.setItem(key, nextText);
        setTranslated(nextText);
      })
      .catch(() => {
        if (mounted) setTranslated(sourceText);
      });

    return () => {
      mounted = false;
    };
  }, [key, locale, slug, sourceText]);

  return <span className={className}>{translated}</span>;
}
