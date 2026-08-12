import { notFound, permanentRedirect } from "next/navigation";
import { looksLikeGuideSlug } from "@/lib/guide-sections";
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
  };
};

/**
 * Root alias for legacy links. This route sits under a catch-all, so it also
 * receives every stray request the site attracts (`/wp-admin`, `/.env`, scanner
 * noise). The shape gate answers those without a database round trip.
 */
export default async function RootPropertyRedirectPage({ params }: PageProps) {
  if (!looksLikeGuideSlug(params.slug)) {
    notFound();
  }

  const property = await getCachedPublicGuideRedirect(params.slug);

  if (!property) {
    notFound();
  }

  permanentRedirect(property.publicCode ? `/g/${property.publicCode}` : `/stay/${property.slug}`);
}
