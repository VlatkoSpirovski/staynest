export function fallbackErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function openAiModel() {
  const model = process.env.OPENAI_MODEL?.trim();
  return model && model !== "gpt-5.4-mini" ? model : "gpt-5-mini";
}

export async function openAiErrorMessage(response: Response) {
  const body = (await response.json().catch(() => null)) as { error?: { message?: string; code?: string; type?: string } } | null;
  const message = body?.error?.message || `${response.status} ${response.statusText}`;
  if (/billing|quota|credit|insufficient/i.test(message)) {
    return "AI import is unavailable because the OpenAI project needs billing or quota attention. Add credits or update OPENAI_API_KEY, then try again.";
  }

  if (/model|unsupported|not found|does not exist/i.test(message)) {
    return `OpenAI model "${openAiModel()}" is unavailable for this API key. Set OPENAI_MODEL to a Responses API model available to the project.`;
  }

  return `OpenAI error: ${message}`;
}

export function isPrivateHostname(hostname: string) {
  const host = hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost")) return true;
  if (host === "::1" || host.startsWith("fc") || host.startsWith("fd") || host.startsWith("fe80:")) return true;
  if (/^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  if (/^169\.254\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  return false;
}

export function trimmedString(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : undefined;
}

export function extractResponseText(data: unknown) {
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

function decodeHtml(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/\s+/g, " ")
    .trim();
}

function metaContent(html: string, attribute: "name" | "property", value: string) {
  const tag = html.match(new RegExp(`<meta[^>]+${attribute}=["']${value}["'][^>]*>`, "i"))?.[0];
  return decodeHtml(tag?.match(/content=["']([^"']+)["']/i)?.[1] || "");
}

function allMetaContent(html: string) {
  const wanted = [
    ["property", "og:title"],
    ["property", "og:description"],
    ["property", "og:image"],
    ["property", "og:site_name"],
    ["property", "og:locale"],
    ["name", "description"],
    ["name", "twitter:title"],
    ["name", "twitter:description"],
    ["name", "twitter:image"],
    ["name", "keywords"]
  ] as const;

  return wanted
    .map(([attribute, value]) => {
      const content = metaContent(html, attribute, value);
      return content ? `${value}: ${content}` : "";
    })
    .filter(Boolean)
    .join("\n");
}

function imageCandidates(html: string, pageUrl: string) {
  const urls = [
    ...[...html.matchAll(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/gi)].map((match) => match[1]),
    ...[...html.matchAll(/<img[^>]+(?:src|data-src|data-original|data-lazy-src)=["']([^"']+)["'][^>]*>/gi)].map((match) => match[1])
  ];

  return Array.from(new Set(urls))
    .map((src) => {
      try {
        return new URL(decodeHtml(src), pageUrl).toString();
      } catch {
        return "";
      }
    })
    .filter((src) => /^https?:\/\//i.test(src))
    .filter((src) => !/sprite|icon|logo|avatar|placeholder|blank|transparent/i.test(src))
    .slice(0, 12)
    .join("\n");
}

export function cleanPageText(html: string, pageUrl: string) {
  const jsonLd = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1]?.trim())
    .filter(Boolean)
    .join("\n");

  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "";
  const visibleText = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");

  return `
Page URL: ${pageUrl}
Title: ${decodeHtml(title)}

Metadata:
${allMetaContent(html)}

Image candidates:
${imageCandidates(html, pageUrl)}

JSON-LD:
${jsonLd}

Visible listing text:
${decodeHtml(visibleText)}
`.slice(0, 28000);
}

export function titleFromListingUrl(url: URL | null) {
  if (!url) return "Imported Property";
  const lastPathPart = url.pathname
    .split("/")
    .filter(Boolean)
    .pop()
    ?.replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (lastPathPart || "Imported Property")
    .replace(/airbnb|booking|agoda|expedia|vrbo|hostelworld/gi, "")
    .trim()
    .slice(0, 120);
}

export function isThinOrBlockedText(text: string) {
  const compactText = text.toLowerCase();
  return (
    text.replace(/\s+/g, " ").trim().length < 700 ||
    /captcha|access denied|enable javascript|are you a robot|sign in to continue|cookie settings|unusual traffic/i.test(compactText) ||
    compactText.includes("enable javascript") ||
    compactText.includes("verify you are human") ||
    compactText.includes("security check") ||
    compactText.includes("checking your browser") ||
    compactText.includes("cloudflare") ||
    compactText.includes("incapsula") ||
    compactText.includes("bot protection") ||
    compactText.includes("captcha")
  );
}

export type ImportedListing = {
  name?: string;
  welcomeMessage?: string;
  houseRules?: string;
  parkingInfo?: string;
  checkInInfo?: string;
  checkOutInfo?: string;
  facilities?: string;
  coverImageUrl?: string;
  aiKnowledge?: string;
  emergencyInfo?: string;
  hostContactName?: string;
  locationInfo?: string;
  recommendationsDraft?: string;
  essentialsDraft?: string;
};

const nullableString = {
  anyOf: [{ type: "string" }, { type: "null" }]
};

export const importListingJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "name",
    "welcomeMessage",
    "coverImageUrl",
    "checkInInfo",
    "checkOutInfo",
    "parkingInfo",
    "houseRules",
    "facilities",
    "emergencyInfo",
    "hostContactName",
    "aiKnowledge",
    "locationInfo",
    "recommendationsDraft",
    "essentialsDraft"
  ],
  properties: {
    name: nullableString,
    welcomeMessage: nullableString,
    coverImageUrl: nullableString,
    checkInInfo: nullableString,
    checkOutInfo: nullableString,
    parkingInfo: nullableString,
    houseRules: nullableString,
    facilities: nullableString,
    emergencyInfo: nullableString,
    hostContactName: nullableString,
    aiKnowledge: nullableString,
    locationInfo: nullableString,
    recommendationsDraft: nullableString,
    essentialsDraft: nullableString
  }
};

