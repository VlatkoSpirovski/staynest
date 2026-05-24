import { notFound } from "next/navigation";
import { GuestGuideHome } from "@/components/guest-guide-home";
import { getCachedPublicGuideHome } from "@/lib/public-guide-cache";

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
  const property = await getCachedPublicGuideHome(params.slug);

  if (!property) {
    notFound();
  }

  return <GuestGuideHome property={property} />;
}
