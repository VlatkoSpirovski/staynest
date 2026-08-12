import { notFound, permanentRedirect } from "next/navigation";
import { GUIDE_SECTION_IDS, looksLikeGuideSlug } from "@/lib/guide-sections";
import { getCachedPublicGuideRedirect } from "@/lib/public-guide-cache";

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

export default async function RootPropertySectionRedirectPage({ params }: PageProps) {
  if (!looksLikeGuideSlug(params.slug) || !GUIDE_SECTION_IDS.has(params.section)) {
    notFound();
  }

  const property = await getCachedPublicGuideRedirect(params.slug);

  if (!property) {
    notFound();
  }

  permanentRedirect(
    property.publicCode ? `/g/${property.publicCode}/${params.section}` : `/stay/${property.slug}/${params.section}`
  );
}
