"use client";

import { Car, MessageCircle, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { EssentialPlaceCard } from "@/components/essential-place-card";
import { GuestLanguageProvider, useGuestLanguage } from "@/components/guest-language";
import { PlaceCard } from "@/components/place-card";
import { DetailShell, EmptyNote, GuideSubheading, MiniCard } from "@/app/stay/[slug]/guide-ui";
import { GuideWifiCard } from "@/components/guide-kit";
import { isEssentialCategory } from "@/lib/place-recommendation";
import { getGuideTheme, guideThemeStyle } from "@/themes";

type GuideSection = {
  id: string;
  title: string;
  content: string;
};

type Recommendation = {
  id: string;
  title: string;
  category: string;
  description: string;
  address: string | null;
  url: string | null;
  imageUrl: string | null;
  placeId: string | null;
  name: string;
  customTitle: string | null;
  customDescription: string | null;
  formattedAddress: string | null;
  latitude: number | null;
  longitude: number | null;
  googleMapsUrl: string | null;
  rating: number | null;
  userRatingsTotal: number | null;
  openingHours: string[];
  website: string | null;
  phoneNumber: string | null;
  photoUrl: string | null;
  isEssential: boolean;
  isVisible: boolean;
};

type ReviewLink = {
  id: string;
  platform: string;
  url: string;
};

export type GuestGuideSectionProperty = {
  slug: string;
  name: string;
  accentColor: string;
  templateId: string;
  designSerif: boolean;
  designRounded: boolean;
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
  aiKnowledge: string | null;
  guideSections: GuideSection[];
  recommendations: Recommendation[];
  reviewLinks: ReviewLink[];
  welcomeMessage?: string | null;
};

function whatsappUrl(phone: string | null | undefined, propertyName: string, template: (property: string) => string) {
  if (!phone) return null;
  const text = encodeURIComponent(template(propertyName || "your property"));
  return `https://wa.me/${phone.replace(/[^\d+]/g, "").replace(/^\+/, "")}?text=${text}`;
}

export function GuestGuideSection({ property, section, basePath }: { property: GuestGuideSectionProperty; section: string; basePath?: string }) {
  return (
    <GuestLanguageProvider>
      <GuestGuideSectionContent property={property} section={section} basePath={basePath} />
    </GuestLanguageProvider>
  );
}

export function GuestGuideSectionContent({ property, section, onBack, basePath }: { property: GuestGuideSectionProperty; section: string; onBack?: () => void; basePath?: string }) {
  const { t } = useGuestLanguage();
  const router = useRouter();
  const meta = t.sections[section as keyof typeof t.sections];
  const backHref = basePath || `/stay/${property.slug}`;

  useEffect(() => {
    router.prefetch(backHref);
  }, [backHref, router]);

  if (!meta) {
    return null;
  }

  const callUrl = property.hostPhone ? `tel:${property.hostPhone.replace(/\s+/g, "")}` : undefined;
  const whatsApp = whatsappUrl(property.hostPhone, property.name, t.content.whatsappStaying);
  const visibleRecommendations = property.recommendations.filter((item) => item.isVisible);
  const restaurantRecommendations = visibleRecommendations.filter((item) => !item.isEssential && /restaurant|cafe|bar|food|dinner|bakery/i.test(item.category));
  const essentialRecommendations = visibleRecommendations.filter((item) => item.isEssential || isEssentialCategory(item.category));
  const activityRecommendations = visibleRecommendations.filter((item) => !restaurantRecommendations.some((restaurant) => restaurant.id === item.id) && !essentialRecommendations.some((essential) => essential.id === item.id));
  const themeStyle = guideThemeStyle(getGuideTheme(property.templateId), {
    accentColor: property.accentColor,
    designSerif: property.designSerif,
    designRounded: property.designRounded
  }) as React.CSSProperties;

  return (
    <div style={themeStyle}>
      <DetailShell backHref={backHref} backLabel={t.back} onBack={onBack} poweredByLabel={t.poweredBy} eyebrow={meta.eyebrow} title={meta.title}>
        {section === "wifi" ? (
          property.wifiName ? <GuideWifiCard network={property.wifiName} password={property.wifiPassword} /> : <EmptyNote>{t.content.askHost}</EmptyNote>
        ) : null}

        {section === "contact" ? (
          <MiniCard title={property.hostContactName || t.content.yourHost}>
            {property.hostPhone ? <p>{property.hostPhone}</p> : null}
            {property.hostEmail ? <p>{property.hostEmail}</p> : null}
            <div className="mt-4 grid gap-2">
              {whatsApp ? (
                <a href={whatsApp} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--guide-button-radius)] bg-[var(--guide-button-bg)] px-4 text-sm font-bold text-[var(--guide-button-text)]">
                  <MessageCircle size={17} />
                  {t.content.whatsappHost}
                </a>
              ) : null}
              {callUrl ? (
                <a href={callUrl} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--guide-button-radius)] bg-[var(--guide-elevated-bg)] px-4 text-sm font-bold text-[var(--guide-text)] ring-1 ring-[var(--guide-card-border)]">
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
              <p>{property.checkInInfo || t.content.checkInFallback}</p>
            </MiniCard>
            <MiniCard title={t.content.checkOut}>
              <p>{property.checkOutInfo || t.content.checkOutFallback}</p>
            </MiniCard>
          </>
        ) : null}

        {section === "house" ? (
          property.parkingInfo || property.houseRules || property.guideSections.length ? (
            <>
              {property.houseRules ? (
                <MiniCard title={t.content.houseRules}>
                  <p className="whitespace-pre-line">{property.houseRules}</p>
                </MiniCard>
              ) : null}
              {property.parkingInfo ? (
                <MiniCard title={t.content.parking}>
                  <p className="whitespace-pre-line">{property.parkingInfo}</p>
                </MiniCard>
              ) : null}
              {property.guideSections.map((item) => (
                <MiniCard key={item.id} title={item.title}>
                  <p className="whitespace-pre-line">{item.content}</p>
                </MiniCard>
              ))}
            </>
          ) : (
            <EmptyNote>{t.content.houseRulesFallback}</EmptyNote>
          )
        ) : null}

        {section === "explore" ? (
          restaurantRecommendations.length || activityRecommendations.length || essentialRecommendations.length ? (
            <>
              {restaurantRecommendations.length ? <GuideSubheading>{t.content.eat}</GuideSubheading> : null}
              {restaurantRecommendations.map((item) => (
                <PlaceCard key={item.id} item={item} openMapLabel={t.content.openMap} />
              ))}
              {activityRecommendations.length ? <GuideSubheading>{t.content.doNearby}</GuideSubheading> : null}
              {activityRecommendations.map((item) => (
                <PlaceCard key={item.id} item={item} openMapLabel={t.content.openMap} />
              ))}
              {essentialRecommendations.length ? <GuideSubheading>{t.content.usefulPlaces}</GuideSubheading> : null}
              {essentialRecommendations.map((item) => (
                <EssentialPlaceCard key={item.id} item={item} />
              ))}
            </>
          ) : (
            <EmptyNote>{t.content.noPlaces}</EmptyNote>
          )
        ) : null}

        {section === "restaurants" ? (
          (restaurantRecommendations.length > 0 ? restaurantRecommendations : property.recommendations).length > 0 ? (
            (restaurantRecommendations.length > 0 ? restaurantRecommendations : property.recommendations).map((item) => (
              <PlaceCard key={item.id} item={item} openMapLabel={t.content.openMap} />
            ))
          ) : (
            <EmptyNote>{t.content.noRestaurants}</EmptyNote>
          )
        ) : null}

        {section === "activities" ? (
          (activityRecommendations.length > 0 ? activityRecommendations : property.recommendations).length > 0 ? (
            (activityRecommendations.length > 0 ? activityRecommendations : property.recommendations).map((item) => (
              <PlaceCard key={item.id} item={item} openMapLabel={t.content.openMap} />
            ))
          ) : (
            <EmptyNote>{t.content.noActivities}</EmptyNote>
          )
        ) : null}

        {section === "essentials" ? (
          essentialRecommendations.length > 0 ? (
            <div className="grid gap-3">
              {essentialRecommendations.map((item) => (
                <EssentialPlaceCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <EmptyNote>{t.content.noEssentials}</EmptyNote>
          )
        ) : null}

        {section === "reviews" ? (
          property.reviewLinks.length > 0 ? (
            <MiniCard title={t.content.leaveReview}>
              <p>{t.content.reviewBlurb}</p>
              <div className="mt-4 grid gap-2">
                {property.reviewLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center justify-center rounded-[var(--guide-button-radius)] bg-[var(--guide-button-bg)] px-4 text-center text-sm font-bold text-[var(--guide-button-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--guide-accent)] focus-visible:ring-offset-2"
                  >
                    {t.content.reviewOn(link.platform === "BOOKING" ? "Booking.com" : link.platform.charAt(0) + link.platform.slice(1).toLowerCase())}
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
              <p className="whitespace-pre-line">{property.emergencyInfo || t.content.emergencyFallback}</p>
            </MiniCard>
            {callUrl ? (
              <a href={callUrl} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--guide-button-radius)] bg-[var(--guide-elevated-bg)] px-4 text-sm font-bold text-[var(--guide-text)] ring-1 ring-[var(--guide-card-border)]">
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
