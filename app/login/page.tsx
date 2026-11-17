import { AppLegalLinks } from "@/components/app-legal-links";
import { GoogleMark } from "@/components/google-mark";
import { InAppBrowserNotice } from "@/components/in-app-browser-notice";
import { LoadingLink } from "@/components/loading-link";
import { SubmitButton } from "@/components/submit-button";
import { Field, inputClass } from "@/components/ui/panel";
import { loginOwner } from "@/app/auth-actions";

export const metadata = {
  title: "Owner login",
  robots: {
    index: false,
    follow: false
  }
};

type LoginPageProps = {
  searchParams?: {
    error?: string;
    next?: string;
    reset?: string;
  };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-sn-canvas px-5 py-10 text-sn-ink">
      <section className="w-full max-w-[420px] rounded-[28px] border border-sn-line/8 bg-white p-6 shadow-[0_24px_70px_rgba(17,24,39,0.06)] sm:p-8">
        <a href="/" className="inline-flex items-center gap-2 text-sm font-bold">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/staynest-logo.png" alt="" className="h-8 w-8 object-contain" />
          StayNest
        </a>
        <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.02em]">Welcome back</h1>
        <p className="mt-2 text-[15px] text-sn-muted">Log in to manage your guest guide.</p>

        {searchParams?.error ? (
          <div role="alert" className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {searchParams.error}
          </div>
        ) : null}
        {searchParams?.reset ? (
          <div role="status" className="mt-5 rounded-2xl bg-sn-accent-soft px-4 py-3 text-sm font-medium text-sn-accent">
            Password reset. You can log in now.
          </div>
        ) : null}

        <div className="mt-5">
          <InAppBrowserNotice />
        </div>

        <LoadingLink
          href="/auth/google"
          loadingText="Opening Google..."
          eventName="login_google_started"
          className="focus-ring mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-[15px] font-semibold text-sn-ink ring-1 ring-sn-line/15 transition hover:ring-sn-line/30"
        >
          <span className="grid h-6 w-6 place-items-center rounded-full bg-white">
            <GoogleMark />
          </span>
          Continue with Google
        </LoadingLink>

        <div className="my-6 flex items-center gap-3 text-xs font-medium text-sn-muted">
          <div className="h-px flex-1 bg-sn-line/10" />
          or with email
          <div className="h-px flex-1 bg-sn-line/10" />
        </div>

        <form action={loginOwner} className="grid gap-4">
          <input type="hidden" name="next" value={searchParams?.next || "/dashboard"} />
          <Field label="Email">
            <input name="email" className={inputClass} type="email" autoComplete="email" required />
          </Field>
          <Field label="Password">
            <input name="password" className={inputClass} type="password" autoComplete="current-password" required />
          </Field>
          <a href="/forgot-password" className="-mt-1 justify-self-end text-sm font-semibold text-sn-accent">
            Forgot password?
          </a>
          <SubmitButton pendingText="Logging in..." className="min-h-12 rounded-full bg-sn-ink text-[15px] font-semibold text-white hover:bg-sn-ink/90">
            Log in
          </SubmitButton>
        </form>

        <p className="mt-6 text-center text-sm text-sn-muted">
          New to StayNest?{" "}
          <a href="/register?plan=ai" className="font-semibold text-sn-accent">
            Create your free guide
          </a>
        </p>
      </section>
      <AppLegalLinks className="mt-10 max-w-md text-sn-muted" />
    </main>
  );
}
