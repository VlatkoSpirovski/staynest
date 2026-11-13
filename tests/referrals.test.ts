import { describe, expect, it } from "vitest";
import { generateReferralCode, normalizeReferralCode, referrerRewardFor } from "@/lib/referrals";

const now = new Date("2026-11-13T10:00:00Z");
const day = 24 * 60 * 60 * 1000;

describe("referral codes", () => {
  it("generates 8 lowercase characters without look-alikes", () => {
    const code = generateReferralCode();
    expect(code).toMatch(/^[a-z2-9]{8}$/);
    expect(code).not.toMatch(/[01ilo]/);
  });

  it("normalises valid codes and rejects anything else", () => {
    expect(normalizeReferralCode("  AbCd2345 ")).toBe("abcd2345");
    expect(normalizeReferralCode("abc")).toBeNull();
    expect(normalizeReferralCode("abcd'; drop")).toBeNull();
    expect(normalizeReferralCode(null)).toBeNull();
  });
});

describe("referrerRewardFor", () => {
  it("adds 3 months to a running trial, counted from its end", () => {
    const trialEndsAt = new Date(now.getTime() + 5 * day);
    const reward = referrerRewardFor({ role: "OWNER", subscriptionStatus: "TRIALING", trialEndsAt, paddleSubscriptionId: null }, now);
    expect(reward).toEqual({ type: "extendTrial", trialEndsAt: new Date(trialEndsAt.getTime() + 90 * day) });
  });

  it("restarts an ended trial with 3 months from today", () => {
    const reward = referrerRewardFor({ role: "OWNER", subscriptionStatus: "TRIALING", trialEndsAt: new Date(now.getTime() - 10 * day), paddleSubscriptionId: null }, now);
    expect(reward).toEqual({ type: "extendTrial", trialEndsAt: new Date(now.getTime() + 90 * day) });
  });

  it("records a 3-month credit for paying hosts instead of touching their subscription", () => {
    expect(referrerRewardFor({ role: "OWNER", subscriptionStatus: "ACTIVE", trialEndsAt: null, paddleSubscriptionId: "sub_1" }, now)).toEqual({ type: "credit", months: 3 });
    expect(referrerRewardFor({ role: "OWNER", subscriptionStatus: "PAST_DUE", trialEndsAt: null, paddleSubscriptionId: "sub_1" }, now)).toEqual({ type: "credit", months: 3 });
  });

  it("gives admins nothing", () => {
    expect(referrerRewardFor({ role: "ADMIN", subscriptionStatus: null, trialEndsAt: null, paddleSubscriptionId: null }, now)).toEqual({ type: "none" });
  });
});
