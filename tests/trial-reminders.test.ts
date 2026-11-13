import { describe, expect, it } from "vitest";
import { trialReminderEmail, trialReminderFor, type TrialReminderCandidate } from "@/lib/trial-reminders";

const now = new Date("2026-11-13T08:00:00Z");
const hours = (h: number) => new Date(now.getTime() + h * 60 * 60 * 1000);

function owner(overrides: Partial<TrialReminderCandidate> = {}): TrialReminderCandidate {
  return {
    role: "OWNER",
    subscriptionStatus: "TRIALING",
    trialEndsAt: hours(36),
    paddleSubscriptionId: null,
    trialReminderSoonSentAt: null,
    trialReminderEndedSentAt: null,
    ...overrides
  };
}

describe("trialReminderFor", () => {
  it("sends the 'soon' reminder in the last two days, once", () => {
    expect(trialReminderFor(owner({ trialEndsAt: hours(47) }), now)).toBe("soon");
    expect(trialReminderFor(owner({ trialEndsAt: hours(1) }), now)).toBe("soon");
    expect(trialReminderFor(owner({ trialEndsAt: hours(47), trialReminderSoonSentAt: now }), now)).toBeNull();
  });

  it("sends nothing earlier than two days before the end", () => {
    expect(trialReminderFor(owner({ trialEndsAt: hours(49) }), now)).toBeNull();
  });

  it("sends the 'ended' reminder once, within three days after the end", () => {
    expect(trialReminderFor(owner({ trialEndsAt: hours(-1) }), now)).toBe("ended");
    expect(trialReminderFor(owner({ trialEndsAt: hours(-71) }), now)).toBe("ended");
    expect(trialReminderFor(owner({ trialEndsAt: hours(-1), trialReminderEndedSentAt: now }), now)).toBeNull();
    expect(trialReminderFor(owner({ trialEndsAt: hours(-73) }), now)).toBeNull();
  });

  it("sends the 'ended' reminder even if the 'soon' one went out", () => {
    expect(trialReminderFor(owner({ trialEndsAt: hours(-5), trialReminderSoonSentAt: hours(-30) }), now)).toBe("ended");
  });

  it("never emails admins, paying customers or card-based trials", () => {
    expect(trialReminderFor(owner({ role: "ADMIN" }), now)).toBeNull();
    expect(trialReminderFor(owner({ subscriptionStatus: "ACTIVE" }), now)).toBeNull();
    expect(trialReminderFor(owner({ subscriptionStatus: "PENDING" }), now)).toBeNull();
    expect(trialReminderFor(owner({ paddleSubscriptionId: "sub_123" }), now)).toBeNull();
    expect(trialReminderFor(owner({ trialEndsAt: null }), now)).toBeNull();
  });
});

describe("trialReminderEmail", () => {
  const input = { name: "Ana <b>", endsOn: "15 November 2026", billingUrl: "https://example.test/billing?plan=annual", dashboardUrl: "https://example.test/dashboard" };

  it("tells the host the date, the price and where to pay", () => {
    const soon = trialReminderEmail("soon", input);
    expect(soon.subject).toContain("goes offline soon");
    expect(soon.text).toContain("15 November 2026");
    expect(soon.text).toContain("EUR 20 per year");
    expect(soon.html).toContain(input.billingUrl);

    const ended = trialReminderEmail("ended", input);
    expect(ended.subject).toContain("offline");
    expect(ended.text).toContain(input.dashboardUrl);
  });

  it("escapes the host's name in the HTML version", () => {
    expect(trialReminderEmail("soon", input).html).toContain("Ana &lt;b&gt;");
    expect(trialReminderEmail("soon", input).html).not.toContain("Ana <b>");
  });
});
