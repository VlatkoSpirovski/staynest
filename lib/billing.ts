import type { User } from "@prisma/client";
import { getPaymentUrl } from "@/lib/utils";

export type PlanTier = "basic" | "ai";
export type BillingInterval = "monthly" | "yearly";
export type PlanKey = "basic-monthly" | "basic-yearly" | "ai-monthly" | "ai-yearly";

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
  "basic-monthly": {
    key: "basic-monthly",
    tier: "basic",
    interval: "monthly",
    name: "Basic Monthly",
    shortName: "Basic",
    price: "€10",
    cadence: "monthly"
  },
  "basic-yearly": {
    key: "basic-yearly",
    tier: "basic",
    interval: "yearly",
    name: "Basic Yearly",
    shortName: "Basic",
    price: "€60",
    cadence: "yearly",
    savings: "Save €60",
    comparison: "instead of €120/year"
  },
  "ai-monthly": {
    key: "ai-monthly",
    tier: "ai",
    interval: "monthly",
    name: "Full AI Monthly",
    shortName: "Full AI",
    price: "€15",
    cadence: "monthly"
  },
  "ai-yearly": {
    key: "ai-yearly",
    tier: "ai",
    interval: "yearly",
    name: "Full AI Yearly",
    shortName: "Full AI",
    price: "€80",
    cadence: "yearly",
    savings: "Save €100",
    comparison: "instead of €180/year"
  }
};

export function normalizeTier(value: string | null | undefined): PlanTier {
  return value === "ai" || value === "ai-monthly" || value === "ai-yearly" ? "ai" : "basic";
}

export function normalizePlanKey(value: string | null | undefined): PlanKey {
  if (value === "basic-yearly" || value === "ai-yearly" || value === "ai-monthly") return value;
  if (value === "ai") return "ai-monthly";
  return "basic-monthly";
}

export function planOption(value: string | null | undefined) {
  return planOptions[normalizePlanKey(value)];
}

export function priceIdForPlan(value: string | null | undefined) {
  const plan = normalizePlanKey(value);
  if (plan === "basic-yearly") return process.env.PADDLE_BASIC_YEARLY_PRICE_ID;
  if (plan === "ai-yearly") return process.env.PADDLE_AI_YEARLY_PRICE_ID;
  if (plan === "ai-monthly") return process.env.PADDLE_AI_MONTHLY_PRICE_ID || process.env.PADDLE_AI_PRICE_ID;
  return process.env.PADDLE_BASIC_MONTHLY_PRICE_ID || process.env.PADDLE_BASIC_PRICE_ID;
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
