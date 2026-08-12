# StayNest Agent Handoff

Last deep scan: 2026-08-12.

This file is the high-signal repo map for future agents. Start here before opening files. Still spot-check the exact files you edit, but do not spend a fresh full scan on basic architecture.

## Product Snapshot

StayNest is a Next.js App Router SaaS MVP for rental/villa owners. Owners create a mobile guest guide with QR/public link, Wi-Fi and arrival details, local recommendations, review links, image branding, and an optional property-specific AI chat.

Current business flow:

- Landing page sells Basic and Full AI plans.
- Owners register publicly and get a 7-day no-card trial, landing straight in `/dashboard`. Billing is prompted from the dashboard trial bar, not as a wall in front of the first visit.
- Admins can also provision owners/admins and manage all properties.
- Owners manage one main property from `/dashboard`.
- Guests open public guides at the short canonical `/g/[code]`; `/stay/[slug]` still renders and `/[slug]` permanently redirects to the short link.
- Optional integrations: PostgreSQL, SMTP, Cloudinary, OpenAI Responses API, Google OAuth, Geoapify places, Paddle subscriptions, Cloudflare Turnstile.

## Stack

- Next.js 14 App Router, React 18, TypeScript strict mode.
- Tailwind CSS with custom colors in `tailwind.config.ts`.
- Prisma 5 with PostgreSQL.
- First-party auth with HTTP-only cookie sessions, no NextAuth.
- Server Actions for form mutations.
- `lucide-react` for icons.
- `qrcode` for dashboard QR generation.
- `nodemailer` for email.
- OpenAI Responses API via raw `fetch`.
- Cloudinary upload via raw signed upload request.
- Paddle subscriptions (webhook-authoritative). A legacy PayPal route still exists and is unused.
- Postgres-backed fixed-window rate limiting in `lib/rate-limit.ts`.

## Commands

Use these from repo root:

```bash
npm install
npm run dev
npm run build
npm run lint
npm run seed
npm run db:deploy
npm run db:generate
npx prisma migrate dev
```

Notes:

- `npm run build` runs `prisma generate` first.
- `npm run seed` runs `tsx prisma/seed.ts`.
- A local PostgreSQL database is required for migrations, seed, and most runtime work.
- No test framework is configured.

## Environment

`.env.example` defines all app env vars:

- `DATABASE_URL`: PostgreSQL connection string.
- `NEXT_PUBLIC_APP_URL`: canonical app URL for generated links and OAuth callbacks.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`: optional email sending. If missing, emails are printed in the dev server terminal.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_UPLOAD_FOLDER`: optional image uploads. If missing, dashboard/admin can still store pasted image URLs.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`: optional signup captcha. Both must be set to enable it; when unset the check is skipped so local dev keeps working.
- `OPENAI_API_KEY`, `OPENAI_MODEL`: optional AI import and guest chat. Default model fallback is `gpt-5-mini`; code intentionally replaces env value `gpt-5.4-mini` with `gpt-5-mini`.
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: optional Google login.
- `PAYPAL_ENV`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_BASIC_PLAN_ID`, `PAYPAL_AI_PLAN_ID`: optional PayPal subscription creation.

Apple OAuth helper code exists in `lib/oauth.ts`, but the active Apple routes redirect with "disabled for MVP".

## Recent Structural Changes (2026-08-12)

- Trials are granted at signup in `lib/billing.ts` (`startTrial`). `/api/billing/activate` only records the chosen plan now; it no longer gates on `NODE_ENV`.
- Signup abuse controls in `app/auth-actions.ts`: per-IP rate limits, Cloudflare Turnstile, disposable-domain blocking, auto-generated-name detection, and Gmail-dot/plus-alias canonicalisation via `lib/email-identity.ts` (`User.emailCanonical`).
- Login and password reset are rate limited per IP and per canonical address.
- Both AI chat routes are rate limited per IP, per property/token, and by a global daily circuit breaker, and now answer in the guest's own language.
- `Property.publicCode` powers the canonical short guide link. `lib/secure-slug.ts` mints codes from an unambiguous base32 alphabet; `lib/guide-sections.ts` holds the shared section list plus the reserved-root-path guard that stops bot scans from reaching the database.
- The listing importer rejects Airbnb URLs (`unsupportedListingHost`); Booking.com only. Airbnb review links and Airbnb marketing keywords are unchanged.
- All four guide themes now meet WCAG AA for body, muted and accent text. Modern's hero scrim was inverted to light because dark hero text over a dark cover photo measured 1:1.
- `prisma/purge-bot-accounts.ts` reports (and with `--delete` removes) the automated signups that predate these controls.

