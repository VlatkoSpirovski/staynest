import { requestPasswordReset } from "@/app/auth-actions";
import { AuthAlert, AuthShell, authButtonClass } from "@/components/auth-shell";
import { SubmitButton } from "@/components/submit-button";
import { Field, inputClass } from "@/components/ui/panel";

export const metadata = {
  title: "Forgot password",
  robots: {
    index: false,
    follow: false
  }
};

type ForgotPasswordPageProps = {
  searchParams?: {
    error?: string;
    sent?: string;
    email?: string;
  };
};

export default function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  return (
    <AuthShell title="Reset your password" subtitle="Enter your email and we send you a link to choose a new password.">
      {searchParams?.error ? <AuthAlert tone="error">{searchParams.error}</AuthAlert> : null}
      {searchParams?.sent ? (
        <AuthAlert tone="success">If an account exists for that email, we sent a reset link. Check your inbox and spam folder.</AuthAlert>
      ) : null}
      <form action={requestPasswordReset} className="mt-6 grid gap-4">
        <Field label="Email">
          <input name="email" className={inputClass} defaultValue={searchParams?.email || ""} type="email" autoComplete="email" required />
        </Field>
        <SubmitButton pendingText="Sending..." className={authButtonClass}>
          Send reset link
        </SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-sn-muted">
        Remembered it?{" "}
        <a href="/login" className="font-semibold text-sn-accent">
          Back to login
        </a>
      </p>
    </AuthShell>
  );
}
