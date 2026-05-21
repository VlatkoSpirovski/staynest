import QRCode from "qrcode";
import {
  BadgeCheck,
  ExternalLink,
  Home,
  ImageIcon,
  KeyRound,
  LinkIcon,
  LogOut,
  MapPin,
  MessageSquareText,
  Plus,
  QrCode,
  Save,
  Star,
  Wifi
} from "lucide-react";
import { logoutOwner } from "@/app/auth-actions";
import { deleteRecommendation, saveProperty, saveRecommendation, saveReviewLinks } from "@/app/actions";
import { CollapsibleSection } from "@/components/collapsible-section";
import { ConfirmSubmitButton } from "@/components/confirm-submit";
import { CopyButton } from "@/components/copy-button";
import { ImageUploadField } from "@/components/image-upload-field";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Field, inputClass, Panel, textareaClass } from "@/components/ui/panel";
import { requireReadyUser } from "@/lib/auth";
import { isUploadConfigured } from "@/lib/image-upload";
import { prisma } from "@/lib/prisma";
import { getAppUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams?: {
    saved?: string;
    error?: string;
  };
};

async function getDashboardProperty(ownerId: string) {
  return prisma.property.findFirst({
    where: { ownerId },
    orderBy: { updatedAt: "desc" },
    include: {
      recommendations: { orderBy: { sortOrder: "asc" } },
      reviewLinks: true
    }
  });
}

function reviewValue(property: Awaited<ReturnType<typeof getDashboardProperty>>, platform: string) {
  return property?.reviewLinks.find((link) => link.platform === platform)?.url || "";
}

function savedMessage(saved?: string) {
  if (saved === "property") return "Property guide saved.";
  if (saved === "recommendation") return "Recommendation saved.";
  if (saved === "recommendation-removed") return "Recommendation removed.";
  if (saved === "reviews") return "Review links saved.";
  return null;
}

function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  text
}: {
  icon: typeof Home;
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 border-b border-ink/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[8px] bg-ink text-white shadow-soft">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-lagoon">{eyebrow}</p>
          <h3 className="mt-1 text-xl font-bold">{title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/60">{text}</p>
        </div>
      </div>
    </div>
  );
}

