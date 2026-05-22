"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isIP } from "node:net";
import { ReviewPlatform } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireReadyUser } from "@/lib/auth";
import { uploadImage } from "@/lib/image-upload";
import { createUniqueSecureSlug, hasSecureSlugSuffix } from "@/lib/secure-slug";
import { normalizeSlug } from "@/lib/utils";

function stringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalValue(formData: FormData, key: string) {
  const value = stringValue(formData, key);
  return value.length > 0 ? value : null;
}

function fileValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

function checkedValue(formData: FormData, key: string) {
  return formData.get(key) === "1";
}

function dashboardError(message: string): never {
  redirect(`/dashboard?error=${encodeURIComponent(message)}`);
}

function openAiModel() {
  const model = process.env.OPENAI_MODEL?.trim();
  return model && model !== "gpt-5.4-mini" ? model : "gpt-5-mini";
}

async function openAiErrorMessage(response: Response) {
  const body = (await response.json().catch(() => null)) as { error?: { message?: string; code?: string; type?: string } } | null;
  const message = body?.error?.message || `${response.status} ${response.statusText}`;
  if (/billing|quota|credit|insufficient/i.test(message)) {
    return "OpenAI billing or credits are not active for this API key.";
  }
  if (/model/i.test(message)) {
    return `OpenAI model error: ${message}`;
  }
  if (/api key|authentication|invalid/i.test(message)) {
    return "OpenAI API key is invalid or not active.";
  }
  return `OpenAI error: ${message}`;
}

function isPrivateHostname(hostname: string) {
  const host = hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost")) return true;

  const ipVersion = isIP(host);
  if (!ipVersion) return false;

  if (ipVersion === 6) {
    return host === "::1" || host.startsWith("fc") || host.startsWith("fd") || host.startsWith("fe80:");
  }

  const parts = host.split(".").map(Number);
  const [first, second] = parts;
  return (
    first === 10 ||
    first === 127 ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168)
  );
}

function safeString(value: unknown, maxLength = 1600) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : undefined;
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

function metaContent(html: string, attribute: "name" | "property", value: string) {
  const tag = html.match(new RegExp(`<meta[^>]+${attribute}=["']${value}["'][^>]*>`, "i"))?.[0];
  return tag?.match(/content=["']([^"']+)["']/i)?.[1] || "";
}

function cleanPageText(html: string) {
  const jsonLd = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1]?.trim())
    .filter(Boolean)
    .join("\n");
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "";
  const description = metaContent(html, "name", "description") || metaContent(html, "property", "og:description");
  const ogTitle = metaContent(html, "property", "og:title");
  const ogImage = metaContent(html, "property", "og:image");
  const visibleText = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

  return `
Title: ${title}
Open graph title: ${ogTitle}
Description: ${description}
Open graph image: ${ogImage}

JSON-LD:
${jsonLd}

Visible listing text:
${visibleText}
`.slice(0, 28000);
}

function titleFromListingUrl(url: URL | null) {
  if (!url) return "Imported Property";
  const lastPathPart = url.pathname
    .split("/")
    .filter(Boolean)
    .pop()
    ?.replace(/\.(html?|php)$/i, "");
  const source = lastPathPart || url.hostname.replace(/^www\./, "");
  return source
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .slice(0, 120);
}

function isThinOrBlockedText(text: string) {
  const compactText = text.toLowerCase();
  return (
    text.replace(/\s+/g, " ").trim().length < 700 ||
    /captcha|access denied|enable javascript|are you a robot|sign in to continue|cookie settings|unusual traffic/i.test(compactText)
  );
}

async function fetchListingText(url: string) {
  const response = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36",
      accept: "text/html,application/xhtml+xml"
    },
    cache: "no-store",
    signal: AbortSignal.timeout(12000)
  });

  if (!response.ok) {
    throw new Error("Could not read that listing URL. The site may be blocking automated access.");
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    throw new Error("That link did not return a readable property page.");
  }

  return cleanPageText(await response.text());
}

async function fetchReaderText(url: string) {
  const response = await fetch(`https://r.jina.ai/${url}`, {
    headers: {
      accept: "text/plain"
    },
    cache: "no-store",
    signal: AbortSignal.timeout(16000)
  });

  if (!response.ok) {
    throw new Error("Reader import failed.");
  }

  return (await response.text()).replace(/\s+\n/g, "\n").trim().slice(0, 28000);
}

type ImportedListing = {
  name?: string;
  welcomeMessage?: string;
  coverImageUrl?: string;
  checkInInfo?: string;
  checkOutInfo?: string;
  parkingInfo?: string;
  houseRules?: string;
  emergencyInfo?: string;
  hostContactName?: string;
  aiKnowledge?: string;
};

const nullableString = {
  anyOf: [{ type: "string" }, { type: "null" }]
};

