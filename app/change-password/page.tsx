import { changePassword } from "@/app/auth-actions";
import { AuthAlert, AuthShell, authButtonClass } from "@/components/auth-shell";
import { SubmitButton } from "@/components/submit-button";
import { Field, inputClass } from "@/components/ui/panel";
import { requireCurrentUser } from "@/lib/auth";
import { passwordRulesText } from "@/lib/password-policy";

export const metadata = {
  title: "Change password",
  robots: {
    index: false,
    follow: false
  }
};

type ChangePasswordPageProps = {
  searchParams?: {
    error?: string;
  };
};

export default async function ChangePasswordPage({ searchParams }: ChangePasswordPageProps) {
  const user = await requireCurrentUser();

  return (
    <AuthShell
      title={user.mustChangePassword ? "Set your own password" : "Change password"}
      subtitle={user.mustChangePassword ? "Replace the temporary password before you open your dashboard." : passwordRulesText()}
      legal={false}
    >
      {searchParams?.error ? <AuthAlert tone="error">{searchParams.error}</AuthAlert> : null}
      <form action={changePassword} className="mt-6 grid gap-4">
        <Field label="Current password">
          <input name="currentPassword" className={inputClass} type="password" autoComplete="current-password" required />
        </Field>
        <Field label="New password">
          <input name="newPassword" className={inputClass} type="password" autoComplete="new-password" minLength={8} required />
        </Field>
        <Field label="Confirm new password">
          <input name="confirmPassword" className={inputClass} type="password" autoComplete="new-password" minLength={8} required />
        </Field>
        {user.mustChangePassword ? <p className="-mt-1 text-xs leading-5 text-sn-muted">{passwordRulesText()}</p> : null}
        <SubmitButton pendingText="Saving..." className={authButtonClass}>
          Save password
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
