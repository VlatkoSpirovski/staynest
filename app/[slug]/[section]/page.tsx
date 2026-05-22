import { notFound, redirect } from "next/navigation";
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
    section: string;
  };
};

export default async function RootPropertySectionRedirectPage({ params }: PageProps) {
  const property = await prisma.property.findUnique({
    where: { slug: params.slug },
    select: { slug: true }
  });

  if (!property) {
    notFound();
  }

  redirect(`/stay/${property.slug}/${params.section}`);
}
