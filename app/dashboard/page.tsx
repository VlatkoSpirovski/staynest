import QRCode from "qrcode";
import { ExternalLink, Home, LinkIcon, LogOut, Plus, QrCode, Save } from "lucide-react";
import { logoutOwner } from "@/app/auth-actions";
import { AiPlaceholders } from "@/components/ai-placeholders";
import { CollapsibleSection } from "@/components/collapsible-section";
import { ConfirmSubmitButton } from "@/components/confirm-submit";
import { CopyButton } from "@/components/copy-button";
import { ImageUploadField } from "@/components/image-upload-field";
import { Button } from "@/components/ui/button";
import { Field, inputClass, Panel, textareaClass } from "@/components/ui/panel";
import { SubmitButton } from "@/components/submit-button";
import { deleteRecommendation, saveProperty, saveRecommendation, saveReviewLinks } from "@/app/actions";
import { requireReadyUser } from "@/lib/auth";
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

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await requireReadyUser();
  const property = await getDashboardProperty(user.id);
  const publicUrl = property ? `${getAppUrl()}/stay/${property.slug}` : "";
  const qrCode = publicUrl ? await QRCode.toDataURL(publicUrl, { margin: 1, width: 240, color: { dark: "#1f2933" } }) : "";
  const success = savedMessage(searchParams?.saved);

  return (
    <main className="min-h-screen bg-mist text-ink">
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-lagoon text-white">
              <Home size={19} />
            </div>
            <div>
              <h1 className="font-bold">StayNest Dashboard</h1>
              <p className="text-sm text-ink/55">Signed in as {user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
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

      <div className="mx-auto grid max-w-7xl gap-5 px-5 py-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-5">
          {success ? <div className="rounded-[8px] border border-olive/20 bg-olive/10 px-4 py-3 text-sm font-semibold text-olive">{success}</div> : null}
          {searchParams?.error ? <div className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{searchParams.error}</div> : null}

          <CollapsibleSection eyebrow="Property setup" title={property ? property.name : "Create your first property"} defaultOpen>
            <div className="mb-5 flex justify-end">
              <AiPlaceholders />
            </div>
            <form action={saveProperty} className="grid gap-5">
              <input type="hidden" name="propertyId" value={property?.id || ""} />

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Property name">
                  <input name="name" className={inputClass} defaultValue={property?.name || "Villa Beti"} required />
                </Field>
                <Field label="Public slug">
                  <input name="slug" className={inputClass} defaultValue={property?.slug || "villa-beti"} required pattern="[a-z0-9-]+" />
                </Field>
                <Field label="Accent color" hint="Used on the public guest guide.">
                  <input name="accentColor" className={inputClass} defaultValue={property?.accentColor || "#4a8a8f"} type="color" />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <ImageUploadField
                  label="Property logo"
                  fileName="logoFile"
                  urlName="logoUrl"
                  removeName="removeLogo"
                  currentUrl={property?.logoUrl}
                />
                <ImageUploadField
                  label="Cover image"
                  fileName="coverImageFile"
                  urlName="coverImageUrl"
                  removeName="removeCoverImage"
                  currentUrl={property?.coverImageUrl}
                />
              </div>

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

              <CollapsibleSection title="Guest information" defaultOpen={false} className="shadow-none">
                <div className="grid gap-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Check-in info">
                      <textarea name="checkInInfo" className={textareaClass} defaultValue={property?.checkInInfo || ""} />
                    </Field>
                    <Field label="Check-out info">
                      <textarea name="checkOutInfo" className={textareaClass} defaultValue={property?.checkOutInfo || ""} />
                    </Field>
                  </div>
                  <Field label="Parking info">
                    <textarea name="parkingInfo" className={textareaClass} defaultValue={property?.parkingInfo || ""} />
                  </Field>
                  <Field label="House rules">
                    <textarea name="houseRules" className={textareaClass} defaultValue={property?.houseRules || ""} />
                  </Field>
                  <Field label="Emergency contacts">
                    <textarea name="emergencyInfo" className={textareaClass} defaultValue={property?.emergencyInfo || ""} />
                  </Field>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Field label="Host contact name">
                      <input name="hostContactName" className={inputClass} defaultValue={property?.hostContactName || ""} />
                    </Field>
                    <Field label="Host phone" hint="Required unless host email is set.">
                      <input name="hostPhone" className={inputClass} defaultValue={property?.hostPhone || ""} />
                    </Field>
                    <Field label="Host email" hint="Required unless host phone is set.">
                      <input name="hostEmail" className={inputClass} defaultValue={property?.hostEmail || ""} type="email" />
                    </Field>
                  </div>
                </div>
              </CollapsibleSection>

              <SubmitButton pendingText="Saving property..." className="w-full sm:w-fit">
                <Save size={17} />
                Save Property
              </SubmitButton>
            </form>
          </CollapsibleSection>

          {property ? (
            <>
              <CollapsibleSection eyebrow="Local recommendations" title="Recommendations" defaultOpen={false}>
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
                  <ImageUploadField
                    label="Recommendation image"
                    fileName="recommendationImageFile"
                    urlName="imageUrl"
                    removeName="removeRecommendationImage"
                  />
                  <SubmitButton variant="secondary" pendingText="Adding..." className="w-full sm:w-fit">
                    <Plus size={16} />
                    Add recommendation
                  </SubmitButton>
                </form>

                <div className="mt-6 grid gap-3">
                  {property.recommendations.length === 0 ? (
                    <div className="rounded-[8px] border border-dashed border-ink/15 bg-mist p-5 text-sm text-ink/60">
                      No recommendations yet. Add restaurants, beaches, viewpoints or practical places guests should know.
                    </div>
                  ) : (
                    property.recommendations.map((item) => (
                      <article key={item.id} className="grid gap-3 rounded-[8px] border border-ink/10 bg-mist p-4">
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
                          <ImageUploadField
                            label="Recommendation image"
                            fileName="recommendationImageFile"
                            urlName="imageUrl"
                            removeName="removeRecommendationImage"
                            currentUrl={item.imageUrl}
                          />
                        </form>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-lagoon">
                            {item.url ? <LinkIcon size={15} /> : null}
                            {item.category}
                          </div>
                          <div className="flex items-center gap-3">
                            <SubmitButton form={`recommendation-${item.id}`} variant="secondary" pendingText="Saving...">Save</SubmitButton>
                            <form action={deleteRecommendation}>
                              <input type="hidden" name="id" value={item.id} />
                              <ConfirmSubmitButton message={`Remove ${item.title}?`} />
                            </form>
                          </div>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </CollapsibleSection>

              <CollapsibleSection eyebrow="Reviews" title="Review links" defaultOpen={false}>
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
                    Save review links
                  </SubmitButton>
                </form>
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
          <CollapsibleSection eyebrow="Public guide" title="QR/public link" defaultOpen>
            {property ? (
              <div className="grid gap-4">
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
              <p className="text-sm leading-6 text-ink/60">Save your first property to generate a public guide URL and QR code.</p>
            )}
          </CollapsibleSection>

          <Panel>
            <p className="text-sm font-semibold text-lagoon">Plan</p>
            <div className="mt-2">
              <span className="text-3xl font-bold">€15</span>
              <span className="text-sm text-ink/55"> / property / month</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-ink/60">Stripe is intentionally left out for this MVP.</p>
          </Panel>
        </aside>
      </div>
    </main>
  );
}
