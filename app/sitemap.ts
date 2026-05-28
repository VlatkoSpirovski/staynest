import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  // Only include public marketing/legal pages (not dashboard/auth/billing, not guest guides).
  const routes = [
    "/",
    "/pricing",
    "/contact",
    "/terms",
    "/privacy",
    "/refund"
  ];

  return routes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.6
  }));
}

