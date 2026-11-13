import { describe, expect, it } from "vitest";
import { hasBillingAccess } from "@/lib/billing";

const day = 24 * 60 * 60 * 1000;
const future = () => new Date(Date.now() + day);
const past = () => new Date(Date.now() - day);

describe("hasBillingAccess", () => {
  it("lets an admin in without any subscription", () => {
    expect(hasBillingAccess({ role: "ADMIN", subscriptionStatus: null, trialEndsAt: null })).toBe(true);
  });

  it("lets an active subscriber in even after the trial date passed", () => {
    expect(hasBillingAccess({ role: "OWNER", subscriptionStatus: "ACTIVE", trialEndsAt: past() })).toBe(true);
    expect(hasBillingAccess({ subscriptionStatus: "active", trialEndsAt: null })).toBe(true);
  });

  it("lets a running trial in and blocks an ended one", () => {
    expect(hasBillingAccess({ role: "OWNER", subscriptionStatus: "TRIALING", trialEndsAt: future() })).toBe(true);
    expect(hasBillingAccess({ role: "OWNER", subscriptionStatus: "TRIALING", trialEndsAt: past() })).toBe(false);
  });

  it("blocks owners without a confirmed subscription", () => {
    for (const status of [null, "PENDING", "CANCELED", "PAST_DUE", "PAUSED"]) {
      expect(hasBillingAccess({ role: "OWNER", subscriptionStatus: status, trialEndsAt: future() })).toBe(false);
    }
  });

  it("keeps working for callers that do not pass a role", () => {
    expect(hasBillingAccess({ subscriptionStatus: null, trialEndsAt: null })).toBe(false);
  });
});
