import { getSiteUrl } from "@/lib/utils";

export function SeoJsonLd() {
  const siteUrl = getSiteUrl();

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "StayNest",
    url: siteUrl
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "StayNest",
    url: siteUrl,
    keywords:
      "get more 5-star reviews, Airbnb reviews, Booking.com reviews, Google reviews for rentals, Airbnb hosts, Booking.com hosts, apartment hosts, guest guide, QR code guest guide, AI guest chat, AI for guests",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  );
}
