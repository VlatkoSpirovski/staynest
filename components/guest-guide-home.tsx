"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Compass, Home, KeyRound, Phone, ShieldAlert, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { GuestLanguageProvider, useGuestLanguage } from "@/components/guest-language";
import { GuestChatLauncher } from "@/components/guest-chat-launcher";
import { PoweredByStayNest } from "@/app/stay/[slug]/guide-ui";
import { GuestGuideSectionContent, type GuestGuideSectionProperty } from "@/components/guest-guide-section";
import { GuideRowCard, GuideTileCard, GuideTopBar, GuideWifiCard } from "@/components/guide-kit";
import { examplePublicGuide } from "@/lib/example-public-guide";
import { getAppUrl } from "@/lib/utils";
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
  welcomeMessage?: string | null;
};

const SECTION_IDS = new Set(["wifi", "contact", "arrival", "house", "restaurants", "activities", "essentials", "reviews", "emergency", "explore"]);

function firstSentence(value: string | null | undefined) {
  const text = (value || "").replace(/\s+/g, " ").trim();
  if (!text) return "";
  const match = text.match(/^.*?[.!?](\s|$)/);
  return (match ? match[0] : text).trim();
}

export function GuestGuideHome({ property, basePath }: { property: GuestProperty; basePath?: string }) {
  return (
    <GuestLanguageProvider>
      <GuestGuideHomeContent property={property} basePath={basePath} />
    </GuestLanguageProvider>
  );
}

