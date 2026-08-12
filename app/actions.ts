"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { GuideSectionType, ReviewPlatform } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireReadyUser } from "@/lib/auth";
import { uploadImage } from "@/lib/image-upload";
import { publicCodeCacheTag, publicGuideCacheTag } from "@/lib/public-guide-cache";
import { createUniquePublicCode, createUniqueSecureSlug, hasSecureSlugSuffix } from "@/lib/secure-slug";
import { normalizeSlug } from "@/lib/utils";
import { curatedAccentForTheme, getGuideTheme, isGuideThemeId } from "@/themes";
import {
  collectListingSourceText,
  extractResponseText,
  fallbackImportedListing,
  hasUsableImport,
  importListingJsonSchema,
  isPrivateHostname,
  isThinOrBlockedText,
  joinKnowledge,
  openAiErrorMessage,
  openAiModel,
  parsedImportedListing,
  titleFromListingUrl,
  unsupportedListingHost,
  type ImportedListing
} from "@/lib/listing-import";

function stringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalValue(formData: FormData, key: string) {
  const value = stringValue(formData, key);
  return value.length > 0 ? value : null;
}

function optionalNumberValue(formData: FormData, key: string) {
  const value = stringValue(formData, key);
  if (!value) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function stringListValue(formData: FormData, key: string) {
  return stringValue(formData, key)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
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

function revalidatePublicGuide(slug: string) {
  revalidateTag(publicGuideCacheTag(slug));
}

function revalidatePublicCode(publicCode: string) {
  revalidateTag(publicCodeCacheTag(publicCode));
}

const dashboardPropertyFieldsSelect = {
  id: true,
  ownerId: true,
  name: true,
  slug: true,
  publicCode: true,
  logoUrl: true,
  coverImageUrl: true,
  accentColor: true,
  templateId: true,
  designSerif: true,
  designRounded: true,
  welcomeMessage: true,
  wifiName: true,
  wifiPassword: true,
  checkInInfo: true,
  checkOutInfo: true,
  parkingInfo: true,
  houseRules: true,
  emergencyInfo: true,
  hostContactName: true,
  hostPhone: true,
  hostEmail: true,
  aiKnowledge: true
} as const;

function inlineActionError(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export async function upsertImportedGuideSection({
  propertyId,
  title,
  content,
  sortOrder
}: {
  propertyId: string;
  title: string;
  content: string | null | undefined;
  sortOrder: number;
}) {
  const cleanContent = content?.trim();
  if (!cleanContent) return;

  const existing = await prisma.guideSection.findFirst({
    where: { propertyId, title },
    select: { id: true }
  });

  if (existing) {
    await prisma.guideSection.update({
      where: { id: existing.id },
      data: {
        content: cleanContent
      }
    });
    return;
  }

  await prisma.guideSection.create({
    data: {
      propertyId,
      type: GuideSectionType.CUSTOM,
      title,
      content: cleanContent,
      sortOrder
    }
  });
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

    const unsupportedHost = unsupportedListingHost(url);
    if (unsupportedHost) {
      dashboardError(
        `${unsupportedHost} blocks automated imports. Paste your Booking.com link instead, or paste the listing text below.`
      );
    }
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    dashboardError("AI import needs OPENAI_API_KEY configured.");
  }

  let listingText = pastedText ? `Host pasted listing text:\n${pastedText}` : "";
  if (!listingText && url) {
    listingText = (await collectListingSourceText(url.toString())).text;
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
          content: `Extract a StayNest guide draft from this source. Prefer host-pasted text over scraped page text. If the page is blocked, still extract the property name from the URL when possible and explain missing private details in aiKnowledge.\n\nReturn these fields:\n- name: property/listing name.\n- hostContactName: visible host/managed-by name only.\n- welcomeMessage: warm guest-facing intro from public listing facts.\n- coverImageUrl: best usable image URL from metadata/image candidates.\n- checkInInfo: public check-in time/window/policy if visible.\n- checkOutInfo: public checkout time/window/policy if visible.\n- parkingInfo: parking availability, type, reservation/cost notes if visible.\n- houseRules: visible public rules/policies: smoking, pets, parties, quiet hours, children, damage/deposit only if present.\n- facilities: major visible facilities/amenities, one per line or short grouped sentences.\n- emergencyInfo: only if public emergency/safety info is visible.\n- locationInfo: public neighborhood, area, view, beach/city distance, transit or landmark context if visible.\n- recommendationsDraft: only public nearby places, activities, beaches, restaurants or area tips visible in the source; otherwise a concise host-to-complete draft.\n- essentialsDraft: public practical essentials visible in the source, such as parking, elevator, heating/cooling, kitchen, laundry, pharmacy/market notes; otherwise a concise host-to-complete draft.\n- aiKnowledge: concise source summary and what still needs host review.\n\nListing URL: ${url?.toString() || "Not provided; host pasted text manually."}\n\nSource content:\n${listingText}`
        }
      ]
    })
  });

  if (!response.ok) {
    dashboardError(await openAiErrorMessage(response));
  }

  let imported: ImportedListing;
  try {
    const json = await response.json();
    imported = parsedImportedListing(extractResponseText(json));
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
  const aiKnowledge = joinKnowledge([
    imported.aiKnowledge,
    imported.locationInfo ? `Location information visible on the listing:\n${imported.locationInfo}` : null,
    imported.facilities ? `Amenities and facilities visible on the listing:\n${imported.facilities}` : null,
    imported.recommendationsDraft ? `Recommendations draft:\n${imported.recommendationsDraft}` : null,
    imported.essentialsDraft ? `Essentials draft:\n${imported.essentialsDraft}` : null,
    url ? `Imported source: ${url.hostname} (${url.toString()})` : "Imported source: pasted listing text"
  ]);
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
    aiKnowledge: aiKnowledge || existingProperty?.aiKnowledge || `Imported from ${url ? `${url.hostname}: ${url.toString()}` : "pasted listing text"}`,
    translationLocales: ["en"],
    translations: {}
  };

  const property = existingProperty
    ? await prisma.property.update({
        where: { id: existingProperty.id },
        data,
        select: {
          id: true,
          slug: true
        }
      })
    : await prisma.property.create({
        data: { ...data, publicCode: await createUniquePublicCode() },
        select: {
          id: true,
          slug: true
        }
      });

  await upsertImportedGuideSection({
    propertyId: property.id,
    title: "Amenities & facilities",
    content: imported.facilities,
    sortOrder: 5
  });
  await upsertImportedGuideSection({
    propertyId: property.id,
    title: "Location overview",
    content: imported.locationInfo,
    sortOrder: 6
  });
  await upsertImportedGuideSection({
    propertyId: property.id,
    title: "Recommendations draft",
    content: imported.recommendationsDraft,
    sortOrder: 7
  });
  await upsertImportedGuideSection({
    propertyId: property.id,
    title: "Essentials draft",
    content: imported.essentialsDraft,
    sortOrder: 8
  });

  revalidatePath("/dashboard");
  revalidatePublicGuide(property.slug);
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

  if (!name) {
    redirect("/dashboard?error=Fill%20in%20the%20property%20name%20to%20start%20your%20guide.");
  }

  const currentProperty = propertyId
    ? await prisma.property.findFirst({
        where: {
          id: propertyId,
          ...(user.role === "ADMIN" ? {} : { ownerId: user.id })
        },
        select: { slug: true, logoUrl: true, coverImageUrl: true }
      })
    : null;

  let slug =
    currentProperty && (!requestedSlug || requestedSlug === currentProperty.slug)
      ? currentProperty.slug
      : await createUniqueSecureSlug(requestedSlug || name, propertyId || undefined);

  if (!hasSecureSlugSuffix(slug)) {
    slug = await createUniqueSecureSlug(name, propertyId || undefined);
  }

  let logoUrl = optionalValue(formData, "logoUrl") || currentProperty?.logoUrl || null;
  let coverImageUrl = optionalValue(formData, "coverImageUrl") || currentProperty?.coverImageUrl || null;

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
    welcomeMessage: stringValue(formData, "welcomeMessage"),
    wifiName: wifiName || null,
    wifiPassword: wifiPassword || null,
    checkInInfo: optionalValue(formData, "checkInInfo"),
    checkOutInfo: optionalValue(formData, "checkOutInfo"),
    parkingInfo: optionalValue(formData, "parkingInfo"),
    houseRules: optionalValue(formData, "houseRules"),
    emergencyInfo: optionalValue(formData, "emergencyInfo"),
    hostContactName: optionalValue(formData, "hostContactName"),
    hostPhone: hostPhone || null,
    hostEmail: hostEmail || null,
    aiKnowledge: optionalValue(formData, "aiKnowledge"),
    translationLocales: ["en"],
    translations: {}
  };

  const property = propertyId
    ? await updateAccessibleProperty(propertyId, user, data)
    : await prisma.property.create({
        data: { ...data, publicCode: await createUniquePublicCode() },
        select: {
          slug: true
        }
      });

  revalidatePath("/dashboard");
  revalidatePublicGuide(property.slug);
  redirect("/dashboard?saved=property");
}

