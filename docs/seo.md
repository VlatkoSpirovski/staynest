# StayNest SEO

Last update: 17.11.2026. Evidence: live search results checked on 17.11.2026 (no keyword-volume tool was used; no volumes or difficulty scores are claimed).

## Audit summary (before this round)

Strong already: server-rendered Next.js pages, one H1 per page, unique titles and descriptions, self canonicals, Organization / WebSite / SoftwareApplication JSON-LD with the real price (EUR 20/year), Article + FAQ + Breadcrumb JSON-LD on guides, robots.txt blocking the app, a 16-URL sitemap, social image, fast landing (about 0.2 s, about 100 KB HTML).

Gaps found:
- Homepage title and H1 did not contain what hosts search for ("digital guest guide", "welcome book").
- English only; German and Italian hosts search with their own terms.
- No page for two distinct intents: QR code guest guide, AI guest assistant.
- Guides linked to signup but not to the matching product page.
- Title of `/guides/digital-guest-guide` competed with the homepage for "digital guest guide".
- No Search Console / Bing verification hook.

## What the search results show

- English head terms ("digital guidebook", "Airbnb welcome book", "checkout instructions template") are dominated by established vendors and PMS blogs (Touch Stay, Hostfully, Lodgify, Hospitable, iGMS, Uplisting). Realistic targets are specific long-tail pages and non-English markets.
- German hosts use "Gästemappe" / "Gästemappe Ferienwohnung" (Smoobu, Holidu, traum-ferienwohnungen, atraveo). "Gästebuch" means a guest signing book, so it is not targeted.
- Italian hosts use "guida per ospiti", "guida digitale casa vacanze" and "libretto di benvenuto digitale" (Smoobu, Holidu, Hostfully IT).
- Competitor comparison pages were not built: feature sets change often and the available evidence is mostly vendor marketing, so a fair comparison is not possible yet.

## Keyword-to-page map

| URL | Lang | Intent | Theme | Title | Index |
|---|---|---|---|---|---|
| `/` | en | commercial | digital guest guide, digital welcome book, guest guide software | Digital Guest Guide & QR Welcome Book for Airbnb Hosts \| StayNest | yes |
| `/de` | de | commercial | digitale Gästemappe, Gästemappe Ferienwohnung | Digitale Gästemappe für Ferienwohnungen mit QR-Code \| StayNest | yes |
| `/it` | it | commercial | guida digitale per ospiti, guida per ospiti casa vacanze | Guida digitale per ospiti con QR code per case vacanze \| StayNest | yes |
| `/qr-code-guest-guide` | en | commercial | QR code guest guide, QR code welcome book | QR Code Guest Guide & Welcome Book for Holiday Rentals | yes |
| `/ai-guest-assistant` | en | commercial | AI guest assistant, AI concierge for holiday rentals | AI Guest Assistant & Concierge for Holiday Rentals | yes |
| `/pricing` | en | transactional | StayNest price | Pricing for more 5-star guest reviews | yes |
| `/tools/wifi-qr-code` | en | tool | Wi-Fi QR code generator | Free Wi-Fi QR Code Generator for Airbnb & Guests | yes |
| `/guides/airbnb-welcome-book` | en | informational | what to include in a welcome book | Airbnb Welcome Book: What to Include (Free Template) | yes |
| `/guides/house-manual-template` | en | informational | house manual template | Vacation Rental House Manual Template | yes |
| `/guides/check-in-instructions-template` | en | informational | check-in instructions | Check-in Instructions Template for Airbnb & Booking.com | yes |
| `/guides/checkout-instructions-template` | en | informational | check-out instructions (new) | Check-out Instructions Template for Holiday Rentals | yes |
| `/guides/airbnb-welcome-message-examples` | en | informational | welcome message examples (new) | Airbnb Welcome Message Examples & Templates | yes |
| `/guides/reduce-guest-questions` | en | problem | reduce repetitive guest questions (new) | How to Reduce Repetitive Guest Questions | yes |
| `/guides/wifi-qr-code-for-guests` | en | informational | share Wi-Fi with guests | Wi-Fi QR Code for Guests: How to Make One | yes |
| `/guides/house-rules-template` | en | informational | house rules template | Airbnb House Rules Template & Examples | yes |
| `/guides/local-recommendations-guide` | en | informational | local recommendations | Local Recommendations for Airbnb Guests | yes |
| `/guides/get-more-airbnb-reviews` | en | informational | more reviews | How to Get More 5-Star Reviews on Airbnb & Booking.com | yes |
| `/guides/digital-guest-guide` | en | comparison | digital vs printed welcome book | Digital vs Printed Welcome Book: Which Is Better for Hosts? | yes |
| `/g/*`, `/stay/*` | - | guest guides | - | - | noindex |
| app routes | - | private | - | - | robots.txt + auth |

One page per intent; the homepage owns "digital guest guide", the comparison guide owns "digital vs printed".

## International setup

- `/`, `/de`, `/it` are full localized homepages from one component (`components/landing-page.tsx`, copy in `lib/landing-copy.ts`).
- Each has a self canonical and reciprocal hreflang (`en`, `de`, `it`, `x-default` → `/`), in the HTML and in the sitemap.
- `Content-Language` response header on `/de` and `/it` (`next.config.mjs`); `<main lang>` server-side and `<html lang>` set on the client. Google does not use the `lang` attribute for language detection; Bing reads the header.
- Guides, signup and the dashboard are English. German and Italian visitors reach an English signup page; translating signup is on the roadmap.
- The guest guide itself is in six languages (detected from the phone).

## Measurement plan

Search Console (www.staynest.site, domain property): clicks, impressions, queries and pages, filtered by country and by `/de` and `/it`. Bing Webmaster Tools: same. Google Analytics: `page_view` by landing page, `register_google_started`, signups (admin funnel), `checkout_started` / `checkout_completed`, `qr_downloaded`, `essentials_completed`. Admin funnel: signed up, started a guide, finished essentials, paying.

## Roadmap

30 days
- Verify Search Console and Bing (set `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` in Vercel), submit the sitemap, request indexing for `/`, `/de`, `/it` and the two new pages.
- List StayNest on AlternativeTo, Product Hunt, Capterra / G2 and relevant host directories.
- Collect 3 to 5 real host quotes with permission and add them to the homepage.
- German and Italian versions of the two strongest guides (welcome book, check-in instructions), with hreflang.

60 days
- Translate signup and the trial emails into German and Italian.
- One guide per month on questions from real host conversations; update existing guides when the product changes.
- Look at Search Console queries with impressions but few clicks and improve those titles and pages.

90 days
- German and Italian versions of the QR and AI pages if the localized homepages get impressions.
- Consider a fair comparison page once there is reliable, current evidence.
- Outreach to host blogs and communities with the free tools and templates as the reason to link.

Not guaranteed: rankings, rich results (FAQ rich results are limited to a few site types), or citations in AI search.
