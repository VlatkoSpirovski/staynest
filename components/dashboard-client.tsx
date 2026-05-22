"use client";

import { useEffect, useMemo, useState } from "react";
import {
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
  LogOut,
  MapPin,
  Phone,
  Plus,
  QrCode,
  Save,
  Settings,
  ShieldAlert,
  Star,
  Utensils,
  Wifi
} from "lucide-react";

import { ConfirmSubmitButton } from "@/components/confirm-submit";
import { CopyButton } from "@/components/copy-button";
import { ImageUploadField } from "@/components/image-upload-field";
import { SubmitButton } from "@/components/submit-button";
import { Field, inputClass, textareaClass } from "@/components/ui/panel";

interface Recommendation {
  id: string;
  propertyId: string;
  title: string;
  category: string;
  description: string;
  address: string | null;
  url: string | null;
  imageUrl: string | null;
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
  logoUrl: string | null;
  coverImageUrl: string | null;
  accentColor: string;
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
  translationLocales: string[];
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
  planPrice: string;
  selectedPlan: string;
  trialLabel: string | null;
  logoutAction: any;
  importListingAction: any;
  savePropertyAction: any;
  saveRecommendationAction: any;
  deleteRecommendationAction: any;
  saveReviewLinksAction: any;
}

type TabId = "setup" | "modules" | "settings";
type ModuleId = "photos" | "welcome" | "wifi" | "checkin" | "rules" | "restaurants" | "activities" | "contact" | "emergency" | "ai" | "reviews";

const tabs: Array<{ id: TabId; label: string; icon: typeof Home }> = [
  { id: "setup", label: "Setup", icon: BadgeCheck },
  { id: "modules", label: "Modules", icon: BedDouble },
  { id: "settings", label: "Settings", icon: Settings }
];

const guideLanguageOptions = [
  { code: "en", label: "English" },
  { code: "mk", label: "Macedonian" },
  { code: "de", label: "German" },
  { code: "fr", label: "French" },
  { code: "nl", label: "Dutch" },
  { code: "sr", label: "Serbian" },
  { code: "sq", label: "Albanian" },
  { code: "tr", label: "Turkish" },
  { code: "pl", label: "Polish" },
  { code: "cs", label: "Czech" }
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
  return property.recommendations.filter((item) => /restaurant|dinner|wine|bar|cafe|food|tavern|grill/i.test(`${item.category} ${item.title}`));
}

function activityItems(property: Property) {
  const restaurants = new Set(restaurantItems(property).map((item) => item.id));
  return property.recommendations.filter((item) => !restaurants.has(item.id));
}

function getReviewValue(property: Property, platform: "GOOGLE" | "BOOKING" | "AIRBNB") {
  return property.reviewLinks.find((link) => link.platform === platform)?.url || "";
}