export async function savePropertyInline(formData: FormData) {
  try {
    const user = await requireReadyUser();
    const propertyId = stringValue(formData, "propertyId");
    const name = stringValue(formData, "name");
    const requestedSlug = normalizeSlug(stringValue(formData, "slug"));
    const accentColor = stringValue(formData, "accentColor") || "#4a8a8f";
    const wifiName = stringValue(formData, "wifiName");
    const wifiPassword = stringValue(formData, "wifiPassword");
    const hostPhone = stringValue(formData, "hostPhone");
    const hostEmail = stringValue(formData, "hostEmail");

    if (!name) {
      throw new Error("Fill in the property name to start your guide.");
    }

    const currentProperty = propertyId
      ? await prisma.property.findFirst({
          where: {
            id: propertyId,
            ...(user.role === "ADMIN" ? {} : { ownerId: user.id })
          },
          select: { slug: true, logoUrl: true, coverImageUrl: true }
        })
      : null;

    if (propertyId && !currentProperty) {
      throw new Error("Property access expired. Refresh and try again.");
    }

    let slug =
      currentProperty && (!requestedSlug || requestedSlug === currentProperty.slug)
        ? currentProperty.slug
        : await createUniqueSecureSlug(requestedSlug || name, propertyId || undefined);

    if (!hasSecureSlugSuffix(slug)) {
      slug = await createUniqueSecureSlug(name, propertyId || undefined);
    }

    let logoUrl = optionalValue(formData, "logoUrl") || currentProperty?.logoUrl || null;
    let coverImageUrl = optionalValue(formData, "coverImageUrl") || currentProperty?.coverImageUrl || null;

    if (checkedValue(formData, "removeLogo")) logoUrl = null;
    if (checkedValue(formData, "removeCoverImage")) coverImageUrl = null;

    const logoFile = fileValue(formData, "logoFile");
    const coverFile = fileValue(formData, "coverImageFile");
    if (logoFile) logoUrl = await uploadImage(logoFile, "staynest/properties/logos");
    if (coverFile) coverImageUrl = await uploadImage(coverFile, "staynest/properties/covers");

    const data = {
      ownerId: user.id,
      name,
      slug,
      accentColor,
      logoUrl,
      coverImageUrl,
      welcomeMessage: stringValue(formData, "welcomeMessage"),
      wifiName: wifiName || null,
      wifiPassword: wifiPassword || null,
      checkInInfo: optionalValue(formData, "checkInInfo"),
      checkOutInfo: optionalValue(formData, "checkOutInfo"),
      parkingInfo: optionalValue(formData, "parkingInfo"),
      houseRules: optionalValue(formData, "houseRules"),
      emergencyInfo: optionalValue(formData, "emergencyInfo"),
      hostContactName: optionalValue(formData, "hostContactName"),
      hostPhone: hostPhone || null,
      hostEmail: hostEmail || null,
      aiKnowledge: optionalValue(formData, "aiKnowledge"),
      translationLocales: ["en"],
      translations: {}
    };

    const property = propertyId
      ? await prisma.property.update({
          where: { id: propertyId },
          data,
          select: dashboardPropertyFieldsSelect
        })
      : await prisma.property.create({
          data: { ...data, publicCode: await createUniquePublicCode() },
          select: dashboardPropertyFieldsSelect
        });

    revalidatePublicGuide(property.slug);

    return {
      ok: true,
      data: { property },
      message: "Guest experience saved."
    };
  } catch (error) {
    return {
      ok: false,
      error: inlineActionError(error, "Could not save the guest guide.")
    };
  }
}

