import { notFound } from "next/navigation";
import { GuestGuideHome } from "@/components/guest-guide-home";
import { canServePublicGuide } from "@/lib/public-guide-access";
import { getCachedPublicGuideSection } from "@/lib/public-guide-cache";

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
  };
};

export default async function PublicGuidePage({ params }: PageProps) {
  if (!(await canServePublicGuide({ slug: params.slug }))) {
    notFound();
  }

  const property = await getCachedPublicGuideSection(params.slug);

  if (!property) {
    notFound();
  }

  return <GuestGuideHome property={property} />;
}