## Important Docs Drift

`README.md` is useful but stale in a few places:

- It says public self-registration is disabled; the current app has public `/register` and `registerOwner`.
- It says Google login is disabled; current Google OAuth routes are functional if env vars are configured.
- Apple login is still disabled at the route level.
- Billing is Paddle, not PayPal or Stripe. `app/api/paddle/webhook/route.ts` is the authoritative source for `subscriptionStatus`.
- It mentions future AI placeholders; current app already has AI listing import and guest chat when `OPENAI_API_KEY` is configured.
- Pricing in the app is Basic EUR 10/month and Full AI EUR 15/month.

## Directory Map

- `app/`: App Router pages, route handlers, server actions.
- `app/actions.ts`: owner dashboard server actions plus OpenAI listing import.
- `app/api/iot/discovery/route.ts`: authenticated smart-home aggregator discovery ingest endpoint.
- `app/admin/actions.ts`: admin-only user/property/recommendation/review actions.
- `app/auth-actions.ts`: email/password register, login, logout, password change/reset.
- `app/api/user/devices/`: authenticated active-session/device API routes.
- `app/settings/security/page.tsx`: security settings page for registered devices and remote logout.
- `app/stay/[slug]/`: public mobile guest guide.
- `app/[slug]/`: root aliases that redirect to `/stay/[slug]`.
- `components/`: shared UI and client components.
- `components/security-devices.tsx`: client UI for active sessions, toasts, and confirmation modal.
- `components/ui/`: tiny local Button/Panel/Field primitives.
- `lib/`: server helpers for auth, device metadata, Prisma, email, images, OAuth, password, slugs, utils.
- `prisma/`: schema, migrations, seed.
- `public/staynest-logo.png`: landing logo.

## Route Map

Marketing and account:

- `/`: landing page with plan cards and example guide link.
- `/register?plan=basic|ai`: public owner registration, starts 7-day trial, redirects to billing.
- `/login`: email/password login and Google link.
- `/forgot-password`: starts reset email flow.
- `/reset-password?token=...`: password reset form.
- `/change-password`: required for admin-provisioned users with temporary passwords.
- `/check-email`: confirmation page exists but current email/password registration marks email verified immediately.
- `/verify-email?token=...`: verifies an email token and signs in user, used by helper code but not current public register flow.

Owner/admin:

- `/dashboard`: owner workspace for one latest-updated property, recommendations, review links, QR/public link, PayPal status card, AI listing import.
- `/admin`: admin-only management for users, properties, recommendations, review links.
- `/billing?plan=basic|ai`: trial and PayPal CTA.
- `/billing/complete`: static success page after PayPal return.
- `/settings/security`: authenticated security page for registered devices and active session revocation.

Public guest:

- `/stay/[slug]`: mobile guide home, robots noindex.
- `/stay/[slug]/[section]`: detail sections: `wifi`, `contact`, `arrival`, `house`, `restaurants`, `activities`, `reviews`, `emergency`.
- `/[slug]` and `/[slug]/[section]`: aliases that look up the property and redirect to `/stay/...`.

API:

- `POST /api/stay/[slug]/chat`: public property-specific guest chat.
- `POST /api/iot/discovery`: auth-required smart-home discovery ingest. Accepts `propertyId`, `provider`, and `devices`; saves `manufacturer`/`brand` into `PropertyDevice.brand`.
- `GET /api/paypal/subscribe?plan=basic|ai`: auth-required PayPal subscription creation.
- `GET /api/user/devices`: auth-required list of active sessions for current user, marking the current device.
- `DELETE /api/user/devices/[id]`: auth-required revoke of one session owned by current user.
- `DELETE /api/user/devices/all-except-current`: auth-required revoke of every other session for current user.

OAuth:

- `GET /auth/google`: sets plan cookie/state, redirects to Google.
- `GET /auth/google/callback`: verifies state, signs in/up, redirects new users to billing.
- `/auth/apple` and `/auth/apple/callback`: disabled stubs.
- `GET /auth/iot/midea` and `GET /auth/iot/vivax`: start AC brand OAuth for a property (`?propertyId=`).
- `GET /auth/iot/[provider]/callback`: completes brand OAuth, stores `PropertyIotConnection`, redirects to device import.

## Data Model

See `prisma/schema.prisma`.

Core enums:

