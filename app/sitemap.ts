import type { MetadataRoute } from "next";
import { GUIDES_UPDATED, guides } from "@/lib/guides-content";
import { getSiteUrl } from "@/lib/utils";

const PAGES_UPDATED = "2026-11-13";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly"; lastModified: string }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly", lastModified: PAGES_UPDATED },
    { path: "/pricing", priority: 0.8, changeFrequency: "monthly", lastModified: PAGES_UPDATED },
    { path: "/guides", priority: 0.8, changeFrequency: "weekly", lastModified: GUIDES_UPDATED },
    { path: "/tools/wifi-qr-code", priority: 0.8, changeFrequency: "monthly", lastModified: PAGES_UPDATED },
    ...guides.map((guide) => ({ path: `/guides/${guide.slug}`, priority: 0.7, changeFrequency: "monthly" as const, lastModified: guide.updated })),
    { path: "/contact", priority: 0.4, changeFrequency: "yearly", lastModified: PAGES_UPDATED },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly", lastModified: PAGES_UPDATED },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly", lastModified: PAGES_UPDATED },
    { path: "/refund", priority: 0.2, changeFrequency: "yearly", lastModified: PAGES_UPDATED }
  ];

  return pages.map((page) => ({
    url: `${siteUrl}${page.path}`,
    lastModified: new Date(page.lastModified),
    changeFrequency: page.changeFrequency,
    priority: page.priority
  }));
}