function GuestGuideHomeContent({ property, basePath }: { property: GuestProperty; basePath?: string }) {
  const { t } = useGuestLanguage();
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [embedded, setEmbedded] = useState(true);
  const baseHref = basePath || `/stay/${property.slug}`;
  const theme = getGuideTheme(property.templateId);
  const themeStyle = guideThemeStyle(theme, {
    accentColor: property.accentColor,
    designSerif: property.designSerif,
    designRounded: property.designRounded
  }) as React.CSSProperties;
  const isExample = property.slug === examplePublicGuide.slug;

  const visibleRecommendations = property.recommendations.filter((item) => item.isVisible);
  const tiles = useMemo(
    () =>
      [
        { id: "contact", show: Boolean(property.hostPhone || property.hostEmail), icon: <Phone size={18} />, title: t.menu.contact.title },
        { id: "house", show: Boolean(property.parkingInfo || property.houseRules || property.guideSections.length), icon: <Home size={18} />, title: t.menu.house.title },
        { id: "explore", show: visibleRecommendations.length > 0, icon: <Compass size={18} />, title: t.menu.explore.title },
        { id: "reviews", show: property.reviewLinks.length > 0, icon: <Star size={18} />, title: t.menu.reviews.title },
        { id: "emergency", show: true, icon: <ShieldAlert size={18} />, title: t.menu.emergency.title }
      ].filter((tile) => tile.show),
    [property, t, visibleRecommendations.length]
  );
  const firstRow = tiles.length >= 3 ? tiles.slice(0, 3) : tiles;
  const secondRow = tiles.length >= 3 ? tiles.slice(3) : [];

  useEffect(() => {
    setEmbedded(window.self !== window.top);
  }, []);

  useEffect(() => {
    ["arrival", "wifi", ...tiles.map((tile) => tile.id)].forEach((id) => router.prefetch(`${baseHref}/${id}`));
  }, [baseHref, router, tiles]);

  useEffect(() => {
    function syncSectionFromUrl() {
      const section = window.location.pathname.split("/").filter(Boolean).at(-1) || "";
      setSelectedSection(SECTION_IDS.has(section) ? section : null);
    }
    syncSectionFromUrl();
    window.addEventListener("popstate", syncSectionFromUrl);
    return () => window.removeEventListener("popstate", syncSectionFromUrl);
  }, []);

  function open(id: string) {
    return (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setSelectedSection(id);
      window.history.pushState(null, "", `${baseHref}/${id}`);
      window.scrollTo({ top: 0 });
    };
  }

  const chat = (
    <GuestChatLauncher slug={property.slug} propertyName={property.name} context={property} chatApiUrl={basePath ? `/api/preview/${property.slug}/chat` : undefined} />
  );

  if (selectedSection) {
    return (
      <>
        <GuestGuideSectionContent
          property={property}
          section={selectedSection}
          onBack={() => {
            setSelectedSection(null);
            window.history.replaceState(null, "", baseHref);
            window.scrollTo({ top: 0 });
          }}
        />
        <div style={themeStyle}>{chat}</div>
      </>
    );
  }

  const canOptimizeCover = Boolean(property.coverImageUrl && !property.coverImageUrl.startsWith("data:"));
  const welcome = (property.welcomeMessage || "").trim();
  const checkInLine = firstSentence(property.checkInInfo) || t.menu.arrival.subtitle;
  const checkOutLine = firstSentence(property.checkOutInfo);

  return (
    <main className="min-h-screen text-[var(--guide-text)]" style={{ ...themeStyle, background: "var(--guide-app-bg)" }}>
      {isExample && !embedded ? (
        <a
          href={`${getAppUrl()}/register?plan=ai`}
          className="sticky top-0 z-40 flex items-center justify-center gap-2 bg-[#111827] px-4 py-2.5 text-center text-[13px] font-semibold text-white"
          style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
        >
          <span className="hidden text-white/70 min-[360px]:inline">This is a demo guide.</span>
          Make one for your place, free
          <ArrowRight size={14} aria-hidden="true" />
        </a>
      ) : null}

      <div className="guide-enter mx-auto min-h-screen w-full max-w-[430px] shadow-[var(--guide-shell-shadow)]" style={{ background: "var(--guide-shell-bg)", fontFamily: "var(--guide-body-font)" }}>
        <GuideTopBar name={property.name} logoUrl={property.logoUrl} />

        <div className="px-4 sm:px-5">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[var(--guide-hero-radius)]" style={{ background: "var(--guide-hero-fallback)" }}>
            {canOptimizeCover ? (
              <Image src={property.coverImageUrl || ""} alt="" fill priority className="object-cover" sizes="(max-width: 430px) 100vw, 430px" style={{ filter: "var(--guide-hero-image-filter)" }} />
            ) : property.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={property.coverImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : null}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent" aria-hidden="true" />
            <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#1F2937] backdrop-blur">
              {t.heroEyebrow[theme.layout]}
            </span>
          </div>

          <h1 className="mt-5 break-words text-[2rem] font-bold leading-[1.08] tracking-tight text-[var(--guide-text)]" style={{ fontFamily: "var(--guide-heading-font)" }}>
            {property.name}
          </h1>
          {welcome ? (
            <div className="mt-2">
              <p className={`whitespace-pre-line text-[15px] leading-6 text-[var(--guide-muted)] ${welcomeOpen ? "" : "line-clamp-2"}`}>{welcome}</p>
              {welcome.length > 110 ? (
                <button
                  type="button"
                  onClick={() => setWelcomeOpen((value) => !value)}
                  aria-expanded={welcomeOpen}
                  className="mt-1 text-sm font-bold text-[var(--guide-accent)] underline-offset-4 hover:underline focus:outline-none focus-visible:underline"
                >
                  {welcomeOpen ? t.showLess : t.readMore}
                </button>
              ) : null}
            </div>
          ) : (
            <p className="mt-2 text-[15px] leading-6 text-[var(--guide-muted)]">{t.heroTagline}</p>
          )}

          <div className="mt-5 grid gap-3">
            {property.wifiName ? <GuideWifiCard network={property.wifiName} password={property.wifiPassword} /> : null}
            <GuideRowCard
              href={`${baseHref}/arrival`}
              onNavigate={open("arrival")}
              icon={<KeyRound size={20} />}
              eyebrow={t.menu.arrival.title}
              title={checkInLine}
              subtitle={checkOutLine || t.menu.arrival.subtitle}
            />
            {firstRow.length ? (
              <nav aria-label={t.guestGuide} className="grid gap-3">
                <div className={`grid gap-3 ${firstRow.length === 3 ? "grid-cols-3" : firstRow.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
                  {firstRow.map((tile) => (
                    <GuideTileCard key={tile.id} href={`${baseHref}/${tile.id}`} onNavigate={open(tile.id)} icon={tile.icon} title={tile.title} />
                  ))}
                </div>
                {secondRow.length ? (
                  <div className={`grid gap-3 ${secondRow.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
                    {secondRow.map((tile) => (
                      <GuideTileCard key={tile.id} href={`${baseHref}/${tile.id}`} onNavigate={open(tile.id)} icon={tile.icon} title={tile.title} />
                    ))}
                  </div>
                ) : null}
              </nav>
            ) : null}
          </div>
        </div>

        <div className="px-5 pb-28 pt-8">
          <PoweredByStayNest label={t.poweredBy} />
        </div>
        {chat}
      </div>
    </main>
  );
}