- `UserRole`: `ADMIN`, `OWNER`.
- `OAuthProvider`: `GOOGLE`, `APPLE`.
- `ReviewPlatform`: `GOOGLE`, `BOOKING`, `AIRBNB`.
- `GuideSectionType`: `WELCOME`, `WIFI`, `CHECK_IN_OUT`, `PARKING`, `HOUSE_RULES`, `EMERGENCY`, `CONTACT`, `CUSTOM`.

Core models:

- `User`: auth/profile/plan fields. Important fields: `passwordHash`, `emailVerifiedAt`, `role`, `mustChangePassword`, `selectedPlan`, `trialEndsAt`, `subscriptionStatus`, `paypalSubscriptionId`.
- `Session`: stores unique `tokenHash`, `userId`, `expiresAt`, device metadata (`deviceType`, `browserName`, `os`, `ipAddress`, `location`) and `lastActiveAt`; cookie stores raw token.
- `EmailVerificationToken`, `PasswordResetToken`: hashed token tables.
- `OAuthAccount`: provider account linkage, unique by provider/account id.
- `Property`: owner, public `slug`, branding, guide content, contact, `aiKnowledge`.
- `PropertyDevice`: property-scoped smart-home hardware registry for AC, lights, locks, thermostats and other IoT devices. Stores `provider`, `externalDeviceId`, `deviceType`, `brand`, `modelName`, `displayName`, `room`, `isOnline`, and original provider `metadata`.
- `GuideSection`: extra custom guide sections, rendered in public house guide.
- `Recommendation`: local recommendations; has `imageUrl` in schema.
- `ReviewLink`: one link per property/platform.

Cascade behavior:

- Deleting a user deletes sessions, tokens, OAuth accounts, and properties.
- Deleting a property deletes guide sections, recommendations, and review links.

Seed data:

- Admin: `admin@staynest.app` / `Admin123!`.
- Owner: `example-host@staynest.site` / `Owner123!`, forced password change.
- Example guide slug: `example-stay`.

## Auth And Access

Auth helpers are in `lib/auth.ts`.

- Cookie name is `staynest_session`.
- `createSession(userId)` stores sha256 token hash in DB and sets a 30-day HTTP-only cookie.
- `createSession(userId)` also captures user-agent/IP metadata through `lib/device-info.ts`.
- `getCurrentSession()` validates the token, returns the DB session plus user, and refreshes device metadata plus `lastActiveAt`.
- `destroySession()` deletes matching session row and cookie.
- `getCurrentUser()` validates token hash and `expiresAt`.
- `requireCurrentUser()` redirects to `/login?next=/dashboard`.
- `requireReadyUser()` also redirects temporary-password users to `/change-password`.
- `requireAdminUser()` also enforces `role === "ADMIN"`.

Middleware:

- `middleware.ts` only checks that the session cookie exists for `/dashboard`, `/admin`, `/change-password`, and `/settings`.
- Middleware does not validate DB session or role; pages/actions do that with helpers.

Owner/admin access pattern:

- Owner actions call `requireReadyUser()` and then filter property access by `ownerId` unless user is admin.
- Admin actions call `requireAdminUser()` at entry.
- Public guide and public chat intentionally require no auth and are keyed by property slug.

Device/session management:

- The active session registry is the `Session` table, not a separate `UserDevice` table.
- Device metadata is parsed locally from user-agent and proxy headers; location uses Vercel/Cloudflare geo headers when present, `Local network` for private IPs, and `Approximate location unavailable` otherwise.
- The UI lives in `components/security-devices.tsx` and is rendered by `app/settings/security/page.tsx`.
- Revoking a session deletes its `Session` row. Revoking the current session also clears the current cookie.

Smart-home device management:

