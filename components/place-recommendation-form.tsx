"use client";

import { Eye, EyeOff, GripVertical, Link2, Star, Trash2 } from "lucide-react";
import { Field, inputClass, textareaClass } from "@/components/ui/panel";
import { placeCategories, placeCategoryLabels, type PlaceRecommendationCategory } from "@/lib/place-recommendation";
import type { GooglePlaceDetails } from "@/components/google-place-picker";

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

export function draftFromGooglePlace(place: GooglePlaceDetails, fallbackCategory: PlaceRecommendationCategory, sortOrder: number): PlaceRecommendationDraft {
  return {
    clientId: `draft-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    id: "",
    placeId: place.placeId,
    name: place.name,
    customTitle: "",
    customDescription: "",
    formattedAddress: place.formattedAddress || "",
    latitude: place.latitude === undefined ? "" : String(place.latitude),
    longitude: place.longitude === undefined ? "" : String(place.longitude),
    googleMapsUrl: place.googleMapsUrl || "",
    rating: place.rating === undefined ? "" : String(place.rating),
    userRatingsTotal: place.userRatingsTotal === undefined ? "" : String(place.userRatingsTotal),
    openingHours: place.openingHours || [],
    website: place.website || "",
    phoneNumber: place.phoneNumber || "",
    photoUrl: place.photoUrl || "",
    category: place.category || fallbackCategory,
    isEssential: false,
    isVisible: true,
    sortOrder,
    manualUrl: place.googleMapsUrl || ""
  };
}

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
  const displayName = draft.customTitle || draft.name || "Manual place";
  const mapsUrl = draft.googleMapsUrl || draft.manualUrl;

  return (
    <article className="overflow-hidden rounded-[18px] border border-[#172234]/8 bg-white shadow-[0_14px_38px_rgba(17,24,39,0.065),inset_0_1px_0_rgba(255,255,255,0.84)]">
      <input type="hidden" name="recommendationId" value={draft.id} />
      <input type="hidden" name="placeId" value={draft.placeId} />
      <input type="hidden" name="name" value={draft.name || draft.customTitle} />
      <input type="hidden" name="formattedAddress" value={draft.formattedAddress} />
      <input type="hidden" name="latitude" value={draft.latitude} />
      <input type="hidden" name="longitude" value={draft.longitude} />
      <input type="hidden" name="googleMapsUrl" value={mapsUrl} />
      <input type="hidden" name="rating" value={draft.rating} />
      <input type="hidden" name="userRatingsTotal" value={draft.userRatingsTotal} />
      <input type="hidden" name="openingHours" value={draft.openingHours.join("\n")} />
      <input type="hidden" name="website" value={draft.website} />
      <input type="hidden" name="phoneNumber" value={draft.phoneNumber} />
      <input type="hidden" name="photoUrl" value={draft.photoUrl} />
      <input type="hidden" name="isEssential" value={draft.isEssential ? "1" : ""} />
      <input type="hidden" name="isVisible" value={draft.isVisible ? "1" : ""} />
      <input type="hidden" name="sortOrder" value={draft.sortOrder} />
      <input type="hidden" name="url" value={mapsUrl} />
      <input type="hidden" name="address" value={draft.formattedAddress} />

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
        {draft.photoUrl ? <img src={draft.photoUrl} alt="" className="h-36 w-full rounded-[14px] object-cover" /> : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Custom title">
            <input
              name="customTitle"
              className={`${inputClass} bg-[#F9FAFB]`}
              value={draft.customTitle}
              onChange={(event) => onChange({ customTitle: event.target.value })}
              placeholder={draft.name || "Place name"}
            />
          </Field>
          <Field label="Category">
            <select
              name="category"
              className={`${inputClass} bg-[#F9FAFB]`}
              value={draft.category}
              onChange={(event) => onChange({ category: event.target.value as PlaceRecommendationCategory })}
            >
              {placeCategories.map((category) => (
                <option key={category} value={category}>{placeCategoryLabels[category]}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Display order">
          <input
            type="number"
            min="1"
            inputMode="numeric"
            className={`${inputClass} bg-[#F9FAFB]`}
            value={draft.sortOrder}
            onChange={(event) => onChange({ sortOrder: Number(event.target.value) || 1 })}
          />
        </Field>

        {!draft.placeId ? (
          <Field label="Place name">
            <input
              name="manualName"
              className={`${inputClass} bg-[#F9FAFB]`}
              value={draft.name}
              onChange={(event) => onChange({ name: event.target.value })}
              placeholder="Paste manually if Google is unavailable"
              required
            />
          </Field>
        ) : null}

        <Field label="Host tip">
          <textarea
            name="customDescription"
            className={`${textareaClass} min-h-24 bg-[#F9FAFB]`}
            value={draft.customDescription}
            onChange={(event) => onChange({ customDescription: event.target.value })}
            placeholder="Why guests should go, best time, what to order, or what to know."
          />
        </Field>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <Field label="Manual Google Maps link">
            <span className="flex min-h-11 items-center gap-2 rounded-[16px] border border-[#172234]/10 bg-[#F9FAFB] px-3">
              <Link2 size={15} className="text-[#5F9D99]" />
              <input
                className="min-h-10 min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#111827]/32"
                value={draft.manualUrl}
                onChange={(event) => onChange({ manualUrl: event.target.value, googleMapsUrl: draft.googleMapsUrl || event.target.value })}
                placeholder="https://maps.google.com/..."
              />
            </span>
          </Field>
          <div className="grid grid-cols-2 gap-2 sm:w-52 sm:grid-cols-1">
            <label className="flex min-h-11 items-center justify-center gap-2 rounded-[15px] bg-[#F9FAFB] px-3 text-xs font-black text-[#111827] ring-1 ring-[#172234]/8">
              <input type="checkbox" className="sr-only" checked={draft.isVisible} onChange={(event) => onChange({ isVisible: event.target.checked })} />
              {draft.isVisible ? <Eye size={15} /> : <EyeOff size={15} />}
              Visible
            </label>
            <label className="flex min-h-11 items-center justify-center gap-2 rounded-[15px] bg-[#F9FAFB] px-3 text-xs font-black text-[#111827] ring-1 ring-[#172234]/8">
              <input type="checkbox" className="sr-only" checked={draft.isEssential} onChange={(event) => onChange({ isEssential: event.target.checked })} />
              <Star size={15} />
              Essential
            </label>
          </div>
        </div>

        {draft.formattedAddress || draft.rating ? (
          <div className="rounded-[16px] bg-[#F9FAFB] px-3 py-2 text-xs font-semibold leading-5 text-[#111827]/56">
            {draft.formattedAddress ? <p>{draft.formattedAddress}</p> : null}
            {draft.rating ? <p>{draft.rating} stars{draft.userRatingsTotal ? ` from ${draft.userRatingsTotal} reviews` : ""}</p> : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
