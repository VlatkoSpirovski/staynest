import { describe, expect, it } from "vitest";
import { hostFunnel } from "@/lib/host-funnel";

const now = new Date("2026-11-17T10:00:00Z");
const old = new Date("2026-09-01T10:00:00Z");
const full = { welcomeMessage: "Hi", wifiName: "Net", wifiPassword: "pw", checkInInfo: "15:00", hostPhone: "+389", hostEmail: "a@b.c" };
const empty = { welcomeMessage: null, wifiName: null, wifiPassword: null, checkInInfo: null, hostPhone: null, hostEmail: null };

describe("host funnel", () => {
  const users = [
    { id: "a", role: "OWNER", createdAt: now, subscriptionStatus: "ACTIVE" },
    { id: "b", role: "OWNER", createdAt: now, subscriptionStatus: "TRIALING" },
    { id: "c", role: "OWNER", createdAt: old, subscriptionStatus: null },
    { id: "admin", role: "ADMIN", createdAt: now, subscriptionStatus: null }
  ];
  const properties = [
    { ownerId: "a", name: "Villa A", ...full },
    { ownerId: "a", name: "Villa A2", ...empty },
    { ownerId: "b", name: "Villa B", ...empty },
    { ownerId: "c", name: "", ...full },
    { ownerId: "admin", name: "Example", ...full }
  ];

  it("counts each host once per step and ignores admins and unnamed guides", () => {
    expect(hostFunnel(users, properties)).toEqual({ signedUp: 3, startedGuide: 2, essentialsDone: 1, paying: 1 });
  });

  it("limits to hosts who signed up since a date", () => {
    expect(hostFunnel(users, properties, new Date("2026-11-01T00:00:00Z"))).toEqual({ signedUp: 2, startedGuide: 2, essentialsDone: 1, paying: 1 });
  });
});
