"use client";

import { type FormEvent, useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  AlertCircle,
  BadgeCheck,
  BedDouble,
  Bot,
  Check,
  ChevronDown,
  ChevronRight,
  Download,
  ExternalLink,
  Heart,
  Home,
  ImageIcon,
  KeyRound,
  Link2,
  Loader2,
  LogOut,
  MapPin,
  Phone,
  Palette,
  Pill,
  Plus,
  QrCode,
  Save,
  Settings,
  ShieldAlert,
  Sparkles,
  Star,
  Utensils,
  WandSparkles,
  Wifi,
  X
} from "lucide-react";

import { CopyButton } from "@/components/copy-button";
import { ImageUploadField } from "@/components/image-upload-field";
import { createManualPlaceDraft, PlaceRecommendationForm, type PlaceRecommendationDraft } from "@/components/place-recommendation-form";
import { SubmitButton } from "@/components/submit-button";
import { Field, inputClass, textareaClass } from "@/components/ui/panel";
import { isEssentialCategory, normalizePlaceCategory, type PlaceRecommendationCategory } from "@/lib/place-recommendation";
import { planOption, type PlanTier } from "@/lib/billing";
import { getGuideTheme, guideThemeStyle, guideThemes, type GuideTheme, type GuideThemeId } from "@/themes";

const BILLING_BASE_URL = (process.env.NEXT_PUBLIC_PAYMENT_URL || (process.env.NODE_ENV === "production" ? "https://staynest.site" : "http://localhost:3000")).replace(/\/$/, "");

interface Recommendation {
  id: string;
  propertyId: string;
  title: string;
  category: string;
  description: string;
  address: string | null;
  url: string | null;
  imageUrl: string | null;
  placeId: string | null;
  name: string;
  customTitle: string | null;
  customDescription: string | null;
  formattedAddress: string | null;
  latitude: number | null;
  longitude: number | null;
  googleMapsUrl: string | null;
  rating: number | null;
  userRatingsTotal: number | null;
  openingHours: string[];
  website: string | null;
  phoneNumber: string | null;
  photoUrl: string | null;
  isEssential: boolean;
  isVisible: boolean;
  sortOrder: number;
}

interface ReviewLink {
  id: string;
  propertyId: string;
  platform: "GOOGLE" | "BOOKING" | "AIRBNB";
  url: string;
}

interface Property {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  publicCode: string | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  accentColor: string;
  templateId: string;
  designSerif: boolean;
  designRounded: boolean;
  welcomeMessage: string;
  wifiName: string | null;
  wifiPassword: string | null;
  checkInInfo: string | null;
  checkOutInfo: string | null;
  parkingInfo: string | null;
  houseRules: string | null;
  emergencyInfo: string | null;
  hostContactName: string | null;
  hostPhone: string | null;
  hostEmail: string | null;
  aiKnowledge: string | null;
  recommendations: Recommendation[];
  reviewLinks: ReviewLink[];
}

interface User {
  id: string;
  email: string;
  role: "ADMIN" | "OWNER";
  selectedPlan: string | null;
  trialEndsAt: Date | null;
}

interface DashboardClientProps {
  property: Property | null;
  user: User;
  publicUrl: string;
  qrCode: string;
  successMessage: string | null;
  errorMessage: string | null;
  planName: string;
  selectedPlan: string;
  trialLabel: string | null;
  trialDaysLeft: number | null;
  subscriptionStatus: string | null;
  billingAccess: boolean;
  cardOnFile: boolean;
  referralUrl: string | null;
  referralStats: { invited: number; paid: number; creditMonths: number };
  isFirstVisit: boolean;
  logoutAction: any;
  importListingAction: any;
  savePropertyInlineAction: any;
  savePropertyDesignInlineAction: any;
  saveRecommendationInlineAction: any;
  deleteRecommendationInlineAction: any;
  saveReviewLinksInlineAction: any;
}

type TabId = "setup" | "modules" | "design" | "settings";
type ModuleId = "photos" | "welcome" | "wifi" | "checkin" | "rules" | "restaurants" | "activities" | "essentials" | "contact" | "emergency" | "ai" | "reviews";

const tabs: Array<{ id: TabId; label: string; icon: typeof Home; title: string; description: string }> = [
  { id: "setup", label: "Home", icon: BadgeCheck, title: "Your guide", description: "Finish the essentials, then share it with your guests." },
  { id: "modules", label: "Content", icon: BedDouble, title: "Content", description: "Everything guests see. Tap a section to edit it." },
  { id: "design", label: "Design", icon: Palette, title: "Design", description: "Choose how your guide looks on your guests' phones." },
  { id: "settings", label: "Share", icon: Settings, title: "Share and settings", description: "Your guest link, QR code, subscription and invitations." }
];

const moduleCopy: Record<
  ModuleId,
  {
    title: string;
    subtitle: string;
    preview: (property: Property) => string;
    icon: typeof Home;
    accent: string;
  }
> = {
  welcome: {
    title: "Welcome",
    subtitle: "First impression",
    preview: (property) => property.name || property.welcomeMessage || "Add property name and welcome note",
    icon: Heart,
    accent: "bg-[#F3F4F6] text-[#374151] ring-1 ring-[#172234]/10 shadow-[0_1px_2px_rgba(17,24,39,0.04)]"
  },
  photos: {
    title: "Photos",
    subtitle: "Logo and cover",
    preview: (property) => (property.logoUrl && property.coverImageUrl ? "Brand visuals ready" : "Upload logo and property photo"),
    icon: ImageIcon,
    accent: "bg-[#EEF2F6] text-[#24364C] ring-1 ring-[#172234]/10 shadow-[0_1px_2px_rgba(17,24,39,0.04)]"
  },
  wifi: {
    title: "Wi-Fi",
    subtitle: "Instant connection",
    preview: (property) => property.wifiName || "Add network and password",
    icon: Wifi,
    accent: "bg-[#E8F4F3] text-[#447977] ring-1 ring-[#5F9D99]/18 shadow-[0_12px_26px_rgba(95,157,153,0.10)]"
  },
  checkin: {
    title: "Check-in",
    subtitle: "Arrival made easy",
    preview: (property) => property.checkInInfo || "Add entry instructions",
    icon: KeyRound,
    accent: "bg-[#EEF2F6] text-[#24364C] ring-1 ring-[#172234]/10 shadow-[0_1px_2px_rgba(17,24,39,0.04)]"
  },
  rules: {
    title: "House Rules",
    subtitle: "Calm stay rhythm",
    preview: (property) => property.houseRules || property.parkingInfo || "Add the essentials",
    icon: Home,
    accent: "bg-[#EEF4E8] text-[#64734D] ring-1 ring-[#76875D]/18 shadow-[0_12px_26px_rgba(118,135,93,0.10)]"
  },
  restaurants: {
    title: "Restaurants",
    subtitle: "Local favorites",
    preview: (property) => restaurantItems(property)[0]?.title || "Add dinner and cafe picks",
    icon: Utensils,
    accent: "bg-[#EEF2F6] text-[#374151] ring-1 ring-[#172234]/10 shadow-[0_1px_2px_rgba(17,24,39,0.04)]"
  },
  activities: {
    title: "Activities",
    subtitle: "Things to do",
    preview: (property) => activityItems(property)[0]?.title || "Add beaches, tours and walks",
    icon: MapPin,
    accent: "bg-[#E8F4F3] text-[#447977] ring-1 ring-[#5F9D99]/18 shadow-[0_12px_26px_rgba(95,157,153,0.10)]"
  },
  essentials: {
    title: "Essentials",
    subtitle: "Useful places",
    preview: (property) => essentialItems(property)[0]?.title || essentialItems(property)[0]?.name || "Add pharmacy, ATM, petrol and parking",
    icon: Pill,
    accent: "bg-[#EEF4E8] text-[#64734D] ring-1 ring-[#76875D]/18 shadow-[0_12px_26px_rgba(118,135,93,0.10)]"
  },
  contact: {
    title: "Contact",
    subtitle: "Host help",
    preview: (property) => property.hostContactName || property.hostPhone || "Add host contact",
    icon: Phone,
    accent: "bg-[#E8F4F3] text-[#447977] ring-1 ring-[#5F9D99]/18 shadow-[0_12px_26px_rgba(95,157,153,0.10)]"
  },
  emergency: {
    title: "Emergency",
    subtitle: "Safety contact",
    preview: (property) => property.emergencyInfo || "Add urgent help details",
    icon: ShieldAlert,
    accent: "bg-[#FEF2F2] text-[#991B1B] ring-1 ring-[#FECACA]/80 shadow-[0_1px_2px_rgba(17,24,39,0.04)]"
  },
  ai: {
    title: "AI",
    subtitle: "Guest chat knowledge",
    preview: (property) => property.aiKnowledge || "Add answers the assistant should know",
    icon: Bot,
    accent: "bg-[#E8F4F3] text-[#447977] ring-1 ring-[#5F9D99]/18 shadow-[0_12px_26px_rgba(95,157,153,0.10)]"
  },
  reviews: {
    title: "Reviews",
    subtitle: "Google review link",
    preview: (property) => getReviewValue(property, "GOOGLE") || "Add Google review URL",
    icon: Star,
    accent: "bg-[#EEF4E8] text-[#64734D] ring-1 ring-[#76875D]/18 shadow-[0_12px_26px_rgba(118,135,93,0.10)]"
  }
};

function restaurantItems(property: Property) {
  return property.recommendations.filter((item) => !item.isEssential && /restaurant|cafe|bar|food|dinner|bakery/i.test(`${item.category} ${item.title} ${item.name}`));
}

function essentialItems(property: Property) {
  return property.recommendations.filter((item) => item.isEssential || isEssentialCategory(item.category));
}

function activityItems(property: Property) {
  const restaurants = new Set(restaurantItems(property).map((item) => item.id));
  const essentials = new Set(essentialItems(property).map((item) => item.id));
  return property.recommendations.filter((item) => !restaurants.has(item.id) && !essentials.has(item.id));
}

function getReviewValue(property: Property, platform: "GOOGLE" | "BOOKING" | "AIRBNB") {
  return property.reviewLinks.find((link) => link.platform === platform)?.url || "";
}

function shortText(value: string, fallback: string) {
  return value.length > 72 ? `${value.slice(0, 72).trim()}...` : value || fallback;
}

function createBlankProperty(ownerId: string): Property {
  return {
    id: "",
    ownerId,
    name: "",
    slug: "",
    publicCode: null,
    logoUrl: null,
    coverImageUrl: null,
    accentColor: "#5D9C9A",
    templateId: "classic",
    designSerif: true,
    designRounded: true,
    welcomeMessage: "",
    wifiName: null,
    wifiPassword: null,
    checkInInfo: null,
    checkOutInfo: null,
    parkingInfo: null,
    houseRules: null,
    emergencyInfo: null,
    hostContactName: null,
    hostPhone: null,
    hostEmail: null,
    aiKnowledge: null,
    recommendations: [],
    reviewLinks: []
  };
}

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function formStringArray(formData: FormData, key: string) {
  return formData.getAll(key).map((value) => (typeof value === "string" ? value.trim() : ""));
}

function formOptional(formData: FormData, key: string) {
  const value = formString(formData, key);
  return value || null;
}

function checkedFormValue(formData: FormData, key: string) {
  return formData.get(key) === "1";
}

function previewFileUrl(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof File === "undefined" || !(value instanceof File) || value.size === 0) return "";
  return URL.createObjectURL(value);
}

function optimisticPropertyFromForm(formData: FormData, current: Property, ownerId: string): Property {
  const logoPreview = previewFileUrl(formData, "logoFile");
  const coverPreview = previewFileUrl(formData, "coverImageFile");
  const logoUrl = checkedFormValue(formData, "removeLogo")
    ? null
    : logoPreview || formOptional(formData, "logoUrl") || current.logoUrl;
  const coverImageUrl = checkedFormValue(formData, "removeCoverImage")
    ? null
    : coverPreview || formOptional(formData, "coverImageUrl") || current.coverImageUrl;

  return {
    ...current,
    id: formString(formData, "propertyId") || current.id,
    ownerId: current.ownerId || ownerId,
    name: formString(formData, "name") || current.name,
    accentColor: formString(formData, "accentColor") || current.accentColor,
    logoUrl,
    coverImageUrl,
    welcomeMessage: formString(formData, "welcomeMessage"),
    wifiName: formOptional(formData, "wifiName"),
    wifiPassword: formOptional(formData, "wifiPassword"),
    checkInInfo: formOptional(formData, "checkInInfo"),
    checkOutInfo: formOptional(formData, "checkOutInfo"),
    parkingInfo: formOptional(formData, "parkingInfo"),
    houseRules: formOptional(formData, "houseRules"),
    emergencyInfo: formOptional(formData, "emergencyInfo"),
    hostContactName: formOptional(formData, "hostContactName"),
    hostPhone: formOptional(formData, "hostPhone"),
    hostEmail: formOptional(formData, "hostEmail"),
    aiKnowledge: formOptional(formData, "aiKnowledge")
  };
}

