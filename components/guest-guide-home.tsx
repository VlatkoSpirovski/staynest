"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Home, KeyRound, Map, Phone, Pill, ShieldAlert, Star, Utensils, Wifi } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { GuestLanguageProvider, useGuestLanguage } from "@/components/guest-language";
import { GuestChatLauncher } from "@/components/guest-chat-launcher";
import { MenuLink, PoweredByStayNest } from "@/app/stay/[slug]/guide-ui";
import { GuestGuideSectionContent, type GuestGuideSectionProperty } from "@/components/guest-guide-section";
import { getGuideTheme, guideThemeStyle } from "@/themes";

type GuestProperty = GuestGuideSectionProperty & {
  slug: string;
  name: string;
  logoUrl: string | null;
  coverImageUrl: string | null;
  accentColor: string;
  templateId: string;
  designSerif: boolean;
  designRounded: boolean;
};

export function GuestGuideHome({ property }: { property: GuestProperty }) {
  return (
    <GuestLanguageProvider>
      <GuestGuideHomeContent property={property} />
    </GuestLanguageProvider>
  );
}

function GuestGuideHomeContent({ property }: { property: GuestProperty }) {
  const { t } = useGuestLanguage();
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const baseHref = `/stay/${property.slug}`;
  const theme = getGuideTheme(property.templateId);
  const layout = theme.layout;
  const themeStyle = guideThemeStyle(theme, {
    accentColor: property.accentColor,
    designSerif: property.designSerif,
    designRounded: property.designRounded
  }) as React.CSSProperties;
  const menuItems = useMemo(() => [
    { id: "wifi", href: `${baseHref}/wifi`, icon: <Wifi size={21} />, title: t.menu.wifi.title, subtitle: t.menu.wifi.subtitle },
    { id: "contact", href: `${baseHref}/contact`, icon: <Phone size={21} />, title: t.menu.contact.title, subtitle: t.menu.contact.subtitle },
    { id: "arrival", href: `${baseHref}/arrival`, icon: <KeyRound size={21} />, title: t.menu.arrival.title, subtitle: t.menu.arrival.subtitle },
    { id: "house", href: `${baseHref}/house`, icon: <Home size={21} />, title: t.menu.house.title, subtitle: t.menu.house.subtitle },
    { id: "restaurants", href: `${baseHref}/restaurants`, icon: <Utensils size={21} />, title: t.menu.restaurants.title, subtitle: t.menu.restaurants.subtitle },
    { id: "activities", href: `${baseHref}/activities`, icon: <Map size={21} />, title: t.menu.activities.title, subtitle: t.menu.activities.subtitle },
    { id: "essentials", href: `${baseHref}/essentials`, icon: <Pill size={21} />, title: t.menu.essentials.title, subtitle: t.menu.essentials.subtitle },
    { id: "reviews", href: `${baseHref}/reviews`, icon: <Star size={21} />, title: t.menu.reviews.title, subtitle: t.menu.reviews.subtitle },
    { id: "emergency", href: `${baseHref}/emergency`, icon: <ShieldAlert size={21} />, title: t.menu.emergency.title, subtitle: t.menu.emergency.subtitle }
  ], [baseHref, t]);
  const sectionIds = useMemo(() => new Set(menuItems.map((item) => item.id)), [menuItems]);

  useEffect(() => {
    menuItems.forEach((item) => router.prefetch(item.href));
  }, [menuItems, router]);

  useEffect(() => {
    function syncSectionFromUrl() {
      const section = window.location.pathname.split("/").filter(Boolean).at(-1) || "";
      setSelectedSection(sectionIds.has(section) ? section : null);
    }

    syncSectionFromUrl();
    window.addEventListener("popstate", syncSectionFromUrl);

    return () => window.removeEventListener("popstate", syncSectionFromUrl);
  }, [sectionIds]);
  const menuClass =
    layout === "modern"
      ? "grid gap-[var(--guide-menu-gap)] px-[var(--guide-menu-padding)] py-4"
      : layout === "darkLuxury"
        ? "grid grid-cols-2 gap-[var(--guide-menu-gap)] px-[var(--guide-menu-padding)] pb-6 pt-5"
        : layout === "mediterranean"
          ? "grid grid-cols-2 gap-[var(--guide-menu-gap)] px-[var(--guide-menu-padding)] pb-6 pt-5"
          : "grid grid-cols-2 gap-[var(--guide-menu-gap)] px-[var(--guide-menu-padding)] py-5";

  function LogoMark({ soft = false }: { soft?: boolean }) {
    const canOptimizeLogo = property.logoUrl && !property.logoUrl.startsWith("data:");
    return (
      <div
        className={`${soft ? "h-14 w-14 rounded-[20px]" : "h-16 w-16 rounded-[22px]"} grid shrink-0 place-items-center overflow-hidden border border-[var(--guide-card-border)] p-1.5 text-sm font-black text-[var(--guide-text)] shadow-[0_18px_42px_rgba(0,0,0,0.14)]`}
        style={{ background: "var(--guide-elevated-bg)" }}
      >
        {canOptimizeLogo ? (
          <Image src={property.logoUrl || ""} alt={`${property.name} logo`} width={64} height={64} className="h-full w-full rounded-[inherit] object-cover" sizes="64px" />
        ) : property.logoUrl ? (
          <img src={property.logoUrl} alt={`${property.name} logo`} className="h-full w-full rounded-[inherit] object-cover" />
        ) : (
          <Home size={soft ? 22 : 25} />
        )}
      </div>
    );
  }

  function HeroImage({ className = "" }: { className?: string }) {
    const canOptimizeCover = property.coverImageUrl && !property.coverImageUrl.startsWith("data:");
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ background: "var(--guide-hero-fallback)" }}>
        {canOptimizeCover ? (
          <Image src={property.coverImageUrl || ""} alt="" fill priority className="object-cover" sizes="430px" style={{ filter: "var(--guide-hero-image-filter)" }} />
        ) : property.coverImageUrl ? (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${property.coverImageUrl})`, filter: "var(--guide-hero-image-filter)" }} />
        ) : null}
        <div className="absolute inset-0" style={{ background: "var(--guide-hero-overlay)" }} />
      </div>
    );
  }

  function MenuGrid() {
    return (
      <section className={menuClass}>
        {menuItems.map((item) => (
          <MenuLink
            key={item.href}
            {...item}
            variant={layout}
            onClick={(event) => {
              event.preventDefault();
              setSelectedSection(item.id);
              window.history.pushState(null, "", item.href);
              window.scrollTo({ top: 0 });
            }}
          />
        ))}
      </section>
    );
  }

  function Footer() {
    return (
      <div className="px-5 pb-[4.75rem] pt-0">
        <PoweredByStayNest label={t.poweredBy} />
      </div>
    );
  }

  if (selectedSection) {
    return (
      <GuestGuideSectionContent
        property={property}
        section={selectedSection}
        onBack={() => {
          setSelectedSection(null);
          window.history.replaceState(null, "", baseHref);
          window.scrollTo({ top: 0 });
        }}
      />
    );
  }

  if (layout === "modern") {
    return (
      <main className="min-h-screen text-[var(--guide-text)]" style={{ ...themeStyle, background: "var(--guide-app-bg)" }}>
        <div className="mx-auto min-h-screen max-w-[430px] shadow-[var(--guide-shell-shadow)]" style={{ background: "var(--guide-shell-bg)", fontFamily: "var(--guide-body-font)" }}>
          <header className="flex items-center justify-between gap-3 border-b border-[var(--guide-section-divider)] px-5 py-5">
            <div className="flex min-w-0 items-center gap-3">
              <LogoMark soft />
              <div className="min-w-0">
                <p className="text-sm font-black tracking-tight">{property.name}</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--guide-muted)]">{t.yourStaySimplified}</p>
              </div>
            </div>
          </header>

          <section className="px-5 pb-4 pt-6">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--guide-accent)]">{theme.preview.eyebrow}</p>
            <h1 className="mt-3 text-[2.65rem] font-black leading-[0.95] tracking-tight text-[var(--guide-text)]" style={{ fontFamily: "var(--guide-heading-font)" }}>
              Welcome to {property.name}
            </h1>
            <p className="mt-4 max-w-[330px] text-sm font-semibold leading-7 text-[var(--guide-muted)]">{t.heroDescription}</p>
          </section>

          <div className="px-5">
            <HeroImage className="h-[var(--guide-hero-height)] rounded-[var(--guide-hero-radius)] shadow-[0_18px_48px_rgba(17,24,39,0.10)]" />
          </div>

          <MenuGrid />
          <Footer />
          <GuestChatLauncher slug={property.slug} propertyName={property.name} context={property} />
        </div>
      </main>
    );
  }

  if (layout === "mediterranean") {
    return (
      <main className="min-h-screen text-[var(--guide-text)]" style={{ ...themeStyle, background: "var(--guide-app-bg)" }}>
        <div className="mx-auto min-h-screen max-w-[430px] px-4 py-4 shadow-[var(--guide-shell-shadow)]" style={{ background: "var(--guide-shell-bg)", fontFamily: "var(--guide-body-font)" }}>
          <header className="mb-4 flex items-center justify-between gap-3 px-1">
            <LogoMark soft />
          </header>

          <section className="relative overflow-hidden rounded-[var(--guide-hero-radius)] text-[var(--guide-hero-text)] shadow-[0_24px_70px_rgba(64,99,112,0.18)]">
            <HeroImage className="h-[var(--guide-hero-height)]" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/82">{theme.preview.eyebrow}</p>
              <h1 className="mt-2 text-5xl font-semibold leading-[0.9]" style={{ fontFamily: "var(--guide-heading-font)" }}>{property.name}</h1>
              <p className="mt-4 max-w-[290px] text-sm font-semibold leading-6 text-white/84">{t.heroDescription}</p>
            </div>
          </section>

          <MenuGrid />
          <Footer />
          <GuestChatLauncher slug={property.slug} propertyName={property.name} context={property} />
        </div>
      </main>
    );
  }

  if (layout === "darkLuxury") {
    return (
      <main className="min-h-screen text-[var(--guide-text)]" style={{ ...themeStyle, background: "var(--guide-app-bg)" }}>
        <div className="mx-auto min-h-screen max-w-[430px] shadow-[var(--guide-shell-shadow)]" style={{ background: "var(--guide-shell-bg)", fontFamily: "var(--guide-body-font)" }}>
          <section className="relative min-h-[var(--guide-hero-height)] overflow-hidden text-[var(--guide-hero-text)]">
            <HeroImage className="absolute inset-0" />
            <div className="absolute inset-x-10 top-10 h-px bg-[linear-gradient(90deg,transparent,var(--guide-accent),transparent)] opacity-70" />
            <div className="relative flex min-h-[var(--guide-hero-height)] flex-col justify-between px-5 py-6">
              <div className="flex items-start justify-between gap-3">
                <LogoMark />
              </div>
              <div className="pb-3">
                <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[var(--guide-accent)]">{theme.preview.eyebrow}</p>
                <h1 className="mt-3 text-5xl font-semibold leading-none" style={{ fontFamily: "var(--guide-heading-font)" }}>{property.name}</h1>
                <p className="mt-5 max-w-[300px] text-sm font-semibold leading-7 text-[var(--guide-hero-text)] opacity-80">{t.heroDescription}</p>
              </div>
            </div>
          </section>

          <MenuGrid />
          <Footer />
          <GuestChatLauncher slug={property.slug} propertyName={property.name} context={property} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-[var(--guide-text)]" style={{ ...themeStyle, background: "var(--guide-app-bg)" }}>
      <div className="mx-auto min-h-screen max-w-[430px] shadow-[var(--guide-shell-shadow)]" style={{ background: "var(--guide-shell-bg)", fontFamily: "var(--guide-body-font)" }}>
        <div className="px-4 pt-4">
        <section className="relative min-h-[var(--guide-hero-height)] overflow-hidden rounded-[var(--guide-hero-radius)] text-white shadow-[0_26px_74px_rgba(76,55,37,0.20)]">
          <HeroImage className="absolute inset-0" />
          <div className="relative flex min-h-[var(--guide-hero-height)] flex-col justify-between px-5 py-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <LogoMark />
                <div className="min-w-0">
                  <p className="text-2xl font-semibold leading-tight">{t.digitalConcierge}</p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.32em] text-white/80">{t.yourStaySimplified}</p>
                </div>
              </div>
            </div>

            <div className="pb-3">
              <p className="text-3xl leading-tight" style={{ fontFamily: "var(--guide-heading-font)" }}>{t.welcomeTo}</p>
              <h1 className="text-5xl font-bold leading-none" style={{ fontFamily: "var(--guide-heading-font)" }}>{property.name}</h1>
              <p className="mt-5 max-w-[310px] text-base leading-8 text-white/88">{t.heroDescription}</p>
            </div>
          </div>
        </section>
        </div>

        <MenuGrid />

        <Footer />

        <GuestChatLauncher slug={property.slug} propertyName={property.name} context={property} />
      </div>
    </main>
  );
}
