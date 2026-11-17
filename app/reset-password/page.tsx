import { resetPassword } from "@/app/auth-actions";
import { AuthAlert, AuthShell, authButtonClass } from "@/components/auth-shell";
import { SubmitButton } from "@/components/submit-button";
import { Field, inputClass } from "@/components/ui/panel";
import { passwordRulesText } from "@/lib/password-policy";

export const metadata = {
  title: "Reset password",
  robots: {
    index: false,
    follow: false
  }
};

type ResetPasswordPageProps = {
  searchParams?: {
    token?: string;
    error?: string;
  };
};

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  return (
    <AuthShell title="Choose a new password" subtitle={passwordRulesText()}>
      {searchParams?.error ? <AuthAlert tone="error">{searchParams.error}</AuthAlert> : null}
      <form action={resetPassword} className="mt-6 grid gap-4">
        <input type="hidden" name="token" value={searchParams?.token || ""} />
        <Field label="New password">
          <input name="newPassword" className={inputClass} type="password" autoComplete="new-password" minLength={8} required />
        </Field>
        <Field label="Confirm new password">
          <input name="confirmPassword" className={inputClass} type="password" autoComplete="new-password" minLength={8} required />
        </Field>
        <SubmitButton pendingText="Saving..." className={authButtonClass}>
          Save new password
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
