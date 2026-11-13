import { getSiteUrl } from "@/lib/utils";

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}

export function SeoJsonLd() {
  const siteUrl = getSiteUrl();

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "StayNest",
    url: siteUrl,
    logo: `${siteUrl}/staynest-logo.png`
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "StayNest",
    url: siteUrl
  };

  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "StayNest",
    url: siteUrl,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Digital guest guide for Airbnb, Booking.com and holiday rental hosts: a QR code guide with Wi-Fi, check-in, house rules, local tips, review links and an AI guest chat.",
    offers: {
      "@type": "Offer",
      price: "20",
      priceCurrency: "EUR",
      category: "subscription",
      description: "Yearly plan, 7-day free trial without a card."
    }
  };

  return <JsonLd data={[organization, website, software]} />;
}
