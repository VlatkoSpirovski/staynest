"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ReviewPlatform } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireReadyUser } from "@/lib/auth";
import { uploadImage } from "@/lib/image-upload";
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

export async function saveProperty(formData: FormData) {
  const user = await requireReadyUser();
  const propertyId = stringValue(formData, "propertyId");
  const name = stringValue(formData, "name");
  const slug = normalizeSlug(stringValue(formData, "slug") || name);
  const accentColor = stringValue(formData, "accentColor") || "#4a8a8f";
  const wifiName = stringValue(formData, "wifiName");
  const wifiPassword = stringValue(formData, "wifiPassword");
  const hostPhone = stringValue(formData, "hostPhone");
  const hostEmail = stringValue(formData, "hostEmail");

  if (!name || !slug || !wifiName || !wifiPassword || (!hostPhone && !hostEmail)) {
    redirect("/dashboard?error=Property%20name,%20slug,%20Wi-Fi%20and%20host%20contact%20are%20required.");
  }

  const duplicateSlug = await prisma.property.findFirst({
    where: {
      slug,
      ...(propertyId ? { id: { not: propertyId } } : {})
    },
    select: { id: true }
  });

  if (duplicateSlug) {
    redirect("/dashboard?error=That%20public%20slug%20is%20already%20in%20use.");
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
    hostEmail: hostEmail || null
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
    redirect("/dashboard?error=Recommendation%20title,%20category%20and%20description%20are%20required.");
  }

  let imageUrl = optionalValue(formData, "imageUrl");
  if (checkedValue(formData, "removeRecommendationImage")) imageUrl = null;

  try {
    const imageFile = fileValue(formData, "recommendationImageFile");
    if (imageFile) imageUrl = await uploadImage(imageFile, "staynest/recommendations");
  } catch (error) {
    dashboardError(error instanceof Error ? error.message : "Image upload failed.");
  }

  if (recommendationId) {
    await prisma.recommendation.updateMany({
      where: { id: recommendationId, propertyId },
      data: {
        title,
        category,
        description,
        address: optionalValue(formData, "address"),
        url: optionalValue(formData, "url"),
        imageUrl
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
        imageUrl,
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