function optimisticReviewLinksFromForm(formData: FormData, current: Property): ReviewLink[] {
  const platforms: Array<ReviewLink["platform"]> = ["GOOGLE", "BOOKING", "AIRBNB"];
  const retained = current.reviewLinks.filter((link) => !platforms.includes(link.platform));
  const next = platforms.flatMap((platform) => {
    const url = formOptional(formData, platform.toLowerCase());
    return url
      ? [{
          id: current.reviewLinks.find((link) => link.platform === platform)?.id || `optimistic-${platform.toLowerCase()}`,
          propertyId: current.id,
          platform,
          url
        }]
      : [];
  });
  return [...retained, ...next];
}

function optimisticRecommendationFromForm(formData: FormData, current: Property, fallbackCategory: string): Recommendation {
  const existingId = formString(formData, "recommendationId");
  const existing = current.recommendations.find((item) => item.id === existingId);
  const name = formString(formData, "name") || formString(formData, "manualName") || formString(formData, "title");
  const customTitle = formString(formData, "customTitle") || formString(formData, "title");
  const customDescription = formString(formData, "customDescription") || formString(formData, "description");
  const googleMapsUrl = formOptional(formData, "googleMapsUrl") || formOptional(formData, "url");
  const formattedAddress = formOptional(formData, "formattedAddress") || formOptional(formData, "address");
  const rating = Number(formString(formData, "rating"));
  const userRatingsTotal = Number(formString(formData, "userRatingsTotal"));

  return {
    id: existingId || `optimistic-${Date.now()}`,
    propertyId: current.id,
    title: customTitle || name,
    category: formString(formData, "category") || fallbackCategory,
    description: customDescription,
    address: formattedAddress,
    url: googleMapsUrl,
    imageUrl: existing?.imageUrl || formOptional(formData, "photoUrl"),
    placeId: formOptional(formData, "placeId"),
    name,
    customTitle: customTitle || null,
    customDescription: customDescription || null,
    formattedAddress,
    latitude: Number.isFinite(Number(formString(formData, "latitude"))) ? Number(formString(formData, "latitude")) : null,
    longitude: Number.isFinite(Number(formString(formData, "longitude"))) ? Number(formString(formData, "longitude")) : null,
    googleMapsUrl,
    rating: Number.isFinite(rating) ? rating : null,
    userRatingsTotal: Number.isFinite(userRatingsTotal) ? userRatingsTotal : null,
    openingHours: formString(formData, "openingHours").split("\n").map((line) => line.trim()).filter(Boolean),
    website: formOptional(formData, "website"),
    phoneNumber: formOptional(formData, "phoneNumber"),
    photoUrl: formOptional(formData, "photoUrl"),
    isEssential: checkedFormValue(formData, "isEssential"),
    isVisible: formData.get("isVisible") !== "",
    sortOrder: Number(formString(formData, "sortOrder")) || existing?.sortOrder || current.recommendations.length + 1
  };
}

function optimisticRecommendationsFromBulkForm(formData: FormData, current: Property, fallbackCategory: string): Recommendation[] {
  const ids = formStringArray(formData, "recommendationId");
  const names = formStringArray(formData, "name");
  const manualNames = formStringArray(formData, "manualName");
  const customTitles = formStringArray(formData, "customTitle");
  const customDescriptions = formStringArray(formData, "customDescription");
  const urls = formStringArray(formData, "url");
  const categories = formStringArray(formData, "category");
  const addresses = formStringArray(formData, "formattedAddress");
  const placeIds = formStringArray(formData, "placeId");
  const latitudes = formStringArray(formData, "latitude");
  const longitudes = formStringArray(formData, "longitude");
  const googleMapsUrls = formStringArray(formData, "googleMapsUrl");
  const ratings = formStringArray(formData, "rating");
  const userRatingsTotals = formStringArray(formData, "userRatingsTotal");
  const openingHours = formStringArray(formData, "openingHours");
  const websites = formStringArray(formData, "website");
  const phoneNumbers = formStringArray(formData, "phoneNumber");
  const photoUrls = formStringArray(formData, "photoUrl");
  const isEssentials = formStringArray(formData, "isEssential");
  const isVisibleValues = formStringArray(formData, "isVisible");
  const sortOrders = formStringArray(formData, "sortOrder");
  const now = Date.now();

  return names
    .map((rawName, index) => {
      const existingId = ids[index] || "";
      const existing = current.recommendations.find((item) => item.id === existingId);
      const name = rawName || manualNames[index] || "";
      const customTitle = customTitles[index] || "";
      const customDescription = customDescriptions[index] || "";
      const rating = Number(ratings[index]);
      const userRatingsTotal = Number(userRatingsTotals[index]);

      return {
        id: existingId || `optimistic-${now}-${index}`,
        propertyId: current.id,
        title: customTitle || name,
        category: categories[index] || fallbackCategory,
        description: customDescription,
        address: addresses[index] || null,
        url: googleMapsUrls[index] || urls[index] || null,
        imageUrl: existing?.imageUrl || photoUrls[index] || null,
        placeId: placeIds[index] || null,
        name,
        customTitle: customTitle || null,
        customDescription: customDescription || null,
        formattedAddress: addresses[index] || null,
        latitude: Number.isFinite(Number(latitudes[index])) ? Number(latitudes[index]) : null,
        longitude: Number.isFinite(Number(longitudes[index])) ? Number(longitudes[index]) : null,
        googleMapsUrl: googleMapsUrls[index] || urls[index] || null,
        rating: Number.isFinite(rating) ? rating : null,
        userRatingsTotal: Number.isFinite(userRatingsTotal) ? userRatingsTotal : null,
        openingHours: (openingHours[index] || "").split("\n").map((line) => line.trim()).filter(Boolean),
        website: websites[index] || null,
        phoneNumber: phoneNumbers[index] || null,
        photoUrl: photoUrls[index] || null,
        isEssential: isEssentials[index] === "1",
        isVisible: isVisibleValues[index] !== "",
        sortOrder: Number(sortOrders[index]) || existing?.sortOrder || current.recommendations.length + index + 1
      };
    })
    .filter((item) => item.title);
}

function createRecommendationDraft(item: Recommendation, fallbackCategory: PlaceRecommendationCategory): PlaceRecommendationDraft {
  return {
    clientId: item.id,
    id: item.id,
    placeId: item.placeId || "",
    name: item.name || item.title,
    customTitle: item.customTitle || "",
    customDescription: item.customDescription || item.description || "",
    formattedAddress: item.formattedAddress || item.address || "",
    latitude: item.latitude === null ? "" : String(item.latitude),
    longitude: item.longitude === null ? "" : String(item.longitude),
    googleMapsUrl: item.googleMapsUrl || item.url || "",
    rating: item.rating === null ? "" : String(item.rating),
    userRatingsTotal: item.userRatingsTotal === null ? "" : String(item.userRatingsTotal),
    openingHours: item.openingHours || [],
    website: item.website || "",
    phoneNumber: item.phoneNumber || "",
    photoUrl: item.photoUrl || item.imageUrl || "",
    category: normalizePlaceCategory(item.category || fallbackCategory),
    isEssential: item.isEssential || isEssentialCategory(item.category),
    isVisible: item.isVisible,
    sortOrder: item.sortOrder || 0,
    manualUrl: item.googleMapsUrl || item.url || ""
  };
}

function mergePropertyFields(current: Property, next: Partial<Property>): Property {
  return {
    ...current,
    ...next,
    recommendations: current.recommendations,
    reviewLinks: current.reviewLinks
  };
}

function TrialStatusBar({
  subscriptionStatus,
  trialDaysLeft,
  trialLabel,
  selectedPlan,
  cardOnFile,
  hasGuide,
  onlyIfUrgent = false
}: {
  subscriptionStatus: string | null;
  trialDaysLeft: number | null;
  trialLabel: string | null;
  selectedPlan: string;
  cardOnFile: boolean;
  hasGuide: boolean;
  onlyIfUrgent?: boolean;
}) {
  const status = subscriptionStatus?.toUpperCase();
  if (status === "ACTIVE") return null;

  const billingHref = `${BILLING_BASE_URL}/billing?plan=${encodeURIComponent(selectedPlan)}`;
  const expired = status !== "TRIALING" || trialDaysLeft === null || trialDaysLeft <= 0;
  const urgent = !expired && trialDaysLeft !== null && trialDaysLeft <= 2;
  if (onlyIfUrgent && !expired && !urgent) return null;

  const tone = expired
    ? "border-red-200 bg-red-50 text-red-800"
    : urgent
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : "border-sn-line/10 bg-sn-surface text-sn-ink";

  const daysText = trialDaysLeft === 1 ? "1 day" : `${trialDaysLeft} days`;
  const headline = expired
    ? "Your free trial has ended"
    : cardOnFile
      ? trialDaysLeft === 1
        ? "Trial active: first charge tomorrow"
        : `Trial active: ${daysText} until first charge`
      : `Free trial: ${daysText} left`;

  const detail = expired
    ? "Your guide is offline for guests. Subscribe to put it back online; everything you set up is saved."
    : cardOnFile
      ? trialLabel
        ? `Your card is on file. Paddle starts yearly billing after ${trialLabel}.`
        : "Your card is on file. Paddle starts yearly billing after the trial."
      : !hasGuide
        ? "Set up your guide now. It stays free for guests until the trial ends."
        : trialLabel
        ? `Your guide is live for guests until ${trialLabel}. Subscribe any time to keep it live after that.`
        : "Your guide is live for guests during the trial. Subscribe any time to keep it live.";

  const action = expired ? "Subscribe to go live" : cardOnFile ? "Manage billing" : "Keep my guide live";
  const showAction = expired || urgent || cardOnFile || hasGuide;

  return (
    <div className={`mb-4 flex flex-col gap-3 rounded-[20px] border px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${tone}`}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0">
          {expired ? <AlertCircle size={18} /> : <Sparkles size={18} />}
        </span>
        <div>
          <p className="text-sm font-bold">{headline}</p>
          <p className="mt-0.5 text-xs font-semibold opacity-80">{detail}</p>
        </div>
      </div>
      {showAction ? (
        <a
          href={billingHref}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-sn-ink px-4 text-sm font-semibold text-white transition hover:bg-sn-ink/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sn-accent/40 focus-visible:ring-offset-2"
        >
          {action}
        </a>
      ) : null}
    </div>
  );
}

function InviteHostCard({ referralUrl, stats }: { referralUrl: string; stats: { invited: number; paid: number; creditMonths: number } }) {
  return (
    <section aria-labelledby="invite-host-title" className="mt-4 rounded-[20px] border border-[#172234]/10 bg-white p-5 shadow-[0_1px_2px_rgba(17,24,39,0.04)] sm:p-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#5F9D99]">Invite a host</p>
      <h2 id="invite-host-title" className="mt-1 text-xl font-bold tracking-tight text-[#111827]">Give 3 months, get 3 months</h2>
      <p className="mt-2 text-sm font-semibold leading-6 text-[#111827]/68">
        Know another host? With your link they get a 3-month free trial instead of 7 days. When they subscribe, you get 3 months free too.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <p className="min-w-0 flex-1 break-all rounded-[14px] border border-[#172234]/10 bg-sn-canvas px-4 py-3 text-xs font-bold text-[#111827]">{referralUrl}</p>
        <CopyButton value={referralUrl} label="Copy link" copiedLabel="Copied" className="rounded-[14px] border border-[#172234]/10 bg-[#111827] text-white hover:bg-[#1F2937]" />
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-[14px] bg-sn-canvas px-2 py-3">
          <dt className="text-[11px] font-bold text-[#111827]/55">Signed up</dt>
          <dd className="mt-1 text-lg font-bold text-[#111827]">{stats.invited}</dd>
        </div>
        <div className="rounded-[14px] bg-sn-canvas px-2 py-3">
          <dt className="text-[11px] font-bold text-[#111827]/55">Subscribed</dt>
          <dd className="mt-1 text-lg font-bold text-[#111827]">{stats.paid}</dd>
        </div>
        <div className="rounded-[14px] bg-sn-canvas px-2 py-3">
          <dt className="text-[11px] font-bold text-[#111827]/55">Months earned</dt>
          <dd className="mt-1 text-lg font-bold text-[#111827]">{stats.paid * 3}</dd>
        </div>
      </dl>
      {stats.creditMonths > 0 ? (
        <p className="mt-3 text-xs font-semibold leading-5 text-[#111827]/60">
          {stats.creditMonths} free months are waiting for your next renewal. We add them to your subscription before it renews.
        </p>
      ) : null}
    </section>
  );
}

