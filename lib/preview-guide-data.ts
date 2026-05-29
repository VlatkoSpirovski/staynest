import { prisma } from "@/lib/prisma";
import type { GuestGuideSectionProperty } from "@/components/guest-guide-section";

type PreviewGuideData = GuestGuideSectionProperty & {
  logoUrl: string | null;
  coverImageUrl: string | null;
};

export async function getPreviewGuideData(token: string): Promise<PreviewGuideData | null> {
  const preview = await prisma.propertyPreview.findUnique({
    where: { token },
  });

  if (!preview || preview.claimedPropertyId || preview.expiresAt <= new Date()) {
    return null;
  }

  const guideSections = [];
  if (preview.facilities) {
    guideSections.push({
      id: "facilities",
      title: "Amenities & facilities",
      content: preview.facilities,
    });
  }
  if (preview.locationInfo) {
    guideSections.push({
      id: "location",
      title: "Location overview",
      content: preview.locationInfo,
    });
  }
  if (preview.recommendationsDraft) {
    guideSections.push({
      id: "recommendations-draft",
      title: "Recommendations draft",
      content: preview.recommendationsDraft,
    });
  }
  if (preview.essentialsDraft) {
    guideSections.push({
      id: "essentials-draft",
      title: "Essentials draft",
      content: preview.essentialsDraft,
    });
  }

  return {
    slug: preview.token,
    name: preview.name || "Preview Property",
    logoUrl: null,
    coverImageUrl: preview.coverImageUrl,
    accentColor: "#4a8a8f", // default lagoon
    templateId: "modern",
    designSerif: false,
    designRounded: true,
    wifiName: null,
    wifiPassword: null,
    checkInInfo: preview.checkInInfo,
    checkOutInfo: preview.checkOutInfo,
    parkingInfo: preview.parkingInfo,
    houseRules: preview.houseRules,
    emergencyInfo: preview.emergencyInfo,
    hostContactName: preview.hostContactName,
    hostPhone: null,
    hostEmail: null,
    aiKnowledge: preview.aiKnowledge,
    guideSections,
    recommendations: [],
    reviewLinks: [],
  };
}
