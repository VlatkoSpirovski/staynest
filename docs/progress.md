# StayNest progress

Direction (decided 13.11.2026): stay a guest-guide SaaS and make it excellent. No PMS (reservations, pricing, finances).

## Stage 1: critical fixes and tests (13.11.2026, done locally, not deployed)

Fixed:
- Admins no longer need a subscription: dashboard access and their public guides (`lib/billing.ts`, `lib/public-guide-access.ts`).
- Paddle webhook: the first charge after a card-required trial is stored as `ACTIVE` (was stored as `TRIALING` + 7 days); a late checkout event can no longer downgrade an `ACTIVE` subscriber; unknown users are logged and ignored (`lib/paddle-status.ts`, `app/api/paddle/webhook/route.ts`).
- Lost Paddle notifications repair themselves: a hidden guide whose owner has a Paddle handle re-checks Paddle at most once an hour per owner.
- Cron route refuses all requests in production when `CRON_SECRET` is missing (`lib/cron-auth.ts`).

Added:
- Vitest (`npm test`), 16 tests for access, Paddle status and cron auth. Each fix was undone once to confirm a test fails.

Audited, no change needed:
- Every owner mutation filters by owner (`ensureAccessibleProperty` or an `ownerId` condition); every admin action starts with `requireAdminUser`.
- AI chat: per-IP, per-guide and global daily limits, short answers. Listing import blocks private hosts.

Checks run: `tsc --noEmit` OK, `next lint` OK (existing `<img>` warnings), `vitest run` 16/16, `next build` OK.

## Open decisions and findings

- Signup requires a card before the trial (email and Google). 18 of 19 signups since July stopped at the payment page. Business decision: keep, or offer a no-card trial.
- Nothing calls `/api/cron/expire-previews` (no `vercel.json` cron): expired previews and old rate-limit rows are never cleaned up. Set `CRON_SECRET` in Vercel and add a schedule.
- Automated cross-tenant tests need a test database; not set up yet.

## Stage 2, part 1: visual bugs found in the browser (13.11.2026, local)

Checked with real screenshots (desktop 1440 px, mobile 390 px) of landing, login, register, public guide and dashboard.

Fixed:
- Public guide header: the photo and dark overlay layer had zero height in the classic and dark luxury layouts (`relative` overrode `absolute`), so the white title sat on a light background and was unreadable for every guest. `HeroImage` now only adds `relative` when no position is passed (`components/guest-guide-home.tsx`). Verified in the browser for classic.
- Landing, pricing and register no longer claim "No card needed": they now say 7 days free, then EUR 20 per year, cancel before the trial ends and pay nothing.
- "How it works": five steps sit on one row on wide screens instead of leaving the fifth card alone.

Still to do in Stage 2: desktop layout for the dashboard (today a stretched mobile layout with a floating bottom bar), shared design tokens instead of hard-coded colours, dark mode for the host app, accessibility pass.

## Growth: no-card trial, reminders, host steps (13.11.2026, local)

Decision: new hosts get a 7-day free trial without a card (was: card before the trial; 18 of 19 signups since July stopped at the payment page).

Built:
- Email and Google signup start a 7-day trial (`startTrial`) and land in the dashboard; checkout is now a direct yearly payment (`checkoutMode: "direct"`).
- Dashboard trial bar: days left, "Keep my guide live"; card-based trials keep their old wording.
- "How to use StayNest in 6 steps" on the Setup tab (open on the first visit), including printing and placing the QR code.
- Guests of an ended trial see a friendly "taking a short break" page instead of a 404 (`publicGuideStatus`, `components/guide-unavailable.tsx`); the AI chat stays closed.
- Reminder emails: 2 days before the end and once after it ended (`lib/trial-reminders.ts`, `/api/cron/trial-reminders`), each at most once per host (claim before send, released on failure). New columns `trialReminderSoonSentAt`, `trialReminderEndedSentAt` (additive migration `20261113160000_trial_reminder_tracking`).
- `vercel.json` schedules both cron jobs daily.

Tested: 23 Vitest tests; local end-to-end run of the reminder job (one email, none on the second run; ended email); paused guide page and dashboard trial bar checked in the browser; `next build` OK.

Before deploying:
- In Paddle, remove the 7-day trial from the annual price, otherwise hosts who pay after the free week get another 7 days in Paddle.
- In Vercel, set `CRON_SECRET` (any long random value); without it the scheduled jobs are refused in production.
- SMTP variables must be set in Vercel for reminder emails to be sent.

## SEO (13.11.2026, local)

- Canonical domain is now `https://www.staynest.site` (the apex redirects there); the root layout no longer gives every page the homepage canonical.
- Valid structured data: Organization, WebSite, SoftwareApplication with the real offer (EUR 20/year); the fake site-search action is gone. Guides add Article, FAQPage and BreadcrumbList; the tool adds WebApplication and FAQPage.
- Generated social image (`app/opengraph-image.tsx`, also used for Twitter).
- `/guides` with 8 host guides (`lib/guides-content.ts`): welcome book, house manual, check-in instructions, Wi-Fi QR code, more reviews, house rules, local recommendations, digital vs printed guide. No invented statistics; review-policy statements stay general.
- `/tools/wifi-qr-code`: Wi-Fi QR generator that runs in the browser (`lib/wifi-qr.ts`, tested escaping); verified that no request contains the network name or password.
- Sitemap: 16 URLs with fixed dates. Links to the guides from the landing nav and every footer.
- Checked: every page has one H1, a title up to 70 characters, a description, its own canonical and valid JSON-LD.

## Referrals (13.11.2026, local)

- Every owner gets a code (`ensureReferralCode`) and an invite card under Settings with stats.
- `/register?ref=CODE` (email and Google): 90-day trial instead of 7, `referredById` stored; self-referral by the same canonical email is ignored.
- When an invited owner first becomes `ACTIVE` (webhook or reconcile), the inviter is rewarded once (`referralRewardGrantedAt` claim): trial extended by 90 days, or, for paying inviters, `referralCreditMonths` +3, listed in the admin area to apply in Paddle by hand.
- Migration `20261113170000_referrals` (additive). Tested with unit tests and a local end-to-end run (signup through the link, reward once, credit path).

## Win-back

`docs/winback-2026-11.md`: SQL and two email texts to give the 29 earlier non-paying signups a fresh 14-day trial. Run after deploying.

## Final QA (13.11.2026)

`tsc` OK, `next lint` OK, 32 Vitest tests, `next build` OK (35 pages). Browser crawl of 19 public pages: no broken links, no JavaScript errors, no horizontal overflow on mobile. Dashboard: all four tabs without errors on desktop and mobile.

## Next: Stage 2 (rest)
Design system and redesign of the existing screens (landing, auth, dashboard editor, admin, public guide), light and dark mode, mobile, accessibility, checked in the browser.
