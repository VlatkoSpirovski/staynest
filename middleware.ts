import { NextRequest, NextResponse } from "next/server";

const protectedPrefixes = ["/dashboard", "/admin", "/change-password"];
const hostAppPrefixes = [
  "/auth",
  "/billing",
  "/change-password",
  "/check-email",
  "/dashboard",
  "/forgot-password",
  "/login",
  "/register",
  "/reset-password",
  "/verify-email"
];

function cleanHost(host: string) {
  return host.split(":")[0].toLowerCase();
}

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function shouldUseProductionSubdomains(host: string) {
  return host === "staynest.site" || host === "www.staynest.site" || host === "app.staynest.site" || host === "admin.staynest.site";
}

function subdomainUrl(request: NextRequest, hostname: "staynest.site" | "app.staynest.site" | "admin.staynest.site") {
  const url = request.nextUrl.clone();
  url.protocol = "https:";
  url.hostname = hostname;
  url.port = "";
  return url;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = cleanHost(request.headers.get("host") || "");

  if (shouldUseProductionSubdomains(host)) {
    if (pathname === "/admin" || pathname.startsWith("/admin/")) {
      if (host !== "admin.staynest.site") {
        return NextResponse.redirect(subdomainUrl(request, "admin.staynest.site"));
      }
    } else if (matchesPrefix(pathname, hostAppPrefixes)) {
      if (host !== "app.staynest.site" && host !== "admin.staynest.site") {
        return NextResponse.redirect(subdomainUrl(request, "app.staynest.site"));
      }
    } else if (
      host === "app.staynest.site" &&
      (pathname === "/" || pathname.startsWith("/stay/") || pathname === "/pricing" || pathname === "/privacy" || pathname === "/terms" || pathname === "/refund")
    ) {
      return NextResponse.redirect(subdomainUrl(request, "staynest.site"));
    }
  }

  const isProtected = protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  if (!isProtected) {
    return NextResponse.next();
  }

  const hasSession = Boolean(request.cookies.get("staynest_session")?.value);
  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/auth/:path*",
    "/billing/:path*",
    "/change-password",
    "/check-email",
    "/dashboard/:path*",
    "/forgot-password",
    "/login",
    "/pricing",
    "/privacy",
    "/refund",
    "/register",
    "/reset-password",
    "/stay/:path*",
    "/terms",
    "/verify-email"
  ]
};
