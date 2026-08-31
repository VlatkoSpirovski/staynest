import { notFound } from "next/navigation";
import { GuestGuideHome } from "@/components/guest-guide-home";
import { canServePublicGuide } from "@/lib/public-guide-access";
import { getCachedPublicGuideSection, getCachedSlugForPublicCode } from "@/lib/public-guide-cache";
import { isPublicCodeShape } from "@/lib/secure-slug";
import { examplePublicGuide } from "@/lib/example-public-guide";

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
  };
};

/**
 * Canonical public guide URL. Renders rather than redirects so a guest scanning a
 * QR code at check-in pays no extra round trip.
 */
export default async function ShortGuidePage({ params }: PageProps) {
  const code = params.code.toLowerCase();

  // Reject anything that is not code-shaped before touching the database.
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

  return <GuestGuideHome property={property} />;
}
