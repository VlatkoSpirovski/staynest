import "server-only";

import { GUEST_LOCALES, type GuestLocale, isGuestLocale } from "@/lib/guest-i18n";

export type PropertyTranslation = {
  welcomeMessage?: string;
  checkInInfo?: string;
  checkOutInfo?: string;
  parkingInfo?: string;
  houseRules?: string;
  emergencyInfo?: string;
  aiKnowledge?: string;
};

export type GuideSectionTranslation = {
  content?: string;
};

export type RecommendationTranslation = {
  category?: string;
  description?: string;
};

export type TranslationMap<T> = Partial<Record<GuestLocale, T>>;

const defaultTranslationLocales: GuestLocale[] = ["en"];

export function selectedTranslationLocales(formData: FormData) {
  const values = formData.getAll("translationLocales").filter((value): value is string => typeof value === "string");
  const locales = values.filter((value): value is GuestLocale => isGuestLocale(value));
  return Array.from(new Set<GuestLocale>(["en", ...locales]));
}

export function validTranslationLocales(values: unknown): GuestLocale[] {
  if (!Array.isArray(values)) return defaultTranslationLocales;
  const locales = values.filter((value): value is GuestLocale => typeof value === "string" && isGuestLocale(value));
  return Array.from(new Set<GuestLocale>(["en", ...locales]));
}

export function translatableGuestLocales(locales: GuestLocale[]) {
  return locales.filter((locale) => locale !== "en");
}

export function guestLocaleName(locale: GuestLocale) {
  return GUEST_LOCALES.find((item) => item.code === locale)?.label || "English";
}

function openAiModel() {
  const model = process.env.OPENAI_MODEL?.trim();
  return model && model !== "gpt-5.4-mini" ? model : "gpt-5-mini";
}

function extractResponseText(data: unknown) {
  if (!data || typeof data !== "object") return "";
  if ("output_text" in data && typeof data.output_text === "string") return data.output_text;

  const output = "output" in data ? data.output : null;
  if (!Array.isArray(output)) return "";

  return output
    .flatMap((item) => {
      if (!item || typeof item !== "object" || !("content" in item) || !Array.isArray(item.content)) return [];
      return item.content.map((content: unknown) => {
        if (!content || typeof content !== "object") return "";
        if ("text" in content && typeof content.text === "string") return content.text;
        return "";
      });
    })
    .filter(Boolean)
    .join("\n")
    .trim();
}

function parseJsonObject(text: string) {
  const json = text.match(/\{[\s\S]*\}/)?.[0] || text;
  return JSON.parse(json) as Record<string, string | null>;
}

export async function translateFields<T extends Record<string, string | null | undefined>>(fields: T, locale: GuestLocale) {
  const entries = Object.entries(fields).filter(([, value]) => typeof value === "string" && value.trim().length > 0);
  if (locale === "en" || entries.length === 0) return {};

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return {};

  const source = Object.fromEntries(entries.map(([key, value]) => [key, value]));
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: openAiModel(),
      input: [
        {
          role: "system",
          content:
            `Translate this JSON object into ${guestLocaleName(locale)} for a premium rental guest guide. Preserve JSON keys exactly. Translate values only. Keep Wi-Fi names, passwords, URLs, emails, phone numbers, addresses, brand names and property/place names unchanged. Return only valid JSON.`
        },
        {
          role: "user",
          content: JSON.stringify(source)
        }
      ],
      text: {
        format: {
          type: "json_object"
        }
      },
      max_output_tokens: 1200
    })
  });

  if (!response.ok) return {};

  try {
    return parseJsonObject(extractResponseText(await response.json()));
  } catch {
    return {};
  }
}

export async function buildTranslationMap<T extends Record<string, string | null | undefined>>(fields: T, locales: GuestLocale[]) {
  const translations: TranslationMap<Record<string, string | null>> = {};

  for (const locale of translatableGuestLocales(locales)) {
    const translated = await translateFields(fields, locale);
    if (Object.keys(translated).length > 0) {
      translations[locale] = translated;
    }
  }

  return translations;
}
