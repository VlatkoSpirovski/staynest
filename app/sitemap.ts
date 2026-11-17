import type { MetadataRoute } from "next";
import { GUIDES_INDEX_UPDATED, guides } from "@/lib/guides-content";
import { SOLUTION_PAGES_UPDATED, solutionPages } from "@/lib/solution-pages";
import { getSiteUrl } from "@/lib/utils";

const PAGES_UPDATED = "2026-11-13";
const HOME_UPDATED = "2026-11-17";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  const homeLanguages = { en: `${siteUrl}/`, de: `${siteUrl}/de`, it: `${siteUrl}/it`, "x-default": `${siteUrl}/` };

  const pages: {
    path: string;
    priority: number;
    changeFrequency: "weekly" | "monthly" | "yearly";
    lastModified: string;
    languages?: Record<string, string>;
  }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly", lastModified: HOME_UPDATED, languages: homeLanguages },
    { path: "/de", priority: 0.9, changeFrequency: "weekly", lastModified: HOME_UPDATED, languages: homeLanguages },
    { path: "/it", priority: 0.9, changeFrequency: "weekly", lastModified: HOME_UPDATED, languages: homeLanguages },
    ...Object.values(solutionPages).map((page) => ({ path: page.path, priority: 0.9, changeFrequency: "monthly" as const, lastModified: SOLUTION_PAGES_UPDATED })),
    { path: "/pricing", priority: 0.8, changeFrequency: "monthly", lastModified: PAGES_UPDATED },
    { path: "/guides", priority: 0.8, changeFrequency: "weekly", lastModified: GUIDES_INDEX_UPDATED },
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
    priority: page.priority,
    ...(page.languages ? { alternates: { languages: page.languages } } : {})
  }));
}
