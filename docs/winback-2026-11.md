# Win-back: fresh free trial for earlier signups (November 2026)

Goal: give the 29 owners who signed up but never paid a fresh 14-day trial without a card, and tell them once, personally.

Counts on production (13.11.2026, read-only check):

| Group | Owners | With a guide |
|---|---|---|
| `PENDING`: stopped at the old card-first payment page | 18 | 0 |
| `TRIALING` with an ended trial (May, no-card era) | 10 | 5 |
| No status, has a guide | 1 | 1 |

Do this only **after** the new version is deployed (the migrations add the reminder and referral columns).

## 1. Preview who is affected (read-only)

```sql
SELECT "subscriptionStatus", count(*)
FROM "User"
WHERE role = 'OWNER'
  AND "paddleSubscriptionId" IS NULL
  AND ("subscriptionStatus" = 'PENDING'
       OR "subscriptionStatus" IS NULL
       OR ("subscriptionStatus" = 'TRIALING' AND "trialEndsAt" < now()))
GROUP BY 1;
```

Expected: about 29 rows in total (18 + 10 + 1). If it is very different, stop and check.

## 2. Give them 14 days (run as the database owner, in one transaction)

```sql
BEGIN;

UPDATE "User"
SET "subscriptionStatus" = 'TRIALING',
    "trialEndsAt" = (now() AT TIME ZONE 'UTC') + interval '14 days',
    "trialReminderSoonSentAt" = NULL,
    "trialReminderEndedSentAt" = NULL
WHERE role = 'OWNER'
  AND "paddleSubscriptionId" IS NULL
  AND ("subscriptionStatus" = 'PENDING'
       OR "subscriptionStatus" IS NULL
       OR ("subscriptionStatus" = 'TRIALING' AND "trialEndsAt" < now()));

-- The tool reports the number of updated rows. If it matches step 1:
COMMIT;
-- Otherwise:
-- ROLLBACK;
```

Effect: the 6 existing guides go live again for 14 days, everyone can log in and build a guide without a card, and the normal reminder emails go out 2 days before the end.

## 3. Get the email list

```sql
SELECT u.name, u.email,
       EXISTS (SELECT 1 FROM "Property" p WHERE p."ownerId" = u.id) AS has_guide
FROM "User" u
WHERE u.role = 'OWNER'
  AND u."paddleSubscriptionId" IS NULL
  AND u."subscriptionStatus" = 'TRIALING'
  AND u."trialEndsAt" > now() + interval '13 days'
ORDER BY has_guide DESC, u.name;
```

Send each email individually from your own mailbox (not BCC to everyone). Personal emails get far more replies.

## 4. Email: owners who never built a guide (`has_guide = false`)

**Subject:** Your StayNest guide is ready to try, no card needed

Hi [first name],

You signed up for StayNest a while ago but stopped at the payment step. That was our mistake: we asked for a card before you could even see the product.

We've removed that. Your account now has a free 14-day trial, no card needed:

https://dashboard.staynest.site/login

In about five minutes you can paste your listing link, add Wi-Fi and check-in details, and print one QR code for your guests. If you'd like, reply with your Booking.com or Airbnb link and I'll set up a first version of your guide for you.

Best,
[Your name]
StayNest

## 5. Email: owners who already built a guide (`has_guide = true`)

**Subject:** Your guest guide is back online for 14 days

Hi [first name],

Your StayNest guide for [property name] is online again: we've given you a fresh 14-day free trial, no card needed.

Log in to check it and update anything that changed: https://dashboard.staynest.site/login

Your QR code still works, so anything you printed before is live again. If you keep it after the trial, it's EUR 20 per year, everything included.

Best,
[Your name]
StayNest

## After sending

- Reply personally to every answer within a day.
- Note who replies and who subscribes; that tells you whether the card-first step was really the blocker.
