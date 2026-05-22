"use client";

import { Car, MapPin, MessageCircle, Phone } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { GuestLanguageProvider, useGuestLanguage } from "@/components/guest-language";
import { DetailShell, EmptyNote, MiniCard } from "@/app/stay/[slug]/guide-ui";

type GuideSection = {
  id: string;
  title: string;
  content: string;
  translations: unknown;
};

type Recommendation = {
  id: string;
  title: string;
  category: string;
  description: string;
  address: string | null;
  url: string | null;
  translations: unknown;
};

type ReviewLink = {
  id: string;
  platform: string;
  url: string;
};

type GuestProperty = {
  slug: string;
  name: string;
  accentColor: string;
  wifiName: string | null;
  wifiPassword: string | null;
  checkInInfo: string | null;
  checkOutInfo: string | null;
  parkingInfo: string | null;
  houseRules: string | null;
  emergencyInfo: string | null;
  hostContactName: string | null;
  hostPhone: string | null;
  hostEmail: string | null;
  guideSections: GuideSection[];
  recommendations: Recommendation[];
  reviewLinks: ReviewLink[];
  translationLocales: string[];
  translations: unknown;
};

function whatsappUrl(phone: string | null | undefined, propertyName: string, template: (property: string) => string) {
  if (!phone) return null;
  const text = encodeURIComponent(template(propertyName || "your property"));
  return `https://wa.me/${phone.replace(/[^\d+]/g, "").replace(/^\+/, "")}?text=${text}`;
}

export function GuestGuideSection({ property, section }: { property: GuestProperty; section: string }) {
  return (
    <GuestLanguageProvider availableLocales={property.translationLocales}>
      <GuestGuideSectionContent property={property} section={section} />
    </GuestLanguageProvider>
  );
}

function translationValue(translations: unknown, locale: string, key: string, fallback: string | null | undefined) {
  if (locale === "en") return fallback || "";
  if (!translations || typeof translations !== "object") return fallback || "";
  const localeMap = (translations as Record<string, unknown>)[locale];
  if (!localeMap || typeof localeMap !== "object") return fallback || "";
  const value = (localeMap as Record<string, unknown>)[key];
  return typeof value === "string" && value.trim() ? value : fallback || "";
}

