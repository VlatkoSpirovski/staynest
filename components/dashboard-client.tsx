"use client";

import { type FormEvent, useEffect, useMemo, useState, useTransition } from "react";
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
  Wifi
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

const tabs: Array<{ id: TabId; label: string; icon: typeof Home }> = [
  { id: "setup", label: "Setup", icon: BadgeCheck },
  { id: "modules", label: "Modules", icon: BedDouble },
  { id: "design", label: "Design", icon: Palette },
  { id: "settings", label: "Settings", icon: Settings }
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
    accent: "bg-[#F3F4F6] text-[#374151] ring-1 ring-[#172234]/10 shadow-[0_12px_26px_rgba(17,24,39,0.06)]"
  },
  photos: {
    title: "Photos",
    subtitle: "Logo and cover",
    preview: (property) => (property.logoUrl && property.coverImageUrl ? "Brand visuals ready" : "Upload logo and property photo"),
    icon: ImageIcon,
    accent: "bg-[#EEF2F6] text-[#24364C] ring-1 ring-[#172234]/10 shadow-[0_12px_26px_rgba(17,24,39,0.06)]"
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
    accent: "bg-[#EEF2F6] text-[#24364C] ring-1 ring-[#172234]/10 shadow-[0_12px_26px_rgba(17,24,39,0.06)]"
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
    accent: "bg-[#EEF2F6] text-[#374151] ring-1 ring-[#172234]/10 shadow-[0_12px_26px_rgba(17,24,39,0.06)]"
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
    accent: "bg-[#FEF2F2] text-[#991B1B] ring-1 ring-[#FECACA]/80 shadow-[0_12px_26px_rgba(17,24,39,0.06)]"
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

/**
 * Trial and billing state, shown above the workspace.
 *
 * Owners now reach the dashboard without entering a card, so this bar is the only
 * place the trial is visible and the only prompt to subscribe. It escalates as the
 * trial runs down and disappears entirely once a subscription is active.
 */
function TrialStatusBar({
  subscriptionStatus,
  trialDaysLeft,
  trialLabel,
  selectedPlan
}: {
  subscriptionStatus: string | null;
  trialDaysLeft: number | null;
  trialLabel: string | null;
  selectedPlan: string;
}) {
  const status = subscriptionStatus?.toUpperCase();
  if (status === "ACTIVE") return null;

  const billingHref = `${BILLING_BASE_URL}/billing?plan=${encodeURIComponent(selectedPlan)}`;
  const expired = status !== "TRIALING" || trialDaysLeft === null || trialDaysLeft <= 0;
  const urgent = !expired && trialDaysLeft !== null && trialDaysLeft <= 3;

  const tone = expired
    ? "border-red-200 bg-red-50 text-red-800"
    : urgent
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : "border-[#172234]/10 bg-white text-[#111827]";

  const headline = expired
    ? "Your free trial has ended"
    : trialDaysLeft === 1
      ? "1 day left in your free trial"
      : `${trialDaysLeft} days left in your free trial`;

  const detail = expired
    ? "Add a payment method to put your guide back online for guests."
    : trialLabel
      ? `Your guide stays live after ${trialLabel} once you add a payment method.`
      : "Add a payment method whenever you are ready — nothing is charged until the trial ends.";

  return (
    <div className={`mb-4 flex flex-col gap-3 rounded-[18px] border px-4 py-3 shadow-[0_16px_42px_rgba(17,24,39,0.05)] sm:flex-row sm:items-center sm:justify-between ${tone}`}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0">
          {expired ? <AlertCircle size={18} /> : <Sparkles size={18} />}
        </span>
        <div>
          <p className="text-sm font-black">{headline}</p>
          <p className="mt-0.5 text-xs font-semibold opacity-80">{detail}</p>
        </div>
      </div>
      <a
        href={billingHref}
        className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-[14px] bg-[#111827] px-4 text-sm font-black text-white transition hover:bg-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#111827]/40 focus:ring-offset-2"
      >
        {expired ? "Reactivate guide" : "Add payment method"}
      </a>
    </div>
  );
}

function StayNestLogoMark() {
  return (
    <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-[18px] bg-[#F8F3EA] shadow-[0_16px_38px_rgba(17,24,39,0.14),inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-[#172234]/8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/staynest-logo.png" alt="StayNest" className="h-full w-full object-cover" />
    </div>
  );
}

function StayNestHeaderTitle() {
  return (
    <div className="text-center">
      <p className="text-lg font-black leading-none tracking-tight text-[#111827]">StayNest</p>
      <p className="mt-1 text-[9px] font-black uppercase tracking-[0.22em] text-[#5F9D99]">Host app</p>
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
    isFirstVisit,
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

  const completion = Math.round((setupItems.filter((item) => item.done).length / setupItems.length) * 100);
  const missingItems = setupItems.filter((item) => !item.done).slice(0, 3);
  const quickActions = missingItems.length ? missingItems : setupItems.slice(1, 4);

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
      message: "Guest experience saved.",
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
      message: "Template updated successfully.",
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
      message: "Review path saved.",
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
    <main className="min-h-screen overflow-x-hidden bg-white text-[#111827]">
      <div className="fixed inset-0 -z-10 bg-white" />

      <header className="sticky top-0 z-40 border-b border-[#172234]/6 bg-white/90 px-4 py-3 shadow-[0_10px_36px_rgba(17,24,39,0.04)] backdrop-blur-2xl lg:px-8">
        <div className="relative mx-auto flex max-w-5xl items-center justify-between">
          <StayNestLogoMark />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <StayNestHeaderTitle />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPropertyMenuOpen((open) => !open)}
              aria-label="Open account menu"
              className="grid h-11 w-11 place-items-center rounded-[18px] bg-[#111827] text-xs font-black text-white shadow-[0_18px_44px_rgba(17,24,39,0.28),inset_0_1px_0_rgba(255,255,255,0.12)] transition hover:bg-[#162033] focus:outline-none focus:ring-2 focus:ring-[#5F9D99]/35 focus:ring-offset-2"
            >
              {(property.hostContactName || user.email).slice(0, 1).toUpperCase()}
            </button>
            {propertyMenuOpen ? (
              <div className="absolute right-4 top-16 z-50 w-64 rounded-[24px] border border-[#172234]/8 bg-[#FFFFFF] p-3 shadow-[0_30px_90px_rgba(17,24,39,0.18),inset_0_1px_0_rgba(255,255,255,0.9)]">
                <p className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#111827]/40">Active guide</p>
                <div className="flex items-center gap-3 rounded-[18px] bg-[#F9FAFB] p-3">
                  {property.logoUrl ? (
                    <img src={property.logoUrl} alt="" className="h-11 w-11 rounded-[16px] object-cover" />
                  ) : (
                    <div className="grid h-11 w-11 place-items-center rounded-[16px] bg-[#E8F4F3] text-[#5F9D99]">
                      <Home size={18} />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-black">{property.name}</p>
                    <p className="text-xs font-semibold text-[#111827]/50">Ready for guests</p>
                  </div>
                </div>
                <form action={logoutAction} className="mt-2 border-t border-[#172234]/8 pt-2">
                  <button type="submit" className="flex min-h-11 w-full items-center gap-2 rounded-[16px] px-3 text-left text-sm font-black text-[#111827]/72 transition hover:bg-[#F9FAFB] hover:text-[#111827]">
                    <LogOut size={16} />
                    Log out
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 pb-32 pt-5 lg:pb-32 lg:px-8">
        <TrialStatusBar
          subscriptionStatus={subscriptionStatus}
          trialDaysLeft={trialDaysLeft}
          trialLabel={trialLabel}
          selectedPlan={selectedPlan}
        />

        {isFirstVisit ? (
          <div className="mb-4 rounded-[18px] border border-[#76875D]/18 bg-[#76875D]/10 px-4 py-3 shadow-[0_16px_42px_rgba(17,24,39,0.05)]">
            <p className="text-sm font-black text-[#4F5F3E]">Welcome to StayNest</p>
            <p className="mt-0.5 text-xs font-semibold text-[#4F5F3E]/85">
              Start with Welcome and Wi-Fi below — those two alone already give your guests something useful. You can share the QR code as soon as you are happy with it.
            </p>
          </div>
        ) : null}

        {notice ? (
          <div
            className={`mb-4 rounded-[18px] px-4 py-3 text-sm font-bold shadow-[0_16px_42px_rgba(17,24,39,0.06)] ${
              notice.type === "error"
                ? "border border-red-200 bg-red-50 text-red-700"
                : notice.type === "saving"
                  ? "border border-[#172234]/8 bg-[#F9FAFB] text-[#111827]/70"
                  : "border border-[#76875D]/18 bg-[#76875D]/10 text-[#5F704B]"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              {notice.type === "saving" ? <Loader2 className="animate-spin" size={15} /> : null}
              {notice.text}
            </span>
          </div>
        ) : null}

        {activeTab === "setup" ? (
          <SetupScreen
            property={property}
            completion={completion}
            quickActions={quickActions}
            openModule={openModule}
            importListingAction={importListingAction}
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
          <SettingsScreen property={property} publicUrl={publicUrl} qrCode={qrCode} planName={planName} selectedPlan={selectedPlan} />
        ) : null}
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

      <nav className="dashboard-tab-nav">
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
                <Icon size={active ? 26 : 24} strokeWidth={active ? 2.8 : 2.5} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>
    </main>
  );
}

function SetupScreen({
  property,
  completion,
  quickActions,
  openModule,
  importListingAction
}: {
  property: Property;
  completion: number;
  quickActions: Array<{ id: ModuleId; label: string; done: boolean }>;
  openModule: (id: ModuleId) => void;
  importListingAction: any;
}) {
  // The hero used to claim the guide was "almost ready" even at 0%, which read as
  // broken to anyone who had just signed up. Derive the message from real state.
  const stage = !property.name
    ? { eyebrow: "First step", title: "Let\u2019s build your guest guide" }
    : completion >= 100
      ? { eyebrow: "Ready for guests", title: `${property.name} is good to go` }
      : completion >= 50
        ? { eyebrow: "Almost there", title: "Your guest guide is almost ready" }
        : { eyebrow: "In progress", title: "Add the essentials your guests ask for" };

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-[24px] border border-white/55 bg-[#111827] text-white shadow-[0_34px_110px_rgba(17,24,39,0.30),inset_0_1px_0_rgba(255,255,255,0.10)]">
        <div className="relative h-48">
          {property.coverImageUrl ? (
            <img src={property.coverImageUrl} alt="" className="h-full w-full object-cover opacity-90 saturate-[0.96] contrast-[1.04]" />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(circle_at_50%_0%,rgba(95,157,153,0.24),transparent_42%),linear-gradient(145deg,#111827_0%,#162033_100%)]" />
          )}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,transparent_0%,rgba(17,24,39,0.24)_43%,rgba(17,24,39,0.78)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#162033]/48 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/70">{stage.eyebrow}</p>
            <h1 className="mt-2 max-w-sm text-3xl font-black leading-[1.04] tracking-tight">{stage.title}</h1>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[24px] border border-[#172234]/8 bg-white shadow-[0_30px_90px_rgba(17,24,39,0.10)]">
        <div className="bg-[radial-gradient(circle_at_82%_0%,rgba(95,157,153,0.22),transparent_34%),linear-gradient(145deg,#111827_0%,#162033_100%)] px-5 py-5 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#B7DAD5]">Setup progress</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">{completion}% complete</h2>
              <p className="mt-1 text-sm font-semibold leading-6 text-white/70">{completion >= 100 ? "Every section is filled in. Share your QR code from Settings." : "Finish the essentials in under 3 minutes."}</p>
            </div>
            <div className="relative grid h-[72px] w-[72px] shrink-0 place-items-center">
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 72 72" aria-hidden>
                <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="5" />
                <circle
                  cx="36"
                  cy="36"
                  r="30"
                  fill="none"
                  stroke="#B7DAD5"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={`${(completion / 100) * 188.5} 188.5`}
                  className="transition-all duration-700"
                />
              </svg>
              <span className="text-sm font-black">{completion}%</span>
            </div>
          </div>
        </div>

        <div className="grid gap-2 p-4">
          {quickActions.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openModule(item.id)}
              className="flex min-h-12 items-center justify-between rounded-[18px] border border-[#172234]/7 bg-[#FFFFFF] px-4 text-left shadow-[0_12px_34px_rgba(17,24,39,0.055),inset_0_1px_0_rgba(255,255,255,0.78)] transition hover:-translate-y-0.5 hover:bg-[#FFFFFF] hover:shadow-[0_18px_48px_rgba(17,24,39,0.10)]"
            >
              <span className="flex items-center gap-3">
                <span className={`grid h-6 w-6 place-items-center rounded-[10px] ${item.done ? "bg-[#76875D]/14 text-[#5F704B]" : "bg-[#E8F4F3] text-[#5F9D99]"}`}>
                  {item.done ? <Check size={13} /> : <Plus size={13} />}
                </span>
                <span className="text-sm font-black">{item.done ? `Review ${item.label}` : `Add ${item.label}`}</span>
              </span>
              <ChevronRight size={16} className="text-[#111827]/28" />
            </button>
          ))}
        </div>
      </section>

      <ImportListingCard property={property} importListingAction={importListingAction} />
    </div>
  );
}

function ImportListingCard({
  property,
  importListingAction
}: {
  property: Property;
  importListingAction: any;
}) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-[#172234]/8 bg-white shadow-[0_30px_90px_rgba(17,24,39,0.10),inset_0_1px_0_rgba(255,255,255,0.94)]">
      <div className="bg-[radial-gradient(circle_at_12%_0%,rgba(183,218,213,0.22),transparent_34%),linear-gradient(145deg,#FFFFFF_0%,#F7FAFA_100%)] p-5">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[16px] bg-[#111827] text-white shadow-[0_16px_42px_rgba(17,24,39,0.22),inset_0_1px_0_rgba(255,255,255,0.12)]">
            <WandSparkles size={19} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#5F9D99]">Smart prefill</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight">Import from Booking.com</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#111827]/58">
              Paste a listing link. StayNest will pull the public details it can read: name, host name, check-in/out, parking, rules and facilities.
            </p>
          </div>
        </div>

        <form action={importListingAction} className="mt-5 grid gap-3">
          <input type="hidden" name="propertyId" value={property.id} />
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#111827]/42">Listing link</span>
            <span className="flex min-h-12 items-center gap-2 rounded-[16px] border border-[#172234]/8 bg-white px-3 shadow-[0_10px_28px_rgba(17,24,39,0.055),inset_0_1px_0_rgba(255,255,255,0.84)]">
              <Link2 size={17} className="shrink-0 text-[#5F9D99]" />
              <input
                name="listingUrl"
                type="url"
                className="min-h-11 min-w-0 flex-1 bg-transparent text-sm font-bold text-[#111827] outline-none placeholder:text-[#111827]/32"
                placeholder="https://www.booking.com/hotel/..."
              />
            </span>
          </label>

          <details className="rounded-[18px] border border-[#172234]/8 bg-white">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-black text-[#111827] [&::-webkit-details-marker]:hidden">
              <span>Paste listing text if the site blocks reading</span>
              <ChevronDown size={16} className="text-[#111827]/35" />
            </summary>
            <div className="border-t border-[#172234]/7 p-3">
              <textarea
                name="listingText"
                className={`${textareaClass} min-h-28 bg-[#F9FAFB] text-sm`}
                placeholder="Copy the listing description, facilities, house rules and check-in/out details here."
              />
            </div>
          </details>

          <div className="rounded-[18px] border border-[#5F9D99]/14 bg-[#E8F4F3]/55 px-4 py-3">
            <p className="text-xs font-semibold leading-5 text-[#315F5B]">
              Private details like Wi-Fi passwords and lockbox codes are never invented. After import, review each field before guests use the guide.
            </p>
          </div>

          <SubmitButton pendingText="Importing..." className="min-h-12 rounded-[16px] bg-[#111827] text-white shadow-[0_18px_50px_rgba(17,24,39,0.26),inset_0_1px_0_rgba(255,255,255,0.12)]">
            <WandSparkles size={16} />
            Prefill guide
          </SubmitButton>
        </form>
      </div>
    </section>
  );
}

function ModulesScreen({
  property,
  setupItems,
  activeModule,
  openModule
}: {
  property: Property;
  setupItems: Array<{ id: ModuleId; label: string; done: boolean }>;
  activeModule: ModuleId;
  openModule: (id: ModuleId) => void;
}) {
  const moduleIds = Object.keys(moduleCopy) as ModuleId[];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#5F9D99]">Modules</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Build the guide fast</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {moduleIds.map((id) => {
          const info = moduleCopy[id];
          const Icon = info.icon;
          const done = setupItems.find((item) => item.id === id)?.done;
          const selected = activeModule === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => openModule(id)}
              className={`min-h-[158px] rounded-[20px] border p-4 text-left shadow-[0_22px_62px_rgba(17,24,39,0.085),inset_0_1px_0_rgba(255,255,255,0.82)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_78px_rgba(17,24,39,0.14)] ${
                selected
                  ? "border-[#111827]/32 bg-white ring-4 ring-[#111827]/8"
                  : "border-[#172234]/7 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className={`grid h-10 w-10 place-items-center rounded-[16px] ${info.accent}`}>
                  <Icon size={18} />
                </div>
                <span className={`rounded-[10px] px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] ${done ? "bg-[#76875D]/12 text-[#5F704B]" : "bg-[#F3F4F6] text-[#6B7280]"}`}>
                  {done ? "Done" : "Add"}
                </span>
              </div>
              <h2 className="mt-4 text-lg font-black leading-tight">{info.title}</h2>
              <p className="mt-1 text-xs font-bold text-[#111827]/48">{info.subtitle}</p>
              <p className="mt-3 line-clamp-2 text-xs font-semibold leading-5 text-[#111827]/62">{shortText(info.preview(property), "Ready to edit")}</p>
            </button>
          );
        })}
      </div>
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

  return (
    <div className="space-y-5">
      <section className="rounded-[28px] border border-[#172234]/8 bg-white p-5 shadow-[0_30px_90px_rgba(17,24,39,0.08),inset_0_1px_0_rgba(255,255,255,0.94)] lg:p-7">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#5F9D99]">Design</p>
        <div className="mt-3 max-w-2xl">
          <h1 className="text-3xl font-black leading-[1.02] tracking-tight lg:text-5xl">Choose your guest guide style</h1>
          <p className="mt-4 text-sm font-semibold leading-7 text-[#111827]/58 lg:text-base">
            Pick the template that matches your property atmosphere. You can change it anytime.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="-mx-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:overflow-visible lg:px-0">
          <div className="flex w-max gap-3 lg:grid lg:w-auto lg:grid-cols-2 xl:grid-cols-4">
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

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSaveDesign(new FormData(event.currentTarget));
          }}
          className="flex flex-col items-stretch gap-3 px-1 sm:flex-row sm:items-center sm:justify-end"
        >
          <input type="hidden" name="propertyId" value={property.id} />
          <input type="hidden" name="templateId" value={selectedThemeId} />
          <input type="hidden" name="accentColor" value={accentColor} />
          {designSerif ? <input type="hidden" name="designSerif" value="1" /> : null}
          {designRounded ? <input type="hidden" name="designRounded" value="1" /> : null}

          {!canSave ? (
            <p className="rounded-[16px] border border-[#F59E0B]/20 bg-[#FFFBEB] px-4 py-3 text-sm font-bold text-[#92400E]">Create the property first, then apply a template.</p>
          ) : null}
          <InlineSaveButton saving={saving} savingText="Applying..." disabled={!canSave} className="min-h-12 rounded-[16px] bg-[#111827] px-8 text-white shadow-[0_18px_48px_rgba(17,24,39,0.24),inset_0_1px_0_rgba(255,255,255,0.12)] disabled:opacity-50">
            Apply Template
          </InlineSaveButton>
        </form>
      </section>
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
        ? "border-[#111827]/8 bg-[#FFFFFF] text-[#111827] shadow-[0_18px_54px_rgba(17,24,39,0.06),inset_0_1px_0_rgba(255,255,255,0.98)]"
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
          <span className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full text-white shadow-[0_12px_30px_rgba(17,24,39,0.28)]" style={{ backgroundColor: accentColor }}>
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
            <h2 className="text-lg font-black tracking-tight">{theme.name}</h2>
            <p className={`mt-1 min-h-[40px] text-xs font-semibold leading-5 ${mutedClass}`}>{theme.description}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex -space-x-1">
            {theme.palette.map((color) => (
              <span key={color} className="h-5 w-5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: color }} />
            ))}
          </div>
          <button type="button" onClick={(event) => { event.stopPropagation(); onSelect(); }} className={`rounded-full px-3 py-2 text-xs font-black ${pillClass}`}>
            Preview
          </button>
        </div>
        <p className={`mt-3 rounded-[14px] px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] ${pillClass}`}>
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
        className={`${small ? "h-9 w-9 rounded-[13px]" : "h-12 w-12 rounded-[18px]"} grid shrink-0 place-items-center overflow-hidden p-1 text-[10px] font-black text-[var(--guide-text)] shadow-[0_12px_34px_rgba(0,0,0,0.16)] ring-1 ring-[var(--guide-card-border)]`}
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
      <div className={`relative overflow-hidden ${className}`} style={{ background: theme.preview.heroBackground }}>
        {property.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={property.coverImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ filter: "var(--guide-hero-image-filter)" }} />
        ) : null}
        <div className="absolute inset-0" style={{ background: "var(--guide-hero-overlay)" }} />
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
                  <span className="block truncate text-[11px] font-black">{item.title}</span>
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
              <p className={`${compact ? "mt-2 text-[11px]" : "mt-3 text-sm"} font-black`}>{item.title}</p>
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
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--guide-muted)]">Stay guide</p>
              <p className={`${compact ? "text-xs" : "text-sm"} font-black`}>{displayName}</p>
            </div>
          </div>
          <span className="rounded-full border border-[var(--guide-card-border)] px-2.5 py-1 text-[9px] font-black backdrop-blur-xl" style={{ background: "var(--guide-language-bg)", color: "var(--guide-language-text)" }}>EN</span>
        </header>
        <section className={`${compact ? "p-4" : "p-5"}`}>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--guide-accent)]">{theme.preview.eyebrow}</p>
          <h3 className={`${compact ? "mt-2 text-2xl" : "mt-3 text-3xl"} font-black leading-[0.95] tracking-tight`} style={{ fontFamily: "var(--guide-heading-font)" }}>
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
          <span className="rounded-full border border-[var(--guide-card-border)] px-2.5 py-1 text-[9px] font-black backdrop-blur-xl" style={{ background: "var(--guide-language-bg)", color: "var(--guide-language-text)" }}>EN</span>
        </header>
        <section className="relative overflow-hidden rounded-[var(--guide-hero-radius)]">
          <HeroLayer className={compact ? "h-32" : "h-44"} />
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/82">{theme.preview.eyebrow}</p>
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
              <span className="rounded-full border border-[#D6AF6F]/28 px-2.5 py-1 text-[9px] font-black backdrop-blur-xl" style={{ background: "var(--guide-language-bg)", color: "var(--guide-language-text)" }}>EN</span>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[var(--guide-accent)]">{theme.preview.eyebrow}</p>
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
            <span className="rounded-full px-3 py-1.5 text-[10px] font-black tracking-[0.12em] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl" style={{ background: "var(--guide-language-bg)", color: "var(--guide-language-text)" }}>EN</span>
          </div>
          <div>
            <p className={`${compact ? "text-sm" : "text-xl"} leading-tight`} style={{ fontFamily: "var(--guide-heading-font)" }}>Welcome to</p>
            <h3 className={`${compact ? "text-2xl" : "text-4xl"} font-black leading-none`} style={{ fontFamily: "var(--guide-heading-font)" }}>{displayName}</h3>
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
  selectedPlan
}: {
  property: Property;
  publicUrl: string;
  qrCode: string;
  planName: string;
  selectedPlan: string;
}) {
  const currentPlan = planOption(selectedPlan);
  const targetTier: PlanTier = currentPlan.tier === "ai" ? "basic" : "ai";
  const recommendedTargetPlanKey = `${targetTier}-${currentPlan.interval}`;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#5F9D99]">Settings</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Guide & account</h1>
      </div>

      <section className="rounded-[24px] border border-white/12 bg-[#111827] bg-[radial-gradient(circle_at_82%_0%,rgba(95,157,153,0.22),transparent_34%),linear-gradient(145deg,#111827_0%,#162033_100%)] p-5 text-white shadow-[0_36px_116px_rgba(17,24,39,0.34),inset_0_1px_0_rgba(255,255,255,0.10)]">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#B7DAD5]">Your guide is live</p>
        <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight">Ready for the next guest</h1>
        <p className="mt-2 text-sm font-semibold leading-6 text-white/66">Share the link, print the QR, or open the guest view.</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-[160px_1fr]">
          <div className="grid place-items-center rounded-[20px] bg-[#FFFFFF] p-4 shadow-[0_18px_46px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.92)]">
            {qrCode ? <img src={qrCode} alt="Guest guide QR code" className="h-32 w-32 object-contain" /> : <QrCode size={104} className="text-[#111827]" />}
          </div>
          <div className="flex flex-col justify-between gap-3">
            <div className="rounded-[18px] border border-white/10 bg-white/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <p className="text-xs font-bold text-white/48">Guest link</p>
              <p className="mt-1 break-all text-xs font-black leading-5">{publicUrl}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <CopyButton value={publicUrl} label="Share link" copiedLabel="Copied" className="rounded-[16px] border border-[#172234]/10 bg-[#FFFFFF] text-[#111827] shadow-[0_14px_34px_rgba(17,24,39,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] hover:bg-white" />
              {qrCode ? (
                <a
                  href={qrCode}
                  download={`staynest-${property.slug}-qr.png`}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[16px] border border-[#172234]/10 bg-[#FFFFFF] px-4 text-sm font-black text-[#111827] shadow-[0_14px_34px_rgba(17,24,39,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#B7DAD5]/60 focus:ring-offset-2 focus:ring-offset-[#111827]"
                >
                  <span>Download QR</span>
                  <Download size={15} />
                </a>
              ) : null}
              <a href={publicUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[16px] bg-[#5F9D99] px-4 text-sm font-black text-white shadow-[0_18px_48px_rgba(95,157,153,0.30),inset_0_1px_0_rgba(255,255,255,0.16)] transition hover:-translate-y-0.5 hover:bg-[#558F8B] focus:outline-none focus:ring-2 focus:ring-[#B7DAD5]/60 focus:ring-offset-2 focus:ring-offset-[#111827]">
                <span>Open preview</span>
                <ExternalLink size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-[#172234]/8 bg-white p-5 shadow-[0_30px_90px_rgba(17,24,39,0.12),inset_0_1px_0_rgba(255,255,255,0.92)]">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#5F9D99]">Billing</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight">Manage your subscription</h2>
        <div className="mt-3 rounded-[18px] border border-[#172234]/10 bg-[#F9FAFB] p-4">
          <p className="text-xs font-bold text-[#111827]/55">Current plan</p>
          <p className="mt-1 text-sm font-black text-[#111827]">
            {planName} · {currentPlan.cadence === "yearly" ? "Yearly" : "Monthly"}
          </p>
          <p className="mt-1 text-xs font-semibold text-[#111827]/60">
            {currentPlan.tier === "ai"
              ? "AI guest chat knowledge is active for this account."
              : "Essential guest guide features are active for this account."}
          </p>
        </div>
        <div className="mt-4">
          <p className="text-xs font-semibold text-[#111827]/55">
            {targetTier === "ai" ? "Upgrade to Full AI" : "Switch to Basic"} (choose cadence)
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {[
              planOption(`${targetTier}-monthly`),
              planOption(`${targetTier}-yearly`)
            ].map((option) => {
              const isRecommended = option.key === recommendedTargetPlanKey;
              return (
                <a
                  key={option.key}
                  href={`${BILLING_BASE_URL}/billing?plan=${option.key}`}
                  className={`rounded-[16px] border px-4 py-3 text-left transition ${
                    isRecommended
                      ? "border-[#111827]/35 bg-[#111827] text-white"
                      : "border-[#172234]/10 bg-[#FFFFFF] text-[#111827] hover:border-[#111827]/25"
                  }`}
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.16em]">
                    {option.cadence === "yearly" ? "Yearly" : "Monthly"}
                  </p>
                  <p className="mt-1 text-sm font-black">{option.shortName}</p>
                  <p className={`mt-1 text-xs font-semibold ${isRecommended ? "text-white/70" : "text-[#111827]/55"}`}>
                    {option.price}
                    {option.cadence === "yearly" ? "/year" : "/month"}
                    {isRecommended ? " · Recommended" : ""}
                  </p>
                </a>
              );
            })}
          </div>
          <p className="mt-3 text-xs font-semibold text-[#111827]/45">
            Paddle handles checkout securely; webhooks update your subscription automatically.
          </p>
        </div>
      </section>
    </div>
  );
}

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
    <div className="dashboard-sheet-overlay fixed inset-0 z-50 flex flex-col justify-end bg-[#0B1220]/64 backdrop-blur-md lg:items-center lg:justify-center lg:p-6">
      <button type="button" aria-label="Close editor" className="absolute inset-0" onClick={onClose} />
      <section className="dashboard-sheet-panel relative h-[calc(100dvh-8px)] max-h-[calc(100dvh-8px)] w-full overflow-y-auto rounded-t-[22px] border-t border-[#172234]/8 bg-white px-4 pb-4 pt-2 shadow-[0_-38px_110px_rgba(17,24,39,0.34)] lg:h-auto lg:max-h-[86vh] lg:max-w-5xl lg:rounded-[24px] lg:border lg:px-6 lg:pb-6 lg:pt-5 lg:shadow-[0_38px_130px_rgba(17,24,39,0.34)]">
        <div className="mx-auto h-1.5 w-11 rounded-full bg-[#111827]/18 lg:hidden" />
        <div className="mt-3 flex items-center justify-between gap-3 lg:mt-0 lg:border-b lg:border-[#172234]/8 lg:pb-5">
          <div className="flex items-center gap-3">
            <div className={`grid h-10 w-10 place-items-center rounded-[15px] lg:h-11 lg:w-11 lg:rounded-[16px] ${info.accent}`}>
              <Icon size={19} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight lg:text-xl">{info.title}</h2>
              <p className="text-xs font-bold text-[#111827]/48">{info.subtitle}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-[14px] bg-[#FFFFFF] px-4 py-2 text-xs font-black shadow-[0_14px_38px_rgba(17,24,39,0.10),inset_0_1px_0_rgba(255,255,255,0.86)]">
            Close
          </button>
        </div>

        <div className="mt-4 lg:mt-5">
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

              <div className="overflow-hidden rounded-[20px] border border-[#172234]/8 bg-white shadow-[0_24px_74px_rgba(17,24,39,0.13),inset_0_1px_0_rgba(255,255,255,0.90)] lg:shadow-[0_18px_58px_rgba(17,24,39,0.08),inset_0_1px_0_rgba(255,255,255,0.90)]">
                {activeModule === "photos" ? (
                  <div className="grid gap-3 p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <ImageUploadField label="Property logo" fileName="logoFile" urlName="logoUrl" removeName="removeLogo" currentUrl={property.logoUrl} />
                      <ImageUploadField label="Property photo" fileName="coverImageFile" urlName="coverImageUrl" removeName="removeCoverImage" currentUrl={property.coverImageUrl} />
                    </div>
                  </div>
                ) : null}

                {activeModule === "welcome" ? (
                  <div className="grid gap-0 divide-y divide-[#172234]/7 lg:grid-cols-[0.9fr_1.1fr] lg:divide-x lg:divide-y-0">
                    <div className="p-4 lg:p-5">
                      <Field label="Property name">
                        <input name="name" className={`${inputClass} bg-[#F9FAFB]`} defaultValue={property.name} placeholder="Your property name" required />
                      </Field>
                    </div>
                    <div className="p-4 lg:p-5">
                    <Field label="Welcome note">
                      <textarea name="welcomeMessage" className={`${textareaClass} min-h-24 bg-[#F9FAFB] lg:min-h-44`} defaultValue={property.welcomeMessage} />
                    </Field>
                    </div>
                  </div>
                ) : null}

                {activeModule === "wifi" ? (
                  <div className="grid gap-0 divide-y divide-[#172234]/7 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
                    <div className="p-4 lg:p-5">
                      <Field label="Network">
                        <input name="wifiName" className={`${inputClass} bg-[#F9FAFB]`} defaultValue={property.wifiName || ""} />
                      </Field>
                    </div>
                    <div className="p-4 lg:p-5">
                      <Field label="Password">
                        <input name="wifiPassword" className={`${inputClass} bg-[#F9FAFB]`} defaultValue={property.wifiPassword || ""} />
                      </Field>
                    </div>
                  </div>
                ) : null}

                {activeModule === "checkin" ? (
                  <div className="grid gap-0 divide-y divide-[#172234]/7 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
                    <div className="p-4 lg:p-5">
                      <Field label="Check-in">
                        <textarea name="checkInInfo" className={`${textareaClass} min-h-24 bg-[#F9FAFB] lg:min-h-52`} defaultValue={property.checkInInfo || ""} />
                      </Field>
                    </div>
                    <div className="p-4 lg:p-5">
                      <Field label="Checkout">
                        <textarea name="checkOutInfo" className={`${textareaClass} min-h-20 bg-[#F9FAFB] lg:min-h-52`} defaultValue={property.checkOutInfo || ""} />
                      </Field>
                    </div>
                  </div>
                ) : null}

                {activeModule === "rules" ? (
                  <div className="grid gap-0 divide-y divide-[#172234]/7 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
                    <div className="p-4 lg:p-5">
                      <Field label="House rules">
                        <textarea name="houseRules" className={`${textareaClass} min-h-24 bg-[#F9FAFB] lg:min-h-52`} defaultValue={property.houseRules || ""} />
                      </Field>
                    </div>
                    <div className="p-4 lg:p-5">
                      <Field label="Parking">
                        <textarea name="parkingInfo" className={`${textareaClass} min-h-20 bg-[#F9FAFB] lg:min-h-52`} defaultValue={property.parkingInfo || ""} />
                      </Field>
                    </div>
                  </div>
                ) : null}

                {activeModule === "contact" ? (
                  <div className="grid gap-0 divide-y divide-[#172234]/7 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
                    <div className="p-4 lg:p-5">
                      <Field label="Host name">
                        <input name="hostContactName" className={`${inputClass} bg-[#F9FAFB]`} defaultValue={property.hostContactName || ""} />
                      </Field>
                    </div>
                    <div className="grid gap-0 divide-y divide-[#172234]/7 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:col-span-2">
                      <div className="p-4 lg:p-5">
                        <Field label="Phone">
                          <input name="hostPhone" className={`${inputClass} bg-[#F9FAFB]`} defaultValue={property.hostPhone || ""} />
                        </Field>
                      </div>
                      <div className="p-4 lg:p-5">
                        <Field label="Email">
                          <input name="hostEmail" type="email" className={`${inputClass} bg-[#F9FAFB]`} defaultValue={property.hostEmail || ""} />
                        </Field>
                      </div>
                    </div>
                  </div>
                ) : null}

                {activeModule === "emergency" ? (
                  <div className="p-4 lg:p-5">
                    <Field label="Emergency contact and safety notes">
                      <textarea name="emergencyInfo" className={`${textareaClass} min-h-24 bg-[#F9FAFB] lg:min-h-44`} defaultValue={property.emergencyInfo || ""} />
                    </Field>
                  </div>
                ) : null}

                {activeModule === "ai" ? (
                  <div className="p-4 lg:p-5">
                    <Field label="AI guest chat knowledge">
                      <textarea name="aiKnowledge" className={`${textareaClass} min-h-32 bg-[#F9FAFB] lg:min-h-52`} defaultValue={property.aiKnowledge || ""} />
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

              <div className="sticky bottom-2 lg:static lg:flex lg:justify-end">
                <InlineSaveButton saving={savingKey === "property"} savingText="Saving..." className="luxury-btn-teal w-full lg:w-auto lg:px-8">
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
              className="space-y-4 rounded-[20px] border border-[#172234]/8 bg-white p-4 shadow-[0_24px_74px_rgba(17,24,39,0.13),inset_0_1px_0_rgba(255,255,255,0.90)]"
            >
              <input type="hidden" name="propertyId" value={property.id} />
              <input type="hidden" name="booking" value="" />
              <input type="hidden" name="airbnb" value="" />
              <Field label="Google review link">
                <input name="google" className={`${inputClass} bg-[#F9FAFB]`} defaultValue={getReviewValue(property, "GOOGLE")} placeholder="https://g.page/r/..." />
              </Field>
              <InlineSaveButton saving={savingKey === "reviews"} savingText="Saving..." className="min-h-12 w-full rounded-[16px] bg-[#111827] text-white shadow-[0_18px_50px_rgba(17,24,39,0.26),inset_0_1px_0_rgba(255,255,255,0.12)]">
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

              <div className="overflow-hidden rounded-[20px] border border-[#172234]/8 bg-white shadow-[0_24px_74px_rgba(17,24,39,0.13),inset_0_1px_0_rgba(255,255,255,0.90)]">
                <div className="grid gap-3 border-b border-[#172234]/8 bg-[#F9FAFB] px-4 py-3 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#5F9D99]">Add place</p>
                    <h3 className="text-base font-black">
                      {activeModule === "restaurants" ? "Restaurants, cafes and bars" : activeModule === "essentials" ? "Nearby essentials" : "Attractions, beaches and activities"}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRecommendationDrafts((drafts) => [...drafts, createManualPlaceDraft(defaultCategory, drafts.length + 1, activeModule === "essentials")])}
                      className="inline-flex min-h-10 items-center gap-2 rounded-[14px] bg-white px-3 text-xs font-black text-[#111827] shadow-[0_12px_30px_rgba(17,24,39,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-[#172234]/8"
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
                    <div className="rounded-[18px] border border-dashed border-[#172234]/14 bg-[#F9FAFB] px-4 py-8 text-center">
                      <p className="text-sm font-black text-[#111827]">No {activeModule === "restaurants" ? "places" : activeModule === "essentials" ? "essentials" : "activities"} yet.</p>
                      <p className="mt-1 text-xs font-semibold text-[#111827]/48">Add the name, type, description and link manually.</p>
                      <button
                        type="button"
                        onClick={() => setRecommendationDrafts([createManualPlaceDraft(defaultCategory, 1, activeModule === "essentials")])}
                        className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-[14px] bg-white px-4 text-xs font-black text-[#111827] shadow-[0_12px_30px_rgba(17,24,39,0.08)] ring-1 ring-[#172234]/8"
                      >
                        <Link2 size={14} />
                        Add place
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="sticky bottom-2 lg:static lg:flex lg:justify-end">
                <InlineSaveButton saving={savingKey === `recommendations:${defaultCategory}`} savingText="Saving..." className="min-h-12 w-full rounded-[16px] bg-[#111827] text-white shadow-[0_18px_50px_rgba(17,24,39,0.26),inset_0_1px_0_rgba(255,255,255,0.12)] lg:w-auto lg:px-8">
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
