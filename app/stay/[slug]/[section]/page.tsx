import { notFound } from "next/navigation";
import { GuestGuideSection } from "@/components/guest-guide-section";
import { getCachedPublicGuideSection } from "@/lib/public-guide-cache";

export const preferredRegion = "fra1";
export const metadata = {
  robots: {
    index: false,
    follow: false
  }
};

const sectionIds = new Set(["wifi", "contact", "arrival", "house", "restaurants", "activities", "reviews", "emergency"]);

type PageProps = {
  params: {
    slug: string;
    section: string;
  };
};

export default async function GuideSectionPage({ params }: PageProps) {
  if (!sectionIds.has(params.section)) {
    notFound();
  }

  const property = await getCachedPublicGuideSection(params.slug);

  if (!property) {
    notFound();
  }

  return <GuestGuideSection property={property} section={params.section} />;
}
