import { notFound } from "next/navigation";
import { Car, MapPin, MessageCircle, Phone } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { DetailShell, EmptyNote, MiniCard } from "@/app/stay/[slug]/guide-ui";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  params: {
    slug: string;
    section: string;
  };
};

const sectionMeta: Record<string, { eyebrow: string; title: string }> = {
  wifi: { eyebrow: "Wi-Fi", title: "Connect to the internet." },
  contact: { eyebrow: "Contact", title: "Need help during your stay?" },
  arrival: { eyebrow: "Arrival", title: "Check-in and check-out." },
  house: { eyebrow: "House guide", title: "Everything inside the villa." },
  restaurants: { eyebrow: "Restaurants", title: "Where to eat." },
  activities: { eyebrow: "Activities", title: "Things to do nearby." },
  reviews: { eyebrow: "Reviews", title: "Enjoying your stay?" },
  emergency: { eyebrow: "Emergency", title: "Important information." }
};

function whatsappUrl(phone?: string | null, propertyName?: string) {
  if (!phone) return null;
  const normalizedPhone = phone.replace(/[^\d+]/g, "");
  const text = encodeURIComponent(`Hi, I am staying at ${propertyName || "your property"} and need help.`);
  return `https://wa.me/${normalizedPhone.replace(/^\+/, "")}?text=${text}`;
}

export default async function GuideSectionPage({ params }: PageProps) {
  const meta = sectionMeta[params.section];
  if (!meta) {
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

  const backHref = `/stay/${property.slug}`;
  const callUrl = property.hostPhone ? `tel:${property.hostPhone.replace(/\s+/g, "")}` : undefined;
  const whatsApp = whatsappUrl(property.hostPhone, property.name);
  const restaurantRecommendations = property.recommendations.filter((item) => /restaurant|cafe|bar|food|dinner|bakery/i.test(item.category));
  const activityRecommendations = property.recommendations.filter((item) => !restaurantRecommendations.some((restaurant) => restaurant.id === item.id));

  return (
    <div style={{ "--accent": property.accentColor } as React.CSSProperties}>
      <DetailShell backHref={backHref} eyebrow={meta.eyebrow} title={meta.title}>
        {params.section === "wifi" ? (
          <>
            <MiniCard title="Network">
              <p className="font-semibold text-ink">{property.wifiName || "Ask host"}</p>
            </MiniCard>
            <MiniCard title="Password">
              <div className="grid gap-3">
                <p className="font-semibold text-ink">{property.wifiPassword || "Ask host"}</p>
                {property.wifiPassword ? <CopyButton value={property.wifiPassword} label="Copy Wi-Fi password" copiedLabel="Password copied" /> : null}
              </div>
            </MiniCard>
          </>
        ) : null}

        {params.section === "contact" ? (
          <MiniCard title={property.hostContactName || "Your host"}>
            {property.hostPhone ? <p>{property.hostPhone}</p> : null}
            {property.hostEmail ? <p>{property.hostEmail}</p> : null}
            <div className="mt-4 grid gap-2">
              {whatsApp ? (
                <a href={whatsApp} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 text-sm font-bold text-white">
                  <MessageCircle size={17} />
                  WhatsApp host
                </a>
              ) : null}
              {callUrl ? (
                <a href={callUrl} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-bold text-ink ring-1 ring-ink/10">
                  <Phone size={17} />
                  Call host
                </a>
              ) : null}
            </div>
          </MiniCard>
        ) : null}

        {params.section === "arrival" ? (
          <>
            <MiniCard title="Check-in">
              <p>{property.checkInInfo || "Check your arrival message for check-in details."}</p>
            </MiniCard>
            <MiniCard title="Check-out">
              <p>{property.checkOutInfo || "Check your arrival message for check-out details."}</p>
            </MiniCard>
          </>
        ) : null}

        {params.section === "house" ? (
          <>
            <MiniCard title="Parking">
              <p>{property.parkingInfo || "Ask your host about parking options."}</p>
            </MiniCard>
            <MiniCard title="House rules">
              <p className="whitespace-pre-line">{property.houseRules || "Please enjoy the home with care and respect quiet hours."}</p>
            </MiniCard>
            {property.guideSections.map((section) => (
              <MiniCard key={section.id} title={section.title}>
                <p className="whitespace-pre-line">{section.content}</p>
              </MiniCard>
            ))}
          </>
        ) : null}

        {params.section === "restaurants" ? (
          (restaurantRecommendations.length > 0 ? restaurantRecommendations : property.recommendations).length > 0 ? (
            (restaurantRecommendations.length > 0 ? restaurantRecommendations : property.recommendations).map((item) => <RecommendationCard key={item.id} item={item} />)
          ) : (
            <EmptyNote>Your host has not added restaurant recommendations yet.</EmptyNote>
          )
        ) : null}

        {params.section === "activities" ? (
          (activityRecommendations.length > 0 ? activityRecommendations : property.recommendations).length > 0 ? (
            (activityRecommendations.length > 0 ? activityRecommendations : property.recommendations).map((item) => <RecommendationCard key={item.id} item={item} />)
          ) : (
            <EmptyNote>Your host has not added activities yet.</EmptyNote>
          )
        ) : null}

        {params.section === "reviews" ? (
          property.reviewLinks.length > 0 ? (
            <MiniCard title="Leave a review">
              <p>A quick review helps future guests and means a lot to your host.</p>
              <div className="mt-4 grid gap-2">
                {property.reviewLinks.map((link) => (
                  <a key={link.id} href={link.url} className="rounded-full bg-[var(--accent)] px-4 py-3 text-center text-sm font-bold text-white">
                    {link.platform.charAt(0) + link.platform.slice(1).toLowerCase()}
                  </a>
                ))}
              </div>
            </MiniCard>
          ) : (
            <EmptyNote>Review links will appear here once your host adds them.</EmptyNote>
          )
        ) : null}

        {params.section === "emergency" ? (
          <>
            <MiniCard title="Emergency contacts">
              <p className="whitespace-pre-line">{property.emergencyInfo || "For emergencies, call the local emergency number. Contact your host for property issues."}</p>
            </MiniCard>
            {callUrl ? (
              <a href={callUrl} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-bold text-ink ring-1 ring-ink/10">
                <Car size={17} />
                Call host
              </a>
            ) : null}
          </>
        ) : null}
      </DetailShell>
    </div>
  );
}

function RecommendationCard({
  item
}: {
  item: {
    title: string;
    category: string;
    description: string;
    address: string | null;
    url: string | null;
    imageUrl: string | null;
  };
}) {
  return (
    <MiniCard title={item.title}>
      {item.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.imageUrl} alt={item.title} className="mb-4 h-40 w-full rounded-[14px] object-cover" />
      ) : null}
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">{item.category}</p>
      <p className="mt-2">{item.description}</p>
      {item.address ? <p className="mt-3 font-semibold text-ink/70">{item.address}</p> : null}
      {item.url ? (
        <a href={item.url} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-bold text-[var(--accent)] ring-1 ring-ink/10">
          <MapPin size={16} />
          Open map
        </a>
      ) : null}
    </MiniCard>
  );
}