const listingImportSchema = {
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
    "emergencyInfo",
    "hostContactName",
    "aiKnowledge"
  ],
  properties: {
    name: nullableString,
    welcomeMessage: nullableString,
    coverImageUrl: nullableString,
    checkInInfo: nullableString,
    checkOutInfo: nullableString,
    parkingInfo: nullableString,
    houseRules: nullableString,
    emergencyInfo: nullableString,
    hostContactName: nullableString,
    aiKnowledge: nullableString
  }
};

function parsedImportedListing(text: string): ImportedListing {
  const json = text.match(/\{[\s\S]*\}/)?.[0] || text;
  const parsed = JSON.parse(json) as ImportedListing;
  if (!parsed || typeof parsed !== "object") return {};
  return {
    name: safeString(parsed.name, 120),
    welcomeMessage: safeString(parsed.welcomeMessage, 1200),
    coverImageUrl: safeString(parsed.coverImageUrl, 1000),
    checkInInfo: safeString(parsed.checkInInfo, 1200),
    checkOutInfo: safeString(parsed.checkOutInfo, 1200),
    parkingInfo: safeString(parsed.parkingInfo, 1000),
    houseRules: safeString(parsed.houseRules, 1600),
    emergencyInfo: safeString(parsed.emergencyInfo, 1000),
    hostContactName: safeString(parsed.hostContactName, 120),
    aiKnowledge: safeString(parsed.aiKnowledge, 2500)
  };
}

function hasUsableImport(imported: ImportedListing) {
  return Boolean(imported.name || imported.welcomeMessage || imported.houseRules || imported.parkingInfo || imported.coverImageUrl);
}

function fallbackImportedListing(url: URL | null): ImportedListing {
  const name = titleFromListingUrl(url);
  return {
    name,
    welcomeMessage: `Welcome to ${name}. This guide was started from the public listing. Please review the details below and add any private arrival information before sharing with guests.`,
    aiKnowledge: `Imported from ${url ? url.toString() : "pasted listing text"}. The source did not expose enough structured details, so the host should review and complete Wi-Fi, access, check-in, parking and house rules manually.`
  };
}

export async function importListingFromUrl(formData: FormData) {
  const user = await requireReadyUser();
  const listingUrl = stringValue(formData, "listingUrl");
  const pastedText = stringValue(formData, "listingText").slice(0, 28000);
  const propertyId = stringValue(formData, "propertyId");

  if (!listingUrl && !pastedText) {
    dashboardError("Paste a listing URL or the listing text first.");
  }

  let url: URL | null = null;
  if (listingUrl) {
    try {
      url = new URL(listingUrl);
    } catch {
      dashboardError("Paste a valid listing URL.");
    }

    if (!["http:", "https:"].includes(url.protocol)) {
      dashboardError("Listing URL must start with http or https.");
    }

    if (isPrivateHostname(url.hostname)) {
      dashboardError("That listing URL is not allowed.");
    }
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    dashboardError("AI import needs OPENAI_API_KEY configured.");
  }

  let listingText = pastedText ? `Host pasted listing text:\n${pastedText}` : "";
  if (!listingText && url) {
    const sourceParts: string[] = [];
    try {
      sourceParts.push(`Direct page read:\n${await fetchListingText(url.toString())}`);
    } catch (error) {
      sourceParts.push(`Direct page read failed: ${error instanceof Error ? error.message : "Could not read the listing URL."}`);
    }

    try {
      sourceParts.push(`Clean reader read:\n${await fetchReaderText(url.toString())}`);
    } catch {
      sourceParts.push("Clean reader read failed.");
    }

    listingText = sourceParts.join("\n\n").slice(0, 28000);
  }

  if (url && isThinOrBlockedText(listingText)) {
    listingText = `${listingText}\n\nURL-derived fallback name: ${titleFromListingUrl(url)}\nSource URL: ${url.toString()}`;
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: openAiModel(),
      instructions:
        "Extract the best possible guest-guide draft from a rental listing source. Use direct facts from the source where present. If the source is thin or blocked but the URL clearly contains the property name, use that name and create a short neutral welcome draft. Write concise, polished, guest-facing English. Use null for missing values. Never invent access codes, Wi-Fi passwords, phone numbers, emails, emergency contacts, exact check-in instructions, or prices.",
      text: {
        format: {
          type: "json_schema",
          name: "staynest_listing_import",
          strict: true,
          schema: listingImportSchema
        }
      },
      max_output_tokens: 1400,
      input: [
        {
          role: "user",
          content: `Extract a StayNest guide draft from this source. Prefer host-pasted text over scraped page text. If the page is blocked, still extract the property name from the URL when possible and explain missing private details in aiKnowledge.\n\nListing URL: ${url?.toString() || "Not provided; host pasted text manually."}\n\nSource content:\n${listingText}`
        }
      ]
    })
  });

  if (!response.ok) {
    dashboardError(await openAiErrorMessage(response));
  }

  let imported: ImportedListing;
  try {
    imported = parsedImportedListing(extractResponseText(await response.json()));
  } catch {
    dashboardError("AI returned an unreadable import. Please try again.");
  }

  if (!hasUsableImport(imported)) {
    imported = fallbackImportedListing(url);
  }

  const existingProperty = propertyId
    ? await prisma.property.findFirst({
        where: {
          id: propertyId,
          ...(user.role === "ADMIN" ? {} : { ownerId: user.id })
        }
      })
    : null;

  const name = imported.name?.trim() || existingProperty?.name || "Imported Property";
  const data = {
    ownerId: user.id,
    name,
    slug: existingProperty?.slug || (await createUniqueSecureSlug(name)),
    accentColor: existingProperty?.accentColor || "#4a8a8f",
    logoUrl: existingProperty?.logoUrl || null,
    coverImageUrl: imported.coverImageUrl || existingProperty?.coverImageUrl || null,
    welcomeMessage:
      imported.welcomeMessage ||
      existingProperty?.welcomeMessage ||
      `Welcome to ${name}. This guide includes the most important details for your stay.`,
    wifiName: existingProperty?.wifiName || null,
    wifiPassword: existingProperty?.wifiPassword || null,
    checkInInfo: imported.checkInInfo || existingProperty?.checkInInfo || null,
    checkOutInfo: imported.checkOutInfo || existingProperty?.checkOutInfo || null,
    parkingInfo: imported.parkingInfo || existingProperty?.parkingInfo || null,
    houseRules: imported.houseRules || existingProperty?.houseRules || null,
    emergencyInfo: imported.emergencyInfo || existingProperty?.emergencyInfo || null,
    hostContactName: imported.hostContactName || existingProperty?.hostContactName || null,
    hostPhone: existingProperty?.hostPhone || null,
    hostEmail: existingProperty?.hostEmail || user.email,
    aiKnowledge: imported.aiKnowledge || existingProperty?.aiKnowledge || `Imported from ${url ? `${url.hostname}: ${url.toString()}` : "pasted listing text"}`
  };

  const property = existingProperty
    ? await prisma.property.update({
        where: { id: existingProperty.id },
        data
      })
    : await prisma.property.create({ data });

  revalidatePath("/dashboard");
  revalidatePath(`/stay/${property.slug}`);
  redirect("/dashboard?saved=property");
}