export async function savePropertyDesign(formData: FormData) {
  const user = await requireReadyUser();
  const propertyId = stringValue(formData, "propertyId");

  if (!propertyId) {
    redirect("/dashboard?error=Create%20the%20property%20first,%20then%20choose%20a%20template.");
  }

  await ensureAccessibleProperty(propertyId, user);

  const requestedTemplateId = stringValue(formData, "templateId");
  const theme = getGuideTheme(isGuideThemeId(requestedTemplateId) ? requestedTemplateId : "classic");
  const accentColor = curatedAccentForTheme(theme, stringValue(formData, "accentColor"));

  const property = await prisma.property.update({
    where: { id: propertyId },
    data: {
      templateId: theme.id,
      accentColor,
      designSerif: checkedValue(formData, "designSerif"),
      designRounded: checkedValue(formData, "designRounded")
    },
    select: {
      slug: true
    }
  });

  revalidatePath("/dashboard");
  revalidatePublicGuide(property.slug);
  redirect("/dashboard?saved=design");
}

export async function savePropertyDesignInline(formData: FormData) {
  try {
    const user = await requireReadyUser();
    const propertyId = stringValue(formData, "propertyId");

    if (!propertyId) {
      throw new Error("Create the property first, then choose a template.");
    }

    await ensureAccessibleProperty(propertyId, user);

    const requestedTemplateId = stringValue(formData, "templateId");
    const theme = getGuideTheme(isGuideThemeId(requestedTemplateId) ? requestedTemplateId : "classic");
    const accentColor = curatedAccentForTheme(theme, stringValue(formData, "accentColor"));

    const property = await prisma.property.update({
      where: { id: propertyId },
      data: {
        templateId: theme.id,
        accentColor,
        designSerif: checkedValue(formData, "designSerif"),
        designRounded: checkedValue(formData, "designRounded")
      },
      select: {
        slug: true,
        templateId: true,
        accentColor: true,
        designSerif: true,
        designRounded: true
      }
    });

    revalidatePublicGuide(property.slug);

    return {
      ok: true,
      data: { property },
      message: "Template updated successfully."
    };
  } catch (error) {
    return {
      ok: false,
      error: inlineActionError(error, "Could not update the template.")
    };
  }
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
    select: { id: true, name: true, slug: true, publicCode: true }
  });

  if (!property) {
    redirect("/dashboard");
  }

  // Rotate both forms: leaving the old short code alive would defeat the point
  // of regenerating the link.
  const slug = await createUniqueSecureSlug(property.name, property.id);
  const publicCode = await createUniquePublicCode();
  const previousPublicCode = property.publicCode;
  await prisma.property.update({
    where: { id: property.id },
    data: { slug, publicCode }
  });

  revalidatePath("/dashboard");
  revalidatePublicGuide(property.slug);
  revalidatePublicGuide(slug);
  if (previousPublicCode) revalidatePublicCode(previousPublicCode);
  revalidatePublicCode(publicCode);
  redirect("/dashboard?saved=property");
}