function DesktopSidebar({
  activeTab,
  onSelect,
  propertyName,
  logoUrl,
  publicUrl,
  live,
  accountLabel,
  logoutAction
}: {
  activeTab: TabId;
  onSelect: (tab: TabId) => void;
  propertyName: string;
  logoUrl: string | null;
  publicUrl: string;
  live: boolean;
  accountLabel: string;
  logoutAction: () => void | Promise<void>;
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[272px] flex-col border-r border-sn-line/10 bg-sn-surface lg:flex">
      <div className="flex items-center gap-3 px-6 pb-5 pt-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/staynest-logo.png" alt="" className="h-9 w-9 rounded-[12px] object-cover ring-1 ring-sn-line/10" />
        <div>
          <p className="text-base font-extrabold leading-none tracking-tight">StayNest</p>
          <p className="mt-1 text-[11px] font-semibold text-sn-muted">Host workspace</p>
        </div>
      </div>

      <div className="mx-4 rounded-[16px] border border-sn-line/10 bg-sn-canvas p-3">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" className="h-10 w-10 rounded-[12px] object-cover" />
          ) : (
            <span className="grid h-10 w-10 place-items-center rounded-[12px] bg-sn-accent-soft text-sn-accent">
              <Home size={18} aria-hidden="true" />
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{propertyName}</p>
            <p className={`mt-0.5 inline-flex items-center gap-1.5 text-xs font-semibold ${!publicUrl ? "text-sn-muted" : live ? "text-sn-accent" : "text-sn-warn"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${!publicUrl ? "bg-sn-muted" : live ? "bg-sn-accent" : "bg-sn-warn"}`} aria-hidden="true" />
              {!publicUrl ? "Not set up yet" : live ? "Live for guests" : "Paused for guests"}
            </p>
          </div>
        </div>
        {publicUrl ? (
          <a
            href={publicUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex min-h-9 items-center justify-center gap-1.5 rounded-[10px] border border-sn-line/12 bg-sn-surface text-xs font-bold text-sn-ink transition hover:bg-sn-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-sn-accent/40"
          >
            Open guest view <ExternalLink size={13} aria-hidden="true" />
          </a>
        ) : null}
      </div>

      <nav aria-label="Dashboard sections" className="mt-6 grid gap-1 px-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelect(tab.id)}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-11 items-center gap-3 rounded-[12px] px-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sn-accent/40 ${
                active ? "bg-sn-ink text-white" : "text-sn-ink/72 hover:bg-sn-canvas hover:text-sn-ink"
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.4 : 2} aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-sn-line/10 p-4">
        <div className="flex items-center gap-3 px-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-sn-ink text-xs font-bold text-white" aria-hidden="true">
            {accountLabel.slice(0, 1).toUpperCase()}
          </span>
          <p className="min-w-0 flex-1 truncate text-sm font-semibold text-sn-ink/80">{accountLabel}</p>
        </div>
        <form action={logoutAction} className="mt-3">
          <button type="submit" className="flex min-h-10 w-full items-center gap-2 rounded-[10px] px-3 text-sm font-semibold text-sn-muted transition hover:bg-sn-canvas hover:text-sn-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-sn-accent/40">
            <LogOut size={16} aria-hidden="true" />
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}

function PageHeader({ tab }: { tab: { title: string; description: string } }) {
  return (
    <div className="sr-only lg:not-sr-only lg:mb-6">
      <h1 className="text-[28px] font-extrabold leading-tight tracking-tight">{tab.title}</h1>
      <p className="mt-1 text-sm font-medium text-sn-muted">{tab.description}</p>
    </div>
  );
}

function GuidePreviewPanel({ publicUrl, live, refreshKey }: { publicUrl: string; live: boolean; refreshKey: number }) {
  if (!publicUrl) return null;
  return (
    <aside aria-label="Guest view preview" className="sticky top-8 hidden xl:block">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-bold">Guest view</p>
        <span className={`text-xs font-semibold ${live ? "text-sn-accent" : "text-sn-warn"}`}>{live ? "Live" : "Paused"}</span>
      </div>
      <div className="overflow-hidden rounded-[36px] border-[10px] border-sn-ink bg-sn-ink shadow-[0_1px_2px_rgba(17,24,39,0.04)]">
        <iframe
          key={refreshKey}
          src={publicUrl}
          title="Your guide as guests see it"
          className="block h-[640px] w-full rounded-[26px] bg-white"
          loading="lazy"
        />
      </div>
      <p className="mt-3 text-center text-xs font-medium text-sn-muted">Updates after you save.</p>
    </aside>
  );
}

function MobileHeaderTitle({ name, status }: { name: string; status: "none" | "live" | "paused" }) {
  return (
    <div className="min-w-0">
      <p className="truncate text-[15px] font-bold leading-tight tracking-tight">{name}</p>
      <p className={`mt-0.5 inline-flex items-center gap-1.5 text-xs font-semibold ${status === "live" ? "text-sn-accent" : status === "paused" ? "text-sn-warn" : "text-sn-muted"}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${status === "live" ? "bg-sn-accent" : status === "paused" ? "bg-sn-warn" : "bg-sn-muted"}`} aria-hidden="true" />
        {status === "live" ? "Live for guests" : status === "paused" ? "Paused for guests" : "Not set up yet"}
      </p>
    </div>
  );
}

function InlineSaveButton({
  children,
  saving,
  savingText,
  className,
  form,
  disabled = false
}: {
  children: React.ReactNode;
  saving: boolean;
  savingText: string;
  className?: string;
  form?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      form={form}
      disabled={saving || disabled}
      className={`focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${className || ""}`}
    >
      {saving ? <Loader2 className="animate-spin" size={16} /> : null}
      {saving ? savingText : children}
    </button>
  );
}

export default function DashboardClient(props: DashboardClientProps) {
  const {
    property: initialProperty,
    user,
    publicUrl: initialPublicUrl,
    qrCode: initialQrCode,
    successMessage,
    errorMessage,
    planName,
    selectedPlan,
    trialLabel,
    trialDaysLeft,
    subscriptionStatus,
    billingAccess,
    cardOnFile,
    referralUrl,
    referralStats,
    logoutAction,
    importListingAction,
    savePropertyInlineAction,
    savePropertyDesignInlineAction,
    saveRecommendationInlineAction,
    deleteRecommendationInlineAction,
    saveReviewLinksInlineAction
  } = props;

  const blankProperty = useMemo(() => createBlankProperty(user.id), [user.id]);
  const [property, setProperty] = useState<Property>(() => initialProperty || blankProperty);
  const [savingKey, setSavingKey] = useState("");
  const [, startSaveTransition] = useTransition();
  const [notice, setNotice] = useState<{ type: "success" | "error" | "saving"; text: string } | null>(() => {
    if (errorMessage) return { type: "error", text: errorMessage };
    if (successMessage) return { type: "success", text: successMessage };
    return null;
  });

  useEffect(() => {
    setProperty(initialProperty || blankProperty);
  }, [initialProperty, blankProperty]);

  useEffect(() => {
    if (errorMessage) setNotice({ type: "error", text: errorMessage });
    else if (successMessage) setNotice({ type: "success", text: successMessage });
  }, [errorMessage, successMessage]);

  useEffect(() => {
    if (notice?.type !== "success") return;
    const timer = window.setTimeout(() => setNotice(null), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const siteBaseUrl = useMemo(() => {
    // Recover the origin from whatever public URL the server rendered, whether
    // that was the short /g/<code> form or the legacy /stay/<slug> one.
    if (initialPublicUrl) {
      return initialPublicUrl.replace(/\/(?:g|stay)\/[^/]+$/, "");
    }
    return "https://dashboard.staynest.site";
  }, [initialPublicUrl]);
  const publicUrl = property.publicCode
    ? `${siteBaseUrl}/g/${property.publicCode}`
    : property.slug
      ? `${siteBaseUrl}/stay/${property.slug}`
      : "";
  const qrCode = publicUrl ? `/api/qr?text=${encodeURIComponent(publicUrl)}` : initialQrCode || "";
  const [activeTab, setActiveTab] = useState<TabId>("setup");
  const [activeModule, setActiveModule] = useState<ModuleId>("welcome");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [propertyMenuOpen, setPropertyMenuOpen] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const lastSavingKey = useRef("");

  useEffect(() => {
    if (lastSavingKey.current && !savingKey) {
      setPreviewKey((key) => key + 1);
    }
    lastSavingKey.current = savingKey;
  }, [savingKey]);

  const setupItems = useMemo(
    () => [
      { id: "welcome" as ModuleId, label: "Welcome", done: Boolean(property.name && property.welcomeMessage) },
      { id: "wifi" as ModuleId, label: "Wi-Fi", done: Boolean(property.wifiName && property.wifiPassword) },
      { id: "checkin" as ModuleId, label: "Check-in", done: Boolean(property.checkInInfo) },
      { id: "reviews" as ModuleId, label: "Google reviews", done: Boolean(getReviewValue(property, "GOOGLE")) },
      { id: "photos" as ModuleId, label: "Photos", done: Boolean(property.logoUrl && property.coverImageUrl) },
      { id: "rules" as ModuleId, label: "Rules", done: Boolean(property.houseRules || property.parkingInfo) },
      { id: "restaurants" as ModuleId, label: "Restaurants", done: restaurantItems(property).length >= 1 },
      { id: "activities" as ModuleId, label: "Activities", done: activityItems(property).length >= 1 },
      { id: "essentials" as ModuleId, label: "Essentials", done: essentialItems(property).length >= 2 },
      { id: "contact" as ModuleId, label: "Contact", done: Boolean(property.hostPhone && property.hostEmail) },
      { id: "emergency" as ModuleId, label: "Emergency", done: Boolean(property.emergencyInfo) },
      { id: "ai" as ModuleId, label: "AI", done: Boolean(property.aiKnowledge) }
    ],
    [property]
  );

  const hasGuide = Boolean(property.id && property.name);

  const openModule = (id: ModuleId) => {
    setActiveModule(id);
    setSheetOpen(true);
  };

  function finishInlineSave({
    key,
    previousProperty,
    message,
    action
  }: {
    key: string;
    previousProperty: Property;
    message: string;
    action: () => Promise<{ ok?: boolean; data?: any; message?: string; error?: string }>;
  }) {
    setSavingKey(key);
    setNotice({ type: "saving", text: "Saving..." });
    startSaveTransition(async () => {
      try {
        const result = await action();
        if (!result?.ok) {
          throw new Error(result?.error || "Save failed. Please try again.");
        }
        setNotice({ type: "success", text: result.message || message });
      } catch (error) {
        setProperty(previousProperty);
        setNotice({ type: "error", text: error instanceof Error ? error.message : "Save failed. Please try again." });
      } finally {
        setSavingKey("");
      }
    });
  }

  function handlePropertySave(formData: FormData) {
    const previousProperty = property;
    const optimisticProperty = optimisticPropertyFromForm(formData, property, user.id);
    setProperty(optimisticProperty);
    setSheetOpen(false);

    finishInlineSave({
      key: "property",
      previousProperty,
      message: "Saved. Guests see it now.",
      action: async () => {
        const result = await savePropertyInlineAction(formData);
        if (result?.ok && result.data?.property) {
          setProperty((current) => mergePropertyFields(current, result.data.property));
        }
        return result;
      }
    });
  }

  function handleDesignSave(formData: FormData) {
    const previousProperty = property;
    setProperty((current) => ({
      ...current,
      templateId: formString(formData, "templateId") || current.templateId,
      accentColor: formString(formData, "accentColor") || current.accentColor,
      designSerif: checkedFormValue(formData, "designSerif"),
      designRounded: checkedFormValue(formData, "designRounded")
    }));

    finishInlineSave({
      key: "design",
      previousProperty,
      message: "Style applied.",
      action: async () => {
        const result = await savePropertyDesignInlineAction(formData);
        if (result?.ok && result.data?.property) {
          setProperty((current) => ({ ...current, ...result.data.property }));
        }
        return result;
      }
    });
  }

  function handleRecommendationSave(formData: FormData, fallbackCategory: string) {
    const previousProperty = property;
    const optimisticRecommendation = optimisticRecommendationFromForm(formData, property, fallbackCategory);
    const existingId = formString(formData, "recommendationId");
    setProperty((current) => ({
      ...current,
      recommendations: existingId
        ? current.recommendations.map((item) => (item.id === existingId ? optimisticRecommendation : item))
        : [...current.recommendations, optimisticRecommendation]
    }));

    finishInlineSave({
      key: `recommendation:${existingId || "new"}`,
      previousProperty,
      message: "Recommendation saved.",
      action: async () => {
        const result = await saveRecommendationInlineAction(formData);
        if (result?.ok && result.data?.recommendation) {
          setProperty((current) => ({
            ...current,
            recommendations: existingId
              ? current.recommendations.map((item) => (item.id === existingId ? result.data.recommendation : item))
              : current.recommendations.map((item) => (item.id === optimisticRecommendation.id ? result.data.recommendation : item))
          }));
        }
        return result;
      }
    });
  }

  function handleRecommendationDelete(formData: FormData) {
    const previousProperty = property;
    const id = formString(formData, "id");
    setProperty((current) => ({
      ...current,
      recommendations: current.recommendations.filter((item) => item.id !== id)
    }));

    finishInlineSave({
      key: `delete:${id}`,
      previousProperty,
      message: "Recommendation removed.",
      action: () => deleteRecommendationInlineAction(formData)
    });
  }

  function handleRecommendationsBulkSave(formData: FormData, fallbackCategory: string) {
    const previousProperty = property;
    const visibleBefore = fallbackCategory === "restaurant" ? restaurantItems(property) : fallbackCategory === "pharmacy" ? essentialItems(property) : activityItems(property);
    const visibleIds = new Set(visibleBefore.map((item) => item.id));
    const optimisticRecommendations = optimisticRecommendationsFromBulkForm(formData, property, fallbackCategory);
    const keptExistingIds = new Set(optimisticRecommendations.filter((item) => !item.id.startsWith("optimistic-")).map((item) => item.id));
    const deleteIds = visibleBefore.filter((item) => !keptExistingIds.has(item.id)).map((item) => item.id);
    const label = fallbackCategory === "restaurant" ? "Restaurants" : fallbackCategory === "pharmacy" ? "Essentials" : "Activities";

    setProperty((current) => ({
      ...current,
      recommendations: [
        ...current.recommendations.filter((item) => !visibleIds.has(item.id)),
        ...optimisticRecommendations
      ]
    }));
    setSheetOpen(false);

    finishInlineSave({
      key: `recommendations:${fallbackCategory}`,
      previousProperty,
      message: `${label} saved.`,
      action: async () => {
        for (const id of deleteIds) {
          const deleteForm = new FormData();
          deleteForm.set("id", id);
          const deleteResult = await deleteRecommendationInlineAction(deleteForm);
          if (!deleteResult?.ok) {
            throw new Error(deleteResult?.error || `Could not remove ${label.toLowerCase()}.`);
          }
        }

        const savedRecommendations: Recommendation[] = [];
        for (const item of optimisticRecommendations) {
          const itemForm = new FormData();
          itemForm.set("propertyId", property.id);
          if (!item.id.startsWith("optimistic-")) {
            itemForm.set("recommendationId", item.id);
          }
          itemForm.set("category", item.category || fallbackCategory);
          itemForm.set("title", item.title);
          itemForm.set("name", item.name || item.title);
          if (item.customTitle) itemForm.set("customTitle", item.customTitle);
          if (item.description) itemForm.set("description", item.description);
          if (item.customDescription) itemForm.set("customDescription", item.customDescription);
          if (item.address) itemForm.set("address", item.address);
          if (item.formattedAddress) itemForm.set("formattedAddress", item.formattedAddress);
          if (item.url) itemForm.set("url", item.url);
          if (item.placeId) itemForm.set("placeId", item.placeId);
          if (item.latitude !== null) itemForm.set("latitude", String(item.latitude));
          if (item.longitude !== null) itemForm.set("longitude", String(item.longitude));
          if (item.googleMapsUrl) itemForm.set("googleMapsUrl", item.googleMapsUrl);
          if (item.rating !== null) itemForm.set("rating", String(item.rating));
          if (item.userRatingsTotal !== null) itemForm.set("userRatingsTotal", String(item.userRatingsTotal));
          if (item.openingHours?.length) itemForm.set("openingHours", item.openingHours.join("\n"));
          if (item.website) itemForm.set("website", item.website);
          if (item.phoneNumber) itemForm.set("phoneNumber", item.phoneNumber);
          if (item.photoUrl) itemForm.set("photoUrl", item.photoUrl);
          if (item.isEssential) itemForm.set("isEssential", "1");
          if (item.isVisible) itemForm.set("isVisible", "1");
          itemForm.set("sortOrder", String(item.sortOrder));

          const saveResult = await saveRecommendationInlineAction(itemForm);
          if (!saveResult?.ok || !saveResult.data?.recommendation) {
            throw new Error(saveResult?.error || `Could not save ${label.toLowerCase()}.`);
          }
          savedRecommendations.push(saveResult.data.recommendation);
        }

        const optimisticIds = new Set(optimisticRecommendations.map((item) => item.id));
        setProperty((current) => ({
          ...current,
          recommendations: [
            ...current.recommendations.filter((item) => !visibleIds.has(item.id) && !optimisticIds.has(item.id)),
            ...savedRecommendations
          ]
        }));

        return {
          ok: true,
          data: { recommendations: savedRecommendations },
          message: `${label} saved.`
        };
      }
    });
  }

  function handleReviewLinksSave(formData: FormData) {
    const previousProperty = property;
    setProperty((current) => ({
      ...current,
      reviewLinks: optimisticReviewLinksFromForm(formData, current)
    }));
    setSheetOpen(false);

    finishInlineSave({
      key: "reviews",
      previousProperty,
      message: "Review link saved.",
      action: async () => {
        const result = await saveReviewLinksInlineAction(formData);
        if (result?.ok && result.data?.reviewLinks) {
          setProperty((current) => ({ ...current, reviewLinks: result.data.reviewLinks }));
        }
        return result;
      }
    });
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-sn-canvas text-sn-ink">
      <div className="fixed inset-0 -z-10 bg-sn-canvas" />

      <DesktopSidebar
        activeTab={activeTab}
        onSelect={setActiveTab}
        propertyName={property.name || "Your guide"}
        logoUrl={property.logoUrl}
        publicUrl={publicUrl}
        live={billingAccess}
        accountLabel={property.hostContactName || user.email}
        logoutAction={logoutAction}
      />

      <header className="sticky top-0 z-40 border-b border-sn-line/8 bg-sn-canvas/85 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="relative mx-auto flex max-w-5xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {property.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={property.logoUrl} alt="" className="h-10 w-10 shrink-0 rounded-xl object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/staynest-logo.png" alt="" className="h-10 w-10 shrink-0 rounded-xl object-contain" />
            )}
            <MobileHeaderTitle name={property.name || "Your guide"} status={!publicUrl ? "none" : billingAccess ? "live" : "paused"} />
          </div>
          {publicUrl ? (
            <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="ml-auto inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border border-sn-line/12 px-3 text-xs font-semibold"
            >
              Guest view <ExternalLink size={13} aria-hidden="true" />
            </a>
          ) : null}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPropertyMenuOpen((open) => !open)}
              aria-label="Open account menu"
              className="grid h-10 w-10 place-items-center rounded-full bg-sn-ink text-xs font-bold text-white transition hover:bg-sn-ink/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sn-accent/40 focus-visible:ring-offset-2"
            >
              {(property.hostContactName || user.email).slice(0, 1).toUpperCase()}
            </button>
            {propertyMenuOpen ? (
              <div className="absolute right-4 top-16 z-50 w-64 rounded-[20px] border border-sn-line/10 bg-[#FFFFFF] p-3 shadow-[0_1px_2px_rgba(17,24,39,0.04)]">
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#111827]/40">Active guide</p>
                <div className="flex items-center gap-3 rounded-[18px] bg-sn-canvas p-3">
                  {property.logoUrl ? (
                    <img src={property.logoUrl} alt="" className="h-11 w-11 rounded-[16px] object-cover" />
                  ) : (
                    <div className="grid h-11 w-11 place-items-center rounded-[16px] bg-[#E8F4F3] text-[#5F9D99]">
                      <Home size={18} />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold">{property.name || "Your guide"}</p>
                    <p className="text-xs font-semibold text-[#111827]/50">{!publicUrl ? "Not set up yet" : billingAccess ? "Live for guests" : "Paused for guests"}</p>
                  </div>
                </div>
                <form action={logoutAction} className="mt-2 border-t border-sn-line/10 pt-2">
                  <button type="submit" className="flex min-h-11 w-full items-center gap-2 rounded-[16px] px-3 text-left text-sm font-bold text-[#111827]/72 transition hover:bg-sn-canvas hover:text-[#111827]">
                    <LogOut size={16} />
                    Log out
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="lg:pl-[272px]">
      <div className="mx-auto max-w-6xl px-4 pb-32 pt-5 lg:px-10 lg:pb-16 lg:pt-8 xl:grid xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start xl:gap-10">
      <div className="min-w-0">
        <PageHeader tab={tabs.find((tab) => tab.id === activeTab) ?? tabs[0]} />
        <TrialStatusBar
          subscriptionStatus={subscriptionStatus}
          trialDaysLeft={trialDaysLeft}
          trialLabel={trialLabel}
          selectedPlan={selectedPlan}
          cardOnFile={cardOnFile}
          hasGuide={hasGuide}
          onlyIfUrgent={activeTab !== "setup"}
        />

        {activeTab === "setup" ? (
          <SetupScreen
            property={property}
            setupItems={setupItems}
            openModule={openModule}
            importListingAction={importListingAction}
            publicUrl={publicUrl}
            qrCode={qrCode}
            billingAccess={billingAccess}
          />
        ) : null}

        {activeTab === "modules" ? (
          <ModulesScreen
            property={property}
            setupItems={setupItems}
            activeModule={activeModule}
            openModule={openModule}
          />
        ) : null}

        {activeTab === "design" ? (
          <DesignScreen
            property={property}
            onSaveDesign={handleDesignSave}
            saving={savingKey === "design"}
          />
        ) : null}

        {activeTab === "settings" ? (
          <SettingsScreen
            property={property}
            publicUrl={publicUrl}
            qrCode={qrCode}
            planName={planName}
            selectedPlan={selectedPlan}
            billingAccess={billingAccess}
          />
        ) : null}

        {activeTab === "settings" && referralUrl ? <InviteHostCard referralUrl={referralUrl} stats={referralStats} /> : null}
      </div>
      <GuidePreviewPanel publicUrl={publicUrl} live={billingAccess} refreshKey={previewKey} />
      </div>
      </div>

      {sheetOpen ? (
        <ModuleSheet
          property={property}
          activeModule={activeModule}
          onClose={() => setSheetOpen(false)}
          onSaveProperty={handlePropertySave}
          onSaveRecommendationsBulk={handleRecommendationsBulkSave}
          onSaveReviewLinks={handleReviewLinksSave}
          savingKey={savingKey}
        />
      ) : null}

      {notice ? (
        <div
          role={notice.type === "error" ? "alert" : "status"}
          className={`fixed left-1/2 top-4 z-[60] flex max-w-[calc(100vw-32px)] -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-[0_18px_50px_rgba(17,24,39,0.18)] lg:left-[calc(50%+136px)] ${
            notice.type === "error" ? "bg-red-600 text-white" : "bg-sn-ink text-white"
          }`}
        >
          {notice.type === "saving" ? <Loader2 className="animate-spin" size={15} aria-hidden="true" /> : notice.type === "success" ? <Check size={15} aria-hidden="true" /> : <AlertCircle size={15} aria-hidden="true" />}
          <span className="truncate">{notice.text}</span>
          {notice.type === "error" ? (
            <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss" className="-mr-1 grid h-6 w-6 place-items-center rounded-full hover:bg-white/15">
              <X size={14} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      ) : null}

      <nav className="dashboard-tab-nav lg:hidden" aria-label="Dashboard sections">
        <div className="dashboard-tab-grid">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-current={active ? "page" : undefined}
                className={`dashboard-tab-button ${active ? "dashboard-tab-button-active" : ""}`}
              >
                <Icon size={21} strokeWidth={active ? 2.4 : 2} aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>
    </main>
  );
}

type SetupItem = { id: ModuleId; label: string; done: boolean };

const ESSENTIAL_IDS: ModuleId[] = ["welcome", "wifi", "checkin", "contact"];

const essentialCopy: Partial<Record<ModuleId, { label: string; why: string }>> = {
  welcome: { label: "Name and welcome note", why: "The first thing guests see when they scan." },
  wifi: { label: "Wi-Fi", why: "The question every guest asks first." },
  checkin: { label: "Check-in steps", why: "A calm arrival starts the stay well." },
  contact: { label: "Your contact", why: "So guests can reach you if they need to." }
};

const extraCopy: Partial<Record<ModuleId, { label: string; why: string }>> = {
  reviews: { label: "Google review link", why: "Happy guests can review you in one tap." },
  photos: { label: "Cover photo and logo", why: "Your guide looks like your place." },
  restaurants: { label: "Favourite restaurants", why: "Guests love a local tip." },
  activities: { label: "Things to do", why: "Beaches, walks and tours nearby." },
  essentials: { label: "Pharmacy, ATM, supermarket", why: "Saves you the late-night message." },
  rules: { label: "House rules and parking", why: "Clear rules prevent awkward moments." },
  ai: { label: "Notes for the AI concierge", why: "It answers more questions for you." },
  emergency: { label: "Emergency info", why: "Peace of mind for you and your guests." }
};

function SetupScreen({
  property,
  setupItems,
  openModule,
  importListingAction,
  publicUrl,
  qrCode,
  billingAccess
}: {
  property: Property;
  setupItems: SetupItem[];
  openModule: (id: ModuleId) => void;
  importListingAction: any;
  publicUrl: string;
  qrCode: string;
  billingAccess: boolean;
}) {
  const hasGuide = Boolean(property.id && property.name);

  if (!hasGuide) {
    return (
      <div className="space-y-4">
        <section className="rounded-[24px] border border-sn-line/10 bg-sn-surface p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sn-accent">Welcome to StayNest</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Let&rsquo;s build your guest guide</h2>
          <p className="mt-2 max-w-xl text-[15px] leading-7 text-sn-muted">
            Paste your Booking.com link and we fill in the basics for you. It takes about a minute.
          </p>
          <ImportListingForm property={property} importListingAction={importListingAction} />
          <div className="mt-6 flex items-center gap-3 text-sm text-sn-muted">
            <span className="h-px flex-1 bg-sn-line/10" />
            or
            <span className="h-px flex-1 bg-sn-line/10" />
          </div>
          <button
            type="button"
            onClick={() => openModule("welcome")}
            className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-sn-line/12 bg-sn-surface text-sm font-semibold transition hover:border-sn-line/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-sn-accent/40"
          >
            Start from scratch <ChevronRight size={16} aria-hidden="true" />
          </button>
        </section>
      </div>
    );
  }

  const essentials = ESSENTIAL_IDS.map((id) => setupItems.find((item) => item.id === id)).filter(Boolean) as SetupItem[];
  const essentialsDone = essentials.filter((item) => item.done).length;
  const ready = essentialsDone === essentials.length;
  const nextEssential = essentials.find((item) => !item.done);
  const extras = setupItems.filter((item) => extraCopy[item.id] && !item.done);

  return (
    <div className="space-y-4">
      {ready ? (
        <ShareCard property={property} publicUrl={publicUrl} qrCode={qrCode} billingAccess={billingAccess} />
      ) : (
        <section className="rounded-[24px] border border-sn-line/10 bg-sn-surface p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sn-accent">Ready for guests</p>
              <h2 className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">
                {essentialsDone === 0 ? "Four things and you are ready" : `${essentials.length - essentialsDone} more to go`}
              </h2>
            </div>
            <span className="shrink-0 rounded-full bg-sn-accent-soft px-3 py-1 text-sm font-bold tabular-nums text-sn-accent">
              {essentialsDone}/{essentials.length}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-1.5" aria-hidden="true">
            {essentials.map((item) => (
              <span key={item.id} className={`h-1.5 rounded-full ${item.done ? "bg-sn-accent" : "bg-sn-line/10"}`} />
            ))}
          </div>
          <ul className="mt-4 grid gap-1">
            {essentials.map((item) => {
              const copy = essentialCopy[item.id];
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => openModule(item.id)}
                    className="group flex min-h-14 w-full items-center gap-3 rounded-2xl px-2 text-left transition hover:bg-sn-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-sn-accent/40"
                  >
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${item.done ? "bg-sn-accent text-white" : "border border-dashed border-sn-line/30 text-sn-muted"}`}>
                      {item.done ? <Check size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-sm font-semibold ${item.done ? "text-sn-muted line-through decoration-sn-line/30" : ""}`}>{copy?.label ?? item.label}</span>
                      {!item.done ? <span className="block text-xs text-sn-muted">{copy?.why}</span> : null}
                    </span>
                    <ChevronRight size={17} className="shrink-0 text-sn-muted transition group-hover:translate-x-0.5" aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
          {nextEssential ? (
            <button
              type="button"
              onClick={() => openModule(nextEssential.id)}
              className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-sn-ink text-sm font-semibold text-white transition hover:bg-sn-ink/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sn-accent/40 focus-visible:ring-offset-2"
            >
              Next: {essentialCopy[nextEssential.id]?.label ?? nextEssential.label} <ChevronRight size={16} aria-hidden="true" />
            </button>
          ) : null}
        </section>
      )}

      {extras.length ? (
        <section className="rounded-[24px] border border-sn-line/10 bg-sn-surface p-5 sm:p-6">
          <h2 className="text-lg font-bold tracking-tight">{ready ? "Make it even better" : "After that"}</h2>
          <p className="mt-1 text-sm text-sn-muted">Optional, but guests notice.</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {extras.slice(0, ready ? 6 : 4).map((item) => {
              const info = moduleCopy[item.id];
              const copy = extraCopy[item.id];
              const Icon = info.icon;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => openModule(item.id)}
                    className="flex h-full w-full items-start gap-3 rounded-2xl border border-sn-line/8 p-3 text-left transition hover:border-sn-line/20 hover:bg-sn-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-sn-accent/40"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-sn-canvas text-sn-ink">
                      <Icon size={17} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">{copy?.label}</span>
                      <span className="block text-xs leading-5 text-sn-muted">{copy?.why}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <details className="group rounded-[24px] border border-sn-line/10 bg-sn-surface px-5 py-2 sm:px-6">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-2">
            <WandSparkles size={16} className="text-sn-accent" aria-hidden="true" />
            Fill in more from your Booking.com listing
          </span>
          <ChevronDown size={16} className="text-sn-muted transition group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="pb-4">
          <ImportListingForm property={property} importListingAction={importListingAction} />
        </div>
      </details>
    </div>
  );
}

function ShareCard({
  property,
  publicUrl,
  qrCode,
  billingAccess
}: {
  property: Property;
  publicUrl: string;
  qrCode: string;
  billingAccess: boolean;
}) {
  const billingHref = `${BILLING_BASE_URL}/billing?plan=ai`;
  return (
    <section className="overflow-hidden rounded-[24px] bg-sn-ink p-5 text-white sm:p-6">
      <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#8FD3C9]">
        <Check size={14} aria-hidden="true" /> Ready for guests
      </p>
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight">Share it with your next guest</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-[148px_1fr] sm:items-center">
        <div className="grid h-[148px] w-[148px] place-items-center rounded-2xl bg-white p-3">
          {qrCode ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrCode} alt="QR code for your guest guide" className="h-full w-full object-contain" />
          ) : (
            <QrCode size={96} className="text-sn-ink" aria-hidden="true" />
          )}
        </div>
        <div>
          <ol className="grid gap-2 text-sm text-white/75">
            <li><span className="font-semibold text-white">1.</span> Print the QR code, about 6 cm or larger.</li>
            <li><span className="font-semibold text-white">2.</span> Put it by the door, the fridge or the router.</li>
            <li><span className="font-semibold text-white">3.</span> Send the link in your booking message.</li>
          </ol>
          <div className="mt-4 flex flex-wrap gap-2">
            {billingAccess ? (
              <>
                {qrCode ? (
                  <a
                    href={qrCode}
                    download={`staynest-${property.slug || "guide"}-qr.png`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-sn-ink transition hover:bg-white/90"
                  >
                    <Download size={15} aria-hidden="true" /> Download QR
                  </a>
                ) : null}
                {publicUrl ? (
                  <CopyButton value={publicUrl} label="Copy link" copiedLabel="Link copied" className="min-h-11 border-white/20 bg-transparent text-white hover:bg-white/10" />
                ) : null}
                {publicUrl ? (
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-white/80 transition hover:text-white"
                  >
                    Open as guest <ExternalLink size={14} aria-hidden="true" />
                  </a>
                ) : null}
              </>
            ) : (
              <a href={billingHref} className="inline-flex min-h-11 items-center rounded-full bg-white px-4 text-sm font-semibold text-sn-ink">
                Subscribe to put it online
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ImportListingForm({
  property,
  importListingAction
}: {
  property: Property;
  importListingAction: any;
}) {
  return (
    <form action={importListingAction} className="mt-5 grid gap-3">
      <input type="hidden" name="propertyId" value={property.id} />
      <label className="flex min-h-12 items-center gap-2 rounded-full border border-sn-line/12 bg-sn-surface px-4 focus-within:border-sn-accent/50 focus-within:ring-2 focus-within:ring-sn-accent/20">
        <span className="sr-only">Booking.com listing link</span>
        <Link2 size={17} className="shrink-0 text-sn-accent" aria-hidden="true" />
        <input
          name="listingUrl"
          type="url"
          className="min-h-11 min-w-0 flex-1 bg-transparent text-sm font-medium text-sn-ink outline-none placeholder:text-sn-muted/70"
          placeholder="https://www.booking.com/hotel/..."
        />
      </label>
      <details className="rounded-2xl bg-sn-canvas">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 text-xs font-semibold text-sn-muted [&::-webkit-details-marker]:hidden">
          No link, or the site blocks reading? Paste the listing text instead
          <ChevronDown size={15} aria-hidden="true" />
        </summary>
        <div className="px-3 pb-3">
          <textarea
            name="listingText"
            className={`${textareaClass} min-h-28 bg-sn-surface text-sm`}
            placeholder="Copy the listing description, facilities, house rules and check-in/out details here."
          />
        </div>
      </details>
      <SubmitButton pendingText="Reading your listing..." className="min-h-12 rounded-full bg-sn-ink text-white hover:bg-sn-ink/90">
        <WandSparkles size={16} aria-hidden="true" />
        Fill in my guide
      </SubmitButton>
      <p className="text-xs leading-5 text-sn-muted">
        We never invent private details like Wi-Fi passwords or lockbox codes. Check each section before guests use it.
      </p>
    </form>
  );
}

const moduleGroups: Array<{ title: string; hint: string; ids: ModuleId[] }> = [
  { title: "Essentials", hint: "What every guest needs", ids: ["welcome", "wifi", "checkin", "contact"] },
  { title: "Make them feel at home", hint: "Photos, rules and your local tips", ids: ["photos", "rules", "restaurants", "activities", "essentials"] },
  { title: "Reviews and help", hint: "Review links, AI concierge and safety", ids: ["reviews", "ai", "emergency"] }
];

function ModulesScreen({
  property,
  setupItems,
  openModule
}: {
  property: Property;
  setupItems: SetupItem[];
  activeModule: ModuleId;
  openModule: (id: ModuleId) => void;
}) {
  return (
    <div className="space-y-6">
      {moduleGroups.map((group) => {
        const doneCount = group.ids.filter((id) => setupItems.find((item) => item.id === id)?.done).length;
        return (
          <section key={group.title}>
            <div className="mb-2 flex items-end justify-between gap-3 px-1">
              <div>
                <h2 className="text-base font-bold tracking-tight">{group.title}</h2>
                <p className="text-xs text-sn-muted">{group.hint}</p>
              </div>
              <span className="text-xs font-semibold tabular-nums text-sn-muted">
                {doneCount}/{group.ids.length} done
              </span>
            </div>
            <ul className="divide-y divide-sn-line/8 overflow-hidden rounded-[22px] border border-sn-line/10 bg-sn-surface">
              {group.ids.map((id) => {
                const info = moduleCopy[id];
                const Icon = info.icon;
                const done = Boolean(setupItems.find((item) => item.id === id)?.done);
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => openModule(id)}
                      className="group flex min-h-[68px] w-full items-center gap-3 px-4 text-left transition hover:bg-sn-canvas focus:outline-none focus-visible:bg-sn-canvas focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sn-accent/40"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sn-canvas text-sn-ink">
                        <Icon size={18} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold">{info.title}</span>
                        <span className="block truncate text-xs text-sn-muted">{done ? shortText(info.preview(property), info.subtitle) : info.subtitle}</span>
                      </span>
                      {done ? (
                        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-sn-accent">
                          <Check size={14} aria-hidden="true" /> Done
                        </span>
                      ) : (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-sn-ink px-3 py-1 text-xs font-semibold text-white">
                          <Plus size={13} aria-hidden="true" /> Add
                        </span>
                      )}
                      <ChevronRight size={16} className="shrink-0 text-sn-muted transition group-hover:translate-x-0.5" aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function DesignScreen({
  property,
  onSaveDesign,
  saving
}: {
  property: Property;
  onSaveDesign: (formData: FormData) => void;
  saving: boolean;
}) {
  const [selectedThemeId, setSelectedThemeId] = useState<GuideThemeId>(getGuideTheme(property.templateId).id);
  const selectedTheme = useMemo(() => getGuideTheme(selectedThemeId), [selectedThemeId]);
  const [accentColor, setAccentColor] = useState(property.accentColor || selectedTheme.defaults.accentColor);
  const [designSerif, setDesignSerif] = useState(property.designSerif ?? selectedTheme.defaults.serifHeading);
  const [designRounded, setDesignRounded] = useState(property.designRounded ?? selectedTheme.defaults.roundedCards);

  useEffect(() => {
    const nextTheme = getGuideTheme(property.templateId);
    setSelectedThemeId(nextTheme.id);
    setAccentColor(property.accentColor || nextTheme.defaults.accentColor);
    setDesignSerif(property.designSerif ?? nextTheme.defaults.serifHeading);
    setDesignRounded(property.designRounded ?? nextTheme.defaults.roundedCards);
  }, [property.id, property.templateId, property.accentColor, property.designSerif, property.designRounded]);

  useEffect(() => {
    if (!selectedTheme.accentOptions.includes(accentColor)) {
      setAccentColor(selectedTheme.defaults.accentColor);
    }
  }, [accentColor, selectedTheme]);

  const canSave = Boolean(property.id);
  function chooseTheme(themeId: GuideThemeId) {
    const nextTheme = getGuideTheme(themeId);
    setSelectedThemeId(nextTheme.id);
    setAccentColor(nextTheme.defaults.accentColor);
    setDesignSerif(nextTheme.defaults.serifHeading);
    setDesignRounded(nextTheme.defaults.roundedCards);
  }

  const savedTheme = getGuideTheme(property.templateId);
  const savedAccent = savedTheme.accentOptions.includes(property.accentColor) ? property.accentColor : savedTheme.defaults.accentColor;
  const dirty =
    selectedThemeId !== savedTheme.id ||
    accentColor !== savedAccent ||
    designSerif !== (property.designSerif ?? savedTheme.defaults.serifHeading) ||
    designRounded !== (property.designRounded ?? savedTheme.defaults.roundedCards);

  return (
    <div className="space-y-5 pb-24 lg:pb-0">
      <section>
        <div className="-mx-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:overflow-visible lg:px-0">
          <div className="flex w-max gap-3 lg:grid lg:w-auto lg:grid-cols-2">
            {guideThemes.map((theme) => (
              <TemplateChoiceCard
                key={theme.id}
                theme={theme}
                property={property}
                selected={selectedThemeId === theme.id}
                accentColor={selectedThemeId === theme.id ? accentColor : theme.defaults.accentColor}
                designSerif={selectedThemeId === theme.id ? designSerif : theme.defaults.serifHeading}
                designRounded={selectedThemeId === theme.id ? designRounded : theme.defaults.roundedCards}
                onSelect={() => chooseTheme(theme.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[22px] border border-sn-line/10 bg-sn-surface p-5">
        <h2 className="text-base font-bold tracking-tight">Fine-tune {selectedTheme.name}</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-start">
          <fieldset>
            <legend className="text-xs font-semibold text-sn-muted">Accent colour</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedTheme.accentOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setAccentColor(color)}
                  aria-label={`Accent colour ${color}`}
                  aria-pressed={accentColor === color}
                  className={`grid h-10 w-10 place-items-center rounded-full ring-offset-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sn-accent/50 ${accentColor === color ? "ring-2 ring-sn-ink" : "ring-1 ring-sn-line/15"}`}
                  style={{ backgroundColor: color }}
                >
                  {accentColor === color ? <Check size={16} className="text-white mix-blend-difference" aria-hidden="true" /> : null}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-2">
            {[
              { label: "Elegant serif headings", value: designSerif, set: setDesignSerif },
              { label: "Rounded cards", value: designRounded, set: setDesignRounded }
            ].map((option) => (
              <label key={option.label} className="flex min-h-10 cursor-pointer items-center justify-between gap-4 text-sm font-medium">
                {option.label}
                <span className="relative inline-flex">
                  <input type="checkbox" checked={option.value} onChange={(event) => option.set(event.target.checked)} className="peer sr-only" />
                  <span className="h-6 w-11 rounded-full bg-sn-line/15 transition peer-checked:bg-sn-accent peer-focus-visible:ring-2 peer-focus-visible:ring-sn-accent/40" />
                  <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                </span>
              </label>
            ))}
          </div>
        </div>
      </section>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSaveDesign(new FormData(event.currentTarget));
        }}
        className={`fixed inset-x-4 bottom-[104px] z-30 flex items-center justify-between gap-3 rounded-full border border-sn-line/10 bg-white/95 py-2 pl-5 pr-2 shadow-[0_18px_50px_rgba(17,24,39,0.16)] backdrop-blur-xl transition lg:sticky lg:inset-x-auto lg:bottom-6 ${
          dirty || saving ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
        aria-hidden={!dirty && !saving}
      >
        <input type="hidden" name="propertyId" value={property.id} />
        <input type="hidden" name="templateId" value={selectedThemeId} />
        <input type="hidden" name="accentColor" value={accentColor} />
        {designSerif ? <input type="hidden" name="designSerif" value="1" /> : null}
        {designRounded ? <input type="hidden" name="designRounded" value="1" /> : null}
        <p className="min-w-0 truncate text-sm font-medium">
          {canSave ? <>Not applied yet: <span className="font-semibold">{selectedTheme.name}</span></> : "Create your guide first, then pick a style."}
        </p>
        <InlineSaveButton saving={saving} savingText="Applying..." disabled={!canSave} className="min-h-11 shrink-0 rounded-full bg-sn-ink px-6 text-white disabled:opacity-50">
          Apply
        </InlineSaveButton>
      </form>
    </div>
  );
}

function TemplateChoiceCard({
  theme,
  property,
  selected,
  accentColor,
  designSerif,
  designRounded,
  onSelect
}: {
  theme: GuideTheme;
  property: Property;
  selected: boolean;
  accentColor: string;
  designSerif: boolean;
  designRounded: boolean;
  onSelect: () => void;
}) {
  const shellClass =
    theme.layout === "darkLuxury"
      ? "border-[#D6AF6F]/24 bg-[#0B1218] text-[#F7F0E2] shadow-[0_28px_86px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.08)]"
      : theme.layout === "modern"
        ? "border-[#111827]/8 bg-[#FFFFFF] text-[#111827] shadow-[0_1px_2px_rgba(17,24,39,0.04)]"
        : theme.layout === "mediterranean"
          ? "border-[#6FA1AD]/18 bg-[#FBFAF4] text-[#18313A] shadow-[0_24px_70px_rgba(64,99,112,0.12),inset_0_1px_0_rgba(255,255,255,0.92)]"
          : "border-[#D8C8AE]/60 bg-[#F7EFE3] text-[#1F2326] shadow-[0_24px_70px_rgba(76,55,37,0.13),inset_0_1px_0_rgba(255,255,255,0.9)]";
  const selectedClass =
    theme.layout === "darkLuxury"
      ? "ring-4 ring-[#D6AF6F]/18 border-[#D6AF6F]/55"
      : theme.layout === "modern"
        ? "ring-4 ring-[#111827]/8 border-[#111827]/28"
        : theme.layout === "mediterranean"
          ? "ring-4 ring-[#6FA1AD]/16 border-[#6FA1AD]/42"
          : "ring-4 ring-[#9B7C4B]/16 border-[#9B7C4B]/42";
  const mutedClass = "opacity-60";
  const pillClass =
    theme.layout === "darkLuxury"
      ? "bg-[#D6AF6F]/10 text-[#D6AF6F] ring-1 ring-[#D6AF6F]/18"
      : theme.layout === "modern"
        ? "bg-[#F4F6F8] text-[#65707C]"
        : theme.layout === "mediterranean"
          ? "bg-[#EAF3F1] text-[#4F8793] ring-1 ring-[#6FA1AD]/14"
          : "bg-[#FFF9EF] text-[#9B7C4B] ring-1 ring-[#9B7C4B]/12";

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onSelect();
      }}
      className={`w-[282px] shrink-0 cursor-pointer rounded-[28px] border p-3 transition duration-200 hover:-translate-y-1 lg:w-auto ${shellClass} ${
        selected ? selectedClass : ""
      }`}
    >
      <div className="relative">
        {selected ? (
          <span className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full text-white shadow-[0_1px_2px_rgba(17,24,39,0.04)]" style={{ backgroundColor: accentColor }}>
            <Check size={16} />
          </span>
        ) : null}
        <TemplatePhonePreview
          theme={theme}
          property={property}
          accentColor={accentColor}
          designSerif={designSerif}
          designRounded={designRounded}
          compact
        />
      </div>

      <div className="px-1 pb-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold tracking-tight">{theme.name}</h2>
            <p className={`mt-1 min-h-[40px] text-xs font-semibold leading-5 ${mutedClass}`}>{theme.description}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex -space-x-1">
            {theme.palette.map((color) => (
              <span key={color} className="h-5 w-5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: color }} />
            ))}
          </div>
          <button type="button" onClick={(event) => { event.stopPropagation(); onSelect(); }} className={`rounded-full px-3 py-2 text-xs font-bold ${pillClass}`}>
            Preview
          </button>
        </div>
        <p className={`mt-3 rounded-[14px] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] ${pillClass}`}>
          Best for: {theme.bestFor}
        </p>
      </div>
    </article>
  );
}

function TemplatePhonePreview({
  theme,
  property,
  accentColor,
  designSerif,
  designRounded,
  compact = false
}: {
  theme: GuideTheme;
  property: Property;
  accentColor: string;
  designSerif: boolean;
  designRounded: boolean;
  compact?: boolean;
}) {
  const style = guideThemeStyle(theme, { accentColor, designSerif, designRounded }) as React.CSSProperties;
  const displayName = property.name || theme.preview.propertyName;
  const previewCards: Array<{ title: string; subtitle: string; icon: typeof Home }> = [
    { title: "Wi-Fi", subtitle: "Connect", icon: Wifi },
    { title: "Contact", subtitle: "We are here", icon: Phone },
    { title: "Check-in", subtitle: "Arrival", icon: KeyRound },
    { title: "House Guide", subtitle: "About", icon: Home }
  ];
  const heightClass = compact ? "h-[388px]" : "h-[520px]";

  function PreviewLogo({ small = false }: { small?: boolean }) {
    return (
      <div
        className={`${small ? "h-9 w-9 rounded-[13px]" : "h-12 w-12 rounded-[18px]"} grid shrink-0 place-items-center overflow-hidden p-1 text-[10px] font-bold text-[var(--guide-text)] shadow-[0_12px_34px_rgba(0,0,0,0.16)] ring-1 ring-[var(--guide-card-border)]`}
        style={{ background: "var(--guide-elevated-bg)" }}
      >
        {property.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={property.logoUrl} alt="" className="h-full w-full rounded-[inherit] object-cover" />
        ) : (
          theme.preview.logoText
        )}
      </div>
    );
  }

  function HeroLayer({ className = "" }: { className?: string }) {
    return (
      <div className={`${/\b(absolute|fixed)\b/.test(className) ? "" : "relative "}overflow-hidden ${className}`} style={{ background: theme.preview.heroBackground }}>
        {property.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={property.coverImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ filter: "var(--guide-hero-image-filter)" }} />
        ) : null}
        {theme.layout === "modern" && property.coverImageUrl ? null : <div className="absolute inset-0" style={{ background: "var(--guide-hero-overlay)" }} />}
      </div>
    );
  }

  function MiniMenu({ variant = theme.layout }: { variant?: GuideTheme["layout"] }) {
    return (
      <>
        {previewCards.map((item) => {
          const Icon = item.icon;
          if (variant === "modern") {
            return (
              <div
                key={item.title}
                className="flex min-h-[54px] items-center gap-2 rounded-[var(--guide-card-radius)] border border-[var(--guide-card-border)] px-3 text-left shadow-[var(--guide-card-shadow)] backdrop-blur-xl"
                style={{ background: "var(--guide-card-bg)", boxShadow: "var(--guide-card-shadow), var(--guide-card-inset-shadow)", backdropFilter: "var(--guide-card-backdrop)" }}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[var(--guide-icon-radius)] text-[var(--guide-accent)]" style={{ background: "var(--guide-icon-bg)" }}>
                  <Icon size={13} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[11px] font-bold">{item.title}</span>
                  <span className="block truncate text-[9px] font-semibold text-[var(--guide-muted)]">{item.subtitle}</span>
                </span>
              </div>
            );
          }

          return (
            <div
              key={item.title}
              className={`${compact ? "min-h-[74px] p-3" : "min-h-[108px] p-4"} rounded-[var(--guide-card-radius)] border border-[var(--guide-card-border)] ${variant === "darkLuxury" ? "text-left" : "text-center"} shadow-[var(--guide-card-shadow)] backdrop-blur-xl`}
              style={{ background: "var(--guide-card-bg)", boxShadow: "var(--guide-card-shadow), var(--guide-card-inset-shadow)", backdropFilter: "var(--guide-card-backdrop)" }}
            >
              <span className={`${compact ? "h-8 w-8" : "h-11 w-11"} ${variant === "darkLuxury" ? "" : "mx-auto"} grid place-items-center rounded-[var(--guide-icon-radius)] text-[var(--guide-accent)] shadow-[var(--guide-icon-shadow)]`} style={{ background: "var(--guide-icon-bg)" }}>
                <Icon size={compact ? 14 : 17} />
              </span>
              <p className={`${compact ? "mt-2 text-[11px]" : "mt-3 text-sm"} font-bold`}>{item.title}</p>
              <p className={`${compact ? "text-[10px]" : "text-xs"} mt-1 font-semibold text-[var(--guide-muted)]`}>{item.subtitle}</p>
            </div>
          );
        })}
      </>
    );
  }

  if (theme.layout === "modern") {
    return (
      <div style={{ ...style, background: "var(--guide-shell-bg)" }} className={`${heightClass} overflow-hidden rounded-[var(--guide-shell-radius)] text-[var(--guide-text)] shadow-[var(--guide-shell-shadow)] ring-1 ring-black/5`}>
        <header className={`${compact ? "px-4 py-3" : "px-5 py-4"} flex items-center justify-between border-b border-[var(--guide-section-divider)]`}>
          <div className="flex items-center gap-2">
            <PreviewLogo small={compact} />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--guide-muted)]">Stay guide</p>
              <p className={`${compact ? "text-xs" : "text-sm"} font-bold`}>{displayName}</p>
            </div>
          </div>
          <span className="rounded-full border border-[var(--guide-card-border)] px-2.5 py-1 text-[9px] font-bold backdrop-blur-xl" style={{ background: "var(--guide-language-bg)", color: "var(--guide-language-text)" }}>EN</span>
        </header>
        <section className={`${compact ? "p-4" : "p-5"}`}>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--guide-accent)]">{theme.preview.eyebrow}</p>
          <h3 className={`${compact ? "mt-2 text-2xl" : "mt-3 text-3xl"} font-bold leading-[0.95] tracking-tight`} style={{ fontFamily: "var(--guide-heading-font)" }}>
            Welcome to {displayName}
          </h3>
          <HeroLayer className={`${compact ? "mt-3 h-28" : "mt-4 h-36"} rounded-[var(--guide-hero-radius)]`} />
        </section>
        <section className={`${compact ? "px-4" : "px-5"} grid gap-2`}>
          <MiniMenu variant="modern" />
        </section>
      </div>
    );
  }

  if (theme.layout === "mediterranean") {
    return (
      <div style={{ ...style, background: "var(--guide-shell-bg)" }} className={`${heightClass} overflow-hidden rounded-[var(--guide-shell-radius)] p-3 text-[var(--guide-text)] shadow-[var(--guide-shell-shadow)] ring-1 ring-black/5`}>
        <header className="mb-3 flex items-center justify-between">
          <PreviewLogo small={compact} />
          <span className="rounded-full border border-[var(--guide-card-border)] px-2.5 py-1 text-[9px] font-bold backdrop-blur-xl" style={{ background: "var(--guide-language-bg)", color: "var(--guide-language-text)" }}>EN</span>
        </header>
        <section className="relative overflow-hidden rounded-[var(--guide-hero-radius)]">
          <HeroLayer className={compact ? "h-32" : "h-44"} />
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/82">{theme.preview.eyebrow}</p>
            <h3 className={`${compact ? "text-2xl" : "text-4xl"} font-semibold leading-none`} style={{ fontFamily: "var(--guide-heading-font)" }}>{displayName}</h3>
          </div>
        </section>
        <section className={`${compact ? "mt-3 gap-2" : "mt-4 gap-3"} grid grid-cols-2`}>
          <MiniMenu variant="mediterranean" />
        </section>
      </div>
    );
  }

  if (theme.layout === "darkLuxury") {
    return (
      <div style={{ ...style, background: "var(--guide-shell-bg)" }} className={`${heightClass} overflow-hidden rounded-[var(--guide-shell-radius)] text-[var(--guide-text)] shadow-[var(--guide-shell-shadow)] ring-1 ring-[#D6AF6F]/20`}>
        <section className={`${compact ? "h-40" : "h-56"} relative overflow-hidden`}>
          <HeroLayer className="absolute inset-0" />
          <div className={`${compact ? "p-4" : "p-5"} relative flex h-full flex-col justify-between`}>
            <div className="flex items-start justify-between">
              <PreviewLogo small={compact} />
              <span className="rounded-full border border-[#D6AF6F]/28 px-2.5 py-1 text-[9px] font-bold backdrop-blur-xl" style={{ background: "var(--guide-language-bg)", color: "var(--guide-language-text)" }}>EN</span>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[var(--guide-accent)]">{theme.preview.eyebrow}</p>
              <h3 className={`${compact ? "text-3xl" : "text-4xl"} font-semibold leading-none`} style={{ fontFamily: "var(--guide-heading-font)" }}>{displayName}</h3>
            </div>
          </div>
        </section>
        <section className={`${compact ? "gap-2 p-3" : "gap-3 p-4"} grid grid-cols-2`}>
          <MiniMenu variant="darkLuxury" />
        </section>
      </div>
    );
  }

  return (
    <div style={{ ...style, background: "var(--guide-shell-bg)" }} className={`${heightClass} overflow-hidden rounded-[var(--guide-shell-radius)] text-[var(--guide-text)] shadow-[var(--guide-shell-shadow)] ring-1 ring-black/5`}>
      <section className={`${compact ? "h-44" : "h-64"} relative overflow-hidden`}>
        <HeroLayer className="absolute inset-0" />
        <div className={`${compact ? "p-4" : "p-5"} relative flex h-full flex-col justify-between text-white`}>
          <div className="flex items-start justify-between gap-3">
            <PreviewLogo small={compact} />
            <span className="rounded-full px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl" style={{ background: "var(--guide-language-bg)", color: "var(--guide-language-text)" }}>EN</span>
          </div>
          <div>
            <p className={`${compact ? "text-sm" : "text-xl"} leading-tight`} style={{ fontFamily: "var(--guide-heading-font)" }}>Welcome to</p>
            <h3 className={`${compact ? "text-2xl" : "text-4xl"} font-bold leading-none`} style={{ fontFamily: "var(--guide-heading-font)" }}>{displayName}</h3>
            <p className={`${compact ? "mt-2 text-[11px] leading-4" : "mt-4 text-sm leading-6"} max-w-[260px] font-semibold text-white/82`}>Your polished mobile guide for Wi-Fi, arrival, house info and more.</p>
          </div>
        </div>
      </section>

      <section className={`${compact ? "grid-cols-2 gap-2 p-3" : "grid-cols-2 gap-3 p-5"} grid`}>
        <MiniMenu variant="classic" />
      </section>
    </div>
  );
}

function SettingsScreen({
  property,
  publicUrl,
  qrCode,
  planName,
  selectedPlan,
  billingAccess
}: {
  property: Property;
  publicUrl: string;
  qrCode: string;
  planName: string;
  selectedPlan: string;
  billingAccess: boolean;
}) {
  const currentPlan = planOption(selectedPlan);
  const billingHref = `${BILLING_BASE_URL}/billing?plan=${encodeURIComponent(selectedPlan)}`;

  return (
    <div className="space-y-4">
      {publicUrl ? (
        <>
          <ShareCard property={property} publicUrl={publicUrl} qrCode={qrCode} billingAccess={billingAccess} />
          <section className="rounded-[22px] border border-sn-line/10 bg-sn-surface p-5">
            <p className="text-xs font-semibold text-sn-muted">Your guest link</p>
            <p className="mt-1 break-all text-sm font-semibold">{publicUrl}</p>
            <p className="mt-2 text-xs leading-5 text-sn-muted">This link and the QR code never change, even when you edit the guide.</p>
          </section>
        </>
      ) : (
        <section className="rounded-[22px] border border-sn-line/10 bg-sn-surface p-5">
          <h2 className="text-base font-bold">Your link and QR code appear here</h2>
          <p className="mt-1 text-sm text-sn-muted">Create your guide on the Home tab first.</p>
        </section>
      )}

      <section className="rounded-[22px] border border-sn-line/10 bg-sn-surface p-5">
        <h2 className="text-base font-bold tracking-tight">Subscription</h2>
        <div className="mt-3 flex flex-col gap-4 rounded-2xl bg-sn-canvas p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">
              {planName} · {currentPlan.price} per year
            </p>
            <p className="mt-0.5 text-xs leading-5 text-sn-muted">Guide, QR code, review links and AI concierge included.</p>
          </div>
          <a
            href={billingAccess ? `${BILLING_BASE_URL}/billing` : billingHref}
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-sn-ink px-5 text-sm font-semibold text-white transition hover:bg-sn-ink/90"
          >
            {billingAccess ? "Manage billing" : "Subscribe"}
          </a>
        </div>
        <p className="mt-3 text-xs text-sn-muted">Payments are handled securely by Paddle.</p>
      </section>
    </div>
  );
}

const sheetHints: Record<ModuleId, string> = {
  welcome: "The first thing guests read when they scan.",
  photos: "Your logo and one photo of the place.",
  wifi: "Guests copy the password with one tap.",
  checkin: "How to get in, and what to do when leaving.",
  rules: "Short and friendly works best.",
  restaurants: "Your favourite places to eat and drink.",
  activities: "Beaches, walks, tours and sights.",
  essentials: "Pharmacy, supermarket, ATM, petrol.",
  contact: "Guests can call or WhatsApp you from the guide.",
  emergency: "Who to call when something goes wrong.",
  ai: "The concierge answers guests only from what you write here and in the guide.",
  reviews: "Happy guests can leave a review in one tap."
};

function ModuleSheet({
  property,
  activeModule,
  onClose,
  onSaveProperty,
  onSaveRecommendationsBulk,
  onSaveReviewLinks,
  savingKey
}: {
  property: Property;
  activeModule: ModuleId;
  onClose: () => void;
  onSaveProperty: (formData: FormData) => void;
  onSaveRecommendationsBulk: (formData: FormData, fallbackCategory: string) => void;
  onSaveReviewLinks: (formData: FormData) => void;
  savingKey: string;
}) {
  const info = moduleCopy[activeModule];
  const Icon = info.icon;
  const isPlaceModule = activeModule === "restaurants" || activeModule === "activities" || activeModule === "essentials";
  const isPropertyModule = !isPlaceModule && activeModule !== "reviews";
  const defaultCategory: PlaceRecommendationCategory = activeModule === "restaurants" ? "restaurant" : activeModule === "essentials" ? "pharmacy" : "attraction";
  const visibleRecommendations = useMemo(
    () => (activeModule === "restaurants" ? restaurantItems(property) : activeModule === "essentials" ? essentialItems(property) : activityItems(property)),
    [activeModule, property]
  );
  const [recommendationDrafts, setRecommendationDrafts] = useState<PlaceRecommendationDraft[]>([]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (!isPlaceModule) return;
    setRecommendationDrafts(
      visibleRecommendations.length
        ? visibleRecommendations.map((item) => createRecommendationDraft(item, defaultCategory))
        : []
    );
  }, [activeModule, visibleRecommendations, defaultCategory, isPlaceModule]);

  function updateRecommendationDraft(clientId: string, patch: Partial<PlaceRecommendationDraft>) {
    setRecommendationDrafts((drafts) => drafts.map((draft) => (draft.clientId === clientId ? { ...draft, ...patch } : draft)));
  }

  function removeRecommendationDraft(clientId: string) {
    setRecommendationDrafts((drafts) => drafts.filter((draft) => draft.clientId !== clientId));
  }

  return (
    <div className="dashboard-sheet-overlay fixed inset-0 z-50 flex flex-col justify-end bg-sn-ink/40 backdrop-blur-sm lg:flex-row lg:justify-end" role="dialog" aria-modal="true" aria-labelledby="module-sheet-title">
      <button type="button" aria-label="Close editor" tabIndex={-1} className="absolute inset-0" onClick={onClose} />
      <section className="dashboard-sheet-panel relative flex h-[calc(100dvh-12px)] w-full flex-col overflow-y-auto rounded-t-[26px] bg-sn-surface px-5 pb-5 pt-2 shadow-[0_-30px_90px_rgba(17,24,39,0.28)] lg:h-full lg:max-w-[560px] lg:rounded-none lg:rounded-l-[28px] lg:px-8 lg:pt-7">
        <div className="mx-auto h-1.5 w-10 shrink-0 rounded-full bg-sn-line/15 lg:hidden" aria-hidden="true" />
        <div className="mt-3 flex items-start justify-between gap-3 lg:mt-0">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sn-canvas text-sn-ink">
              <Icon size={20} aria-hidden="true" />
            </span>
            <div>
              <h2 id="module-sheet-title" className="text-xl font-extrabold tracking-tight">{info.title}</h2>
              <p className="text-sm text-sn-muted">{sheetHints[activeModule]}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sn-canvas text-sn-ink transition hover:bg-sn-line/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sn-accent/40"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 flex-1">
          {isPropertyModule ? (
            <form
              onSubmit={(event: FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                onSaveProperty(new FormData(event.currentTarget));
              }}
              className="space-y-4"
            >
              <input type="hidden" name="propertyId" value={property.id} />
              <input type="hidden" name="accentColor" value={property.accentColor || "#5D9C9A"} />

              <div className="overflow-hidden rounded-[20px] border border-sn-line/10 bg-sn-surface">
                {activeModule === "photos" ? (
                  <div className="grid gap-3 p-4">
                    <div className="grid gap-4">
                      <ImageUploadField label="Property logo" fileName="logoFile" urlName="logoUrl" removeName="removeLogo" currentUrl={property.logoUrl} />
                      <ImageUploadField label="Property photo" fileName="coverImageFile" urlName="coverImageUrl" removeName="removeCoverImage" currentUrl={property.coverImageUrl} />
                    </div>
                  </div>
                ) : null}

                {activeModule === "welcome" ? (
                  <div className="grid gap-0 divide-y divide-sn-line/8">
                    <div className="p-4">
                      <Field label="Property name">
                        <input name="name" className={`${inputClass} bg-sn-canvas`} defaultValue={property.name} placeholder="Your property name" required />
                      </Field>
                    </div>
                    <div className="p-4">
                    <Field label="Welcome note">
                      <textarea name="welcomeMessage" className={`${textareaClass} min-h-28 bg-sn-canvas`} defaultValue={property.welcomeMessage} placeholder="Welcome! We are happy to have you. Everything you need for your stay is in this guide." />
                    </Field>
                    </div>
                  </div>
                ) : null}

                {activeModule === "wifi" ? (
                  <div className="grid gap-0 divide-y divide-sn-line/8">
                    <div className="p-4">
                      <Field label="Network">
                        <input name="wifiName" className={`${inputClass} bg-sn-canvas`} defaultValue={property.wifiName || ""} placeholder="VillaSunset_Guest" autoComplete="off" />
                      </Field>
                    </div>
                    <div className="p-4">
                      <Field label="Password">
                        <input name="wifiPassword" className={`${inputClass} bg-sn-canvas`} defaultValue={property.wifiPassword || ""} placeholder="The password guests type" autoComplete="off" />
                      </Field>
                    </div>
                  </div>
                ) : null}

                {activeModule === "checkin" ? (
                  <div className="grid gap-0 divide-y divide-sn-line/8">
                    <div className="p-4">
                      <Field label="Check-in">
                        <textarea name="checkInInfo" className={`${textareaClass} min-h-28 bg-sn-canvas`} defaultValue={property.checkInInfo || ""} placeholder="Check-in from 15:00. The key box is left of the door; we send the code the day before." />
                      </Field>
                    </div>
                    <div className="p-4">
                      <Field label="Checkout">
                        <textarea name="checkOutInfo" className={`${textareaClass} min-h-24 bg-sn-canvas`} defaultValue={property.checkOutInfo || ""} placeholder="Check-out by 10:00. Leave the keys in the box and close the windows." />
                      </Field>
                    </div>
                  </div>
                ) : null}

                {activeModule === "rules" ? (
                  <div className="grid gap-0 divide-y divide-sn-line/8">
                    <div className="p-4">
                      <Field label="House rules">
                        <textarea name="houseRules" className={`${textareaClass} min-h-28 bg-sn-canvas`} defaultValue={property.houseRules || ""} placeholder="Quiet hours 22:00 to 08:00. No smoking inside. No parties." />
                      </Field>
                    </div>
                    <div className="p-4">
                      <Field label="Parking">
                        <textarea name="parkingInfo" className={`${textareaClass} min-h-24 bg-sn-canvas`} defaultValue={property.parkingInfo || ""} placeholder="Free parking in front of the house, one car." />
                      </Field>
                    </div>
                  </div>
                ) : null}

                {activeModule === "contact" ? (
                  <div className="grid gap-0 divide-y divide-sn-line/8">
                    <div className="p-4">
                      <Field label="Your name">
                        <input name="hostContactName" className={`${inputClass} bg-sn-canvas`} defaultValue={property.hostContactName || ""} placeholder="Your first name" />
                      </Field>
                    </div>
                    <div className="grid gap-0 divide-y divide-sn-line/8">
                      <div className="p-4">
                        <Field label="Phone">
                          <input name="hostPhone" type="tel" className={`${inputClass} bg-sn-canvas`} defaultValue={property.hostPhone || ""} placeholder="+389 70 123 456 (also used for WhatsApp)" />
                        </Field>
                      </div>
                      <div className="p-4">
                        <Field label="Email">
                          <input name="hostEmail" type="email" className={`${inputClass} bg-sn-canvas`} defaultValue={property.hostEmail || ""} />
                        </Field>
                      </div>
                    </div>
                  </div>
                ) : null}

                {activeModule === "emergency" ? (
                  <div className="p-4">
                    <Field label="Emergency contact and safety notes">
                      <textarea name="emergencyInfo" className={`${textareaClass} min-h-28 bg-sn-canvas`} defaultValue={property.emergencyInfo || ""} placeholder="Emergency 112. Nearest hospital and pharmacy, and who to call for urgent property issues." />
                    </Field>
                  </div>
                ) : null}

                {activeModule === "ai" ? (
                  <div className="p-4">
                    <Field label="What should the AI concierge know?">
                      <textarea name="aiKnowledge" className={`${textareaClass} min-h-48 bg-sn-canvas`} defaultValue={property.aiKnowledge || ""} placeholder="Anything guests ask you: where the extra towels are, how the coffee machine works, which bin is for recycling, your favourite beach, how to get a taxi." />
                    </Field>
                  </div>
                ) : null}
              </div>

              {activeModule !== "welcome" ? <input type="hidden" name="welcomeMessage" value={property.welcomeMessage || ""} /> : null}
              {activeModule !== "welcome" ? <input type="hidden" name="name" value={property.name} /> : null}
              {activeModule !== "wifi" ? <input type="hidden" name="wifiName" value={property.wifiName || ""} /> : null}
              {activeModule !== "wifi" ? <input type="hidden" name="wifiPassword" value={property.wifiPassword || ""} /> : null}
              {activeModule !== "checkin" ? <input type="hidden" name="checkInInfo" value={property.checkInInfo || ""} /> : null}
              {activeModule !== "checkin" ? <input type="hidden" name="checkOutInfo" value={property.checkOutInfo || ""} /> : null}
              {activeModule !== "rules" ? <input type="hidden" name="parkingInfo" value={property.parkingInfo || ""} /> : null}
              {activeModule !== "rules" ? <input type="hidden" name="houseRules" value={property.houseRules || ""} /> : null}
              {activeModule !== "emergency" ? <input type="hidden" name="emergencyInfo" value={property.emergencyInfo || ""} /> : null}
              {activeModule !== "contact" ? <input type="hidden" name="hostContactName" value={property.hostContactName || ""} /> : null}
              {activeModule !== "contact" ? <input type="hidden" name="hostPhone" value={property.hostPhone || ""} /> : null}
              {activeModule !== "contact" ? <input type="hidden" name="hostEmail" value={property.hostEmail || ""} /> : null}
              {activeModule !== "ai" ? <input type="hidden" name="aiKnowledge" value={property.aiKnowledge || ""} /> : null}

              <div className="sticky bottom-0 -mx-1 bg-gradient-to-t from-sn-surface via-sn-surface to-transparent px-1 pb-1 pt-4">
                <InlineSaveButton saving={savingKey === "property"} savingText="Saving..." className="min-h-12 w-full bg-sn-ink text-[15px] text-white hover:bg-sn-ink/90">
                  <Save size={16} />
                  Save changes
                </InlineSaveButton>
              </div>
            </form>
          ) : activeModule === "reviews" ? (
            <form
              onSubmit={(event: FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                onSaveReviewLinks(new FormData(event.currentTarget));
              }}
              className="space-y-4 rounded-[20px] border border-sn-line/10 bg-sn-surface p-4"
            >
              <input type="hidden" name="propertyId" value={property.id} />
              <input type="hidden" name="booking" value="" />
              <input type="hidden" name="airbnb" value="" />
              <Field label="Google review link">
                <input name="google" type="url" className={`${inputClass} bg-sn-canvas`} defaultValue={getReviewValue(property, "GOOGLE")} placeholder="https://g.page/r/..." />
              </Field>
              <p className="-mt-2 text-xs leading-5 text-sn-muted">
                Where to find it: open your Google Business Profile, tap &ldquo;Ask for reviews&rdquo; and copy the link.
              </p>
              <InlineSaveButton saving={savingKey === "reviews"} savingText="Saving..." className="min-h-12 w-full bg-sn-ink text-[15px] text-white hover:bg-sn-ink/90">
                <Save size={16} />
                Save Google link
              </InlineSaveButton>
            </form>
          ) : (
            <form
              onSubmit={(event: FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                onSaveRecommendationsBulk(new FormData(event.currentTarget), defaultCategory);
              }}
              className="space-y-4"
            >
              <input type="hidden" name="propertyId" value={property.id} />

              <div className="overflow-hidden rounded-[20px] border border-sn-line/10 bg-sn-surface">
                <div className="grid gap-3 border-b border-sn-line/10 bg-sn-canvas px-4 py-3 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5F9D99]">Add place</p>
                    <h3 className="text-base font-bold">
                      {activeModule === "restaurants" ? "Restaurants, cafes and bars" : activeModule === "essentials" ? "Nearby essentials" : "Attractions, beaches and activities"}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRecommendationDrafts((drafts) => [...drafts, createManualPlaceDraft(defaultCategory, drafts.length + 1, activeModule === "essentials")])}
                      className="inline-flex min-h-10 items-center gap-2 rounded-[14px] bg-white px-3 text-xs font-bold text-[#111827] shadow-[0_1px_2px_rgba(17,24,39,0.04)] ring-1 ring-[#172234]/8"
                    >
                      <Link2 size={14} />
                      Add place
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 p-3 lg:p-4">
                  {recommendationDrafts.length ? (
                    recommendationDrafts.map((draft, index) => (
                      <PlaceRecommendationForm
                        key={draft.clientId}
                        draft={draft}
                        label={`${activeModule === "restaurants" ? "Place" : activeModule === "essentials" ? "Essential" : "Activity"} ${index + 1}`}
                        onChange={(patch) => updateRecommendationDraft(draft.clientId, patch)}
                        onRemove={() => removeRecommendationDraft(draft.clientId)}
                      />
                    ))
                  ) : (
                    <div className="rounded-[18px] border border-dashed border-[#172234]/14 bg-sn-canvas px-4 py-8 text-center">
                      <p className="text-sm font-bold text-[#111827]">No {activeModule === "restaurants" ? "places" : activeModule === "essentials" ? "essentials" : "activities"} yet.</p>
                      <p className="mt-1 text-xs font-semibold text-[#111827]/48">Add the name, type, description and link manually.</p>
                      <button
                        type="button"
                        onClick={() => setRecommendationDrafts([createManualPlaceDraft(defaultCategory, 1, activeModule === "essentials")])}
                        className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-[14px] bg-white px-4 text-xs font-bold text-[#111827] shadow-[0_1px_2px_rgba(17,24,39,0.04)] ring-1 ring-[#172234]/8"
                      >
                        <Link2 size={14} />
                        Add place
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="sticky bottom-0 -mx-1 bg-gradient-to-t from-sn-surface via-sn-surface to-transparent px-1 pb-1 pt-4">
                <InlineSaveButton saving={savingKey === `recommendations:${defaultCategory}`} savingText="Saving..." className="min-h-12 w-full bg-sn-ink text-[15px] text-white hover:bg-sn-ink/90">
                  <Save size={16} />
                  Save {activeModule === "restaurants" ? "places" : activeModule === "essentials" ? "essentials" : "activities"}
                </InlineSaveButton>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
