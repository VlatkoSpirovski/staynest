/** Sections a public guide can render. Shared by every guide route. */
export const GUIDE_SECTION_IDS = new Set([
  "wifi",
  "contact",
  "arrival",
  "house",
  "restaurants",
  "activities",
  "essentials",
  "reviews",
  "emergency"
]);

/**
 * Top-level paths the app owns. The root `/[slug]` alias must never shadow these,
 * and checking the list is far cheaper than a database lookup for the stream of
 * `/wp-admin`-style requests that public sites attract.
 */
export const RESERVED_ROOT_PATHS = new Set([
  "api",
  "admin",
  "auth",
  "billing",
  "change-password",
  "check-email",
  "contact",
  "dashboard",
  "forgot-password",
  "g",
  "login",
  "preview",
  "pricing",
  "privacy",
  "refund",
  "register",
  "reset-password",
  "settings",
  "sitemap.xml",
  "robots.txt",
  "stay",
  "terms",
  "verify-email",
  "favicon.ico",
  "_next",
  "well-known"
]);

/** Cheap shape gate for slug-like paths, applied before any database lookup. */
export function looksLikeGuideSlug(value: string) {
  if (value.length < 3 || value.length > 80) return false;
  if (RESERVED_ROOT_PATHS.has(value.toLowerCase())) return false;
  if (value.includes(".")) return false;
  return /^[a-z0-9][a-z0-9-]*$/.test(value.toLowerCase());
}
