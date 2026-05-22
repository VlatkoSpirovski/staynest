"use client";

import { Home, KeyRound, Map, Phone, ShieldAlert, Star, Utensils, Wifi } from "lucide-react";
import { GuestLanguageMenu, GuestLanguageProvider, useGuestLanguage } from "@/components/guest-language";
import { GuestChat } from "@/components/guest-chat";
import { MenuLink, PoweredByStayNest } from "@/app/stay/[slug]/guide-ui";

type GuestProperty = {
  slug: string;
  name: string;
  logoUrl: string | null;
  coverImageUrl: string | null;
  accentColor: string;
  translationLocales: string[];
};

export function GuestGuideHome({ property }: { property: GuestProperty }) {
  return (
    <GuestLanguageProvider availableLocales={property.translationLocales}>
      <GuestGuideHomeContent property={property} />
    </GuestLanguageProvider>
  );
}

function GuestGuideHomeContent({ property }: { property: GuestProperty }) {
  const { t } = useGuestLanguage();
  const baseHref = `/stay/${property.slug}`;

  return (
    <main className="min-h-screen bg-[#2f302e] text-ink" style={{ "--accent": property.accentColor || "#4a8a8f" } as React.CSSProperties}>
      <div className="mx-auto min-h-screen max-w-[430px] bg-[#f1e7d8] shadow-2xl">
        <section className="relative min-h-[430px] overflow-hidden bg-ink text-white">
          {property.coverImageUrl ? <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${property.coverImageUrl})` }} /> : null}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/35 via-ink/45 to-ink/82" />
          <div className="relative flex min-h-[430px] flex-col justify-between px-5 py-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[22px] border border-white/24 bg-white/14 p-1.5 shadow-[0_18px_42px_rgba(0,0,0,0.20),inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-xl">
                  {property.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={property.logoUrl} alt={`${property.name} logo`} className="h-full w-full rounded-[18px] object-cover" />
                  ) : (
                    <span className="grid h-full w-full place-items-center rounded-[18px] bg-white text-ink">
                      <Home size={25} />
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-semibold leading-tight">{t.digitalConcierge}</p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.32em] text-white/80">{t.yourStaySimplified}</p>
                </div>
              </div>
              <GuestLanguageMenu />
            </div>

            <div className="pb-3">
              <p className="text-3xl leading-tight">{t.welcomeTo}</p>
              <h1 className="text-5xl font-bold leading-none">{property.name}</h1>
              <p className="mt-5 max-w-[310px] text-base leading-8 text-white/88">{t.heroDescription}</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 px-5 py-5">
          <MenuLink href={`${baseHref}/wifi`} icon={<Wifi size={21} />} title={t.menu.wifi.title} subtitle={t.menu.wifi.subtitle} />
          <MenuLink href={`${baseHref}/contact`} icon={<Phone size={21} />} title={t.menu.contact.title} subtitle={t.menu.contact.subtitle} />
          <MenuLink href={`${baseHref}/arrival`} icon={<KeyRound size={21} />} title={t.menu.arrival.title} subtitle={t.menu.arrival.subtitle} />
          <MenuLink href={`${baseHref}/house`} icon={<Home size={21} />} title={t.menu.house.title} subtitle={t.menu.house.subtitle} />
          <MenuLink href={`${baseHref}/restaurants`} icon={<Utensils size={21} />} title={t.menu.restaurants.title} subtitle={t.menu.restaurants.subtitle} />
          <MenuLink href={`${baseHref}/activities`} icon={<Map size={21} />} title={t.menu.activities.title} subtitle={t.menu.activities.subtitle} />
          <MenuLink href={`${baseHref}/reviews`} icon={<Star size={21} />} title={t.menu.reviews.title} subtitle={t.menu.reviews.subtitle} />
          <MenuLink href={`${baseHref}/emergency`} icon={<ShieldAlert size={21} />} title={t.menu.emergency.title} subtitle={t.menu.emergency.subtitle} />
        </section>

        <div className="px-5 pb-[4.75rem] pt-0">
          <PoweredByStayNest label={t.poweredBy} />
        </div>

        <GuestChat slug={property.slug} propertyName={property.name} />
      </div>
    </main>
  );
}
