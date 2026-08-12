"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { ReviewPlatform, UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { destroyAllUserSessions, requireAdminUser } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { passwordRulesText, validatePassword } from "@/lib/password-policy";
import { publicCodeCacheTag, publicGuideCacheTag } from "@/lib/public-guide-cache";
import { createUniquePublicCode, createUniqueSecureSlug, hasSecureSlugSuffix } from "@/lib/secure-slug";
import { normalizeSlug } from "@/lib/utils";

function stringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalValue(formData: FormData, key: string) {
  const value = stringValue(formData, key);
  return value.length > 0 ? value : null;
}

function redirectWithAdminError(message: string): never {
  redirect(`/admin?error=${encodeURIComponent(message)}`);
}

function validateAdminPassword(password: string) {
  const passwordErrors = validatePassword(password);
  if (passwordErrors.length > 0) {
    redirectWithAdminError(`Password must include ${passwordErrors.join(", ")}. ${passwordRulesText()}`);
  }
}

function revalidatePublicGuide(slug: string) {
  revalidateTag(publicGuideCacheTag(slug));
}

export async function createUser(formData: FormData) {
  await requireAdminUser();
  const name = stringValue(formData, "name");
  const email = stringValue(formData, "email").toLowerCase();
  const temporaryPassword = stringValue(formData, "temporaryPassword");
  const role = stringValue(formData, "role") === "ADMIN" ? UserRole.ADMIN : UserRole.OWNER;

  if (!name || !email || !temporaryPassword) {
    redirectWithAdminError("Fill in name, email and temporary password.");
  }

  validateAdminPassword(temporaryPassword);

  await prisma.user.create({
    data: {
      name,
      email,
      role,
      passwordHash: hashPassword(temporaryPassword),
      emailVerifiedAt: new Date(),
      mustChangePassword: true
    }
  });

  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateUser(formData: FormData) {
  const admin = await requireAdminUser();
  const id = stringValue(formData, "id");
  const name = stringValue(formData, "name");
  const email = stringValue(formData, "email").toLowerCase();
  const temporaryPassword = stringValue(formData, "temporaryPassword");
  const role = stringValue(formData, "role") === "ADMIN" ? UserRole.ADMIN : UserRole.OWNER;

  if (!id || !name || !email) {
    redirectWithAdminError("Fill in user name and email.");
  }

  if (admin.id === id && role !== UserRole.ADMIN) {
    redirectWithAdminError("You cannot remove your own admin role.");
  }

  const data: Parameters<typeof prisma.user.update>[0]["data"] = {
    name,
    email,
    role
  };

  if (temporaryPassword) {
    validateAdminPassword(temporaryPassword);
    data.passwordHash = hashPassword(temporaryPassword);
    data.mustChangePassword = true;
  }

  await prisma.user.update({
    where: { id },
    data
  });

  if (temporaryPassword) {
    await destroyAllUserSessions(id);
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  redirect("/admin");
}

export async function deleteUser(formData: FormData) {
  const admin = await requireAdminUser();
  const id = stringValue(formData, "id");

  if (!id || id === admin.id) {
    redirectWithAdminError("You cannot delete your own admin account.");
  }

  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin");
  redirect("/admin");
}

export async function createAdminProperty(formData: FormData) {
  await requireAdminUser();
  const ownerId = stringValue(formData, "ownerId");
  const name = stringValue(formData, "name") || "Untitled Property";
  const slug = await createUniqueSecureSlug(stringValue(formData, "slug") || name);

  if (!ownerId) {
    redirectWithAdminError("Assign an owner before creating a property.");
  }

  await prisma.property.create({
    data: {
      ownerId,
      name,
      slug,
      publicCode: await createUniquePublicCode(),
      accentColor: stringValue(formData, "accentColor") || "#4a8a8f",
      logoUrl: optionalValue(formData, "logoUrl"),
      coverImageUrl: optionalValue(formData, "coverImageUrl"),
      welcomeMessage: stringValue(formData, "welcomeMessage") || "Welcome. We are happy to host you.",
      wifiName: optionalValue(formData, "wifiName"),
      wifiPassword: optionalValue(formData, "wifiPassword"),
      checkInInfo: optionalValue(formData, "checkInInfo"),
      checkOutInfo: optionalValue(formData, "checkOutInfo"),
      parkingInfo: optionalValue(formData, "parkingInfo"),
      houseRules: optionalValue(formData, "houseRules"),
      emergencyInfo: optionalValue(formData, "emergencyInfo"),
      hostContactName: optionalValue(formData, "hostContactName"),
      hostPhone: optionalValue(formData, "hostPhone"),
      hostEmail: optionalValue(formData, "hostEmail"),
      aiKnowledge: optionalValue(formData, "aiKnowledge")
    }
  });

  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateAdminProperty(formData: FormData) {
  await requireAdminUser();
  const id = stringValue(formData, "id");
  const ownerId = stringValue(formData, "ownerId");
  const name = stringValue(formData, "name") || "Untitled Property";
  const requestedSlug = normalizeSlug(stringValue(formData, "slug"));

  if (!id || !ownerId) {
    redirectWithAdminError("Choose a property and owner.");
  }

  const existingProperty = await prisma.property.findUnique({
    where: { id },
    select: { slug: true }
  });

  if (!existingProperty) {
    redirectWithAdminError("Choose an existing property.");
  }

  let slug =
    requestedSlug && requestedSlug !== existingProperty.slug
      ? await createUniqueSecureSlug(requestedSlug, id)
      : existingProperty.slug;

  if (!hasSecureSlugSuffix(slug)) {
    slug = await createUniqueSecureSlug(name, id);
  }

  const property = await prisma.property.update({
    where: { id },
    data: {
      ownerId,
      name,
      slug,
      accentColor: stringValue(formData, "accentColor") || "#4a8a8f",
      logoUrl: optionalValue(formData, "logoUrl"),
      coverImageUrl: optionalValue(formData, "coverImageUrl"),
      welcomeMessage: stringValue(formData, "welcomeMessage") || "Welcome. We are happy to host you.",
      wifiName: optionalValue(formData, "wifiName"),
      wifiPassword: optionalValue(formData, "wifiPassword"),
      checkInInfo: optionalValue(formData, "checkInInfo"),
      checkOutInfo: optionalValue(formData, "checkOutInfo"),
      parkingInfo: optionalValue(formData, "parkingInfo"),
      houseRules: optionalValue(formData, "houseRules"),
      emergencyInfo: optionalValue(formData, "emergencyInfo"),
      hostContactName: optionalValue(formData, "hostContactName"),
      hostPhone: optionalValue(formData, "hostPhone"),
      hostEmail: optionalValue(formData, "hostEmail"),
      aiKnowledge: optionalValue(formData, "aiKnowledge")
    }
  });

  revalidatePath("/admin");
  revalidatePublicGuide(existingProperty.slug);
  revalidatePublicGuide(property.slug);
  redirect("/admin");
}

export async function rotateAdminPropertySlug(formData: FormData) {
  await requireAdminUser();
  const id = stringValue(formData, "id");

  if (!id) {
    redirectWithAdminError("Choose a property.");
  }

  const property = await prisma.property.findUnique({
    where: { id },
    select: { id: true, name: true, slug: true, publicCode: true }
  });

  if (!property) {
    redirectWithAdminError("Choose an existing property.");
  }

  const slug = await createUniqueSecureSlug(property.name, property.id);
  const publicCode = await createUniquePublicCode();
  const previousPublicCode = property.publicCode;
  await prisma.property.update({
    where: { id: property.id },
    data: { slug, publicCode }
  });

  revalidatePath("/admin");
  revalidatePublicGuide(property.slug);
  revalidatePublicGuide(slug);
  if (previousPublicCode) revalidateTag(publicCodeCacheTag(previousPublicCode));
  revalidateTag(publicCodeCacheTag(publicCode));
  redirect("/admin");
}

export async function deleteAdminProperty(formData: FormData) {
  await requireAdminUser();
  const id = stringValue(formData, "id");
  const property = id
    ? await prisma.property.findUnique({
        where: { id },
        select: { slug: true }
      })
    : null;

  if (id) {
    await prisma.property.delete({ where: { id } });
  }

  revalidatePath("/admin");
  if (property?.slug) revalidatePublicGuide(property.slug);
  redirect("/admin");
}

export async function saveAdminRecommendation(formData: FormData) {
  await requireAdminUser();
  const propertyId = stringValue(formData, "propertyId");
  const recommendationId = stringValue(formData, "recommendationId");
  const title = stringValue(formData, "title");
  const category = stringValue(formData, "category");
  const description = stringValue(formData, "description");

  if (!propertyId || !title || !category || !description) {
    redirectWithAdminError("Fill in recommendation title, category and description.");
  }

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { slug: true }
  });

  if (!property) {
    redirectWithAdminError("Choose an existing property.");
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

  revalidatePath("/admin");
  revalidatePublicGuide(property.slug);
  redirect("/admin");
}

export async function deleteAdminRecommendation(formData: FormData) {
  await requireAdminUser();
  const id = stringValue(formData, "id");
  const recommendation = id
    ? await prisma.recommendation.findUnique({
        where: { id },
        select: {
          property: {
            select: { slug: true }
          }
        }
      })
    : null;

  if (id) {
    await prisma.recommendation.delete({ where: { id } });
  }

  revalidatePath("/admin");
  if (recommendation?.property.slug) revalidatePublicGuide(recommendation.property.slug);
  redirect("/admin");
}

export async function saveAdminReviewLinks(formData: FormData) {
  await requireAdminUser();
  const propertyId = stringValue(formData, "propertyId");

  if (!propertyId) {
    redirectWithAdminError("Choose an existing property.");
  }

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { slug: true }
  });

  if (!property) {
    redirectWithAdminError("Choose an existing property.");
  }

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

  revalidatePath("/admin");
  revalidatePublicGuide(property.slug);
  redirect("/admin");
}