export function parsedImportedListing(text: string): ImportedListing {
  const json = text.match(/\{[\s\S]*\}/)?.[0] || text;
  const parsed = JSON.parse(json) as ImportedListing;
  if (!parsed || typeof parsed !== "object") return {};
  return {
    name: trimmedString(parsed.name, 120),
    welcomeMessage: trimmedString(parsed.welcomeMessage, 500),
    houseRules: trimmedString(parsed.houseRules, 1000),
    parkingInfo: trimmedString(parsed.parkingInfo, 500),
    checkInInfo: trimmedString(parsed.checkInInfo, 500),
    checkOutInfo: trimmedString(parsed.checkOutInfo, 500),
    facilities: trimmedString(parsed.facilities, 2000),
    coverImageUrl: trimmedString(parsed.coverImageUrl, 1000),
    aiKnowledge: trimmedString(parsed.aiKnowledge, 2500),
    emergencyInfo: trimmedString(parsed.emergencyInfo, 1000),
    hostContactName: trimmedString(parsed.hostContactName, 120),
    locationInfo: trimmedString(parsed.locationInfo, 1200),
    recommendationsDraft: trimmedString(parsed.recommendationsDraft, 1600),
    essentialsDraft: trimmedString(parsed.essentialsDraft, 1600)
  };
}

export function hasUsableImport(imported: ImportedListing) {
  return Boolean(imported.name || imported.welcomeMessage || imported.houseRules || imported.parkingInfo || imported.facilities || imported.coverImageUrl);
}

export function fallbackImportedListing(url: URL | null): ImportedListing {
  const name = titleFromListingUrl(url);
  return {
    name,
    welcomeMessage: `Welcome to ${name}. This guide was started from the public listing. Please review the details below and add any private arrival information before sharing with guests.`,
    aiKnowledge: `Imported from ${url ? url.toString() : "pasted listing text"}. The source did not expose enough structured details, so the host should review and complete Wi-Fi, access, check-in, parking and house rules manually.`,
    essentialsDraft: "Host should add Wi-Fi details, access instructions, emergency contacts, nearest pharmacy, parking notes and waste disposal details before publishing.",
    recommendationsDraft: "Host should add favorite restaurants, cafes, beaches, activities and practical nearby places before publishing."
  };
}

export function joinKnowledge(parts: Array<string | null | undefined>) {
  return parts
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join("\n\n")
    .slice(0, 5000);
}

type ListingSourceResult = {
  label: string;
  ok: boolean;
  durationMs: number;
  text: string;
  error?: string;
};

export type ListingSourceSummary = {
  text: string;
  durationMs: number;
  direct: Omit<ListingSourceResult, "text">;
  reader: Omit<ListingSourceResult, "text">;
  contentChars: number;
};

function sourceErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

async function timedListingSource(label: string, read: () => Promise<string>): Promise<ListingSourceResult> {
  const startedAt = Date.now();
  try {
    return {
      label,
      ok: true,
      durationMs: Date.now() - startedAt,
      text: await read()
    };
  } catch (error) {
    return {
      label,
      ok: false,
      durationMs: Date.now() - startedAt,
      text: "",
      error: sourceErrorMessage(error, `${label} failed.`)
    };
  }
}

export async function collectListingSourceText(url: string): Promise<ListingSourceSummary> {
  const startedAt = Date.now();
  const [direct, reader] = await Promise.all([
    timedListingSource("Direct page read", () => fetchListingText(url, { timeoutMs: 7_000 })),
    timedListingSource("Clean reader read", () => fetchReaderText(url, { timeoutMs: 7_000 }))
  ]);

  const text = [
    direct.ok ? `${direct.label}:\n${direct.text}` : `${direct.label} failed: ${direct.error}`,
    reader.ok ? `${reader.label}:\n${reader.text}` : `${reader.label} failed: ${reader.error}`
  ]
    .join("\n\n")
    .slice(0, 28000);

  return {
    text,
    durationMs: Date.now() - startedAt,
    direct: {
      label: direct.label,
      ok: direct.ok,
      durationMs: direct.durationMs,
      error: direct.error
    },
    reader: {
      label: reader.label,
      ok: reader.ok,
      durationMs: reader.durationMs,
      error: reader.error
    },
    contentChars: text.length
  };
}

export async function fetchListingText(url: string, options: { timeoutMs?: number } = {}) {
  const response = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 StayNestBot/1.0",
      accept: "text/html,application/xhtml+xml"
    },
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(options.timeoutMs ?? 12_000)
  });

  if (!response.ok) {
    throw new Error(`Listing page returned ${response.status}.`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
    throw new Error("Listing URL did not return a readable HTML page.");
  }

  return cleanPageText(await response.text(), url);
}

export async function fetchReaderText(url: string, options: { timeoutMs?: number } = {}) {
  const response = await fetch(`https://r.jina.ai/${url}`, {
    headers: {
      accept: "text/plain"
    },
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(options.timeoutMs ?? 12_000)
  });

  if (!response.ok) {
    throw new Error(`Reader service returned ${response.status}.`);
  }

  return (await response.text()).replace(/\s+\n/g, "\n").trim().slice(0, 28000);
}