function GuestGuideSectionContent({ property, section }: { property: GuestProperty; section: string }) {
  const { locale, t } = useGuestLanguage();
  const meta = t.sections[section as keyof typeof t.sections];

  if (!meta) {
    return null;
  }

  const backHref = `/stay/${property.slug}`;
  const callUrl = property.hostPhone ? `tel:${property.hostPhone.replace(/\s+/g, "")}` : undefined;
  const whatsApp = whatsappUrl(property.hostPhone, property.name, t.content.whatsappStaying);
  const restaurantRecommendations = property.recommendations.filter((item) => /restaurant|cafe|bar|food|dinner|bakery/i.test(item.category));
  const activityRecommendations = property.recommendations.filter((item) => !restaurantRecommendations.some((restaurant) => restaurant.id === item.id));

  return (
    <div style={{ "--accent": property.accentColor } as React.CSSProperties}>
      <DetailShell backHref={backHref} backLabel={t.back} poweredByLabel={t.poweredBy} eyebrow={meta.eyebrow} title={meta.title}>
        {section === "wifi" ? (
          <>
            <MiniCard title={t.content.network}>
              <p className="font-semibold text-ink">{property.wifiName || t.content.askHost}</p>
            </MiniCard>
            <MiniCard title={t.content.password}>
              <div className="grid gap-3">
                <p className="font-semibold text-ink">{property.wifiPassword || t.content.askHost}</p>
                {property.wifiPassword ? (
                  <CopyButton value={property.wifiPassword} label={t.content.copyWifiPassword} copiedLabel={t.content.passwordCopied} />
                ) : null}
              </div>
            </MiniCard>
          </>
        ) : null}

        {section === "contact" ? (
          <MiniCard title={property.hostContactName || t.content.yourHost}>
            {property.hostPhone ? <p>{property.hostPhone}</p> : null}
            {property.hostEmail ? <p>{property.hostEmail}</p> : null}
            <div className="mt-4 grid gap-2">
              {whatsApp ? (
                <a href={whatsApp} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 text-sm font-bold text-white">
                  <MessageCircle size={17} />
                  {t.content.whatsappHost}
                </a>
              ) : null}
              {callUrl ? (
                <a href={callUrl} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-bold text-ink ring-1 ring-ink/10">
                  <Phone size={17} />
                  {t.content.callHost}
                </a>
              ) : null}
            </div>
          </MiniCard>
        ) : null}

        {section === "arrival" ? (
          <>
            <MiniCard title={t.content.checkIn}>
              <p>{translationValue(property.translations, locale, "checkInInfo", property.checkInInfo || t.content.checkInFallback)}</p>
            </MiniCard>
            <MiniCard title={t.content.checkOut}>
              <p>{translationValue(property.translations, locale, "checkOutInfo", property.checkOutInfo || t.content.checkOutFallback)}</p>
            </MiniCard>
          </>
        ) : null}

        {section === "house" ? (
          <>
            <MiniCard title={t.content.parking}>
              <p>{translationValue(property.translations, locale, "parkingInfo", property.parkingInfo || t.content.parkingFallback)}</p>
            </MiniCard>
            <MiniCard title={t.content.houseRules}>
              <p className="whitespace-pre-line">{translationValue(property.translations, locale, "houseRules", property.houseRules || t.content.houseRulesFallback)}</p>
            </MiniCard>
            {property.guideSections.map((item) => (
              <MiniCard key={item.id} title={item.title}>
                <p className="whitespace-pre-line">{translationValue(item.translations, locale, "content", item.content)}</p>
              </MiniCard>
            ))}
          </>
        ) : null}

        {section === "restaurants" ? (
          (restaurantRecommendations.length > 0 ? restaurantRecommendations : property.recommendations).length > 0 ? (
            (restaurantRecommendations.length > 0 ? restaurantRecommendations : property.recommendations).map((item) => (
              <RecommendationCard key={item.id} item={item} locale={locale} openMapLabel={t.content.openMap} />
            ))
          ) : (
            <EmptyNote>{t.content.noRestaurants}</EmptyNote>
          )
        ) : null}

        {section === "activities" ? (
          (activityRecommendations.length > 0 ? activityRecommendations : property.recommendations).length > 0 ? (
            (activityRecommendations.length > 0 ? activityRecommendations : property.recommendations).map((item) => (
              <RecommendationCard key={item.id} item={item} locale={locale} openMapLabel={t.content.openMap} />
            ))
          ) : (
            <EmptyNote>{t.content.noActivities}</EmptyNote>
          )
        ) : null}

        {section === "reviews" ? (
          property.reviewLinks.length > 0 ? (
            <MiniCard title={t.content.leaveReview}>
              <p>{t.content.reviewBlurb}</p>
              <div className="mt-4 grid gap-2">
                {property.reviewLinks.map((link) => (
                  <a key={link.id} href={link.url} className="rounded-full bg-[var(--accent)] px-4 py-3 text-center text-sm font-bold text-white">
                    {link.platform.charAt(0) + link.platform.slice(1).toLowerCase()}
                  </a>
                ))}
              </div>
            </MiniCard>
          ) : (
            <EmptyNote>{t.content.noReviewLinks}</EmptyNote>
          )
        ) : null}

        {section === "emergency" ? (
          <>
            <MiniCard title={t.content.emergencyContacts}>
              <p className="whitespace-pre-line">{translationValue(property.translations, locale, "emergencyInfo", property.emergencyInfo || t.content.emergencyFallback)}</p>
            </MiniCard>
            {callUrl ? (
              <a href={callUrl} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-bold text-ink ring-1 ring-ink/10">
                <Car size={17} />
                {t.content.callHost}
              </a>
            ) : null}
          </>
        ) : null}
      </DetailShell>
    </div>
  );
}

function RecommendationCard({
  item,
  locale,
  openMapLabel
}: {
  item: Recommendation;
  locale: string;
  openMapLabel: string;
}) {
  return (
    <MiniCard title={item.title}>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">{translationValue(item.translations, locale, "category", item.category)}</p>
      <p className="mt-2">{translationValue(item.translations, locale, "description", item.description)}</p>
      {item.address ? <p className="mt-3 font-semibold text-ink/70">{item.address}</p> : null}
      {item.url ? (
        <a href={item.url} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-bold text-[var(--accent)] ring-1 ring-ink/10">
          <MapPin size={16} />
          {openMapLabel}
        </a>
      ) : null}
    </MiniCard>
  );
}