function SubPanel({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`rounded-[8px] border border-ink/10 bg-white/75 p-4 shadow-[0_12px_38px_rgba(31,41,51,0.06)] ${className}`}>{children}</div>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await requireReadyUser();
  const property = await getDashboardProperty(user.id);
  const publicUrl = property ? `${getAppUrl()}/stay/${property.slug}` : "";
  const qrCode = publicUrl ? await QRCode.toDataURL(publicUrl, { margin: 1, width: 240, color: { dark: "#1f2933" } }) : "";
  const success = savedMessage(searchParams?.saved);
  const uploadsEnabled = isUploadConfigured();

  return (
    <main className="min-h-screen bg-mist text-ink">
      <header className="border-b border-ink/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-ink text-white shadow-soft">
              <Home size={19} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-lagoon">Host workspace</p>
              <h1 className="text-lg font-bold">StayNest Dashboard</h1>
              <p className="text-sm text-ink/55">Signed in as {user.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {user.role === "ADMIN" ? (
              <Button href="/admin" variant="secondary">
                Admin
              </Button>
            ) : null}
            <Button href={property ? `/stay/${property.slug}` : "/"} variant="secondary" className="gap-2">
              <ExternalLink size={16} />
              Public Guide
            </Button>
            <form action={logoutOwner}>
              <button type="submit" title="Log out" className="focus-ring inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-semibold text-ink ring-1 ring-ink/10 transition hover:bg-white/80">
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-5 py-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-5">
          {success ? <div className="rounded-[8px] border border-olive/20 bg-olive/10 px-4 py-3 text-sm font-semibold text-olive">{success}</div> : null}
          {searchParams?.error ? <div className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{searchParams.error}</div> : null}

          <CollapsibleSection eyebrow="Property guide" title={property ? property.name : "Create your first property"} defaultOpen>
            <form action={saveProperty} className="grid gap-5">
              <input type="hidden" name="propertyId" value={property?.id || ""} />

              <SubPanel>
                <SectionHeader
                  icon={BadgeCheck}
                  eyebrow="Essentials"
                  title="Identity and public link"
                  text="These fields shape the public guide name, URL and visual accent."
                />
                <div className="grid gap-4 md:grid-cols-[1fr_1fr_150px]">
                  <Field label="Property name">
                    <input name="name" className={inputClass} defaultValue={property?.name || "Example Stay"} required />
                  </Field>
                  <Field label="Public slug">
                    <input name="slug" className={inputClass} defaultValue={property?.slug || "example-stay"} required pattern="[a-z0-9-]+" />
                  </Field>
                  <Field label="Accent color">
                    <input name="accentColor" className={`${inputClass} p-1`} defaultValue={property?.accentColor || "#4a8a8f"} type="color" />
                  </Field>
                </div>
              </SubPanel>

              <SubPanel>
                <SectionHeader
                  icon={ImageIcon}
                  eyebrow="Brand visuals"
                  title="Logo and cover image"
                  text="Use a crisp logo and a bright cover image. These are the first signals guests see."
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <ImageUploadField
                    label="Property logo"
                    fileName="logoFile"
                    urlName="logoUrl"
                    removeName="removeLogo"
                    currentUrl={property?.logoUrl}
                    uploadsEnabled={uploadsEnabled}
                  />
                  <ImageUploadField
                    label="Cover image"
                    fileName="coverImageFile"
                    urlName="coverImageUrl"
                    removeName="removeCoverImage"
                    currentUrl={property?.coverImageUrl}
                    uploadsEnabled={uploadsEnabled}
                  />
                </div>
              </SubPanel>

              <SubPanel>
                <SectionHeader
                  icon={Wifi}
                  eyebrow="Guest essentials"
                  title="Welcome, Wi-Fi and arrival basics"
                  text="Keep this part practical. It should answer the questions guests ask first."
                />
                <div className="grid gap-4">
                  <Field label="Welcome message">
                    <textarea name="welcomeMessage" className={textareaClass} defaultValue={property?.welcomeMessage || ""} />
                  </Field>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Wi-Fi network">
                      <input name="wifiName" className={inputClass} defaultValue={property?.wifiName || ""} required />
                    </Field>
                    <Field label="Wi-Fi password">
                      <input name="wifiPassword" className={inputClass} defaultValue={property?.wifiPassword || ""} required />
                    </Field>
                  </div>
                </div>
              </SubPanel>

              <SubPanel>
                <SectionHeader
                  icon={KeyRound}
                  eyebrow="Stay instructions"
                  title="Check-in, rules and contact details"
                  text="Separate operational details so guests can jump straight to what they need during the stay."
                />
                <div className="grid gap-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Check-in info">
                      <textarea name="checkInInfo" className={textareaClass} defaultValue={property?.checkInInfo || ""} />
                    </Field>
                    <Field label="Check-out info">
                      <textarea name="checkOutInfo" className={textareaClass} defaultValue={property?.checkOutInfo || ""} />
                    </Field>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Parking info">
                      <textarea name="parkingInfo" className={textareaClass} defaultValue={property?.parkingInfo || ""} />
                    </Field>
                    <Field label="House rules">
                      <textarea name="houseRules" className={textareaClass} defaultValue={property?.houseRules || ""} />
                    </Field>
                  </div>
                  <Field label="Emergency contacts">
                    <textarea name="emergencyInfo" className={textareaClass} defaultValue={property?.emergencyInfo || ""} />
                  </Field>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Field label="Host contact name">
                      <input name="hostContactName" className={inputClass} defaultValue={property?.hostContactName || ""} />
                    </Field>
                    <Field label="Host phone">
                      <input name="hostPhone" className={inputClass} defaultValue={property?.hostPhone || ""} required />
                    </Field>
                    <Field label="Host email">
                      <input name="hostEmail" className={inputClass} defaultValue={property?.hostEmail || ""} type="email" required />
                    </Field>
                  </div>
                </div>
              </SubPanel>

              <div className="flex justify-end rounded-[8px] border border-ink/10 bg-white p-3 shadow-[0_12px_34px_rgba(31,41,51,0.06)]">
                <SubmitButton pendingText="Saving property..." className="w-full sm:w-fit">
                  <Save size={17} />
                  Save Property
                </SubmitButton>
              </div>
            </form>
          </CollapsibleSection>

          {property ? (
            <>
              <CollapsibleSection eyebrow="Local guide" title="Recommendations" defaultOpen={false}>
                <div className="grid gap-5">
                  <SubPanel>
                    <SectionHeader
                      icon={MapPin}
                      eyebrow="Add a place"
                      title="Recommend restaurants, beaches and useful stops"
                      text="Each recommendation appears as a polished card in the guest guide."
                    />
                    <form action={saveRecommendation} className="grid gap-4">
                      <input type="hidden" name="propertyId" value={property.id} />
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Title">
                          <input name="title" className={inputClass} placeholder="Beach restaurant" required />
                        </Field>
                        <Field label="Category">
                          <input name="category" className={inputClass} placeholder="Restaurant" required />
                        </Field>
                      </div>
                      <Field label="Description">
                        <textarea name="description" className={textareaClass} placeholder="Why guests should go there..." required />
                      </Field>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Address">
                          <input name="address" className={inputClass} />
                        </Field>
                        <Field label="Map or website URL">
                          <input name="url" className={inputClass} placeholder="https://maps.google.com" />
                        </Field>
                      </div>
                      <SubmitButton variant="secondary" pendingText="Adding..." className="w-full sm:w-fit">
                        <Plus size={16} />
                        Save recommendation
                      </SubmitButton>
                    </form>
                  </SubPanel>

                  <div className="grid gap-3">
                    {property.recommendations.length === 0 ? (
                      <div className="rounded-[8px] border border-dashed border-ink/15 bg-mist p-5 text-sm text-ink/60">
                        No recommendations yet. Add restaurants, beaches, viewpoints or practical places guests should know.
                      </div>
                    ) : (
                      property.recommendations.map((item) => (
                        <article key={item.id} className="grid gap-4 rounded-[8px] border border-ink/10 bg-white p-4 shadow-[0_12px_34px_rgba(31,41,51,0.06)]">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-[0.16em] text-lagoon">{item.category}</p>
                              <h3 className="mt-1 text-lg font-bold">{item.title}</h3>
                            </div>
                            {item.url ? (
                              <span className="inline-flex items-center gap-2 rounded-full bg-mist px-3 py-2 text-xs font-semibold text-ink/60">
                                <LinkIcon size={14} />
                                Link added
                              </span>
                            ) : null}
                          </div>
                          <form action={saveRecommendation} className="grid gap-3" id={`recommendation-${item.id}`}>
                            <input type="hidden" name="propertyId" value={property.id} />
                            <input type="hidden" name="recommendationId" value={item.id} />
                            <div className="grid gap-3 md:grid-cols-2">
                              <input name="title" className={inputClass} defaultValue={item.title} required />
                              <input name="category" className={inputClass} defaultValue={item.category} required />
                            </div>
                            <textarea name="description" className={textareaClass} defaultValue={item.description} required />
                            <div className="grid gap-3 md:grid-cols-2">
                              <input name="address" className={inputClass} defaultValue={item.address || ""} placeholder="Address" />
                              <input name="url" className={inputClass} defaultValue={item.url || ""} placeholder="Map or website URL" />
                            </div>
                          </form>
                          <div className="flex flex-wrap items-center justify-end gap-3">
                            <SubmitButton form={`recommendation-${item.id}`} variant="secondary" pendingText="Saving...">
                              Save recommendation
                            </SubmitButton>
                            <form action={deleteRecommendation}>
                              <input type="hidden" name="id" value={item.id} />
                              <ConfirmSubmitButton message={`Remove ${item.title}?`} />
                            </form>
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection eyebrow="Guest feedback" title="Review links" defaultOpen={false}>
                <SubPanel>
                  <SectionHeader
                    icon={Star}
                    eyebrow="Reputation"
                    title="Send guests to the right review pages"
                    text="Add only the platforms you actively use. Empty fields are hidden from the public guide."
                  />
                  <form action={saveReviewLinks} className="grid gap-4">
                    <input type="hidden" name="propertyId" value={property.id} />
                    <Field label="Google review link">
                      <input name="google" className={inputClass} defaultValue={reviewValue(property, "GOOGLE")} placeholder="https://..." />
                    </Field>
                    <Field label="Booking review link">
                      <input name="booking" className={inputClass} defaultValue={reviewValue(property, "BOOKING")} placeholder="https://..." />
                    </Field>
                    <Field label="Airbnb review link">
                      <input name="airbnb" className={inputClass} defaultValue={reviewValue(property, "AIRBNB")} placeholder="https://..." />
                    </Field>
                    <SubmitButton variant="secondary" pendingText="Saving links..." className="w-full sm:w-fit">
                      Save reviews
                    </SubmitButton>
                  </form>
                </SubPanel>
              </CollapsibleSection>
            </>
          ) : (
            <Panel>
              <h2 className="text-xl font-bold">No property yet</h2>
              <p className="mt-2 text-sm leading-6 text-ink/60">Create and save your first property above. Your public guide link and QR code will appear immediately.</p>
            </Panel>
          )}
        </div>

        <aside className="grid h-fit gap-5 lg:sticky lg:top-5">
          <Panel className="overflow-hidden p-0">
            <div className="bg-ink p-5 text-white">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">Public guide</p>
                  <h2 className="mt-1 text-2xl font-bold">QR and live link</h2>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-[8px] bg-white/10">
                  <QrCode size={24} />
                </div>
              </div>
            </div>
            {property ? (
              <div className="grid gap-4 p-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrCode} alt="QR code for public guest guide" className="mx-auto h-52 w-52 rounded-[8px] bg-white p-3 ring-1 ring-ink/10" />
                <div className="break-all rounded-[8px] bg-mist p-3 text-sm text-ink/70">{publicUrl}</div>
                <Button href={`/stay/${property.slug}`} variant="secondary" className="gap-2">
                  <ExternalLink size={16} />
                  Open guide
                </Button>
                <CopyButton value={publicUrl} label="Copy link" copiedLabel="Link copied" />
              </div>
            ) : (
              <p className="p-5 text-sm leading-6 text-ink/60">Save your first property to generate a public guide URL and QR code.</p>
            )}
          </Panel>

          <Panel>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-clay/10 text-clay">
                <MessageSquareText size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-lagoon">Plan</p>
                <div>
                  <span className="text-3xl font-bold">€15</span>
                  <span className="text-sm text-ink/55"> / property / month</span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-ink/60">Stripe is intentionally left out for this MVP.</p>
          </Panel>
        </aside>
      </div>
    </main>
  );
}
