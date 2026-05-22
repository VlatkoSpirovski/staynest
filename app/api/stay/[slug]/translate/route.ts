import { NextResponse } from "next/server";
import { GUEST_LOCALES, type GuestLocale, isGuestLocale } from "@/lib/guest-i18n";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: {
    slug: string;
  };
};

type TranslateRequest = {
  locale?: unknown;
  text?: unknown;
};

function openAiModel() {
  const model = process.env.OPENAI_MODEL?.trim();
  return model && model !== "gpt-5.4-mini" ? model : "gpt-5-mini";
}

function localeName(locale: GuestLocale) {
  return GUEST_LOCALES.find((item) => item.code === locale)?.label || "English";
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

export async function POST(request: Request, { params }: RouteContext) {
  const body = (await request.json().catch(() => null)) as TranslateRequest | null;
  const requestedLocale = typeof body?.locale === "string" ? body.locale : "";
  const locale = isGuestLocale(requestedLocale) ? requestedLocale : "en";
  const sourceText = typeof body?.text === "string" ? body.text.trim().slice(0, 2500) : "";

  if (!sourceText || locale === "en") {
    return NextResponse.json({ text: sourceText });
  }

  const property = await prisma.property.findUnique({
    where: { slug: params.slug },
    select: { id: true }
  });

  if (!property) {
    return NextResponse.json({ text: sourceText }, { status: 404 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ text: sourceText });
  }

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
            `Translate host-provided guest guide text into ${localeName(locale)}. Keep the meaning precise and natural for travelers. Preserve line breaks, phone numbers, Wi-Fi names, passwords, URLs, emails, addresses, brand names and place names. Return only the translated text.`
        },
        {
          role: "user",
          content: sourceText
        }
      ],
      max_output_tokens: 900
    })
  });

  if (!response.ok) {
    return NextResponse.json({ text: sourceText });
  }

  const translated = extractResponseText(await response.json());
  return NextResponse.json({ text: translated || sourceText });
}
