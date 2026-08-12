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

/**
 * Alphabet for public codes: Crockford-style base32 with the characters people
 * misread removed (no 0/O, 1/I/L, U). A guest may have to read one of these off a
 * printed card, so ambiguity costs more than a few bits of entropy.
 */
const codeAlphabet = "23456789abcdefghjkmnpqrstvwxyz";
const publicCodeLength = 10;

/** ~49 bits of entropy, on par with the 12-hex legacy suffix but 2 characters shorter. */
export function publicCodeCandidate() {
  const bytes = randomBytes(publicCodeLength);
  let code = "";
  for (let i = 0; i < publicCodeLength; i += 1) {
    code += codeAlphabet[bytes[i]! % codeAlphabet.length];
  }
  return code;
}

export function isPublicCodeShape(value: string) {
  return value.length === publicCodeLength && new RegExp(`^[${codeAlphabet}]+$`).test(value);
}

export async function createUniquePublicCode() {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const publicCode = publicCodeCandidate();
    const existing = await prisma.property.findUnique({ where: { publicCode }, select: { id: true } });
    if (!existing) return publicCode;
  }

  throw new Error("Could not create a public link. Please try again.");
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
