import { describe, expect, it } from "vitest";
import { escapeWifiValue, wifiQrPayload } from "@/lib/wifi-qr";

describe("wifiQrPayload", () => {
  it("builds the standard Wi-Fi QR format", () => {
    expect(wifiQrPayload({ ssid: "VillaBeti", password: "sea-view-2026", security: "WPA", hidden: false })).toBe(
      "WIFI:T:WPA;S:VillaBeti;P:sea-view-2026;;"
    );
  });

  it("escapes the characters that would break the format", () => {
    expect(escapeWifiValue('a;b,c:d\\e"f')).toBe('a\\;b\\,c\\:d\\\\e\\"f');
    expect(wifiQrPayload({ ssid: "Home;Net", password: "p:w", security: "WPA", hidden: false })).toBe("WIFI:T:WPA;S:Home\\;Net;P:p\\:w;;");
  });

  it("leaves out the password for open networks and marks hidden ones", () => {
    expect(wifiQrPayload({ ssid: "Guest", password: "ignored", security: "nopass", hidden: true })).toBe("WIFI:T:nopass;S:Guest;H:true;;");
  });
});
