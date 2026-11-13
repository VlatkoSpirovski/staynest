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

## Next: Stage 2
Design system and redesign of the existing screens (landing, auth, dashboard editor, admin, public guide), light and dark mode, mobile, accessibility, checked in the browser.
