import { notFound } from "next/navigation";
import { GuestGuideHome } from "@/components/guest-guide-home";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
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
  const property = await prisma.property.findUnique({
    where: { slug: params.slug },
    select: {
      slug: true,
      name: true,
      logoUrl: true,
      coverImageUrl: true,
      accentColor: true,
      templateId: true,
      designSerif: true,
      designRounded: true,
      translationLocales: true
    }
  });

  if (!property) {
    notFound();
  }

  return <GuestGuideHome property={property} />;
}
