"use client";

import { Home, KeyRound, Map, Phone, ShieldAlert, Star, Utensils, Wifi } from "lucide-react";
import { GuestLanguageMenu, GuestLanguageProvider, useGuestLanguage } from "@/components/guest-language";
import { GuestChat } from "@/components/guest-chat";
import { MenuLink, PoweredByStayNest } from "@/app/stay/[slug]/guide-ui";
import { getGuideTheme, guideThemeStyle } from "@/themes";

type GuestProperty = {
  slug: string;
  name: string;
  logoUrl: string | null;
  coverImageUrl: string | null;
  accentColor: string;
  templateId: string;
  designSerif: boolean;
  designRounded: boolean;
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
  const theme = getGuideTheme(property.templateId);
  const layout = theme.layout;
  const themeStyle = guideThemeStyle(theme, {
    accentColor: property.accentColor,
    designSerif: property.designSerif,
    designRounded: property.designRounded
  }) as React.CSSProperties;
  const menuItems = [
    { href: `${baseHref}/wifi`, icon: <Wifi size={21} />, title: t.menu.wifi.title, subtitle: t.menu.wifi.subtitle },
    { href: `${baseHref}/contact`, icon: <Phone size={21} />, title: t.menu.contact.title, subtitle: t.menu.contact.subtitle },
    { href: `${baseHref}/arrival`, icon: <KeyRound size={21} />, title: t.menu.arrival.title, subtitle: t.menu.arrival.subtitle },
    { href: `${baseHref}/house`, icon: <Home size={21} />, title: t.menu.house.title, subtitle: t.menu.house.subtitle },
    { href: `${baseHref}/restaurants`, icon: <Utensils size={21} />, title: t.menu.restaurants.title, subtitle: t.menu.restaurants.subtitle },
    { href: `${baseHref}/activities`, icon: <Map size={21} />, title: t.menu.activities.title, subtitle: t.menu.activities.subtitle },
    { href: `${baseHref}/reviews`, icon: <Star size={21} />, title: t.menu.reviews.title, subtitle: t.menu.reviews.subtitle },
    { href: `${baseHref}/emergency`, icon: <ShieldAlert size={21} />, title: t.menu.emergency.title, subtitle: t.menu.emergency.subtitle }
  ];
  const menuClass =
    layout === "modern"
      ? "grid gap-[var(--guide-menu-gap)] px-[var(--guide-menu-padding)] py-4"
      : layout === "darkLuxury"
        ? "grid grid-cols-2 gap-[var(--guide-menu-gap)] px-[var(--guide-menu-padding)] pb-6 pt-5"
        : layout === "mediterranean"
          ? "grid grid-cols-2 gap-[var(--guide-menu-gap)] px-[var(--guide-menu-padding)] pb-6 pt-5"
          : "grid grid-cols-2 gap-[var(--guide-menu-gap)] px-[var(--guide-menu-padding)] py-5";

  function LogoMark({ soft = false }: { soft?: boolean }) {
    return (
      <div className={`${soft ? "h-14 w-14 rounded-[20px]" : "h-16 w-16 rounded-[22px]"} grid shrink-0 place-items-center overflow-hidden border border-[var(--guide-card-border)] bg-[var(--guide-elevated-bg)] p-1.5 text-sm font-black text-[var(--guide-text)] shadow-[0_18px_42px_rgba(0,0,0,0.14)]`}>
        {property.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={property.logoUrl} alt={`${property.name} logo`} className="h-full w-full rounded-[inherit] object-cover" />
        ) : (
          <Home size={soft ? 22 : 25} />
        )}
      </div>
    );
  }

  function HeroImage({ className = "" }: { className?: string }) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ background: "var(--guide-hero-fallback)" }}>
        {property.coverImageUrl ? <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${property.coverImageUrl})` }} /> : null}
        <div className="absolute inset-0" style={{ background: "var(--guide-hero-overlay)" }} />
      </div>
    );
  }

  function MenuGrid() {
    return (
      <section className={menuClass}>
        {menuItems.map((item) => (
          <MenuLink key={item.href} {...item} variant={layout} />
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

  if (layout === "modern") {
    return (
      <main className="min-h-screen bg-[var(--guide-app-bg)] text-[var(--guide-text)]" style={themeStyle}>
        <div className="mx-auto min-h-screen max-w-[430px] bg-[var(--guide-shell-bg)] shadow-[var(--guide-shell-shadow)]" style={{ fontFamily: "var(--guide-body-font)" }}>
          <header className="flex items-center justify-between gap-3 border-b border-[var(--guide-section-divider)] px-5 py-5">
            <div className="flex min-w-0 items-center gap-3">
              <LogoMark soft />
              <div className="min-w-0">
                <p className="text-sm font-black tracking-tight">{property.name}</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--guide-muted)]">{t.yourStaySimplified}</p>
              </div>
            </div>
            <GuestLanguageMenu />
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
          <GuestChat slug={property.slug} propertyName={property.name} />
        </div>
      </main>
    );
  }

  if (layout === "mediterranean") {
    return (
      <main className="min-h-screen bg-[var(--guide-app-bg)] text-[var(--guide-text)]" style={themeStyle}>
        <div className="mx-auto min-h-screen max-w-[430px] bg-[var(--guide-shell-bg)] px-4 py-4 shadow-[var(--guide-shell-shadow)]" style={{ fontFamily: "var(--guide-body-font)" }}>
          <header className="mb-4 flex items-center justify-between gap-3 px-1">
            <LogoMark soft />
            <GuestLanguageMenu />
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
          <GuestChat slug={property.slug} propertyName={property.name} />
        </div>
      </main>
    );
  }

  if (layout === "darkLuxury") {
    return (
      <main className="min-h-screen bg-[var(--guide-app-bg)] text-[var(--guide-text)]" style={themeStyle}>
        <div className="mx-auto min-h-screen max-w-[430px] bg-[var(--guide-shell-bg)] shadow-[var(--guide-shell-shadow)]" style={{ fontFamily: "var(--guide-body-font)" }}>
          <section className="relative min-h-[var(--guide-hero-height)] overflow-hidden text-[var(--guide-hero-text)]" style={{ background: "var(--guide-hero-fallback)" }}>
            {property.coverImageUrl ? <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${property.coverImageUrl})` }} /> : null}
            <div className="absolute inset-0" style={{ background: "var(--guide-hero-overlay)" }} />
            <div className="absolute inset-x-10 top-10 h-px bg-[linear-gradient(90deg,transparent,var(--guide-accent),transparent)] opacity-70" />
            <div className="relative flex min-h-[var(--guide-hero-height)] flex-col justify-between px-5 py-6">
              <div className="flex items-start justify-between gap-3">
                <LogoMark />
                <GuestLanguageMenu />
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
          <GuestChat slug={property.slug} propertyName={property.name} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--guide-app-bg)] text-[var(--guide-text)]" style={themeStyle}>
      <div className="mx-auto min-h-screen max-w-[430px] bg-[var(--guide-shell-bg)] shadow-[var(--guide-shell-shadow)]" style={{ fontFamily: "var(--guide-body-font)" }}>
        <section className="relative min-h-[430px] overflow-hidden text-white" style={{ background: "var(--guide-hero-fallback)" }}>
          {property.coverImageUrl ? <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${property.coverImageUrl})` }} /> : null}
          <div className="absolute inset-0" style={{ background: "var(--guide-hero-overlay)" }} />
          <div className="relative flex min-h-[430px] flex-col justify-between px-5 py-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <LogoMark />
                <div className="min-w-0">
                  <p className="text-2xl font-semibold leading-tight">{t.digitalConcierge}</p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.32em] text-white/80">{t.yourStaySimplified}</p>
                </div>
              </div>
              <GuestLanguageMenu />
            </div>

            <div className="pb-3">
              <p className="text-3xl leading-tight" style={{ fontFamily: "var(--guide-heading-font)" }}>{t.welcomeTo}</p>
              <h1 className="text-5xl font-bold leading-none" style={{ fontFamily: "var(--guide-heading-font)" }}>{property.name}</h1>
              <p className="mt-5 max-w-[310px] text-base leading-8 text-white/88">{t.heroDescription}</p>
            </div>
          </div>
        </section>

        <MenuGrid />

        <Footer />

        <GuestChat slug={property.slug} propertyName={property.name} />
      </div>
    </main>
  );
}