export async function saveRecommendation(formData: FormData) {
  const user = await requireReadyUser();
  const propertyId = stringValue(formData, "propertyId");
  const recommendationId = stringValue(formData, "recommendationId");
  if (!propertyId) {
    redirect("/dashboard");
  }

  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      ...(user.role === "ADMIN" ? {} : { ownerId: user.id })
    },
    select: { slug: true }
  });
  if (!property) {
    redirect("/dashboard");
  }
  const title = stringValue(formData, "title");
  const name = stringValue(formData, "name") || stringValue(formData, "manualName") || title;
  const customTitle = optionalValue(formData, "customTitle") || (title && title !== name ? title : null);
  const category = stringValue(formData, "category");
  const description = stringValue(formData, "description") || stringValue(formData, "customDescription");
  const customDescription = optionalValue(formData, "customDescription") || optionalValue(formData, "description");
  const googleMapsUrl = optionalValue(formData, "googleMapsUrl") || optionalValue(formData, "url");
  const formattedAddress = optionalValue(formData, "formattedAddress") || optionalValue(formData, "address");

  if (!name || !category) {
    redirect("/dashboard?error=Fill%20in%20recommendation%20name%20and%20category.");
  }

  if (recommendationId) {
    await prisma.recommendation.updateMany({
      where: { id: recommendationId, propertyId },
      data: {
        title: customTitle || name,
        name,
        customTitle,
        category,
        description,
        customDescription,
        address: formattedAddress,
        url: googleMapsUrl,
        placeId: optionalValue(formData, "placeId"),
        formattedAddress,
        latitude: optionalNumberValue(formData, "latitude"),
        longitude: optionalNumberValue(formData, "longitude"),
        googleMapsUrl,
        rating: optionalNumberValue(formData, "rating"),
        userRatingsTotal: optionalNumberValue(formData, "userRatingsTotal"),
        openingHours: stringListValue(formData, "openingHours"),
        website: optionalValue(formData, "website"),
        phoneNumber: optionalValue(formData, "phoneNumber"),
        photoUrl: optionalValue(formData, "photoUrl"),
        imageUrl: optionalValue(formData, "photoUrl"),
        isEssential: checkedValue(formData, "isEssential"),
        isVisible: formData.get("isVisible") !== "",
        sortOrder: optionalNumberValue(formData, "sortOrder") || undefined
      }
    });
  } else {
    const recommendationCount = await prisma.recommendation.count({ where: { propertyId } });
    await prisma.recommendation.create({
      data: {
        propertyId,
        title: customTitle || name,
        name,
        customTitle,
        category,
        description,
        customDescription,
        address: formattedAddress,
        url: googleMapsUrl,
        placeId: optionalValue(formData, "placeId"),
        formattedAddress,
        latitude: optionalNumberValue(formData, "latitude"),
        longitude: optionalNumberValue(formData, "longitude"),
        googleMapsUrl,
        rating: optionalNumberValue(formData, "rating"),
        userRatingsTotal: optionalNumberValue(formData, "userRatingsTotal"),
        openingHours: stringListValue(formData, "openingHours"),
        website: optionalValue(formData, "website"),
        phoneNumber: optionalValue(formData, "phoneNumber"),
        photoUrl: optionalValue(formData, "photoUrl"),
        imageUrl: optionalValue(formData, "photoUrl"),
        isEssential: checkedValue(formData, "isEssential"),
        isVisible: formData.get("isVisible") !== "",
        sortOrder: optionalNumberValue(formData, "sortOrder") || recommendationCount + 1
      }
    });
  }

  revalidatePath("/dashboard");
  if (property?.slug) revalidatePublicGuide(property.slug);
  redirect("/dashboard?saved=recommendation");
}

