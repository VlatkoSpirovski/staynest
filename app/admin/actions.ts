"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { passwordRulesText, validatePassword } from "@/lib/password-policy";
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
  const slug = normalizeSlug(stringValue(formData, "slug") || name);

  if (!ownerId) {
    redirectWithAdminError("Assign an owner before creating a property.");
  }

  await prisma.property.create({
    data: {
      ownerId,
      name,
      slug,
      accentColor: stringValue(formData, "accentColor") || "#4a8a8f",
      logoUrl: optionalValue(formData, "logoUrl"),
      coverImageUrl: optionalValue(formData, "coverImageUrl"),
      welcomeMessage: stringValue(formData, "welcomeMessage") || "Welcome. We are happy to host you."
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

  if (!id || !ownerId) {
    redirectWithAdminError("Choose a property and owner.");
  }

  const property = await prisma.property.update({
    where: { id },
    data: {
      ownerId,
      name,
      slug: normalizeSlug(stringValue(formData, "slug") || name),
      accentColor: stringValue(formData, "accentColor") || "#4a8a8f",
      logoUrl: optionalValue(formData, "logoUrl"),
      coverImageUrl: optionalValue(formData, "coverImageUrl"),
      welcomeMessage: stringValue(formData, "welcomeMessage") || "Welcome. We are happy to host you."
    }
  });

  revalidatePath("/admin");
  revalidatePath(`/stay/${property.slug}`);
  redirect("/admin");
}

export async function deleteAdminProperty(formData: FormData) {
  await requireAdminUser();
  const id = stringValue(formData, "id");

  if (id) {
    await prisma.property.delete({ where: { id } });
  }

  revalidatePath("/admin");
  redirect("/admin");
}
