import { KeyRound } from "lucide-react";
import { changePassword } from "@/app/auth-actions";
import { Button } from "@/components/ui/button";
import { Field, inputClass, Panel } from "@/components/ui/panel";
import { requireCurrentUser } from "@/lib/auth";
import { passwordRulesText } from "@/lib/password-policy";

type ChangePasswordPageProps = {
  searchParams?: {
    error?: string;
  };
};

export default async function ChangePasswordPage({ searchParams }: ChangePasswordPageProps) {
  const user = await requireCurrentUser();

  return (
    <main className="grid min-h-screen place-items-center bg-mist px-5 py-10 text-ink">
      <Panel className="w-full max-w-md">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-lagoon text-white">
            <KeyRound size={19} />
          </div>
          <div>
            <h1 className="text-xl font-bold">Change password</h1>
            <p className="text-sm text-ink/60">{user.mustChangePassword ? "Required before dashboard access" : "Update your account password"}</p>
          </div>
        </div>
        {searchParams?.error ? (
          <div className="mb-4 rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {searchParams.error}
          </div>
        ) : null}
        <form action={changePassword} className="grid gap-4">
          <Field label="Current password">
            <input name="currentPassword" className={inputClass} type="password" autoComplete="current-password" required />
          </Field>
          <Field label="New password" hint={passwordRulesText()}>
            <input name="newPassword" className={inputClass} type="password" autoComplete="new-password" required />
          </Field>
          <Field label="Confirm new password">
            <input name="confirmPassword" className={inputClass} type="password" autoComplete="new-password" required />
          </Field>
          <Button type="submit" className="mt-2">
            Save password
          </Button>
        </form>
      </Panel>
    </main>
  );
}
