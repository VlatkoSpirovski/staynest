import { notFound } from "next/navigation";
import { GuestGuideSection } from "@/components/guest-guide-section";
import { getPreviewGuideData } from "@/lib/preview-guide-data";

export const metadata = {
  robots: {
    index: false,
    follow: false
  }
};

const sectionIds = new Set(["wifi", "contact", "arrival", "house", "restaurants", "activities", "essentials", "reviews", "emergency"]);

type PageProps = {
  params: {
    token: string;
    section: string;
  };
};

export default async function PreviewSectionPage({ params }: PageProps) {
  if (!sectionIds.has(params.section)) {
    notFound();
  }

  const property = await getPreviewGuideData(params.token);

  if (!property) {
    notFound();
  }

  return <GuestGuideSection property={property as any} section={params.section} basePath={`/preview/${params.token}`} />;
}