export async function saveRecommendationInline(formData: FormData) {
  try {
    const user = await requireReadyUser();
    const propertyId = stringValue(formData, "propertyId");
    const recommendationId = stringValue(formData, "recommendationId");
    if (!propertyId) {
      throw new Error("Create the property before adding local tips.");
    }

    const property = await prisma.property.findFirst({
      where: {
        id: propertyId,
        ...(user.role === "ADMIN" ? {} : { ownerId: user.id })
      },
      select: { slug: true }
    });
    if (!property) {
      throw new Error("Property access expired. Refresh and try again.");
    }

    const title = stringValue(formData, "title");
    const name = stringValue(formData, "name") || stringValue(formData, "manualName") || title;
    const customTitle = optionalValue(formData, "customTitle") || (title && title !== name ? title : null);
    const category = stringValue(formData, "category");
    const description = stringValue(formData, "description") || stringValue(formData, "customDescription");
    const customDescription = optionalValue(formData, "customDescription") || optionalValue(formData, "description");
    const googleMapsUrl = optionalValue(formData, "googleMapsUrl") || optionalValue(formData, "url");
    const formattedAddress = optionalValue(formData, "formattedAddress") || optionalValue(formData, "address");

    if (!name || !category) {
      throw new Error("Fill in recommendation name and category.");
    }

    const recommendationSelect = {
      id: true,
      propertyId: true,
      title: true,
      category: true,
      description: true,
      address: true,
      url: true,
      imageUrl: true,
      placeId: true,
      name: true,
      customTitle: true,
      customDescription: true,
      formattedAddress: true,
      latitude: true,
      longitude: true,
      googleMapsUrl: true,
      rating: true,
      userRatingsTotal: true,
      openingHours: true,
      website: true,
      phoneNumber: true,
      photoUrl: true,
      isEssential: true,
      isVisible: true,
      sortOrder: true
    } as const;

    const recommendation = recommendationId
      ? await (async () => {
          const existingRecommendation = await prisma.recommendation.findFirst({
            where: { id: recommendationId, propertyId },
            select: { id: true }
          });
          if (!existingRecommendation) {
            throw new Error("Recommendation access expired. Refresh and try again.");
          }

          return prisma.recommendation.update({
            where: { id: recommendationId },
            data: {
              title: customTitle || name,
              name,
              customTitle,
              category,
              description,
              customDescription,
              address: formattedAddress,
              url: googleMapsUrl,
              placeId: optionalValue(formData, "placeId"),
              formattedAddress,
              latitude: optionalNumberValue(formData, "latitude"),
              longitude: optionalNumberValue(formData, "longitude"),
              googleMapsUrl,
              rating: optionalNumberValue(formData, "rating"),
              userRatingsTotal: optionalNumberValue(formData, "userRatingsTotal"),
              openingHours: stringListValue(formData, "openingHours"),
              website: optionalValue(formData, "website"),
              phoneNumber: optionalValue(formData, "phoneNumber"),
              photoUrl: optionalValue(formData, "photoUrl"),
              imageUrl: optionalValue(formData, "photoUrl"),
              isEssential: checkedValue(formData, "isEssential"),
              isVisible: formData.get("isVisible") !== "",
              sortOrder: optionalNumberValue(formData, "sortOrder") || undefined
            },
            select: recommendationSelect
          });
        })()
      : await prisma.recommendation.create({
          data: {
            propertyId,
            title: customTitle || name,
            name,
            customTitle,
            category,
            description,
            customDescription,
            address: formattedAddress,
            url: googleMapsUrl,
            placeId: optionalValue(formData, "placeId"),
            formattedAddress,
            latitude: optionalNumberValue(formData, "latitude"),
            longitude: optionalNumberValue(formData, "longitude"),
            googleMapsUrl,
            rating: optionalNumberValue(formData, "rating"),
            userRatingsTotal: optionalNumberValue(formData, "userRatingsTotal"),
            openingHours: stringListValue(formData, "openingHours"),
            website: optionalValue(formData, "website"),
            phoneNumber: optionalValue(formData, "phoneNumber"),
            photoUrl: optionalValue(formData, "photoUrl"),
            imageUrl: optionalValue(formData, "photoUrl"),
            isEssential: checkedValue(formData, "isEssential"),
            isVisible: formData.get("isVisible") !== "",
            sortOrder: optionalNumberValue(formData, "sortOrder") || (await prisma.recommendation.count({ where: { propertyId } })) + 1
          },
          select: recommendationSelect
        });

    revalidatePublicGuide(property.slug);

    return {
      ok: true,
      data: { recommendation },
      message: "Recommendation saved."
    };
  } catch (error) {
    return {
      ok: false,
      error: inlineActionError(error, "Could not save the recommendation.")
    };
  }
}

