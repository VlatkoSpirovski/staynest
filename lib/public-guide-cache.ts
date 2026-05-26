import "server-only";

import { unstable_cache } from "next/cache";
import { examplePublicGuide, isExamplePublicGuide } from "@/lib/example-public-guide";
import { prisma } from "@/lib/prisma";

const PUBLIC_GUIDE_REVALIDATE_SECONDS = 60 * 60 * 24;

export function publicGuideCacheTag(slug: string) {
  return `public-guide:${slug}`;
}

export function getCachedPublicGuideHome(slug: string) {
  return unstable_cache(
    async () => {
      const property = await prisma.property.findUnique({
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
      });
      return property ?? (isExamplePublicGuide(slug) ? {
        slug: examplePublicGuide.slug,
        name: examplePublicGuide.name,
        logoUrl: examplePublicGuide.logoUrl,
        coverImageUrl: examplePublicGuide.coverImageUrl,
        accentColor: examplePublicGuide.accentColor,
        templateId: examplePublicGuide.templateId,
        designSerif: examplePublicGuide.designSerif,
        designRounded: examplePublicGuide.designRounded
      } : null);
    },
    ["public-guide-home", slug],
    {
      tags: [publicGuideCacheTag(slug)],
      revalidate: PUBLIC_GUIDE_REVALIDATE_SECONDS
    }
  )();
}

export function getCachedPublicGuideSection(slug: string) {
  return unstable_cache(
    async () => {
      const property = await prisma.property.findUnique({
        where: { slug },
        select: {
          slug: true,
          name: true,
          logoUrl: true,
          coverImageUrl: true,
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
          aiKnowledge: true,
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
              url: true,
              imageUrl: true,
              placeId: true,
              name: true,
              customTitle: true,
              customDescription: true,
              formattedAddress: true,
              latitude: true,
              longitude: true,
              googleMapsUrl: true,
              rating: true,
              userRatingsTotal: true,
              openingHours: true,
              website: true,
              phoneNumber: true,
              photoUrl: true,
              isEssential: true,
              isVisible: true
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
      });
      return property ?? (isExamplePublicGuide(slug) ? examplePublicGuide : null);
    },
    ["public-guide-section", slug],
    {
      tags: [publicGuideCacheTag(slug)],
      revalidate: PUBLIC_GUIDE_REVALIDATE_SECONDS
    }
  )();
}

export function getCachedPublicGuideRedirect(slug: string) {
  return unstable_cache(
    async () => {
      const property = await prisma.property.findUnique({
        where: { slug },
        select: { slug: true }
      });
      return property ?? (isExamplePublicGuide(slug) ? { slug: examplePublicGuide.slug } : null);
    },
    ["public-guide-redirect", slug],
    {
      tags: [publicGuideCacheTag(slug)],
      revalidate: PUBLIC_GUIDE_REVALIDATE_SECONDS
    }
  )();
}

export function getCachedPublicGuideChatContext(slug: string) {
  return unstable_cache(
    async () => {
      const property = await prisma.property.findUnique({
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
              url: true,
              placeId: true,
              name: true,
              customTitle: true,
              customDescription: true,
              formattedAddress: true,
              googleMapsUrl: true,
              rating: true,
              userRatingsTotal: true,
              website: true,
              phoneNumber: true,
              isEssential: true,
              isVisible: true
            }
          },
          reviewLinks: {
            select: {
              platform: true,
              url: true
            }
          }
        }
      });
      return property ?? (isExamplePublicGuide(slug) ? {
        name: examplePublicGuide.name,
        welcomeMessage: examplePublicGuide.welcomeMessage,
        wifiName: examplePublicGuide.wifiName,
        wifiPassword: examplePublicGuide.wifiPassword,
        checkInInfo: examplePublicGuide.checkInInfo,
        checkOutInfo: examplePublicGuide.checkOutInfo,
        parkingInfo: examplePublicGuide.parkingInfo,
        houseRules: examplePublicGuide.houseRules,
        emergencyInfo: examplePublicGuide.emergencyInfo,
        hostContactName: examplePublicGuide.hostContactName,
        hostPhone: examplePublicGuide.hostPhone,
        hostEmail: examplePublicGuide.hostEmail,
        aiKnowledge: examplePublicGuide.aiKnowledge,
        guideSections: examplePublicGuide.guideSections.map(({ title, content }) => ({ title, content })),
        recommendations: examplePublicGuide.recommendations.map((item) => ({
          title: item.title,
          category: item.category,
          description: item.description,
          address: item.address,
          url: item.url,
          placeId: item.placeId,
          name: item.name,
          customTitle: item.customTitle,
          customDescription: item.customDescription,
          formattedAddress: item.formattedAddress,
          googleMapsUrl: item.googleMapsUrl,
          rating: item.rating,
          userRatingsTotal: item.userRatingsTotal,
          website: item.website,
          phoneNumber: item.phoneNumber,
          isEssential: item.isEssential,
          isVisible: item.isVisible
        })),
        reviewLinks: examplePublicGuide.reviewLinks.map(({ platform, url }) => ({ platform, url }))
      } : null);
    },
    ["public-guide-chat", slug],
    {
      tags: [publicGuideCacheTag(slug)],
      revalidate: PUBLIC_GUIDE_REVALIDATE_SECONDS
    }
  )();
}
