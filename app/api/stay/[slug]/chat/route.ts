import { NextResponse } from "next/server";
import { getGuestMessages } from "@/lib/guest-i18n";
import { getCachedPublicGuideChatContext } from "@/lib/public-guide-cache";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const preferredRegion = "fra1";

type RouteContext = {
  params: {
    slug: string;
  };
};

function textValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function openAiModel() {
  const model = process.env.OPENAI_MODEL?.trim();
  return model && model !== "gpt-5.4-mini" ? model : "gpt-5-mini";
}

function buildPropertyContext(property: NonNullable<Awaited<ReturnType<typeof getCachedPublicGuideChatContext>>>) {
  const recommendations = property.recommendations
    .filter((item) => item.isVisible)
    .map((item) => `${item.customTitle || item.title || item.name} (${item.category}${item.isEssential ? ", essential" : ""}): ${item.customDescription || item.description || ""}${item.formattedAddress || item.address ? ` Address: ${item.formattedAddress || item.address}.` : ""}${item.googleMapsUrl || item.url ? ` Link: ${item.googleMapsUrl || item.url}.` : ""}${item.phoneNumber ? ` Phone: ${item.phoneNumber}.` : ""}`)
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

/** First language tag from Accept-Language, used only as a fallback hint. */
function browserLanguage(request: Request) {
  const header = request.headers.get("accept-language");
  if (!header) return "unknown";
  return header.split(",")[0]?.trim().slice(0, 12) || "unknown";
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
  const body = (await request.json().catch(() => null)) as { message?: unknown } | null;
  const message = textValue(body?.message).slice(0, 600);
  const t = getGuestMessages();

  if (!message) {
    return NextResponse.json({ answer: t.chat.askAnything }, { status: 400 });
  }

  // This endpoint is public and every call costs OpenAI credits, so it is capped
  // three ways: per guest, per property, and globally as a circuit breaker.
  const ip = clientIp(request);
  const [guestLimit, propertyLimit, globalLimit] = await Promise.all([
    rateLimit(`chat:ip:${ip}`, 20, 10 * 60),
    rateLimit(`chat:property:${params.slug}`, 200, 24 * 60 * 60),
    rateLimit("chat:global", 2000, 24 * 60 * 60)
  ]);

  if (!guestLimit.allowed) {
    return NextResponse.json(
      { answer: t.chat.errorNow },
      { status: 429, headers: { "retry-after": String(guestLimit.retryAfterSeconds) } }
    );
  }

  if (!propertyLimit.allowed || !globalLimit.allowed) {
    return NextResponse.json({ answer: t.chat.errorNow }, { status: 429 });
  }

  const property = await getCachedPublicGuideChatContext(params.slug);
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
      max_output_tokens: 220,
      instructions:
        "You are StayNest's guest assistant. Answer only from the provided property context. " +
        "Reply in the same language the guest wrote in; if that is unclear, use the language hinted by the guest's browser, otherwise English. " +
        "Be concise, warm, and practical. If the answer is missing, say you do not have that detail and tell the guest to contact the host. " +
        "Never invent codes, prices, policies, addresses, or emergency instructions.",
      input: [
        {
          role: "user",
          content: `Property context:\n${propertyContext}\n\nGuest browser language hint: ${browserLanguage(request)}\n\nGuest question:\n${message}`
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