export async function deleteRecommendation(formData: FormData) {
  const user = await requireReadyUser();
  const id = stringValue(formData, "id");
  const recommendation = id
    ? await prisma.recommendation.findFirst({
        where: {
          id,
          property: user.role === "ADMIN" ? undefined : { ownerId: user.id }
        },
        select: {
          property: {
            select: { slug: true }
          }
        }
      })
    : null;
  if (id) {
    await prisma.recommendation.deleteMany({
      where: {
        id,
        property: user.role === "ADMIN" ? undefined : { ownerId: user.id }
      }
    });
  }

  revalidatePath("/dashboard");
  if (recommendation?.property.slug) revalidatePublicGuide(recommendation.property.slug);
  redirect("/dashboard?saved=recommendation-removed");
}

export async function deleteRecommendationInline(formData: FormData) {
  try {
    const user = await requireReadyUser();
    const id = stringValue(formData, "id");
    if (!id) {
      throw new Error("Missing recommendation.");
    }

    const recommendation = await prisma.recommendation.findFirst({
      where: {
        id,
        property: user.role === "ADMIN" ? undefined : { ownerId: user.id }
      },
      select: {
        property: {
          select: { slug: true }
        }
      }
    });

    await prisma.recommendation.deleteMany({
      where: {
        id,
        property: user.role === "ADMIN" ? undefined : { ownerId: user.id }
      }
    });

    if (recommendation?.property.slug) revalidatePublicGuide(recommendation.property.slug);

    return {
      ok: true,
      data: { id },
      message: "Recommendation removed."
    };
  } catch (error) {
    return {
      ok: false,
      error: inlineActionError(error, "Could not remove the recommendation.")
    };
  }
}

