"use client";

import { ExternalLink, Globe, MapPin, Phone, Star } from "lucide-react";
import { warmExternalOrigin } from "@/lib/external-link-warmup";
import { displayPlaceTitle, mapsUrlForPlace, normalizePlaceCategory, placeCategoryLabels } from "@/lib/place-recommendation";

export type PlaceCardItem = {
  id: string;
  title?: string | null;
  name?: string | null;
  customTitle?: string | null;
  description?: string | null;
  customDescription?: string | null;
  category: string;
  address?: string | null;
  formattedAddress?: string | null;
  url?: string | null;
  googleMapsUrl?: string | null;
  placeId?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  rating?: number | null;
  userRatingsTotal?: number | null;
  website?: string | null;
  phoneNumber?: string | null;
  photoUrl?: string | null;
  imageUrl?: string | null;
  openingHours?: string[] | null;
};

function shortAddress(value?: string | null) {
  if (!value) return "";
  return value.split(",").slice(0, 2).join(",").trim();
}

function openingStatus(openingHours?: string[] | null) {
  if (!openingHours?.length) return "";
  const today = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date());
  return openingHours.find((line) => line.startsWith(`${today}:`)) || openingHours[0] || "";
}

export function PlaceCard({ item, openMapLabel = "Open in Maps" }: { item: PlaceCardItem; openMapLabel?: string }) {
  const category = normalizePlaceCategory(item.category);
  const displayTitle = displayPlaceTitle(item);
  const hostTip = item.customDescription || item.description || "";
  const address = shortAddress(item.formattedAddress || item.address);
  const mapsUrl = mapsUrlForPlace(item);
  const imageUrl = item.photoUrl || item.imageUrl || "";
  const todaysHours = openingStatus(item.openingHours);

  return (
    <article className="overflow-hidden rounded-[var(--guide-card-radius)] border border-[var(--guide-card-border)] bg-[var(--guide-card-bg)] text-[var(--guide-text)] shadow-[var(--guide-card-shadow)] backdrop-blur-xl">
      {imageUrl ? <img src={imageUrl} alt="" className="h-36 w-full object-cover" /> : null}
      <div className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-lg font-black tracking-tight">{displayTitle}</h2>
            <p className="mt-1 inline-flex rounded-full bg-[var(--guide-icon-bg)] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--guide-accent)]">
              {placeCategoryLabels[category]}
            </p>
          </div>
          {item.rating ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--guide-elevated-bg)] px-2.5 py-1 text-xs font-black ring-1 ring-[var(--guide-card-border)]">
              <Star size={13} className="fill-current" />
              {item.rating}
              {item.userRatingsTotal ? <span className="font-bold opacity-55">({item.userRatingsTotal})</span> : null}
            </span>
          ) : null}
        </div>

        {address ? <p className="mt-3 flex gap-2 text-sm font-semibold leading-6 opacity-70"><MapPin size={15} className="mt-1 shrink-0" />{address}</p> : null}
        {hostTip ? <p className="mt-3 whitespace-pre-line text-sm leading-6">{hostTip}</p> : null}
        {todaysHours ? <p className="mt-3 text-xs font-bold text-[var(--guide-accent)]">{todaysHours}</p> : null}

        <div className="mt-4 grid grid-cols-2 gap-2">
          {mapsUrl ? (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onPointerEnter={() => warmExternalOrigin(mapsUrl)}
              onPointerDown={() => warmExternalOrigin(mapsUrl)}
              onTouchStart={() => warmExternalOrigin(mapsUrl)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--guide-button-radius)] bg-[var(--guide-button-bg)] px-3 text-sm font-bold text-[var(--guide-button-text)]"
            >
              <ExternalLink size={15} />
              {openMapLabel}
            </a>
          ) : null}
          {item.phoneNumber ? (
            <a href={`tel:${item.phoneNumber.replace(/\s+/g, "")}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--guide-button-radius)] bg-[var(--guide-elevated-bg)] px-3 text-sm font-bold text-[var(--guide-text)] ring-1 ring-[var(--guide-card-border)]">
              <Phone size={15} />
              Call
            </a>
          ) : null}
          {item.website ? (
            <a
              href={item.website}
              target="_blank"
              rel="noopener noreferrer"
              onPointerEnter={() => warmExternalOrigin(item.website)}
              onPointerDown={() => warmExternalOrigin(item.website)}
              onTouchStart={() => warmExternalOrigin(item.website)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--guide-button-radius)] bg-[var(--guide-elevated-bg)] px-3 text-sm font-bold text-[var(--guide-text)] ring-1 ring-[var(--guide-card-border)]"
            >
              <Globe size={15} />
              Website
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
