import { describe, expect, it } from "vitest";
import { isAuthorizedCronRequest } from "@/lib/cron-auth";

describe("isAuthorizedCronRequest", () => {
  it("refuses every request in production when no secret is configured", () => {
    expect(isAuthorizedCronRequest(null, undefined, "production")).toBe(false);
    expect(isAuthorizedCronRequest("Bearer anything", "", "production")).toBe(false);
  });

  it("allows local runs without a secret", () => {
    expect(isAuthorizedCronRequest(null, undefined, "development")).toBe(true);
  });

  it("requires the exact bearer secret when one is configured", () => {
    expect(isAuthorizedCronRequest("Bearer s3cret", "s3cret", "production")).toBe(true);
    expect(isAuthorizedCronRequest("Bearer wrong", "s3cret", "production")).toBe(false);
    expect(isAuthorizedCronRequest(null, "s3cret", "development")).toBe(false);
  });
});
