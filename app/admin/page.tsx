import { ExternalLink, Shield, Trash2 } from "lucide-react";
import { logoutOwner } from "@/app/auth-actions";
import {
  createAdminProperty,
  createUser,
  deleteAdminProperty,
  deleteAdminRecommendation,
  deleteUser,
  saveAdminRecommendation,
  saveAdminReviewLinks,
  updateAdminProperty,
  updateUser
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Field, inputClass, Panel, textareaClass } from "@/components/ui/panel";
import { requireAdminUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type AdminPageProps = {
  searchParams?: {
    error?: string;
  };
};

async function getAdminData() {
  const [users, properties] = await Promise.all([
    prisma.user.findMany({
      orderBy: [{ role: "asc" }, { createdAt: "desc" }],
      include: {
        properties: {
          select: { id: true }
        }
      }
    }),
    prisma.property.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        owner: true,
        recommendations: { orderBy: { sortOrder: "asc" } },
        reviewLinks: true
      }
    })
  ]);

  return { users, properties };
}

function reviewValue(property: Awaited<ReturnType<typeof getAdminData>>["properties"][number], platform: string) {
  return property.reviewLinks.find((link) => link.platform === platform)?.url || "";
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const admin = await requireAdminUser();
  const { users, properties } = await getAdminData();
  const owners = users.filter((user) => user.role === "OWNER");

  return (
    <main className="min-h-screen bg-mist text-ink">
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-ink text-white">
              <Shield size={19} />
            </div>
            <div>
              <h1 className="font-bold">StayNest Admin</h1>
              <p className="text-sm text-ink/55">Signed in as {admin.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button href="/dashboard" variant="secondary">
              Dashboard
            </Button>
            <form action={logoutOwner}>
              <button type="submit" className="focus-ring inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-semibold text-ink ring-1 ring-ink/10">
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-5 py-6">
        {searchParams?.error ? (
          <div className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{searchParams.error}</div>
        ) : null}

        <Panel>
          <p className="text-sm font-semibold text-lagoon">Platform workflow</p>
          <h2 className="text-2xl font-bold">How accounts work</h2>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-ink/65 md:grid-cols-3">
            <p>
              <strong className="block text-ink">1. You are the platform admin.</strong>
              Use this page to create host accounts and manage properties.
            </p>
            <p>
              <strong className="block text-ink">2. Hosts are owners.</strong>
              Create them with role OWNER and give them a temporary password.
            </p>
            <p>
              <strong className="block text-ink">3. Assign a property.</strong>
              The host logs in, changes their password, and edits their guest guide.
            </p>
          </div>
        </Panel>

        <Panel>
          <p className="text-sm font-semibold text-lagoon">Hosts and admins</p>
          <h2 className="mb-2 text-2xl font-bold">Create account</h2>
          <p className="mb-5 text-sm leading-6 text-ink/60">
            Use OWNER for rental hosts. Use ADMIN only for people who should manage all StayNest users and properties.
          </p>
          <form action={createUser} className="grid gap-4 md:grid-cols-2">
            <Field label="Name">
              <input name="name" className={inputClass} required />
            </Field>
            <Field label="Email">
              <input name="email" className={inputClass} type="email" required />
            </Field>
            <Field label="Temporary password">
              <input name="temporaryPassword" className={inputClass} type="password" required />
            </Field>
            <Field label="Role">
              <select name="role" className={inputClass} defaultValue="OWNER">
                <option value="OWNER">Owner / host</option>
                <option value="ADMIN">Platform admin</option>
              </select>
            </Field>
            <Button type="submit" className="md:col-span-2 md:w-fit">
              Create account
            </Button>
          </form>
        </Panel>

        <div className="grid gap-4">
          {users.map((user) => (
            <Panel key={user.id}>
              <form action={updateUser} className="grid gap-4 lg:grid-cols-[1fr_1fr_140px_1fr_auto] lg:items-end">
                <input type="hidden" name="id" value={user.id} />
                <Field label="Name">
                  <input name="name" className={inputClass} defaultValue={user.name} required />
                </Field>
                <Field label="Email">
                  <input name="email" className={inputClass} type="email" defaultValue={user.email} required />
                </Field>
                <Field label="Role">
                  <select name="role" className={inputClass} defaultValue={user.role}>
                    <option value="OWNER">Owner / host</option>
                    <option value="ADMIN">Platform admin</option>
                  </select>
                </Field>
                <Field label="New temp password">
                  <input name="temporaryPassword" className={inputClass} type="password" placeholder="Optional" />
                </Field>
                <Button type="submit" variant="secondary">
                  Save
                </Button>
              </form>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-ink/55">
                <span>
                  {user.properties.length} properties · {user.mustChangePassword ? "must change password" : "password set"}
                </span>
                <form action={deleteUser}>
                  <input type="hidden" name="id" value={user.id} />
                  <button type="submit" className="inline-flex items-center gap-2 text-sm font-semibold text-red-600">
                    <Trash2 size={15} />
                    Delete user
                  </button>
                </form>
              </div>
            </Panel>
          ))}
        </div>

        <Panel>
          <p className="text-sm font-semibold text-lagoon">Properties</p>
          <h2 className="mb-5 text-2xl font-bold">Create property</h2>
          <form action={createAdminProperty} className="grid gap-4 md:grid-cols-2">
            <Field label="Owner">
              <select name="ownerId" className={inputClass} required>
                <option value="">Choose owner</option>
                {owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name} · {owner.email}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Property name">
              <input name="name" className={inputClass} required />
            </Field>
            <Field label="Slug">
              <input name="slug" className={inputClass} placeholder="example-stay" />
            </Field>
            <Field label="Accent color">
              <input name="accentColor" className={inputClass} type="color" defaultValue="#4a8a8f" />
            </Field>
            <Field label="Logo URL">
              <input name="logoUrl" className={inputClass} placeholder="https://..." />
            </Field>
            <Field label="Cover image URL">
              <input name="coverImageUrl" className={inputClass} placeholder="https://..." />
            </Field>
            <Field label="Welcome message">
              <textarea name="welcomeMessage" className={textareaClass} />
            </Field>
            <Field label="Wi-Fi network">
              <input name="wifiName" className={inputClass} />
            </Field>
            <Field label="Wi-Fi password">
              <input name="wifiPassword" className={inputClass} />
            </Field>
            <Field label="Check-in info">
              <textarea name="checkInInfo" className={textareaClass} />
            </Field>
            <Field label="Check-out info">
              <textarea name="checkOutInfo" className={textareaClass} />
            </Field>
            <Field label="Parking info">
              <textarea name="parkingInfo" className={textareaClass} />
            </Field>
            <Field label="House rules">
              <textarea name="houseRules" className={textareaClass} />
            </Field>
            <Field label="Emergency contacts">
              <textarea name="emergencyInfo" className={textareaClass} />
            </Field>
            <Field label="Host contact name">
              <input name="hostContactName" className={inputClass} />
            </Field>
            <Field label="Host phone">
              <input name="hostPhone" className={inputClass} />
            </Field>
            <Field label="Host email">
              <input name="hostEmail" className={inputClass} type="email" />
            </Field>
            <Button type="submit" className="md:col-span-2 md:w-fit">
              Create property
            </Button>
          </form>
        </Panel>

        <div className="grid gap-4">
          {properties.map((property) => (
            <Panel key={property.id}>
              <form action={updateAdminProperty} className="grid gap-4 md:grid-cols-2">
                <input type="hidden" name="id" value={property.id} />
                <Field label="Owner">
                  <select name="ownerId" className={inputClass} defaultValue={property.ownerId} required>
                    {owners.map((owner) => (
                      <option key={owner.id} value={owner.id}>
                        {owner.name} · {owner.email}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Property name">
                  <input name="name" className={inputClass} defaultValue={property.name} required />
                </Field>
                <Field label="Slug">
                  <input name="slug" className={inputClass} defaultValue={property.slug} required />
                </Field>
                <Field label="Accent color">
                  <input name="accentColor" className={inputClass} type="color" defaultValue={property.accentColor} />
                </Field>
                <Field label="Logo URL">
                  <input name="logoUrl" className={inputClass} defaultValue={property.logoUrl || ""} />
                </Field>
                <Field label="Cover image URL">
                  <input name="coverImageUrl" className={inputClass} defaultValue={property.coverImageUrl || ""} />
                </Field>
                <Field label="Welcome message">
                  <textarea name="welcomeMessage" className={textareaClass} defaultValue={property.welcomeMessage} />
                </Field>
                <Field label="Wi-Fi network">
                  <input name="wifiName" className={inputClass} defaultValue={property.wifiName || ""} />
                </Field>
                <Field label="Wi-Fi password">
                  <input name="wifiPassword" className={inputClass} defaultValue={property.wifiPassword || ""} />
                </Field>
                <Field label="Check-in info">
                  <textarea name="checkInInfo" className={textareaClass} defaultValue={property.checkInInfo || ""} />
                </Field>
                <Field label="Check-out info">
                  <textarea name="checkOutInfo" className={textareaClass} defaultValue={property.checkOutInfo || ""} />
                </Field>
                <Field label="Parking info">
                  <textarea name="parkingInfo" className={textareaClass} defaultValue={property.parkingInfo || ""} />
                </Field>
                <Field label="House rules">
                  <textarea name="houseRules" className={textareaClass} defaultValue={property.houseRules || ""} />
                </Field>
                <Field label="Emergency contacts">
                  <textarea name="emergencyInfo" className={textareaClass} defaultValue={property.emergencyInfo || ""} />
                </Field>
                <Field label="Host contact name">
                  <input name="hostContactName" className={inputClass} defaultValue={property.hostContactName || ""} />
                </Field>
                <Field label="Host phone">
                  <input name="hostPhone" className={inputClass} defaultValue={property.hostPhone || ""} />
                </Field>
                <Field label="Host email">
                  <input name="hostEmail" className={inputClass} type="email" defaultValue={property.hostEmail || ""} />
                </Field>
                <div className="flex flex-wrap items-end gap-2">
                  <Button type="submit" variant="secondary">
                    Save property
                  </Button>
                  <Button href={`/stay/${property.slug}`} variant="ghost" className="gap-2">
                    <ExternalLink size={15} />
                    Public
                  </Button>
                </div>
              </form>
              <form action={deleteAdminProperty} className="mt-3">
                <input type="hidden" name="id" value={property.id} />
                <button type="submit" className="inline-flex items-center gap-2 text-sm font-semibold text-red-600">
                  <Trash2 size={15} />
                  Delete property
                </button>
              </form>

              <div className="mt-5 grid gap-4 border-t border-ink/10 pt-5">
                <div>
                  <p className="text-sm font-semibold text-lagoon">Restaurants and activities</p>
                  <h3 className="text-xl font-bold">Recommendations</h3>
                </div>
                <form action={saveAdminRecommendation} className="grid gap-3 md:grid-cols-2">
                  <input type="hidden" name="propertyId" value={property.id} />
                  <Field label="Title">
                    <input name="title" className={inputClass} placeholder="Beach restaurant" required />
                  </Field>
                  <Field label="Category">
                    <input name="category" className={inputClass} placeholder="Restaurant or Activity" required />
                  </Field>
                  <Field label="Description">
                    <textarea name="description" className={textareaClass} required />
                  </Field>
                  <div className="grid gap-3">
                    <Field label="Address">
                      <input name="address" className={inputClass} />
                    </Field>
                    <Field label="Map or website URL">
                      <input name="url" className={inputClass} placeholder="https://..." />
                    </Field>
                  </div>
                  <Button type="submit" variant="secondary" className="md:col-span-2 md:w-fit">
                    Save recommendation
                  </Button>
                </form>

                {property.recommendations.length > 0 ? (
                  <div className="grid gap-3">
                    {property.recommendations.map((item) => (
                      <form key={item.id} action={saveAdminRecommendation} className="grid gap-3 rounded-[8px] border border-ink/10 bg-mist p-4 md:grid-cols-2">
                        <input type="hidden" name="propertyId" value={property.id} />
                        <input type="hidden" name="recommendationId" value={item.id} />
                        <Field label="Title">
                          <input name="title" className={inputClass} defaultValue={item.title} required />
                        </Field>
                        <Field label="Category">
                          <input name="category" className={inputClass} defaultValue={item.category} required />
                        </Field>
                        <Field label="Description">
                          <textarea name="description" className={textareaClass} defaultValue={item.description} required />
                        </Field>
                        <div className="grid gap-3">
                          <Field label="Address">
                            <input name="address" className={inputClass} defaultValue={item.address || ""} />
                          </Field>
                          <Field label="Map or website URL">
                            <input name="url" className={inputClass} defaultValue={item.url || ""} />
                          </Field>
                        </div>
                        <div className="flex flex-wrap gap-3 md:col-span-2">
                          <Button type="submit" variant="secondary">
                            Save recommendation
                          </Button>
                          <button form={`delete-recommendation-${item.id}`} type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-red-600">
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </div>
                      </form>
                    ))}
                    {property.recommendations.map((item) => (
                      <form key={`delete-${item.id}`} id={`delete-recommendation-${item.id}`} action={deleteAdminRecommendation}>
                        <input type="hidden" name="id" value={item.id} />
                      </form>
                    ))}
                  </div>
                ) : null}

                <div className="border-t border-ink/10 pt-5">
                  <p className="text-sm font-semibold text-lagoon">Reviews</p>
                  <h3 className="text-xl font-bold">Review links</h3>
                </div>
                <form action={saveAdminReviewLinks} className="grid gap-3 md:grid-cols-3">
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
                  <Button type="submit" variant="secondary" className="md:col-span-3 md:w-fit">
                    Save reviews
                  </Button>
                </form>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </main>
  );
}
