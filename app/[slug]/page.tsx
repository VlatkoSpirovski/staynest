import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function RootPropertyRedirectPage({ params }: PageProps) {
  const property = await prisma.property.findUnique({
    where: { slug: params.slug },
    select: { slug: true }
  });

  if (!property) {
    notFound();
  }

  redirect(`/stay/${property.slug}`);
}
