import { NextResponse } from "next/server";
import { GUEST_LOCALES, type GuestLocale, getGuestMessages, isGuestLocale } from "@/lib/guest-i18n";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    slug: string;
  };
};

function textValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function localeName(locale: GuestLocale) {
  return GUEST_LOCALES.find((item) => item.code === locale)?.label || "English";
}

function openAiModel() {
  const model = process.env.OPENAI_MODEL?.trim();
  return model && model !== "gpt-5.4-mini" ? model : "gpt-5-mini";
}

function buildPropertyContext(property: NonNullable<Awaited<ReturnType<typeof getPropertyForChat>>>) {
  const recommendations = property.recommendations
    .map((item) => `${item.title} (${item.category}): ${item.description}${item.address ? ` Address: ${item.address}.` : ""}${item.url ? ` Link: ${item.url}.` : ""}`)
    .join("\n");

  const guideSections = property.guideSections.map((section) => `${section.title}: ${section.content}`).join("\n");
  const reviews = property.reviewLinks.map((link) => `${link.platform}: ${link.url}`).join("\n");

  return `
Property: ${property.name}
Welcome: ${property.welcomeMessage}
Wi-Fi network: ${property.wifiName || "Not provided"}
Wi-Fi password: ${property.wifiPassword || "Not provided"}
Check-in: ${property.checkInInfo || "Not provided"}
Check-out: ${property.checkOutInfo || "Not provided"}
Parking: ${property.parkingInfo || "Not provided"}
House rules: ${property.houseRules || "Not provided"}
Emergency: ${property.emergencyInfo || "Not provided"}
Host contact: ${property.hostContactName || "Host"} ${property.hostPhone || ""} ${property.hostEmail || ""}

Extra assistant knowledge:
${property.aiKnowledge || "None"}

Guide sections:
${guideSections || "None"}

Recommendations:
${recommendations || "None"}

Review links:
${reviews || "None"}
`.trim();
}

async function getPropertyForChat(slug: string) {
  return prisma.property.findUnique({
    where: { slug },
    include: {
      guideSections: { orderBy: { sortOrder: "asc" } },
      recommendations: { orderBy: { sortOrder: "asc" } },
      reviewLinks: true
    }
  });
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
  const body = (await request.json().catch(() => null)) as { message?: unknown; locale?: unknown } | null;
  const message = textValue(body?.message).slice(0, 600);
  const requestedLocale = textValue(body?.locale);
  const locale = isGuestLocale(requestedLocale) ? requestedLocale : "en";
  const t = getGuestMessages(locale);

  if (!message) {
    return NextResponse.json({ answer: t.chat.askAnything }, { status: 400 });
  }

  const property = await getPropertyForChat(params.slug);
  if (!property) {
    return NextResponse.json({ answer: t.chat.errorAnswer }, { status: 404 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      answer: t.chat.errorNow
    });
  }

  const propertyContext = buildPropertyContext(property);
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: openAiModel(),
      instructions:
        `You are StayNest's guest assistant. Answer only from the provided property context. Reply in ${localeName(locale)}. Be concise, warm, and practical. If the answer is missing, say you do not have that detail and tell the guest to contact the host. Never invent codes, prices, policies, addresses, or emergency instructions.`,
      input: [
        {
          role: "user",
          content: `Property context:\n${propertyContext}\n\nGuest question:\n${message}`
        }
      ]
    })
  });

  if (!response.ok) {
    return NextResponse.json({
      answer: t.chat.errorNow
    });
  }

  const data = await response.json();
  const answer = extractResponseText(data) || t.chat.errorAnswer;

  return NextResponse.json({ answer });
}
