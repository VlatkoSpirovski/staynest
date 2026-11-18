import { describe, expect, it } from "vitest";
import { extractCardTime, getWelcomeCardCopy, safeAccentColor, welcomeCardLayout, welcomeCardLocale } from "@/lib/welcome-card";
import { GUEST_LOCALES } from "@/lib/guest-i18n";

describe("extractCardTime", () => {
  it("finds a 24-hour time in any language", () => {
    expect(extractCardTime("Check-in ab 15:00 Uhr, Schlüsselbox neben der Tür.")).toBe("15:00");
    expect(extractCardTime("Arrivée à partir de 16h30")).toBe("16:30");
    expect(extractCardTime("Arrivo dalle 9.30")).toBe("09:30");
  });

  it("keeps a range together", () => {
    expect(extractCardTime("From 15:00 to 22:00, late arrival on request")).toBe("15:00–22:00");
    expect(extractCardTime("Check-in 15:00-20:00")).toBe("15:00–20:00");
    expect(extractCardTime("zwischen 14 Uhr bis 18 Uhr")).toBe("14:00–18:00");
  });

  it("understands am/pm and bare hours", () => {
    expect(extractCardTime("Check-out by 10 am please")).toBe("10 am");
    expect(extractCardTime("Leave by 11:30 AM")).toBe("11:30 am");
    expect(extractCardTime("Departure before 11h")).toBe("11:00");
  });

  it("ignores text without a time and does not read dates as times", () => {
    expect(extractCardTime(null)).toBeNull();
    expect(extractCardTime("Self check-in with the key box.")).toBeNull();
    expect(extractCardTime("Available from 24.04.2026")).toBeNull();
  });
});

describe("welcome card settings", () => {
  it("falls back to the A6 card", () => {
    expect(welcomeCardLayout("a5").key).toBe("a5");
    expect(welcomeCardLayout("poster").key).toBe("a6");
    expect(welcomeCardLayout(undefined).key).toBe("a6");
  });

  it("uses the requested language, then the guide's first language, then English", () => {
    expect(welcomeCardLocale("it", ["de"])).toBe("it");
    expect(welcomeCardLocale("xx", ["pt", "de"])).toBe("de");
    expect(welcomeCardLocale(undefined, [])).toBe("en");
  });

  it("only accepts a plain hex accent colour", () => {
    expect(safeAccentColor("#A1b2C3")).toBe("#A1b2C3");
    expect(safeAccentColor("red;background:url(x)")).toBe("#4a8a8f");
    expect(safeAccentColor(null, "#111111")).toBe("#111111");
  });

  it("has every text in every guest language", () => {
    for (const { code } of GUEST_LOCALES) {
      for (const value of Object.values(getWelcomeCardCopy(code))) {
        expect(value.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
