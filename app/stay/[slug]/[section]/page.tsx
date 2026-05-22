import { notFound } from "next/navigation";
import { GuestGuideSection } from "@/components/guest-guide-section";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = {
  robots: {
    index: false,
    follow: false
  }
};

const sectionIds = new Set(["wifi", "contact", "arrival", "house", "restaurants", "activities", "reviews", "emergency"]);

type PageProps = {
  params: {
    slug: string;
    section: string;
  };
};

export default async function GuideSectionPage({ params }: PageProps) {
  if (!sectionIds.has(params.section)) {
    notFound();
  }

  const property = await prisma.property.findUnique({
    where: { slug: params.slug },
    include: {
      guideSections: { orderBy: { sortOrder: "asc" } },
      recommendations: { orderBy: { sortOrder: "asc" } },
      reviewLinks: true
    }
  });

  if (!property) {
    notFound();
  }

  return <GuestGuideSection property={property} section={params.section} />;
}
