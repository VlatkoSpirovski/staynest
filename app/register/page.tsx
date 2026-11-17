import { CheckCircle2 } from "lucide-react";
import { AppLegalLinks } from "@/components/app-legal-links";
import { GoogleMark } from "@/components/google-mark";
import { InAppBrowserNotice } from "@/components/in-app-browser-notice";
import { LoadingLink } from "@/components/loading-link";
import { SubmitButton } from "@/components/submit-button";
import { TurnstileWidget } from "@/components/turnstile-widget";
import { Field, inputClass } from "@/components/ui/panel";
import { registerOwner } from "@/app/auth-actions";
import { findReferrer } from "@/lib/referral-service";
import { normalizeReferralCode } from "@/lib/referrals";
import { normalizePlanKey, planOption } from "@/lib/billing";
import { passwordRulesText } from "@/lib/password-policy";

export const metadata = {
  title: "Start getting more 5-star reviews",
  description:
    "Create a StayNest owner account and build a QR guest guide with AI answers, Google review links, Booking.com review links and Airbnb review links.",
  robots: {
    index: false,
    follow: false
  }
};

const planFeatures = [
  "A mobile guest guide with one QR code",
  "Wi-Fi, check-in, house rules and your local tips",
  "An AI concierge that answers in the guest's language",
  "Google, Booking.com and Airbnb review links",
  "Fill it in from your Booking.com listing"
];

type RegisterPageProps = {
  searchParams?: {
    plan?: string;
    error?: string;
    previewToken?: string;
    ref?: string;
  };
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const selectedPlan = normalizePlanKey(searchParams?.plan);
  const previewToken = searchParams?.previewToken;
  const referrer = await findReferrer(searchParams?.ref);
  const referralCode = referrer ? normalizeReferralCode(searchParams?.ref) : null;
  const googleHref = `/auth/google?plan=${selectedPlan}${previewToken ? `&previewToken=${encodeURIComponent(previewToken)}` : ""}${referralCode ? `&ref=${referralCode}` : ""}`;
  const selectedOption = planOption(selectedPlan);

  return (
    <main className="min-h-screen bg-sn-canvas px-5 py-8 text-sn-ink sm:py-12">
      <div className="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-[1fr_0.9fr] lg:gap-10">
        <section className="rounded-[28px] border border-sn-line/8 bg-white p-6 shadow-[0_24px_70px_rgba(17,24,39,0.06)] sm:p-8">
          <a href="/" className="inline-flex items-center gap-2 text-sm font-bold">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/staynest-logo.png" alt="" className="h-8 w-8 object-contain" />
            StayNest
          </a>
          <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.02em]">Create your guest guide</h1>
          <p className="mt-2 text-[15px] text-sn-muted">
            {referrer ? "3 months free" : "7 days free"}. No card needed. Ready in minutes.
          </p>

          {referrer ? (
            <div className="mt-5 rounded-2xl bg-sn-accent-soft px-4 py-3 text-sm font-semibold text-sn-accent">
              {referrer.name.split(" ")[0] || "A StayNest host"} invited you: your free trial is 3 months instead of 7 days.
            </div>
          ) : null}

          {searchParams?.error ? (
            <div role="alert" className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {searchParams.error}
            </div>
          ) : null}

          <div className="mt-5">
            <InAppBrowserNotice />
          </div>

          <LoadingLink
            href={googleHref}
            loadingText="Opening Google..."
            eventName="register_google_started"
            eventParams={{ plan: selectedPlan, preview: Boolean(previewToken) }}
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

          <form action={registerOwner} className="grid gap-4">
            <input type="hidden" name="plan" value={selectedPlan} />
            {previewToken && <input type="hidden" name="previewToken" value={previewToken} />}
            {referralCode && <input type="hidden" name="ref" value={referralCode} />}
            <Field label="Your name">
              <input name="name" className={inputClass} autoComplete="name" required />
            </Field>
            <Field label="Email">
              <input name="email" className={inputClass} type="email" autoComplete="email" required />
            </Field>
            <Field label="Password">
              <input name="password" className={inputClass} type="password" autoComplete="new-password" minLength={8} required aria-describedby="password-rules" />
            </Field>
            <p id="password-rules" className="-mt-2 text-xs leading-5 text-sn-muted">{passwordRulesText()}</p>
            <TurnstileWidget className="mt-1" />
            <SubmitButton pendingText="Creating your guide..." className="mt-1 min-h-12 rounded-full bg-sn-ink text-[15px] font-semibold text-white hover:bg-sn-ink/90">
              Create my free guide
            </SubmitButton>
          </form>

          <p className="mt-5 text-center text-sm text-sn-muted">
            Already have an account?{" "}
            <a href="/login" className="font-semibold text-sn-accent">
              Log in
            </a>
          </p>
        </section>

        <aside className="rounded-[28px] bg-sn-ink p-6 text-white sm:p-8 lg:sticky lg:top-12">
          <p className="text-sm font-semibold text-white/60">What you get</p>
          <ul className="mt-5 grid gap-4">
            {planFeatures.map((item) => (
              <li key={item} className="flex gap-3 text-[15px] text-white/85">
                <CheckCircle2 className="mt-0.5 shrink-0 text-[#8FD3C9]" size={18} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-sm text-white/60">
              {referrer ? "3 months free" : "7 days free"}, then
            </p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight">
              {selectedOption.price} <span className="text-base font-medium text-white/60">per year</span>
            </p>
            <p className="mt-2 text-sm text-white/60">If you do not subscribe, nothing is charged. Your guide simply pauses.</p>
          </div>
        </aside>
      </div>
      <AppLegalLinks className="mx-auto mt-10 max-w-5xl text-sn-muted" />
    </main>
  );
}