- This is separate from account sessions. The property hardware registry is `PropertyDevice`.
- Brand account links are stored in `PropertyIotConnection` (OAuth tokens + pending device import list).
- Dashboard section: `Smart home` / `Property devices` in `app/dashboard/page.tsx`.
- AC brand connect flow: `/dashboard/connect-iot` → `/auth/iot/midea` or `/auth/iot/vivax` (live OAuth when env configured, otherwise sandbox login) → `/dashboard/connect-iot/devices` to import AC units.
- Provider adapters: `lib/iot-providers.ts`, OAuth state cookies: `lib/iot-oauth.ts`.
- Owner actions in `app/actions.ts`: `connectSandboxIotAccount`, `importClimateDevices`, `disconnectIotProvider`, `saveSmartDevice`, `syncSmartDevicesFromDiscovery`, `deleteSmartDevice`, `updateDeviceStateAction`.
- Guests and hosts control climate in `/stay/[slug]/smart-home` and dashboard device cards via `updateDeviceStateAction`, which proxies commands to Midea/Tuya when a live connection exists.
- Discovery normalization is in `lib/smart-devices.ts`.
- Aggregator payloads may be an array or `{ devices: [...] }`. For each item, `manufacturer` or `brand` is saved into `PropertyDevice.brand`; `external_device_id` is saved into `externalDeviceId`; `device_type` is saved into `deviceType`; `model_name` is saved into `modelName`; `is_online` is saved into `isOnline`.
- Optional env for live brand OAuth: `MIDEA_IOT_CLIENT_ID`, `MIDEA_IOT_CLIENT_SECRET`, `TUYA_CLIENT_ID`, `TUYA_CLIENT_SECRET` (Vivax via Smart Life / Tuya).
- iLetComfort/Sime does not use the Midea Open API OAuth path. It uses the local Python bridge in `lib/iletcomfort-bridge.ts` and `scripts/iletcomfort_cloud.py`, which talks to the Dollin API using iLetComfort app constants, imports devices from `/midea/open/business/v1/appliance/list`, and reads raw C3 heat-pump status through `/midea/open/business/v1/appliance/control/hexadecimal`.
- Current iLetComfort limitation: the imported SIME ATW `sn8=171H120F` model can list/import and refresh raw live status, but public C3 SET command frames are rejected by the cloud with `code=1214`. StayNest intentionally renders this model read-only and blocks non-refresh iLetComfort heat-pump commands until model-specific command frames are captured from the official app or another supported control bridge is added.

## Secure Slugs

Slug helpers are in `lib/secure-slug.ts`.

- Secure generated slugs end with `-[a-f0-9]{12}`.
- `createUniqueSecureSlug(value, excludePropertyId?)` normalizes base and appends a random 12-hex suffix.
- Owner/admin update actions reject public guide links without the secure suffix.
- Seeded `example-stay` intentionally does not have a secure suffix, so be careful when editing it through UI/actions.
- Root aliases `/[slug]` exist to support cleaner QR links.

## Main Server Actions

`app/auth-actions.ts`:

- `registerOwner`: public owner signup, password policy, creates verified user, selected plan, 7-day trial, status `TRIALING`, session, redirect to billing.
- `loginOwner`: verifies scrypt password, creates session, respects safe relative `next`, redirects temp-password users to `/change-password`.
- `changePassword`: validates current and new password, clears `mustChangePassword`.
- `logoutOwner`: destroys session.
- `requestPasswordReset`: creates 1-hour hashed reset token, emails or logs reset link.
- `resetPassword`: validates token and new password, clears reset tokens.

`app/actions.ts`:

- `importListingFromUrl`: owner/admin action. Accepts listing URL or pasted listing text, blocks private/local hosts, fetches HTML when needed, extracts page text/meta/json-ld, calls OpenAI Responses API with strict JSON schema, creates or updates accessible property.
- `saveProperty`: owner/admin property create/update, required fields are property name, Wi-Fi name/password, host phone/email. Handles URL/image upload/remove. Generates secure slug.
- `rotatePropertySlug`: regenerates secure slug for accessible property.
- `saveRecommendation`, `deleteRecommendation`: owner/admin recommendation management.
- `saveReviewLinks`: upserts/deletes Google/Booking/Airbnb review links.

`app/admin/actions.ts`:

- User CRUD with password policy, temp passwords force `mustChangePassword`.
- Property CRUD, owner assignment, secure slug generation/rotation.
- Admin recommendation and review link management.
- Admin cannot demote/delete self through included checks.

## AI Flows

Listing import:

- Located in `app/actions.ts`.
- Needs `OPENAI_API_KEY`.
- Uses `fetchListingText` for URL import, with user-agent, HTML-only check, 12-second timeout, no-store, and private hostname blocking.
- `cleanPageText` extracts title, meta description, OG tags, JSON-LD, visible text, capped around 28k chars.
- Sends a strict `json_schema` request to `https://api.openai.com/v1/responses`.
- Parsed import only fills clearly present guest-guide fields. It must not invent access codes, Wi-Fi passwords, phone numbers, emails, emergency contacts, exact check-in instructions, or prices.

Guest chat:

