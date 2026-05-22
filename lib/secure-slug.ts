import "server-only";

import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { normalizeSlug } from "@/lib/utils";

const secureSuffixPattern = /-[a-f0-9]{12}$/;

export function hasSecureSlugSuffix(slug: string) {
  return secureSuffixPattern.test(slug);
}

export function secureSlugCandidate(value: string) {
  const base = normalizeSlug(value).replace(secureSuffixPattern, "") || "stay";
  const suffix = randomBytes(6).toString("hex");
  return `${base.slice(0, 51)}-${suffix}`;
}

export async function createUniqueSecureSlug(value: string, excludePropertyId?: string) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const slug = secureSlugCandidate(value);
    const existing = await prisma.property.findFirst({
      where: {
        slug,
        ...(excludePropertyId ? { id: { not: excludePropertyId } } : {})
      },
      select: { id: true }
    });

    if (!existing) return slug;
  }

  throw new Error("Could not create a secure public link. Please try again.");
}
