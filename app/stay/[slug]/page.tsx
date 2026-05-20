import { notFound } from "next/navigation";
import { Home, KeyRound, Languages, Map, Phone, ShieldAlert, Star, Utensils, Wifi } from "lucide-react";
import { MenuLink } from "@/app/stay/[slug]/guide-ui";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function PublicGuidePage({ params }: PageProps) {
  const property = await prisma.property.findUnique({
    where: { slug: params.slug }
  });

  if (!property) {
    notFound();
  }

  const baseHref = `/stay/${property.slug}`;

  return (
    <main className="min-h-screen bg-[#2f302e] text-ink" style={{ "--accent": property.accentColor } as React.CSSProperties}>
      <div className="mx-auto min-h-screen max-w-[430px] bg-[#f1e7d8] shadow-2xl">
        <section className="relative min-h-[430px] overflow-hidden bg-ink text-white">
          {property.coverImageUrl ? <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${property.coverImageUrl})` }} /> : null}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/35 via-ink/45 to-ink/82" />
          <div className="relative flex min-h-[430px] flex-col justify-between px-5 py-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {property.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={property.logoUrl} alt={`${property.name} logo`} className="h-20 w-20 rounded-full object-cover ring-2 ring-white/80" />
                ) : (
                  <div className="grid h-20 w-20 place-items-center rounded-full bg-white/15">
                    <Home size={30} />
                  </div>
                )}
                <div>
                  <p className="text-2xl font-semibold leading-tight">Digital Concierge</p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.32em] text-white/80">Your stay, simplified</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-extrabold text-ink shadow-soft">
                <Languages size={14} />
                EN
              </div>
            </div>

            <div className="pb-3">
              <p className="text-3xl leading-tight">Welcome to</p>
              <h1 className="text-5xl font-bold leading-none">{property.name}</h1>
              <p className="mt-5 max-w-[310px] text-base leading-8 text-white/88">
                Your digital concierge for Wi-Fi, arrival, house info, local tips and direct host contact.
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 px-5 py-5">
          <MenuLink href={`${baseHref}/wifi`} icon={<Wifi size={21} />} title="Wi-Fi" subtitle="Connect" />
          <MenuLink href={`${baseHref}/contact`} icon={<Phone size={21} />} title="Contact" subtitle="We are here" />
          <MenuLink href={`${baseHref}/arrival`} icon={<KeyRound size={21} />} title="Check-in/out" subtitle="Arrival and departure" />
          <MenuLink href={`${baseHref}/house`} icon={<Home size={21} />} title="House Guide" subtitle="All about the villa" />
          <MenuLink href={`${baseHref}/restaurants`} icon={<Utensils size={21} />} title="Restaurants" subtitle="Food nearby" />
          <MenuLink href={`${baseHref}/activities`} icon={<Map size={21} />} title="Activities" subtitle="Things to do" />
          <MenuLink href={`${baseHref}/reviews`} icon={<Star size={21} />} title="Reviews" subtitle="Share your stay" />
          <MenuLink href={`${baseHref}/emergency`} icon={<ShieldAlert size={21} />} title="Emergency" subtitle="Important contacts" />
        </section>
      </div>
    </main>
  );
}
