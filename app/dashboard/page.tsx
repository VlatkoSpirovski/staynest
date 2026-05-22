import QRCode from "qrcode";
import { logoutOwner } from "@/app/auth-actions";
import { deleteRecommendation, importListingFromUrl, saveProperty, saveRecommendation, saveReviewLinks } from "@/app/actions";
import DashboardClient from "@/components/dashboard-client";
import { requireReadyUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams?: {
    saved?: string;
    error?: string;
  };
};

async function getDashboardProperty(ownerId: string) {
  return prisma.property.findFirst({
    where: { ownerId },
    orderBy: { updatedAt: "desc" },
    include: {
      recommendations: { orderBy: { sortOrder: "asc" } },
      reviewLinks: true
    }
  });
}

function savedMessage(saved?: string) {
  if (saved === "property") return "Guest experience saved.";
  if (saved === "recommendation") return "Recommendation added to the guest guide.";
  if (saved === "recommendation-removed") return "Recommendation removed.";
  if (saved === "reviews") return "Review paths updated.";
  return null;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await requireReadyUser();
  const property = await getDashboardProperty(user.id);
  const publicUrl = property ? `${getSiteUrl()}/stay/${property.slug}` : "";
  const qrCode = publicUrl ? await QRCode.toDataURL(publicUrl, { margin: 1, width: 260, color: { dark: "#111827" } }) : "";
  const selectedPlan = user.selectedPlan === "ai" ? "ai" : "basic";
  const planName = selectedPlan === "ai" ? "Premium AI Concierge" : "Essential Guest Guide";
  const planPrice = selectedPlan === "ai" ? "€15" : "€10";
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
      planPrice={planPrice}
      selectedPlan={selectedPlan}
      trialLabel={trialLabel}
      logoutAction={logoutOwner}
      importListingAction={importListingFromUrl}
      savePropertyAction={saveProperty}
      saveRecommendationAction={saveRecommendation}
      deleteRecommendationAction={deleteRecommendation}
      saveReviewLinksAction={saveReviewLinks}
    />
  );
}
