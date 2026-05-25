import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function envUrl(value: string | undefined, fallback: string) {
  return value?.replace(/\/$/, "") || fallback;
}

export function getSiteUrl() {
  return envUrl(process.env.NEXT_PUBLIC_SITE_URL, process.env.NODE_ENV === "production" ? "https://staynest.site" : "http://localhost:3000");
}

export function getAppUrl() {
  return envUrl(process.env.NEXT_PUBLIC_APP_URL, process.env.NODE_ENV === "production" ? "https://dashboard.staynest.site" : "http://localhost:3000");
}

export function getPaymentUrl() {
  return envUrl(process.env.NEXT_PUBLIC_PAYMENT_URL, process.env.NODE_ENV === "production" ? "https://staynest.site" : "http://localhost:3000");
}

export function getAdminUrl() {
  return envUrl(process.env.NEXT_PUBLIC_ADMIN_URL, process.env.NODE_ENV === "production" ? "https://admin.staynest.site" : "http://localhost:3000");
}

export function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}
