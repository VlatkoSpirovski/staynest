export const REFERRAL_TRIAL_DAYS = 90;
export const REFERRAL_REWARD_DAYS = 90;
export const REFERRAL_REWARD_MONTHS = 3;

const DAY_MS = 24 * 60 * 60 * 1000;
const CODE_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

export function generateReferralCode(random: (max: number) => number = (max) => Math.floor(Math.random() * max)) {
  let code = "";
  for (let index = 0; index < 8; index += 1) {
    code += CODE_ALPHABET[random(CODE_ALPHABET.length)];
  }
  return code;
}

export function normalizeReferralCode(value: string | null | undefined) {
  const code = (value ?? "").trim().toLowerCase();
  return /^[a-z0-9]{6,16}$/.test(code) ? code : null;
}

export type ReferrerState = {
  role: string;
  subscriptionStatus: string | null;
  trialEndsAt: Date | null;
  paddleSubscriptionId: string | null;
};

export type ReferrerReward =
  | { type: "extendTrial"; trialEndsAt: Date }
  | { type: "credit"; months: number }
  | { type: "none" };

export function referrerRewardFor(referrer: ReferrerState, now: Date): ReferrerReward {
  if (referrer.role === "ADMIN") return { type: "none" };

  const status = referrer.subscriptionStatus?.toUpperCase();
  if (status === "ACTIVE" || referrer.paddleSubscriptionId) {
    return { type: "credit", months: REFERRAL_REWARD_MONTHS };
  }

  const base = referrer.trialEndsAt && referrer.trialEndsAt.getTime() > now.getTime() ? referrer.trialEndsAt : now;
  return { type: "extendTrial", trialEndsAt: new Date(base.getTime() + REFERRAL_REWARD_DAYS * DAY_MS) };
}
