import { notFound } from "next/navigation";
import { GuestGuideSection } from "@/components/guest-guide-section";
import { canServePublicGuide } from "@/lib/public-guide-access";
import { getCachedPublicGuideSection, getCachedSlugForPublicCode } from "@/lib/public-guide-cache";
import { isPublicCodeShape } from "@/lib/secure-slug";
import { examplePublicGuide } from "@/lib/example-public-guide";
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
    code: string;
    section: string;
  };
};

export default async function ShortGuideSectionPage({ params }: PageProps) {
  const code = params.code.toLowerCase();

  if (!GUIDE_SECTION_IDS.has(params.section)) {
    notFound();
  }

  if (!isPublicCodeShape(code) && code !== examplePublicGuide.publicCode) {
    notFound();
  }

  if (!(await canServePublicGuide({ publicCode: code }))) {
    notFound();
  }

  const slug = await getCachedSlugForPublicCode(code);
  if (!slug) {
    notFound();
  }

  const property = await getCachedPublicGuideSection(slug);
  if (!property) {
    notFound();
  }

  return <GuestGuideSection property={property} section={params.section} />;
}
