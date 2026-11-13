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

## Next: Stage 2 (rest)
Design system and redesign of the existing screens (landing, auth, dashboard editor, admin, public guide), light and dark mode, mobile, accessibility, checked in the browser.