function shortText(value: string, fallback: string) {
  return value.length > 72 ? `${value.slice(0, 72).trim()}...` : value || fallback;
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

export default function DashboardClient(props: DashboardClientProps) {
  const {
    property: initialProperty,
    user,
    publicUrl: initialPublicUrl,
    qrCode: initialQrCode,
    successMessage,
    errorMessage,
    planName,
    planPrice,
    selectedPlan,
    logoutAction,
    savePropertyAction,
    saveRecommendationAction,
    deleteRecommendationAction,
    saveReviewLinksAction
  } = props;

  const property = useMemo<Property>(() => {
    const blankProperty: Property = {
      id: "",
      ownerId: user.id,
      name: "",
      slug: "",
      logoUrl: null,
      coverImageUrl: null,
      accentColor: "#5D9C9A",
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
      translationLocales: ["en"],
      recommendations: [],
      reviewLinks: []
    };

    if (!initialProperty) return blankProperty;

    return initialProperty;
  }, [initialProperty, user.id]);

  const publicUrl = initialPublicUrl || (property.slug ? `https://staynest.app/stay/${property.slug}` : "");
  const qrCode = initialQrCode || "";
  const [activeTab, setActiveTab] = useState<TabId>("setup");
  const [activeModule, setActiveModule] = useState<ModuleId>("welcome");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [propertyMenuOpen, setPropertyMenuOpen] = useState(false);

  const setupItems = useMemo(
    () => [
      { id: "welcome" as ModuleId, label: "Welcome", done: Boolean(property.name && property.welcomeMessage) },
      { id: "photos" as ModuleId, label: "Photos", done: Boolean(property.logoUrl && property.coverImageUrl) },
      { id: "wifi" as ModuleId, label: "Wi-Fi", done: Boolean(property.wifiName && property.wifiPassword) },
      { id: "checkin" as ModuleId, label: "Check-in", done: Boolean(property.checkInInfo) },
      { id: "rules" as ModuleId, label: "Rules", done: Boolean(property.houseRules || property.parkingInfo) },
      { id: "restaurants" as ModuleId, label: "Restaurants", done: restaurantItems(property).length >= 1 },
      { id: "activities" as ModuleId, label: "Activities", done: activityItems(property).length >= 1 },
      { id: "contact" as ModuleId, label: "Contact", done: Boolean(property.hostPhone && property.hostEmail) },
      { id: "emergency" as ModuleId, label: "Emergency", done: Boolean(property.emergencyInfo) },
      { id: "ai" as ModuleId, label: "AI", done: Boolean(property.aiKnowledge) },
      { id: "reviews" as ModuleId, label: "Google reviews", done: Boolean(getReviewValue(property, "GOOGLE")) }
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

      <div className="mx-auto max-w-5xl px-4 pb-52 pt-5 lg:pb-32 lg:px-8">
        {successMessage ? <div className="mb-4 rounded-[18px] border border-[#76875D]/18 bg-[#76875D]/10 px-4 py-3 text-sm font-bold text-[#5F704B] shadow-[0_16px_42px_rgba(17,24,39,0.06)]">{successMessage}</div> : null}
        {errorMessage ? <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{errorMessage}</div> : null}

        {activeTab === "setup" ? (
          <SetupScreen
            property={property}
            completion={completion}
            quickActions={quickActions}
            openModule={openModule}
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

        {activeTab === "settings" ? (
          <SettingsScreen property={property} publicUrl={publicUrl} qrCode={qrCode} planName={planName} planPrice={planPrice} selectedPlan={selectedPlan} />
        ) : null}
      </div>

      {sheetOpen ? (
        <ModuleSheet
          property={property}
          activeModule={activeModule}
          onClose={() => setSheetOpen(false)}
          user={user}
          savePropertyAction={savePropertyAction}
          saveRecommendationAction={saveRecommendationAction}
          deleteRecommendationAction={deleteRecommendationAction}
          saveReviewLinksAction={saveReviewLinksAction}
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
  openModule
}: {
  property: Property;
  completion: number;
  quickActions: Array<{ id: ModuleId; label: string; done: boolean }>;
  openModule: (id: ModuleId) => void;
}) {
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
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/66">Good afternoon</p>
            <h1 className="mt-2 max-w-xs text-3xl font-black leading-[1.04] tracking-tight">Your guest guide is almost ready</h1>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[24px] border border-[#172234]/8 bg-white shadow-[0_30px_90px_rgba(17,24,39,0.10)]">
        <div className="bg-[radial-gradient(circle_at_82%_0%,rgba(95,157,153,0.22),transparent_34%),linear-gradient(145deg,#111827_0%,#162033_100%)] px-5 py-5 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#B7DAD5]">Setup progress</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">{completion}% complete</h2>
              <p className="mt-1 text-sm font-semibold leading-6 text-white/58">Finish the essentials in under 3 minutes.</p>
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
    </div>
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

function SettingsScreen({
  property,
  publicUrl,
  qrCode,
  planName,
  planPrice,
  selectedPlan
}: {
  property: Property;
  publicUrl: string;
  qrCode: string;
  planName: string;
  planPrice: string;
  selectedPlan: string;
}) {
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
        <h2 className="mt-2 text-2xl font-black tracking-tight">Choose your host plan</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { id: "basic", name: "Basic", price: "€10", text: "Beautiful guest guide, QR sharing, restaurants and house info." },
            { id: "ai", name: "AI Concierge", price: "€15", text: "Everything in Basic plus guest chat knowledge and AI answers." }
          ].map((plan) => {
            const active = selectedPlan === plan.id || planName.toLowerCase().includes(plan.name.toLowerCase());
            return (
              <a
                key={plan.id}
                href={`/billing?plan=${plan.id}`}
                className={`rounded-[20px] border p-4 shadow-[0_18px_48px_rgba(17,24,39,0.085),inset_0_1px_0_rgba(255,255,255,0.76)] transition hover:-translate-y-0.5 ${
                  active ? "border-[#111827]/35 bg-[#111827] text-white" : "border-[#172234]/7 bg-[#FFFFFF] text-[#111827]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-[0.16em] ${active ? "text-[#B7DAD5]" : "text-[#5F9D99]"}`}>{active ? "Current plan" : "Upgrade option"}</p>
                    <h3 className="mt-2 text-lg font-black">{plan.name}</h3>
                  </div>
                  <p className="text-2xl font-black">{active ? planPrice || plan.price : plan.price}</p>
                </div>
                <p className={`mt-3 text-xs font-semibold leading-5 ${active ? "text-white/66" : "text-[#111827]/58"}`}>{plan.text}</p>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function ModuleSheet({
  property,
  activeModule,
  onClose,
  user,
  savePropertyAction,
  saveRecommendationAction,
  deleteRecommendationAction,
  saveReviewLinksAction
}: {
  property: Property;
  activeModule: ModuleId;
  onClose: () => void;
  user: User;
  savePropertyAction: any;
  saveRecommendationAction: any;
  deleteRecommendationAction: any;
  saveReviewLinksAction: any;
}) {
  const info = moduleCopy[activeModule];
  const Icon = info.icon;
  const isPropertyModule = !["restaurants", "activities", "reviews"].includes(activeModule);
  const visibleRecommendations = activeModule === "restaurants" ? restaurantItems(property) : activityItems(property);
  const defaultCategory = activeModule === "restaurants" ? "Restaurant" : "Activity";

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-[#0B1220]/64 backdrop-blur-md lg:items-center lg:justify-center lg:p-6">
      <button type="button" aria-label="Close editor" className="absolute inset-0" onClick={onClose} />
      <section className="relative max-h-[82vh] w-full overflow-y-auto rounded-t-[24px] border-t border-[#172234]/8 bg-white px-4 pb-5 pt-3 shadow-[0_-38px_110px_rgba(17,24,39,0.34)] lg:max-h-[86vh] lg:max-w-5xl lg:rounded-[24px] lg:border lg:px-6 lg:pb-6 lg:pt-5 lg:shadow-[0_38px_130px_rgba(17,24,39,0.34)]">
        <div className="mx-auto h-1.5 w-11 rounded-full bg-[#111827]/18 lg:hidden" />
        <div className="mt-4 flex items-center justify-between gap-4 lg:mt-0 lg:border-b lg:border-[#172234]/8 lg:pb-5">
          <div className="flex items-center gap-3">
            <div className={`grid h-11 w-11 place-items-center rounded-[16px] ${info.accent}`}>
              <Icon size={19} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">{info.title}</h2>
              <p className="text-xs font-bold text-[#111827]/48">{info.subtitle}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-[14px] bg-[#FFFFFF] px-4 py-2 text-xs font-black shadow-[0_14px_38px_rgba(17,24,39,0.10),inset_0_1px_0_rgba(255,255,255,0.86)]">
            Close
          </button>
        </div>

        <div className="mt-4 lg:mt-5">
          {isPropertyModule ? (
            <form action={savePropertyAction} className="space-y-4">
              <input type="hidden" name="propertyId" value={property.id} />
              <input type="hidden" name="accentColor" value={property.accentColor || "#5D9C9A"} />
              {activeModule !== "welcome" ? property.translationLocales.map((locale) => (
                <input key={locale} type="hidden" name="translationLocales" value={locale} />
              )) : null}

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
                  <div className="border-t border-[#172234]/7 p-4 lg:p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-sm font-black text-[#111827]">Guide languages</p>
                        <p className="mt-1 text-xs font-semibold leading-5 text-[#111827]/52">StayNest translates guest content on save, so public pages open instantly.</p>
                      </div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#5F9D99]">English always included</p>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {guideLanguageOptions.map((language) => {
                        const checked = language.code === "en" || property.translationLocales.includes(language.code);
                        return (
                          <label key={language.code} className={`flex min-h-11 items-center gap-2 rounded-[14px] border px-3 text-sm font-black ${
                            checked ? "border-[#5F9D99]/30 bg-[#5F9D99]/10 text-[#111827]" : "border-[#172234]/8 bg-[#F9FAFB] text-[#111827]/68"
                          }`}>
                            <input
                              type="checkbox"
                              name="translationLocales"
                              value={language.code}
                              defaultChecked={checked}
                              disabled={language.code === "en"}
                              className="h-4 w-4 rounded border-[#172234]/20"
                            />
                            {language.label}
                          </label>
                        );
                      })}
                      <input type="hidden" name="translationLocales" value="en" />
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
                <SubmitButton pendingText="Saving..." className="luxury-btn-teal w-full lg:w-auto lg:px-8">
                  <Save size={16} />
                  Save changes
                </SubmitButton>
              </div>
            </form>
          ) : activeModule === "reviews" ? (
            <form action={saveReviewLinksAction} className="space-y-4 rounded-[20px] border border-[#172234]/8 bg-white p-4 shadow-[0_24px_74px_rgba(17,24,39,0.13),inset_0_1px_0_rgba(255,255,255,0.90)]">
              <input type="hidden" name="propertyId" value={property.id} />
              <input type="hidden" name="booking" value="" />
              <input type="hidden" name="airbnb" value="" />
              <Field label="Google review link">
                <input name="google" className={`${inputClass} bg-[#F9FAFB]`} defaultValue={getReviewValue(property, "GOOGLE")} placeholder="https://g.page/r/..." />
              </Field>
              <SubmitButton pendingText="Saving..." className="min-h-12 w-full rounded-[16px] bg-[#111827] text-white shadow-[0_18px_50px_rgba(17,24,39,0.26),inset_0_1px_0_rgba(255,255,255,0.12)]">
                <Save size={16} />
                Save Google link
              </SubmitButton>
            </form>
          ) : (
            <div className="space-y-4">
              <form action={saveRecommendationAction} className="rounded-[20px] border border-[#172234]/8 bg-white p-4 shadow-[0_24px_74px_rgba(17,24,39,0.13),inset_0_1px_0_rgba(255,255,255,0.90)]">
                <input type="hidden" name="propertyId" value={property.id} />
                <input type="hidden" name="category" value={defaultCategory} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Place">
                    <input name="title" className={`${inputClass} bg-[#F9FAFB]`} placeholder={activeModule === "restaurants" ? "Casa Antica" : "Sunset boat tour"} required />
                  </Field>
                  <Field label="Link">
                    <input name="url" className={`${inputClass} bg-[#F9FAFB]`} placeholder="https://maps.google.com/..." />
                  </Field>
                </div>
                <Field label="Why guests love it">
                  <textarea name="description" className={`${textareaClass} mt-2 min-h-24 bg-[#F9FAFB]`} placeholder="A candlelit terrace, handmade pasta and a perfect first evening." required />
                </Field>
                <SubmitButton pendingText="Adding..." className="mt-4 min-h-12 w-full rounded-[16px] bg-[#111827] text-white shadow-[0_18px_50px_rgba(17,24,39,0.26),inset_0_1px_0_rgba(255,255,255,0.12)]">
                  <Plus size={16} />
                  Add {activeModule === "restaurants" ? "restaurant" : "activity"}
                </SubmitButton>
              </form>

              <div className="grid gap-2">
                {visibleRecommendations.map((item) => (
                  <article key={item.id} className="rounded-[18px] border border-[#172234]/8 bg-white p-3 shadow-[0_14px_38px_rgba(17,24,39,0.075),inset_0_1px_0_rgba(255,255,255,0.84)]">
                    <form id={`recommendation-${item.id}`} action={saveRecommendationAction} className="grid gap-2">
                      <input type="hidden" name="propertyId" value={property.id} />
                      <input type="hidden" name="recommendationId" value={item.id} />
                      <input type="hidden" name="category" value={item.category || defaultCategory} />
                      <input name="title" className={`${inputClass} min-h-10 bg-[#F9FAFB] text-xs font-bold`} defaultValue={item.title} required />
                      <textarea name="description" className={`${textareaClass} min-h-20 bg-[#F9FAFB] text-xs font-semibold`} defaultValue={item.description} required />
                      <input name="url" className={`${inputClass} min-h-10 bg-[#F9FAFB] text-xs font-semibold`} defaultValue={item.url || ""} placeholder="Link only" />
                    </form>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <SubmitButton form={`recommendation-${item.id}`} pendingText="Saving..." className="min-h-10 rounded-[14px] bg-[#111827] px-4 text-xs text-white">
                        Save
                      </SubmitButton>
                      <form action={deleteRecommendationAction}>
                        <input type="hidden" name="id" value={item.id} />
                        <ConfirmSubmitButton message={`Remove ${item.title}?`} />
                      </form>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
