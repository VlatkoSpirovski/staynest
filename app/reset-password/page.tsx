import { KeyRound } from "lucide-react";
import { resetPassword } from "@/app/auth-actions";
import { AppLegalLinks } from "@/components/app-legal-links";
import { Button } from "@/components/ui/button";
import { Field, inputClass, Panel } from "@/components/ui/panel";

type ResetPasswordPageProps = {
  searchParams?: {
    token?: string;
    error?: string;
  };
};

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-mist px-5 py-10 text-ink">
      <Panel className="w-full max-w-md">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-lagoon text-white">
            <KeyRound size={19} />
          </div>
          <div>
            <h1 className="text-xl font-bold">Choose a new password</h1>
            <p className="text-sm text-ink/60">Set a secure password for your account.</p>
          </div>
        </div>
        {searchParams?.error ? (
          <div className="mb-4 rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {searchParams.error}
          </div>
        ) : null}
        <form action={resetPassword} className="grid gap-4">
          <input type="hidden" name="token" value={searchParams?.token || ""} />
          <Field label="New password">
            <input name="newPassword" className={inputClass} type="password" autoComplete="new-password" required />
          </Field>
          <Field label="Confirm new password">
            <input name="confirmPassword" className={inputClass} type="password" autoComplete="new-password" required />
          </Field>
          <Button type="submit" className="mt-2">
            Reset password
          </Button>
        </form>
        <AppLegalLinks className="mt-6 border-t border-ink/10 pt-5" />
      </Panel>
    </main>
  );
}
