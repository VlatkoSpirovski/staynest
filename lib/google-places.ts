import "server-only";

import { inferPlaceCategory } from "@/lib/place-recommendation";

const GOOGLE_PLACES_BASE_URL = "https://maps.googleapis.com/maps/api/place";

export type GooglePlacePrediction = {
  placeId: string;
  mainText: string;
  secondaryText: string;
  description: string;
  types: string[];
};

export type GooglePlaceDetails = {
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
  category: string;
  types: string[];
};

function apiKey() {
  const key = process.env.GOOGLE_MAPS_API_KEY?.trim();
  if (!key) throw new Error("GOOGLE_MAPS_API_KEY is not configured.");
  return key;
}

function assertGoogleStatus(data: { status?: string; error_message?: string }) {
  if (data.status && data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(data.error_message || `Google Places returned ${data.status}.`);
  }
}

export async function autocompleteGooglePlaces(query: string): Promise<GooglePlacePrediction[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const url = new URL(`${GOOGLE_PLACES_BASE_URL}/autocomplete/json`);
  url.searchParams.set("input", trimmed);
  url.searchParams.set("types", "establishment");
  url.searchParams.set("key", apiKey());

  const response = await fetch(url, { next: { revalidate: 60 * 5 } });
  if (!response.ok) throw new Error("Could not reach Google Places.");

  const data = await response.json() as {
    status?: string;
    error_message?: string;
    predictions?: Array<{
      place_id?: string;
      description?: string;
      types?: string[];
      structured_formatting?: {
        main_text?: string;
        secondary_text?: string;
      };
    }>;
  };
  assertGoogleStatus(data);

  return (data.predictions || []).flatMap((item) => {
    if (!item.place_id) return [];
    return [{
      placeId: item.place_id,
      mainText: item.structured_formatting?.main_text || item.description || "Google place",
      secondaryText: item.structured_formatting?.secondary_text || "",
      description: item.description || "",
      types: item.types || []
    }];
  });
}

export async function getGooglePlaceDetails(placeId: string): Promise<GooglePlaceDetails> {
  const trimmed = placeId.trim();
  if (!trimmed) throw new Error("Missing Google place ID.");

  const url = new URL(`${GOOGLE_PLACES_BASE_URL}/details/json`);
  url.searchParams.set("place_id", trimmed);
  url.searchParams.set("fields", [
    "place_id",
    "name",
    "formatted_address",
    "geometry",
    "url",
    "rating",
    "user_ratings_total",
    "opening_hours",
    "website",
    "formatted_phone_number",
    "international_phone_number",
    "photos",
    "types"
  ].join(","));
  url.searchParams.set("key", apiKey());

  const response = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
  if (!response.ok) throw new Error("Could not reach Google Place Details.");

  const data = await response.json() as {
    status?: string;
    error_message?: string;
    result?: {
      place_id?: string;
      name?: string;
      formatted_address?: string;
      geometry?: { location?: { lat?: number; lng?: number } };
      url?: string;
      rating?: number;
      user_ratings_total?: number;
      opening_hours?: { weekday_text?: string[] };
      website?: string;
      formatted_phone_number?: string;
      international_phone_number?: string;
      photos?: Array<{ photo_reference?: string }>;
      types?: string[];
    };
  };
  assertGoogleStatus(data);

  const result = data.result;
  if (!result?.place_id || !result.name) throw new Error("Google did not return place details.");
  const photoReference = result.photos?.find((photo) => photo.photo_reference)?.photo_reference;
  const types = result.types || [];

  return {
    placeId: result.place_id,
    name: result.name,
    formattedAddress: result.formatted_address,
    latitude: result.geometry?.location?.lat,
    longitude: result.geometry?.location?.lng,
    googleMapsUrl: result.url,
    rating: result.rating,
    userRatingsTotal: result.user_ratings_total,
    openingHours: result.opening_hours?.weekday_text || [],
    website: result.website,
    phoneNumber: result.international_phone_number || result.formatted_phone_number,
    photoUrl: photoReference ? `/api/google-places/photo?reference=${encodeURIComponent(photoReference)}` : undefined,
    category: inferPlaceCategory(types),
    types
  };
}

export function googlePhotoUrl(reference: string, maxWidth = 800) {
  const url = new URL(`${GOOGLE_PLACES_BASE_URL}/photo`);
  url.searchParams.set("maxwidth", String(Math.min(Math.max(maxWidth, 120), 1600)));
  url.searchParams.set("photo_reference", reference);
  url.searchParams.set("key", apiKey());
  return url;
}
