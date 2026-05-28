import "server-only";

import { inferPlaceCategory, type PlaceRecommendationCategory } from "@/lib/place-recommendation";

const GEOAPIFY_AUTOCOMPLETE_URL = "https://api.geoapify.com/v1/geocode/autocomplete";

export type GeoapifyPlaceResult = {
  placeId: string;
  name: string;
  formattedAddress?: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
  rating?: number;
  userRatingsTotal?: number;
  openingHours?: string[];
  website?: string;
  phoneNumber?: string;
  photoUrl?: string;
  category: PlaceRecommendationCategory;
  types: string[];
};

type GeoapifyFeature = {
  place_id?: string;
  name?: string;
  address_line1?: string;
  address_line2?: string;
  formatted?: string;
  lat?: number;
  lon?: number;
  categories?: string[];
  datasource?: {
    raw?: Record<string, string | undefined>;
  };
};

function apiKey() {
  const key = process.env.GEOAPIFY_API_KEY?.trim();
  if (!key) throw new Error("GEOAPIFY_API_KEY is not configured.");
  return key;
}

function safeUrl(value?: string) {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function googleMapsSearchUrl(item: { name?: string; formattedAddress?: string; latitude?: number; longitude?: number }) {
  const query = [item.name, item.formattedAddress].filter(Boolean).join(", ").trim();
  if (query) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  if (typeof item.latitude === "number" && typeof item.longitude === "number") {
    return `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`;
  }
  return "";
}

function rawValue(raw: Record<string, string | undefined> | undefined, keys: string[]) {
  if (!raw) return "";
  for (const key of keys) {
    const value = raw[key]?.trim();
    if (value) return value;
  }
  return "";
}

export async function searchGeoapifyPlaces(query: string, fallbackCategory?: string | null): Promise<GeoapifyPlaceResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const url = new URL(GEOAPIFY_AUTOCOMPLETE_URL);
  url.searchParams.set("text", trimmed);
  url.searchParams.set("limit", "8");
  url.searchParams.set("format", "json");
  url.searchParams.set("lang", "en");
  url.searchParams.set("apiKey", apiKey());

  const response = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
  if (!response.ok) throw new Error("Could not reach Geoapify place search.");

  const data = (await response.json()) as { results?: GeoapifyFeature[] };

  return (data.results || []).flatMap((item) => {
    const name = item.name || item.address_line1 || item.formatted || "";
    if (!name) return [];
    const types = item.categories || [];
    const formattedAddress = item.formatted || [item.address_line1, item.address_line2].filter(Boolean).join(", ");
    const raw = item.datasource?.raw;
    const website = safeUrl(rawValue(raw, ["website", "contact:website"]));
    const phoneNumber = rawValue(raw, ["phone", "contact:phone"]);

    return [{
      placeId: item.place_id || `${name}-${item.lat || ""}-${item.lon || ""}`,
      name,
      formattedAddress,
      latitude: item.lat,
      longitude: item.lon,
      googleMapsUrl: googleMapsSearchUrl({ name, formattedAddress, latitude: item.lat, longitude: item.lon }),
      website: website || undefined,
      phoneNumber: phoneNumber || undefined,
      category: inferPlaceCategory(types, fallbackCategory),
      types
    }];
  });
}
