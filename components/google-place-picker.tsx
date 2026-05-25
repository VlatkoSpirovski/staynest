"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, MapPin, Search } from "lucide-react";
import { inferPlaceCategory, type PlaceRecommendationCategory } from "@/lib/place-recommendation";

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
  category: PlaceRecommendationCategory;
  types?: string[];
};

export function GooglePlacePicker({
  onSelect,
  defaultCategory = "other"
}: {
  onSelect: (place: GooglePlaceDetails) => void;
  defaultCategory?: PlaceRecommendationCategory;
}) {
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<GooglePlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailsLoadingPlaceId, setDetailsLoadingPlaceId] = useState("");
  const [error, setError] = useState("");
  const shouldSearch = query.trim().length >= 2;

  useEffect(() => {
    if (!shouldSearch) {
      setPredictions([]);
      setLoading(false);
      setError("");
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/google-places/autocomplete?query=${encodeURIComponent(query.trim())}`, {
          signal: controller.signal
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || "Search failed.");
        setPredictions(data.predictions || []);
      } catch (fetchError) {
        if (!controller.signal.aborted) {
          setPredictions([]);
          setError(fetchError instanceof Error ? fetchError.message : "Google search failed.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 260);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [query, shouldSearch]);

  const status = useMemo(() => {
    if (error) return "error";
    if (loading) return "loading";
    if (!shouldSearch) return "idle";
    if (predictions.length === 0) return "empty";
    return "results";
  }, [error, loading, predictions.length, shouldSearch]);

  async function selectPrediction(prediction: GooglePlacePrediction) {
    setDetailsLoadingPlaceId(prediction.placeId);
    setError("");
    try {
      const response = await fetch(`/api/google-places/details?placeId=${encodeURIComponent(prediction.placeId)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Could not load place details.");
      onSelect({
        ...data.place,
        category: data.place.category || inferPlaceCategory(prediction.types, defaultCategory)
      });
      setQuery("");
      setPredictions([]);
    } catch (detailsError) {
      setError(detailsError instanceof Error ? detailsError.message : "Could not load place details.");
    } finally {
      setDetailsLoadingPlaceId("");
    }
  }

  return (
    <div className="rounded-[20px] border border-[#172234]/8 bg-white p-3 shadow-[0_18px_54px_rgba(17,24,39,0.08),inset_0_1px_0_rgba(255,255,255,0.86)]">
      <label className="flex min-h-12 items-center gap-2 rounded-[16px] border border-[#172234]/8 bg-[#F9FAFB] px-3">
        <Search size={17} className="shrink-0 text-[#5F9D99]" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="min-h-11 min-w-0 flex-1 bg-transparent text-sm font-bold text-[#111827] outline-none placeholder:text-[#111827]/34"
          placeholder="Search on Google Maps..."
        />
        {loading ? <Loader2 className="animate-spin text-[#5F9D99]" size={16} /> : null}
      </label>

      <div className="mt-3 overflow-hidden rounded-[16px] border border-[#172234]/7 bg-white">
        {status === "idle" ? (
          <p className="px-4 py-5 text-center text-sm font-semibold text-[#111827]/50">Search restaurants, pharmacies, ATMs, beaches, cafes and more.</p>
        ) : null}
        {status === "loading" ? (
          <p className="flex items-center justify-center gap-2 px-4 py-5 text-sm font-bold text-[#111827]/58">
            <Loader2 className="animate-spin" size={16} />
            Searching Google Maps...
          </p>
        ) : null}
        {status === "empty" ? (
          <p className="px-4 py-5 text-center text-sm font-semibold text-[#111827]/50">No Google places found. Try a more specific name or paste a Maps link manually below.</p>
        ) : null}
        {status === "error" ? (
          <p className="px-4 py-5 text-center text-sm font-semibold text-red-600">{error} You can still paste a Google Maps link manually below.</p>
        ) : null}
        {status === "results" ? (
          <div className="divide-y divide-[#172234]/7">
            {predictions.map((prediction) => {
              const loadingDetails = detailsLoadingPlaceId === prediction.placeId;
              return (
                <button
                  key={prediction.placeId}
                  type="button"
                  onClick={() => selectPrediction(prediction)}
                  disabled={Boolean(detailsLoadingPlaceId)}
                  className="flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[#F9FAFB] disabled:cursor-wait disabled:opacity-70"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-[#E8F4F3] text-[#5F9D99]">
                    {loadingDetails ? <Loader2 className="animate-spin" size={17} /> : <MapPin size={17} />}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-black text-[#111827]">{prediction.mainText}</span>
                    <span className="mt-0.5 block truncate text-xs font-semibold text-[#111827]/48">{prediction.secondaryText || prediction.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
