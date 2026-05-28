import "server-only";

import { getAdminUrl, getAppUrl, getPaymentUrl, getSiteUrl } from "@/lib/utils";

function originOf(value: string) {
  try {
    return new URL(value).origin;
  } catch {
    return "";
  }
}

export function isTrustedAppRequest(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return false;
  }

  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }

  const allowedOrigins = new Set([getSiteUrl(), getAppUrl(), getPaymentUrl(), getAdminUrl()].map(originOf).filter(Boolean));
  return allowedOrigins.has(originOf(origin));
}
