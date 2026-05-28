import { notFound, redirect } from "next/navigation";
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
  const property = await getCachedPublicGuideRedirect(params.slug);

  if (!property) {
    notFound();
  }

  redirect(`/stay/${property.slug}/${params.section}`);
}