export async function saveProperty(formData: FormData) {
  const user = await requireReadyUser();
  const propertyId = stringValue(formData, "propertyId");
  const name = stringValue(formData, "name");
  const requestedSlug = normalizeSlug(stringValue(formData, "slug"));
  const accentColor = stringValue(formData, "accentColor") || "#4a8a8f";
  const wifiName = stringValue(formData, "wifiName");
  const wifiPassword = stringValue(formData, "wifiPassword");
  const hostPhone = stringValue(formData, "hostPhone");
  const hostEmail = stringValue(formData, "hostEmail");

  if (!name || !wifiName || !wifiPassword || !hostPhone || !hostEmail) {
    redirect("/dashboard?error=Fill%20in%20property%20name,%20Wi-Fi,%20host%20phone%20and%20host%20email.");
  }

  const currentProperty = propertyId
    ? await prisma.property.findFirst({
        where: {
          id: propertyId,
          ...(user.role === "ADMIN" ? {} : { ownerId: user.id })
        },
        select: { slug: true }
      })
    : null;

  const slug =
    currentProperty && (!requestedSlug || requestedSlug === currentProperty.slug)
      ? currentProperty.slug
      : await createUniqueSecureSlug(requestedSlug || name, propertyId || undefined);

  if (!hasSecureSlugSuffix(slug)) {
    redirect("/dashboard?error=Public%20guide%20links%20must%20use%20a%20secure%20generated%20suffix.");
  }

  let logoUrl = optionalValue(formData, "logoUrl");
  let coverImageUrl = optionalValue(formData, "coverImageUrl");

  if (checkedValue(formData, "removeLogo")) logoUrl = null;
  if (checkedValue(formData, "removeCoverImage")) coverImageUrl = null;

  try {
    const logoFile = fileValue(formData, "logoFile");
    const coverFile = fileValue(formData, "coverImageFile");
    if (logoFile) logoUrl = await uploadImage(logoFile, "staynest/properties/logos");
    if (coverFile) coverImageUrl = await uploadImage(coverFile, "staynest/properties/covers");
  } catch (error) {
    dashboardError(error instanceof Error ? error.message : "Image upload failed.");
  }

  const data = {
    ownerId: user.id,
    name,
    slug,
    accentColor,
    logoUrl,
    coverImageUrl,
    welcomeMessage: stringValue(formData, "welcomeMessage") || "Welcome. We are happy to host you.",
    wifiName,
    wifiPassword,
    checkInInfo: optionalValue(formData, "checkInInfo"),
    checkOutInfo: optionalValue(formData, "checkOutInfo"),
    parkingInfo: optionalValue(formData, "parkingInfo"),
    houseRules: optionalValue(formData, "houseRules"),
    emergencyInfo: optionalValue(formData, "emergencyInfo"),
    hostContactName: optionalValue(formData, "hostContactName"),
    hostPhone: hostPhone || null,
    hostEmail: hostEmail || null,
    aiKnowledge: optionalValue(formData, "aiKnowledge")
  };

  const property = propertyId
    ? await updateAccessibleProperty(propertyId, user, data)
    : await prisma.property.create({
        data
      });

  revalidatePath("/dashboard");
  revalidatePath(`/stay/${property.slug}`);
  redirect("/dashboard?saved=property");
}

