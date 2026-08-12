import { logoutOwner } from "@/app/auth-actions";
import {
  deleteRecommendationInline,
  importListingFromUrl,
  savePropertyDesignInline,
  savePropertyInline,
  saveRecommendationInline,
  saveReviewLinksInline
} from "@/app/actions";
import DashboardClient from "@/components/dashboard-client";
import { requireReadyUser } from "@/lib/auth";
import { billingUrl, hasBillingAccess, normalizePlanKey, planOption, trialDaysRemaining } from "@/lib/billing";
import { prisma } from "@/lib/prisma";
import { createUniquePublicCode } from "@/lib/secure-slug";
import { getSiteUrl } from "@/lib/utils";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const preferredRegion = "fra1";
export const metadata = {
  title: "Dashboard",
  robots: {
    index: false,
    follow: false
  }
};

type DashboardPageProps = {
  searchParams?: {
    saved?: string;
    error?: string;
    welcome?: string;
    preview?: string;
  };
};

async function getDashboardProperty(ownerId: string) {
  return prisma.property.findFirst({
    where: { ownerId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      ownerId: true,
      name: true,
      slug: true,
      publicCode: true,
      logoUrl: true,
      coverImageUrl: true,
      accentColor: true,
      templateId: true,
      designSerif: true,
      designRounded: true,
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
      recommendations: {
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          propertyId: true,
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
          isVisible: true,
          sortOrder: true
        }
      },
      reviewLinks: {
        select: {
          id: true,
          propertyId: true,
          platform: true,
          url: true
        }
      }
    }
  });
}

function savedMessage(saved?: string) {
  if (saved === "property") return "Guest experience saved.";
  if (saved === "recommendation") return "Recommendation added to the guest guide.";
  if (saved === "recommendation-removed") return "Recommendation removed.";
  if (saved === "reviews") return "Review paths updated.";
  if (saved === "design") return "Template updated successfully.";
  return null;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await requireReadyUser();
  if (!hasBillingAccess(user)) {
    redirect(billingUrl(user.selectedPlan));
  }

  let property = await getDashboardProperty(user.id);

  // Properties created before short links existed have no code yet. Mint one on
  // first view so every owner gets the short URL without a manual backfill.
  if (property && !property.publicCode) {
    const publicCode = await createUniquePublicCode();
    await prisma.property.update({ where: { id: property.id }, data: { publicCode } });
    property = { ...property, publicCode };
  }

  const publicUrl = property
    ? property.publicCode
      ? `${getSiteUrl()}/g/${property.publicCode}`
      : `${getSiteUrl()}/stay/${property.slug}`
    : "";
  const qrCode = publicUrl ? `/api/qr?text=${encodeURIComponent(publicUrl)}` : "";
  const selectedPlan = normalizePlanKey(user.selectedPlan);
  const currentPlan = planOption(selectedPlan);
  const planName = currentPlan.tier === "ai" ? "Premium AI Concierge" : "Essential Guest Guide";
  const trialLabel = user.trialEndsAt
    ? user.trialEndsAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : null;

  return (
    <DashboardClient
      property={property}
      user={user}
      publicUrl={publicUrl}
      qrCode={qrCode}
      successMessage={savedMessage(searchParams?.saved)}
      errorMessage={searchParams?.error || null}
      planName={planName}
      selectedPlan={selectedPlan}
      trialLabel={trialLabel}
      trialDaysLeft={trialDaysRemaining(user)}
      subscriptionStatus={user.subscriptionStatus}
      isFirstVisit={searchParams?.welcome === "1"}
      logoutAction={logoutOwner}
      importListingAction={importListingFromUrl}
      savePropertyInlineAction={savePropertyInline}
      savePropertyDesignInlineAction={savePropertyDesignInline}
      saveRecommendationInlineAction={saveRecommendationInline}
      deleteRecommendationInlineAction={deleteRecommendationInline}
      saveReviewLinksInlineAction={saveReviewLinksInline}
    />
  );
}
