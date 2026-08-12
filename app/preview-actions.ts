"use server";

import { redirect } from "next/navigation";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { recordPreviewEvent } from "@/lib/preview-analytics";

function stringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}
import {
  collectListingSourceText,
  importListingJsonSchema,
  isPrivateHostname,
  isThinOrBlockedText,
  openAiModel,
  parsedImportedListing,
  extractResponseText,
  hasUsableImport,
  titleFromListingUrl,
  joinKnowledge,
  fallbackImportedListing,
  openAiErrorMessage,
  unsupportedListingHost,
  type ImportedListing
} from "@/lib/listing-import";

type PreviewFormState = {
  error: string;
};

export async function generatePreviewFromUrl(_state: PreviewFormState, formData: FormData): Promise<PreviewFormState> {
  const listingUrl = stringValue(formData, "listingUrl");

  if (!listingUrl) {
    return { error: "Please provide a valid listing URL." };
  }

  let url: URL | null = null;
  try {
    url = new URL(listingUrl);
  } catch {
    return { error: "Please provide a valid listing URL." };
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    return { error: "Listing URL must start with http or https." };
  }

  if (isPrivateHostname(url.hostname)) {
    return { error: "That listing URL is not allowed." };
  }

  const unsupportedHost = unsupportedListingHost(url);
  if (unsupportedHost) {
    return { error: `${unsupportedHost} blocks automated imports. Please paste your Booking.com listing link instead.` };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { error: "AI import is currently unavailable." };
  }

  const sourceSummary = await collectListingSourceText(url.toString());
  let listingText = sourceSummary.text;

  if (isThinOrBlockedText(listingText)) {
    listingText = `${listingText}\n\nURL-derived fallback name: ${titleFromListingUrl(url)}\nSource URL: ${url.toString()}`;
  }

  const aiStartedAt = Date.now();
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: openAiModel(),
      instructions:
        "Extract the best possible StayNest guest-guide draft from a rental listing source. Use direct facts only. Write concise, polished, guest-facing English. Focus especially on property name, visible host name, public check-in/check-out windows or policies, parking availability/details, house rules/policies, and major facilities/amenities. Put amenities/facilities as short clean lines in facilities. If parking is mentioned inside amenities, also summarize it in parkingInfo. If check-in/out times are visible, include only public timing/policy, not private access instructions. Use null for missing values. Never invent access codes, Wi-Fi names/passwords, private phone numbers, emails, emergency contacts, exact lockbox instructions, calendar/prices, or unavailable facilities.",
      text: {
        format: {
          type: "json_schema",
          name: "staynest_listing_import",
          strict: true,
          schema: importListingJsonSchema
        }
      },
      max_output_tokens: 2200,
      input: [
        {
          role: "user",
          content: `Extract a StayNest guide draft from this source. If the page is blocked, still extract the property name from the URL when possible and explain missing private details in aiKnowledge.\n\nReturn these fields:\n- name: property/listing name.\n- hostContactName: visible host/managed-by name only.\n- welcomeMessage: warm guest-facing intro from public listing facts.\n- coverImageUrl: best usable image URL from metadata/image candidates.\n- checkInInfo: public check-in time/window/policy if visible.\n- checkOutInfo: public checkout time/window/policy if visible.\n- parkingInfo: parking availability, type, reservation/cost notes if visible.\n- houseRules: visible public rules/policies: smoking, pets, parties, quiet hours, children, damage/deposit only if present.\n- facilities: major visible facilities/amenities, one per line or short grouped sentences.\n- emergencyInfo: only if public emergency/safety info is visible.\n- locationInfo: public neighborhood, area, view, beach/city distance, transit or landmark context if visible.\n- recommendationsDraft: only public nearby places, activities, beaches, restaurants or area tips visible in the source; otherwise a concise host-to-complete draft.\n- essentialsDraft: public practical essentials visible in the source, such as parking, elevator, heating/cooling, kitchen, laundry, pharmacy/market notes; otherwise a concise host-to-complete draft.\n- aiKnowledge: concise source summary and what still needs host review.\n\nListing URL: ${url.toString()}\n\nSource content:\n${listingText}`
        }
      ]
    })
  });
  const aiDurationMs = Date.now() - aiStartedAt;

  if (!response.ok) {
    const errorMsg = await openAiErrorMessage(response);
    return { error: errorMsg };
  }

  let imported: ImportedListing;
  try {
    imported = parsedImportedListing(extractResponseText(await response.json()));
  } catch {
    return { error: "AI returned an unreadable import. Please try again." };
  }

  if (!hasUsableImport(imported)) {
    imported = fallbackImportedListing(url);
  }

  const name = imported.name?.trim() || "Imported Property";
  const aiKnowledge = joinKnowledge([
    imported.aiKnowledge,
    imported.locationInfo ? `Location information visible on the listing:\n${imported.locationInfo}` : null,
    imported.facilities ? `Amenities and facilities visible on the listing:\n${imported.facilities}` : null,
    imported.recommendationsDraft ? `Recommendations draft:\n${imported.recommendationsDraft}` : null,
    imported.essentialsDraft ? `Essentials draft:\n${imported.essentialsDraft}` : null,
    `Imported source: ${url.hostname} (${url.toString()})`
  ]);

  const token = randomBytes(16).toString("hex");

  // Expires in 72 hours
  const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);

  await prisma.propertyPreview.create({
    data: {
      token,
      listingUrl: url.toString(),
      name,
      welcomeMessage:
        imported.welcomeMessage ||
        `Welcome to ${name}. This guide includes the most important details for your stay.`,
      coverImageUrl: imported.coverImageUrl || null,
      checkInInfo: imported.checkInInfo || null,
      checkOutInfo: imported.checkOutInfo || null,
      parkingInfo: imported.parkingInfo || null,
      houseRules: imported.houseRules || null,
      facilities: imported.facilities || null,
      emergencyInfo: imported.emergencyInfo || null,
      hostContactName: imported.hostContactName || null,
      aiKnowledge: aiKnowledge || `Imported from ${url.hostname}`,
      locationInfo: imported.locationInfo || null,
      recommendationsDraft: imported.recommendationsDraft || null,
      essentialsDraft: imported.essentialsDraft || null,
      expiresAt
    }
  });

  await recordPreviewEvent({
    eventName: "preview_created",
    previewToken: token,
    metadata: {
      hostname: url.hostname,
      sourceDurationMs: sourceSummary.durationMs,
      aiDurationMs,
      directSourceOk: sourceSummary.direct.ok,
      directSourceDurationMs: sourceSummary.direct.durationMs,
      directSourceError: sourceSummary.direct.error || null,
      readerSourceOk: sourceSummary.reader.ok,
      readerSourceDurationMs: sourceSummary.reader.durationMs,
      readerSourceError: sourceSummary.reader.error || null,
      contentChars: sourceSummary.contentChars
    }
  });

  redirect(`/preview/${token}`);
}
