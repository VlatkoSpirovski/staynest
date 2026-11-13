import { describe, expect, it } from "vitest";
import { resolveStatus, webhookStatus } from "@/lib/paddle-status";

describe("webhookStatus", () => {
  it("treats the first charge after a card-required trial as ACTIVE", () => {
    expect(
      webhookStatus({ eventType: "transaction.completed", checkoutMode: "card-required-trial", origin: "subscription_recurring" })
    ).toBe("ACTIVE");
  });

  it("treats the trial checkout itself as TRIALING", () => {
    expect(webhookStatus({ eventType: "transaction.completed", checkoutMode: "card-required-trial", origin: "web" })).toBe("TRIALING");
    expect(webhookStatus({ eventType: "transaction.completed", checkoutMode: "card-required-trial" })).toBe("TRIALING");
  });

  it("treats a checkout without a trial as ACTIVE", () => {
    expect(webhookStatus({ eventType: "transaction.completed", origin: "web" })).toBe("ACTIVE");
  });

  it("maps subscription lifecycle events", () => {
    expect(webhookStatus({ eventType: "subscription.activated" })).toBe("ACTIVE");
    expect(webhookStatus({ eventType: "subscription.trialing" })).toBe("TRIALING");
    expect(webhookStatus({ eventType: "subscription.canceled" })).toBe("CANCELED");
    expect(webhookStatus({ eventType: "subscription.past_due" })).toBe("PAST_DUE");
    expect(webhookStatus({ eventType: "subscription.updated", paddleStatus: "active" })).toBe("ACTIVE");
    expect(webhookStatus({ eventType: "transaction.payment_failed" })).toBe("PAST_DUE");
  });

  it("ignores events that do not change access", () => {
    expect(webhookStatus({ eventType: "customer.updated" })).toBeNull();
  });
});

describe("resolveStatus", () => {
  it("never lets a late checkout event downgrade an active subscriber to trial", () => {
    expect(resolveStatus("ACTIVE", "TRIALING", "transaction.completed")).toBeNull();
  });

  it("lets Paddle's own subscription events move an active subscriber", () => {
    expect(resolveStatus("ACTIVE", "TRIALING", "subscription.updated")).toBe("TRIALING");
    expect(resolveStatus("ACTIVE", "CANCELED", "subscription.canceled")).toBe("CANCELED");
  });

  it("applies normal transitions", () => {
    expect(resolveStatus("PENDING", "TRIALING", "transaction.completed")).toBe("TRIALING");
    expect(resolveStatus("TRIALING", "ACTIVE", "transaction.completed")).toBe("ACTIVE");
    expect(resolveStatus("TRIALING", null, "customer.updated")).toBeNull();
  });
});