export async function saveReviewLinks(formData: FormData) {
  const user = await requireReadyUser();
  const propertyId = stringValue(formData, "propertyId");
  if (!propertyId) {
    redirect("/dashboard");
  }

  const property = await ensureAccessibleProperty(propertyId, user);
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
  revalidatePublicGuide(property.slug);
  redirect("/dashboard?saved=reviews");
}

export async function saveReviewLinksInline(formData: FormData) {
  try {
    const user = await requireReadyUser();
    const propertyId = stringValue(formData, "propertyId");
    if (!propertyId) {
      throw new Error("Create the property before adding review links.");
    }

    const property = await ensureAccessibleProperty(propertyId, user);
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

    const reviewLinks = await prisma.reviewLink.findMany({
      where: { propertyId },
      select: {
        id: true,
        propertyId: true,
        platform: true,
        url: true
      }
    });

    revalidatePublicGuide(property.slug);

    return {
      ok: true,
      data: { reviewLinks },
      message: "Review path saved."
    };
  } catch (error) {
    return {
      ok: false,
      error: inlineActionError(error, "Could not save review links.")
    };
  }
}

type ActionUser = Awaited<ReturnType<typeof requireReadyUser>>;

async function ensureAccessibleProperty(propertyId: string, user: ActionUser) {
  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      ...(user.role === "ADMIN" ? {} : { ownerId: user.id })
    },
    select: {
      id: true,
      slug: true
    }
  });

  if (!property) {
    redirect("/dashboard");
  }

  return property;
}

async function updateAccessibleProperty(propertyId: string, user: ActionUser, data: Parameters<typeof prisma.property.update>[0]["data"]) {
  await ensureAccessibleProperty(propertyId, user);
  return prisma.property.update({
    where: { id: propertyId },
    data,
    select: {
      slug: true
    }
  });
}
