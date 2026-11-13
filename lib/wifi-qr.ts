export type WifiSecurity = "WPA" | "WEP" | "nopass";

export function escapeWifiValue(value: string) {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

export function wifiQrPayload({ ssid, password, security, hidden }: { ssid: string; password: string; security: WifiSecurity; hidden: boolean }) {
  const parts = [`T:${security}`, `S:${escapeWifiValue(ssid)}`];
  if (security !== "nopass") parts.push(`P:${escapeWifiValue(password)}`);
  if (hidden) parts.push("H:true");
  return `WIFI:${parts.join(";")};;`;
}