- Route: `app/api/stay/[slug]/chat/route.ts`.
- Client: `components/guest-chat.tsx`.
- Public POST accepts `{ message }`, trims to 600 chars.
- Builds context from property fields, custom guide sections, recommendations, review links, and `aiKnowledge`.
- If `OPENAI_API_KEY` is missing or API fails, it returns a fallback telling guest to contact host.
- The assistant instruction says answer only from provided context and never invent codes, prices, policies, addresses, or emergency instructions.

## Billing

Plan source:

- `basic`: EUR 10/month.
- `ai`: EUR 15/month.
- Registration and Google OAuth set `selectedPlan` and a 7-day `trialEndsAt`.

PayPal:

- UI in `app/billing/page.tsx`.
- API route in `app/api/paypal/subscribe/route.ts`.
- Uses sandbox unless `PAYPAL_ENV=live`.
- Creates a PayPal subscription with `custom_id: user.id`, return `/billing/complete`, cancel `/billing?plan=...`.
- Before redirecting, updates user with `selectedPlan`, `paypalSubscriptionId`, `subscriptionStatus: "PENDING"`.
- No webhook or completion verification is implemented yet. `/billing/complete` is static and does not update subscription status.

## Image Uploads

Helpers in `lib/image-upload.ts`, UI in `components/image-upload-field.tsx`.

- Accepted MIME types: JPG, PNG, WEBP.
- Max size: 5 MB.
- Cloudinary required for direct uploads.
- If Cloudinary is not configured, dashboard shows URL input fallback.
- Uploaded URLs are stored on `Property.logoUrl`, `Property.coverImageUrl`.
- `Recommendation.imageUrl` exists in schema and seed, but current dashboard/admin/public UI does not upload/edit/render recommendation images.

## Public Guide UI

Main files:

- `app/stay/[slug]/page.tsx`: guide home.
- `app/stay/[slug]/[section]/page.tsx`: guide details.
- `app/stay/[slug]/guide-ui.tsx`: `MenuLink`, `DetailShell`, `MiniCard`, `EmptyNote`.
- `components/guest-chat.tsx`: floating chat.

Design:

- Mobile-first max width around 430px.
- Public guide shell uses dark outer background and beige inner surface.
- Uses `property.accentColor` as CSS var `--accent`.
- `metadata.robots` is `index: false, follow: false`.

Section behavior:

- `wifi`: network/password and copy password.
- `contact`: phone/email, WhatsApp link, tel link.
- `arrival`: check-in/check-out.
- `house`: parking, house rules, then all `guideSections`.
- `restaurants`: recommendations with category matching restaurant/cafe/bar/food/dinner/bakery; falls back to all recommendations if none match.
- `activities`: recommendations not classified as restaurant; falls back to all recommendations if none.
- `reviews`: platform review links.
- `emergency`: emergency info and host call link.

## Dashboard UI

Main file: `app/dashboard/page.tsx`.

Important behavior:

- `dynamic = "force-dynamic"`.
- Loads latest updated property for current owner only.
- Generates QR as data URL with `qrcode`.
- Shows AI listing import panel above guide edit form.
- Owner guide form edits property essentials, images, Wi-Fi, arrival/contact, `aiKnowledge`.
- Recommendations and review links are collapsible sections.
- Sidebar shows QR/public URL/copy link and plan/trial/billing card.
- Admin users on dashboard get link to `/admin`.

## Admin UI

Main file: `app/admin/page.tsx`.

Important behavior:

- `dynamic = "force-dynamic"`.
- Loads all users and all properties with owners, recommendations, review links.
- Manages user create/update/delete, role changes, temp password resets.
- Manages property create/update/delete, owner assignment, slug regeneration.
- Manages recommendations/review links per property.
- Admin property image fields are URL-only; no Cloudinary upload field here.

## UI Conventions

- Local UI primitives are very small. Prefer using/extending them before adding another system:
  - `components/ui/button.tsx`
  - `components/ui/panel.tsx`
  - `components/submit-button.tsx`
- Tailwind colors:
  - `ink`: `#1f2933`
  - `mist`: `#f5f7f4`
  - `clay`: `#b8754d`
  - `olive`: `#6f7c57`
  - `lagoon`: `#4a8a8f`
- Cards/panels mostly use 8px radius in owner/admin app.
- Public guide intentionally uses larger rounded mobile cards.
- Use `lucide-react` icons.
- `focus-ring` utility is defined in `app/globals.css`.
- Existing style leans calm SaaS for dashboard/admin and warm mobile concierge for public guide.

## Coding Conventions

