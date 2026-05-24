import "server-only";

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

const PUBLIC_GUIDE_REVALIDATE_SECONDS = 60 * 60 * 24;

export function publicGuideCacheTag(slug: string) {
  return `public-guide:${slug}`;
}

export function getCachedPublicGuideHome(slug: string) {
  return unstable_cache(
    async () =>
      prisma.property.findUnique({
        where: { slug },
        select: {
          slug: true,
          name: true,
          logoUrl: true,
          coverImageUrl: true,
          accentColor: true,
          templateId: true,
          designSerif: true,
          designRounded: true
        }
      }),
    ["public-guide-home", slug],
    {
      tags: [publicGuideCacheTag(slug)],
      revalidate: PUBLIC_GUIDE_REVALIDATE_SECONDS
    }
  )();
}

export function getCachedPublicGuideSection(slug: string) {
  return unstable_cache(
    async () =>
      prisma.property.findUnique({
        where: { slug },
        select: {
          slug: true,
          name: true,
          accentColor: true,
          templateId: true,
          designSerif: true,
          designRounded: true,
          wifiName: true,
          wifiPassword: true,
          checkInInfo: true,
          checkOutInfo: true,
          parkingInfo: true,
          houseRules: true,
          emergencyInfo: true,
          hostContactName: true,
          hostPhone: true,
          hostEmail: true,
          guideSections: {
            orderBy: { sortOrder: "asc" },
            select: {
              id: true,
              title: true,
              content: true
            }
          },
          recommendations: {
            orderBy: { sortOrder: "asc" },
            select: {
              id: true,
              title: true,
              category: true,
              description: true,
              address: true,
              url: true
            }
          },
          reviewLinks: {
            select: {
              id: true,
              platform: true,
              url: true
            }
          }
        }
      }),
    ["public-guide-section", slug],
    {
      tags: [publicGuideCacheTag(slug)],
      revalidate: PUBLIC_GUIDE_REVALIDATE_SECONDS
    }
  )();
}

export function getCachedPublicGuideRedirect(slug: string) {
  return unstable_cache(
    async () =>
      prisma.property.findUnique({
        where: { slug },
        select: { slug: true }
      }),
    ["public-guide-redirect", slug],
    {
      tags: [publicGuideCacheTag(slug)],
      revalidate: PUBLIC_GUIDE_REVALIDATE_SECONDS
    }
  )();
}

export function getCachedPublicGuideChatContext(slug: string) {
  return unstable_cache(
    async () =>
      prisma.property.findUnique({
        where: { slug },
        select: {
          name: true,
          welcomeMessage: true,
          wifiName: true,
          wifiPassword: true,
          checkInInfo: true,
          checkOutInfo: true,
          parkingInfo: true,
          houseRules: true,
          emergencyInfo: true,
          hostContactName: true,
          hostPhone: true,
          hostEmail: true,
          aiKnowledge: true,
          guideSections: {
            orderBy: { sortOrder: "asc" },
            select: {
              title: true,
              content: true
            }
          },
          recommendations: {
            orderBy: { sortOrder: "asc" },
            select: {
              title: true,
              category: true,
              description: true,
              address: true,
              url: true
            }
          },
          reviewLinks: {
            select: {
              platform: true,
              url: true
            }
          }
        }
      }),
    ["public-guide-chat", slug],
    {
      tags: [publicGuideCacheTag(slug)],
      revalidate: PUBLIC_GUIDE_REVALIDATE_SECONDS
    }
  )();
}
