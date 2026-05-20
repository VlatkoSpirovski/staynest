import { ExternalLink, Shield, Trash2 } from "lucide-react";
import { logoutOwner } from "@/app/auth-actions";
import { createAdminProperty, createUser, deleteAdminProperty, deleteUser, updateAdminProperty, updateUser } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Field, inputClass, Panel, textareaClass } from "@/components/ui/panel";
import { requireAdminUser } from "@/lib/auth";
import { passwordRulesText } from "@/lib/password-policy";
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
        owner: true
      }
    })
  ]);

  return { users, properties };
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
          <p className="text-sm font-semibold text-lagoon">Owners and admins</p>
          <h2 className="mb-5 text-2xl font-bold">Create user</h2>
          <form action={createUser} className="grid gap-4 md:grid-cols-2">
            <Field label="Name">
              <input name="name" className={inputClass} required />
            </Field>
            <Field label="Email">
              <input name="email" className={inputClass} type="email" required />
            </Field>
            <Field label="Temporary password" hint={passwordRulesText()}>
              <input name="temporaryPassword" className={inputClass} type="password" required />
            </Field>
            <Field label="Role">
              <select name="role" className={inputClass} defaultValue="OWNER">
                <option value="OWNER">OWNER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </Field>
            <Button type="submit" className="md:col-span-2 md:w-fit">
              Create user
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
                    <option value="OWNER">OWNER</option>
                    <option value="ADMIN">ADMIN</option>
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
              <input name="slug" className={inputClass} placeholder="villa-beti" />
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
            </Panel>
          ))}
        </div>
      </div>
    </main>
  );
}