- Path alias `@/*` maps to repo root.
- Use TypeScript strict mode and App Router patterns.
- Server-only helpers import `"server-only"` where appropriate.
- Server Actions return by `redirect(...)`; success/error state is mostly query params.
- Forms use uncontrolled inputs with `defaultValue`.
- Prefer Prisma relational filters for access checks.
- Hash secrets/tokens before storing.
- Keep public guide pages dynamic because property content changes in DB.
- Use `revalidatePath` after DB mutations that affect dashboard/admin/public guide.
- Normalize emails to lowercase.
- Normalize slugs with `normalizeSlug` and generate secure slugs with `createUniqueSecureSlug`.

## Known Gaps And Gotchas

- No test framework is configured.
- No PayPal webhook or subscription status reconciliation exists.
- `/billing/complete` does not verify PayPal return state.
- Email verification helper exists, but `registerOwner` currently sets `emailVerifiedAt` immediately.
- `GuideSection` exists and public house guide renders it, but there is no owner/admin UI to manage guide sections.
- `Recommendation.imageUrl` exists and seed includes images, but current UI does not render/edit them.
- `SocialLogin` and `AiPlaceholders` components exist but are not central to current pages.
- Google OAuth is implemented even though README says social login is disabled.
- Apple OAuth helper code exists, but active Apple routes are disabled.
- Middleware checks only cookie presence. Do not rely on middleware for authorization.
- Public chat is unauthenticated by design. It should never expose anything beyond guide context.
- `next.config.mjs` allows remote images from any HTTPS hostname.
- `example-stay` seed slug is not secure-suffixed. Do not treat it as representative of production slugs.
- Dashboard selects the latest updated property only. Multi-property owner UX is not built.
- Admin delete buttons mostly do not use confirm components.
- `package-lock.json` may be touched by dependency installs; avoid churn if not changing dependencies.

## Common Change Recipes

Add/edit a property field:

1. Update `prisma/schema.prisma` and create a migration.
2. Update owner action data in `app/actions.ts`.
3. Update admin action data in `app/admin/actions.ts`.
4. Add fields in `app/dashboard/page.tsx` and usually `app/admin/page.tsx`.
5. Render it in `app/stay/[slug]/page.tsx` or `app/stay/[slug]/[section]/page.tsx`.
6. Include it in AI context/import if guest-facing: `app/api/stay/[slug]/chat/route.ts` and maybe `app/actions.ts`.
7. Update `prisma/seed.ts` if example data should show it.

Add a new guest guide section:

1. Add section key/meta in `app/stay/[slug]/[section]/page.tsx`.
2. Add a `MenuLink` in `app/stay/[slug]/page.tsx`.
3. Decide whether content is fixed property fields, `GuideSection`, recommendations, or a new model.
4. Update chat context if guests may ask about it.

Add a new review platform:

1. Add enum value in Prisma and migration.
2. Update platform arrays in `app/actions.ts` and `app/admin/actions.ts`.
3. Add fields in dashboard/admin pages.
4. Public reviews section maps all links automatically.

Add AI-generated output:

1. Use `OPENAI_API_KEY` and the Responses API pattern already in `app/actions.ts`.
2. Use a strict JSON schema when data will be saved.
3. Validate and trim parsed output before DB writes.
4. Keep fallback errors guest/host-friendly and avoid leaking raw provider errors unless useful to owner.

Add direct uploads:

1. Reuse `ImageUploadField` for client-side validation/preview.
2. Reuse `uploadImage` on the server.
3. Check `isUploadConfigured()` for UI fallback.
4. Keep file size and MIME policy aligned with `lib/image-upload.ts`.

Add auth-protected pages:

1. Add route to `protectedPrefixes` and `config.matcher` in `middleware.ts` if it should redirect early.
2. Still call `requireReadyUser()` or `requireAdminUser()` inside the page/action.
3. Use safe relative redirect targets only.

## Verification Checklist

For doc-only changes:

- Inspect diff and final file formatting.

For app changes:

- Run `npm run lint` when feasible.
- Run `npm run build` when env/database setup allows it.
- For Prisma changes, run `npx prisma migrate dev` locally, then `npm run db:generate`.
- Manually smoke routes that changed:
  - `/`
  - `/register?plan=basic`
  - `/login`
  - `/dashboard`
  - `/admin`
  - `/stay/example-stay`
  - `/stay/example-stay/wifi`
- If touching public guide UI, verify mobile width around 390 to 430px and desktop centered layout.
