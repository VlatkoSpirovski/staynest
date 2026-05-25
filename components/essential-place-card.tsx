"use client";

import { CircleParking, CreditCard, Fuel, Hospital, MapPin, Phone, Pill, ShoppingBasket } from "lucide-react";
import { mapsUrlForPlace, normalizePlaceCategory } from "@/lib/place-recommendation";
import type { PlaceCardItem } from "@/components/place-card";

const icons = {
  pharmacy: Pill,
  atm: CreditCard,
  petrol_station: Fuel,
  supermarket: ShoppingBasket,
  hospital: Hospital,
  parking: CircleParking,
  restaurant: MapPin,
  cafe: MapPin,
  bar: MapPin,
  beach: MapPin,
  attraction: MapPin,
  other: MapPin
};

function openingStatus(openingHours?: string[] | null) {
  if (!openingHours?.length) return "";
  const today = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date());
  return openingHours.find((line) => line.startsWith(`${today}:`)) || "";
}

export function EssentialPlaceCard({ item }: { item: PlaceCardItem }) {
  const category = normalizePlaceCategory(item.category);
  const Icon = icons[category];
  const name = item.customTitle || item.title || item.name || "Essential place";
  const mapsUrl = mapsUrlForPlace(item);
  const hours = openingStatus(item.openingHours);

  return (
    <article className="rounded-[var(--guide-card-radius)] border border-[var(--guide-card-border)] bg-[var(--guide-card-bg)] p-4 text-[var(--guide-text)] shadow-[var(--guide-card-shadow)] backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--guide-icon-radius)] bg-[var(--guide-icon-bg)] text-[var(--guide-accent)] shadow-[var(--guide-icon-shadow)]">
          <Icon size={19} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-black tracking-tight">{name}</h2>
          {(item.formattedAddress || item.address) ? <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 opacity-65">{item.formattedAddress || item.address}</p> : null}
          {hours ? <p className="mt-2 text-xs font-bold text-[var(--guide-accent)]">{hours}</p> : null}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {mapsUrl ? (
          <a href={mapsUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--guide-button-radius)] bg-[var(--guide-button-bg)] px-3 text-xs font-bold text-[var(--guide-button-text)]">
            <MapPin size={14} />
            Open in Maps
          </a>
        ) : null}
        {item.phoneNumber ? (
          <a href={`tel:${item.phoneNumber.replace(/\s+/g, "")}`} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--guide-button-radius)] bg-[var(--guide-elevated-bg)] px-3 text-xs font-bold text-[var(--guide-text)] ring-1 ring-[var(--guide-card-border)]">
            <Phone size={14} />
            Call
          </a>
        ) : null}
      </div>
    </article>
  );
}
