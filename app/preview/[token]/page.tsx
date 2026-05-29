import { notFound } from "next/navigation";
import { GuestGuideHome } from "@/components/guest-guide-home";
import { getPreviewGuideData } from "@/lib/preview-guide-data";

export const metadata = {
  robots: {
    index: false,
    follow: false
  }
};

type PageProps = {
  params: {
    token: string;
  };
};

export default async function PreviewPage({ params }: PageProps) {
  const property = await getPreviewGuideData(params.token);

  if (!property) {
    notFound();
  }

  return <GuestGuideHome property={property as any} basePath={`/preview/${params.token}`} />;
}
