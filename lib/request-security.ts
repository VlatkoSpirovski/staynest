import "server-only";

import { getAdminUrl, getAppUrl, getPaymentUrl, getSiteUrl } from "@/lib/utils";

function originOf(value: string) {
  try {
    return new URL(value).origin;
  } catch {
    return "";
  }
}

function firstHeaderValue(value: string | null) {
  return value?.split(",")[0]?.trim() || "";
}

function inferRequestOrigin(request: Request) {
  const requestOrigin = originOf(request.url);
  if (requestOrigin) {
    return requestOrigin;
  }

  const proto = firstHeaderValue(request.headers.get("x-forwarded-proto"));
  const host = firstHeaderValue(request.headers.get("x-forwarded-host")) || firstHeaderValue(request.headers.get("host"));

  if (!proto || !host) {
    return "";
  }

  return originOf(`${proto}://${host}`);
}

export function isTrustedAppRequest(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return false;
  }

  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }

  const allowedOrigins = new Set(
    [getSiteUrl(), getAppUrl(), getPaymentUrl(), getAdminUrl(), inferRequestOrigin(request)].map(originOf).filter(Boolean)
  );
  return allowedOrigins.has(originOf(origin));
}
