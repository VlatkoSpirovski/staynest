import { notFound } from "next/navigation";
import { GuestGuideSection } from "@/components/guest-guide-section";
import { GuideUnavailable } from "@/components/guide-unavailable";
import { publicGuideStatus } from "@/lib/public-guide-access";
import { getCachedPublicGuideSection } from "@/lib/public-guide-cache";
import { GUIDE_SECTION_IDS } from "@/lib/guide-sections";

export const preferredRegion = "fra1";
export const metadata = {
  robots: {
    index: false,
    follow: false
  }
};

type PageProps = {
  params: {
    slug: string;
    section: string;
  };
};

export default async function GuideSectionPage({ params }: PageProps) {
  if (!GUIDE_SECTION_IDS.has(params.section)) {
    notFound();
  }

  const guideStatus = await publicGuideStatus({ slug: params.slug });
  if (guideStatus === "missing") {
    notFound();
  }
  if (guideStatus === "paused") {
    return <GuideUnavailable />;
  }

  const property = await getCachedPublicGuideSection(params.slug);

  if (!property) {
    notFound();
  }

  return <GuestGuideSection property={property} section={params.section} />;
}
