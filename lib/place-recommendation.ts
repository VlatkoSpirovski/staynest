export const placeCategories = [
  "restaurant",
  "cafe",
  "bar",
  "pharmacy",
  "atm",
  "petrol_station",
  "supermarket",
  "hospital",
  "beach",
  "attraction",
  "parking",
  "other"
] as const;

export type PlaceRecommendationCategory = (typeof placeCategories)[number];

export interface PlaceRecommendation {
  id: string;
  propertyId: string;
  placeId: string;
  name: string;
  customTitle?: string;
  customDescription?: string;
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
  isEssential: boolean;
  isVisible: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export const placeCategoryLabels: Record<PlaceRecommendationCategory, string> = {
  restaurant: "Restaurant",
  cafe: "Cafe",
  bar: "Bar",
  pharmacy: "Pharmacy",
  atm: "ATM",
  petrol_station: "Petrol station",
  supermarket: "Supermarket",
  hospital: "Hospital",
  beach: "Beach",
  attraction: "Attraction",
  parking: "Parking",
  other: "Other"
};

const categoryAliases: Record<string, PlaceRecommendationCategory> = {
  food: "restaurant",
  meal_takeaway: "restaurant",
  meal_delivery: "restaurant",
  bakery: "cafe",
  night_club: "bar",
  gas_station: "petrol_station",
  convenience_store: "supermarket",
  grocery_or_supermarket: "supermarket",
  tourist_attraction: "attraction",
  amusement_park: "attraction",
  museum: "attraction",
  park: "attraction",
  bus_station: "other",
  taxi_stand: "other"
};

export function normalizePlaceCategory(value?: string | null): PlaceRecommendationCategory {
  const normalized = (value || "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  if ((placeCategories as readonly string[]).includes(normalized)) return normalized as PlaceRecommendationCategory;
  return categoryAliases[normalized] || "other";
}

export function inferPlaceCategory(types: string[] = [], fallback?: string | null): PlaceRecommendationCategory {
  for (const type of types) {
    const category = normalizePlaceCategory(type);
    if (category !== "other") return category;
  }
  return normalizePlaceCategory(fallback);
}

export function isEssentialCategory(category: string) {
  return ["pharmacy", "atm", "petrol_station", "supermarket", "hospital", "parking"].includes(normalizePlaceCategory(category));
}

export function displayPlaceTitle(item: { customTitle?: string | null; title?: string | null; name?: string | null }) {
  return item.customTitle || item.title || item.name || "Untitled place";
}

export function mapsUrlForPlace(item: { googleMapsUrl?: string | null; url?: string | null; placeId?: string | null }) {
  if (item.googleMapsUrl) return item.googleMapsUrl;
  if (item.url) return item.url;
  if (item.placeId) return `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${encodeURIComponent(item.placeId)}`;
  return "";
}
