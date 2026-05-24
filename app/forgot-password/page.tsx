import { Mail } from "lucide-react";
import { requestPasswordReset } from "@/app/auth-actions";
import { AppLegalLinks } from "@/components/app-legal-links";
import { Button } from "@/components/ui/button";
import { Field, inputClass, Panel } from "@/components/ui/panel";

type ForgotPasswordPageProps = {
  searchParams?: {
    error?: string;
    sent?: string;
    email?: string;
  };
};

export default function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-mist px-5 py-10 text-ink">
      <Panel className="w-full max-w-md">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-lagoon text-white">
            <Mail size={19} />
          </div>
          <div>
            <h1 className="text-xl font-bold">Reset password</h1>
            <p className="text-sm text-ink/60">We will send a reset link if the account exists.</p>
          </div>
        </div>
        {searchParams?.error ? (
          <div className="mb-4 rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {searchParams.error}
          </div>
        ) : null}
        {searchParams?.sent ? (
          <div className="mb-4 rounded-[8px] border border-olive/20 bg-olive/10 px-3 py-2 text-sm font-medium text-olive">
            If an account exists, a reset link was sent. In local dev, check the terminal.
          </div>
        ) : null}
        <form action={requestPasswordReset} className="grid gap-4">
          <Field label="Email">
            <input name="email" className={inputClass} defaultValue={searchParams?.email || ""} type="email" autoComplete="email" required />
          </Field>
          <Button type="submit" className="mt-2">
            Send reset link
          </Button>
        </form>
        <Button href="/login" variant="ghost" className="mt-4 w-full">
          Back to login
        </Button>
        <AppLegalLinks className="mt-6 border-t border-ink/10 pt-5" />
      </Panel>
    </main>
  );
}
