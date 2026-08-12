import "server-only";

import { GuideSectionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { recordPreviewEvent } from "@/lib/preview-analytics";
import { createUniquePublicCode, createUniqueSecureSlug } from "@/lib/secure-slug";

export async function claimPropertyPreview(previewToken: string, ownerId: string) {
  const preview = await prisma.propertyPreview.findUnique({ where: { token: previewToken } });

  if (!preview || preview.claimedPropertyId || preview.expiresAt <= new Date()) {
    return null;
  }

  const propertyName = preview.name || "Imported Property";
  const slug = await createUniqueSecureSlug(propertyName);
  const property = await prisma.property.create({
    data: {
      ownerId,
      name: propertyName,
      slug,
      publicCode: await createUniquePublicCode(),
      welcomeMessage: preview.welcomeMessage || `Welcome to ${propertyName}.`,
      coverImageUrl: preview.coverImageUrl,
      checkInInfo: preview.checkInInfo,
      checkOutInfo: preview.checkOutInfo,
      parkingInfo: preview.parkingInfo,
      houseRules: preview.houseRules,
      emergencyInfo: preview.emergencyInfo,
      hostContactName: preview.hostContactName,
      aiKnowledge: preview.aiKnowledge
    }
  });

  const draftSections = [
    { title: "Amenities & facilities", content: preview.facilities, sortOrder: 5 },
    { title: "Location overview", content: preview.locationInfo, sortOrder: 6 },
    { title: "Recommendations draft", content: preview.recommendationsDraft, sortOrder: 7 },
    { title: "Essentials draft", content: preview.essentialsDraft, sortOrder: 8 }
  ];

  for (const section of draftSections) {
    const content = section.content?.trim();
    if (!content) continue;

    await prisma.guideSection.create({
      data: {
        propertyId: property.id,
        type: GuideSectionType.CUSTOM,
        title: section.title,
        content,
        sortOrder: section.sortOrder
      }
    });
  }

  await prisma.propertyPreview.update({
    where: { id: preview.id },
    data: { claimedPropertyId: property.id }
  });

  await recordPreviewEvent({
    eventName: "preview_claimed",
    previewToken,
    propertyId: property.id
  });

  return property;
}
