import { describe, expect, it } from "vitest";
import { GUEST_LOCALES, detectGuestLocale, getGuestMessages } from "@/lib/guest-i18n";

function keyPaths(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) return [prefix];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) => keyPaths(child, prefix ? `${prefix}.${key}` : key));
}

describe("guest guide languages", () => {
  it("picks the first supported language from the phone settings", () => {
    expect(detectGuestLocale(["de-CH", "en-US"])).toBe("de");
    expect(detectGuestLocale(["pl-PL", "fr-FR"])).toBe("fr");
    expect(detectGuestLocale(["NL"])).toBe("nl");
  });

  it("falls back to English for unsupported or missing languages", () => {
    expect(detectGuestLocale(["pl-PL", "mk"])).toBe("en");
    expect(detectGuestLocale([])).toBe("en");
    expect(detectGuestLocale(undefined)).toBe("en");
  });

  it("has every text in every language, none empty", () => {
    const english = keyPaths(getGuestMessages("en")).sort();
    for (const { code } of GUEST_LOCALES) {
      const messages = getGuestMessages(code);
      expect(keyPaths(messages).sort(), code).toEqual(english);
      for (const path of english) {
        const value = path.split(".").reduce<any>((node, key) => node[key], messages);
        const text = typeof value === "function" ? value("Villa Test", "Villa Test") : value;
        expect(typeof text === "string" && text.trim().length > 0, `${code}.${path}`).toBe(true);
      }
    }
  });
});
