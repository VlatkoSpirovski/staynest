import type { User } from "@prisma/client";
import { getPaymentUrl } from "@/lib/utils";

export type PlanTier = "ai";
export type BillingInterval = "yearly";
export type PlanKey = "annual";

/**
 * StayNest sells one plan: everything included, billed once a year.
 *
 * The single-plan shape is deliberate. Two tiers that were identical in code
 * (the AI chat never checked the owner's tier) only added a choice to make before
 * anyone had seen the product. `planOption` and `PlanKey` keep their old shape so
 * existing call sites compile; legacy plan strings stored on users all normalise
 * onto this one entry.
 */
export const ANNUAL_PRICE_EUR = 20;

export const planOptions: Record<PlanKey, {
  key: PlanKey;
  tier: PlanTier;
  interval: BillingInterval;
  name: string;
  shortName: string;
  price: string;
  cadence: string;
  savings?: string;
  comparison?: string;
}> = {
  annual: {
    key: "annual",
    tier: "ai",
    interval: "yearly",
    name: "StayNest Annual",
    shortName: "Annual",
    price: `\u20ac${ANNUAL_PRICE_EUR}`,
    cadence: "yearly"
  }
};

/** Every feature ships in the single plan, so there is only one tier. */
export function normalizeTier(_value?: string | null): PlanTier {
  return "ai";
}

/** Collapses any legacy plan string ("basic-monthly", "ai-yearly", ...) onto the one plan. */
export function normalizePlanKey(_value?: string | null): PlanKey {
  return "annual";
}

export function planOption(_value?: string | null) {
  return planOptions.annual;
}

export function priceIdForPlan(_value?: string | null) {
  return (
    process.env.PADDLE_ANNUAL_PRICE_ID ||
    process.env.PADDLE_AI_YEARLY_PRICE_ID ||
    process.env.PADDLE_BASIC_YEARLY_PRICE_ID
  );
}

export function billingUrl(plan: string | null | undefined) {
  return `${getPaymentUrl()}/billing?plan=${encodeURIComponent(normalizePlanKey(plan))}`;
}

export const TRIAL_DAYS = 7;

/**
 * Fields that start a no-card trial. Applied at signup in every environment so a
 * new owner can build and publish a guide before being asked for a payment method.
 * Paddle webhooks remain authoritative afterwards and overwrite these.
 */
export function startTrial(days = TRIAL_DAYS) {
  return {
    subscriptionStatus: "TRIALING",
    trialEndsAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000)
  };
}

export function trialDaysRemaining(user: Pick<User, "trialEndsAt">) {
  if (!user.trialEndsAt) return null;
  const ms = user.trialEndsAt.getTime() - Date.now();
  return ms <= 0 ? 0 : Math.ceil(ms / (24 * 60 * 60 * 1000));
}

export function hasBillingAccess(user: Pick<User, "subscriptionStatus" | "trialEndsAt">) {
  const status = user.subscriptionStatus?.toUpperCase();
  if (status === "ACTIVE") return true;
  if (status !== "TRIALING") return false;
  return user.trialEndsAt ? user.trialEndsAt.getTime() > Date.now() : true;
}