export async function rotatePropertySlug(formData: FormData) {
  const user = await requireReadyUser();
  const propertyId = stringValue(formData, "propertyId");

  if (!propertyId) {
    redirect("/dashboard");
  }

  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      ...(user.role === "ADMIN" ? {} : { ownerId: user.id })
    },
    select: { id: true, name: true, slug: true }
  });

  if (!property) {
    redirect("/dashboard");
  }

  const slug = await createUniqueSecureSlug(property.name, property.id);
  await prisma.property.update({
    where: { id: property.id },
    data: { slug }
  });

  revalidatePath("/dashboard");
  revalidatePath(`/stay/${property.slug}`);
  revalidatePath(`/stay/${slug}`);
  redirect("/dashboard?saved=property");
}

export async function saveRecommendation(formData: FormData) {
  const user = await requireReadyUser();
  const propertyId = stringValue(formData, "propertyId");
  const recommendationId = stringValue(formData, "recommendationId");
  if (!propertyId) {
    redirect("/dashboard");
  }

  await ensureAccessibleProperty(propertyId, user);
  const title = stringValue(formData, "title");
  const category = stringValue(formData, "category");
  const description = stringValue(formData, "description");

  if (!title || !category || !description) {
    redirect("/dashboard?error=Fill%20in%20recommendation%20title,%20category%20and%20description.");
  }

  if (recommendationId) {
    await prisma.recommendation.updateMany({
      where: { id: recommendationId, propertyId },
      data: {
        title,
        category,
        description,
        address: optionalValue(formData, "address"),
        url: optionalValue(formData, "url")
      }
    });
  } else {
    const recommendationCount = await prisma.recommendation.count({ where: { propertyId } });
    await prisma.recommendation.create({
      data: {
        propertyId,
        title,
        category,
        description,
        address: optionalValue(formData, "address"),
        url: optionalValue(formData, "url"),
        sortOrder: recommendationCount + 1
      }
    });
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?saved=recommendation");
}

export async function deleteRecommendation(formData: FormData) {
  const user = await requireReadyUser();
  const id = stringValue(formData, "id");
  if (id) {
    await prisma.recommendation.deleteMany({
      where: {
        id,
        property: user.role === "ADMIN" ? undefined : { ownerId: user.id }
      }
    });
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?saved=recommendation-removed");
}

export async function saveReviewLinks(formData: FormData) {
  const user = await requireReadyUser();
  const propertyId = stringValue(formData, "propertyId");
  if (!propertyId) {
    redirect("/dashboard");
  }

  await ensureAccessibleProperty(propertyId, user);
  const platforms = [ReviewPlatform.GOOGLE, ReviewPlatform.BOOKING, ReviewPlatform.AIRBNB];

  await Promise.all(
    platforms.map(async (platform) => {
      const url = optionalValue(formData, platform.toLowerCase());
      if (!url) {
        await prisma.reviewLink.deleteMany({ where: { propertyId, platform } });
        return;
      }

      await prisma.reviewLink.upsert({
        where: {
          propertyId_platform: {
            propertyId,
            platform
          }
        },
        update: { url },
        create: {
          propertyId,
          platform,
          url
        }
      });
    })
  );

  revalidatePath("/dashboard");
  redirect("/dashboard?saved=reviews");
}

type ActionUser = Awaited<ReturnType<typeof requireReadyUser>>;

async function ensureAccessibleProperty(propertyId: string, user: ActionUser) {
  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      ...(user.role === "ADMIN" ? {} : { ownerId: user.id })
    },
    select: {
      id: true
    }
  });

  if (!property) {
    redirect("/dashboard");
  }
}

async function updateAccessibleProperty(propertyId: string, user: ActionUser, data: Parameters<typeof prisma.property.update>[0]["data"]) {
  await ensureAccessibleProperty(propertyId, user);
  return prisma.property.update({
    where: { id: propertyId },
    data
  });
}
