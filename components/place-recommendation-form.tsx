"use client";

import { GripVertical, Link2, Trash2 } from "lucide-react";
import { Field, inputClass, textareaClass } from "@/components/ui/panel";
import { placeCategories, placeCategoryLabels, type PlaceRecommendationCategory } from "@/lib/place-recommendation";

export type PlaceRecommendationDraft = {
  clientId: string;
  id: string;
  placeId: string;
  name: string;
  customTitle: string;
  customDescription: string;
  formattedAddress: string;
  latitude: string;
  longitude: string;
  googleMapsUrl: string;
  rating: string;
  userRatingsTotal: string;
  openingHours: string[];
  website: string;
  phoneNumber: string;
  photoUrl: string;
  category: PlaceRecommendationCategory;
  isEssential: boolean;
  isVisible: boolean;
  sortOrder: number;
  manualUrl: string;
};

export function createManualPlaceDraft(category: PlaceRecommendationCategory, sortOrder: number, isEssential = false): PlaceRecommendationDraft {
  return {
    clientId: `draft-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    id: "",
    placeId: "",
    name: "",
    customTitle: "",
    customDescription: "",
    formattedAddress: "",
    latitude: "",
    longitude: "",
    googleMapsUrl: "",
    rating: "",
    userRatingsTotal: "",
    openingHours: [],
    website: "",
    phoneNumber: "",
    photoUrl: "",
    category,
    isEssential,
    isVisible: true,
    sortOrder,
    manualUrl: ""
  };
}

export function PlaceRecommendationForm({
  draft,
  label,
  onChange,
  onRemove
}: {
  draft: PlaceRecommendationDraft;
  label: string;
  onChange: (patch: Partial<PlaceRecommendationDraft>) => void;
  onRemove: () => void;
}) {
  const displayName = draft.name || "Manual place";
  const mapsUrl = draft.manualUrl || draft.googleMapsUrl;

  return (
    <article className="overflow-hidden rounded-[18px] border border-[#172234]/8 bg-white shadow-[0_14px_38px_rgba(17,24,39,0.065),inset_0_1px_0_rgba(255,255,255,0.84)]">
      <input type="hidden" name="recommendationId" value={draft.id} />
      <input type="hidden" name="placeId" value={draft.placeId} />
      <input type="hidden" name="name" value={draft.name} />
      <input type="hidden" name="customTitle" value="" />
      <input type="hidden" name="formattedAddress" value="" />
      <input type="hidden" name="latitude" value="" />
      <input type="hidden" name="longitude" value="" />
      <input type="hidden" name="googleMapsUrl" value={mapsUrl} />
      <input type="hidden" name="rating" value="" />
      <input type="hidden" name="userRatingsTotal" value="" />
      <input type="hidden" name="openingHours" value="" />
      <input type="hidden" name="website" value="" />
      <input type="hidden" name="phoneNumber" value="" />
      <input type="hidden" name="photoUrl" value="" />
      <input type="hidden" name="isEssential" value={draft.isEssential ? "1" : ""} />
      <input type="hidden" name="isVisible" value={draft.isVisible ? "1" : ""} />
      <input type="hidden" name="sortOrder" value={draft.sortOrder} />
      <input type="hidden" name="url" value={mapsUrl} />
      <input type="hidden" name="address" value="" />

      <div className="flex items-center justify-between gap-3 border-b border-[#172234]/7 bg-[#F9FAFB] px-3 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[13px] bg-white text-[#111827]/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.84)]">
            <GripVertical size={15} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-[#111827]">{displayName}</p>
            <p className="truncate text-[10px] font-black uppercase tracking-[0.16em] text-[#5F9D99]">{label}</p>
          </div>
        </div>
        <button type="button" onClick={onRemove} aria-label={`Remove ${displayName}`} className="grid h-9 w-9 shrink-0 place-items-center rounded-[13px] text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200">
          <Trash2 size={15} />
        </button>
      </div>

      <div className="grid gap-3 p-3 lg:p-4">
        <Field label="Name">
          <input
            name="manualName"
            className={`${inputClass} bg-[#F9FAFB]`}
            value={draft.name}
            onChange={(event) => onChange({ name: event.target.value })}
            placeholder="Restaurant, pharmacy, beach..."
            required
          />
        </Field>

        <Field label="What is it for">
          <select
            name="category"
            className={`${inputClass} bg-[#F9FAFB]`}
            value={draft.category}
            onChange={(event) => {
              const category = event.target.value as PlaceRecommendationCategory;
              onChange({ category, isEssential: draft.isEssential || ["pharmacy", "atm", "petrol_station", "supermarket", "hospital", "parking"].includes(category) });
            }}
          >
            {placeCategories.map((category) => (
              <option key={category} value={category}>{placeCategoryLabels[category]}</option>
            ))}
          </select>
        </Field>

        <Field label="Description">
          <textarea
            name="customDescription"
            className={`${textareaClass} min-h-24 bg-[#F9FAFB]`}
            value={draft.customDescription}
            onChange={(event) => onChange({ customDescription: event.target.value })}
            placeholder="What guests should know, why to go, or what to order."
          />
        </Field>

        <Field label="Link">
          <span className="flex min-h-11 items-center gap-2 rounded-[16px] border border-[#172234]/10 bg-[#F9FAFB] px-3">
            <Link2 size={15} className="text-[#5F9D99]" />
            <input
              className="min-h-10 min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#111827]/32"
              value={mapsUrl}
              onChange={(event) => onChange({ manualUrl: event.target.value, googleMapsUrl: event.target.value })}
              placeholder="Google Maps, website, Booking, Instagram..."
            />
          </span>
        </Field>
      </div>
    </article>
  );
}
