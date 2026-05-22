import { CheckCircle2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleMark } from "@/components/google-mark";
import { InAppBrowserNotice } from "@/components/in-app-browser-notice";
import { Field, inputClass, Panel } from "@/components/ui/panel";
import { registerOwner } from "@/app/auth-actions";

const plans = {
  basic: {
    name: "Basic",
    price: "€10/month",
    items: ["Mobile QR guest guide", "Wi-Fi, check-in and house rules", "Recommendations and review links"]
  },
  ai: {
    name: "Full AI",
    price: "€15/month",
    items: ["Everything in Basic", "AI guest chat trained for the property", "Booking/Airbnb import support"]
  }
};

type RegisterPageProps = {
  searchParams?: {
    plan?: string;
    error?: string;
  };
};

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  const selectedPlan = searchParams?.plan === "ai" ? "ai" : "basic";
  const plan = plans[selectedPlan];

  return (
    <main className="min-h-screen bg-mist px-5 py-8 text-ink">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl items-center gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <Panel className="order-2 lg:order-1">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-lagoon text-white">
              <Home size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold">Create your owner account</h1>
              <p className="text-sm text-ink/60">Start with 7 days free.</p>
            </div>
          </div>

          {searchParams?.error ? (
            <div className="mt-5 rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {searchParams.error}
            </div>
          ) : null}

          <div className="mt-5">
            <InAppBrowserNotice />
          </div>

          <a
            href={`/auth/google?plan=${selectedPlan}`}
            className="focus-ring inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-ink ring-1 ring-ink/10 transition hover:bg-white/80"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white">
              <GoogleMark />
            </span>
            Continue with Google
          </a>

          <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-ink/45">
            <div className="h-px flex-1 bg-ink/10" />
            Or use email
            <div className="h-px flex-1 bg-ink/10" />
          </div>

          <form action={registerOwner} className="grid gap-4">
            <input type="hidden" name="plan" value={selectedPlan} />
            <Field label="Full name">
              <input name="name" className={inputClass} autoComplete="name" required />
            </Field>
            <Field label="Email">
              <input name="email" className={inputClass} type="email" autoComplete="email" required />
            </Field>
            <Field label="Password">
              <input name="password" className={inputClass} type="password" autoComplete="new-password" required />
            </Field>
            <Field label="Confirm password">
              <input name="confirmPassword" className={inputClass} type="password" autoComplete="new-password" required />
            </Field>
            <Button type="submit" className="mt-2 min-h-12">
              Start free trial
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-ink/55">
            Already have an account?{" "}
            <a href="/login" className="font-semibold text-lagoon">
              Log in
            </a>
          </p>
        </Panel>

        <Panel className="order-1 bg-ink text-white lg:order-2">
          <p className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white/70">
            Selected plan
          </p>
          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold">{plan.name}</h2>
              <p className="mt-2 text-white/65">7-day free trial, then {plan.price}.</p>
            </div>
            <p className="text-right text-2xl font-bold">{plan.price}</p>
          </div>
          <div className="mt-6 grid gap-3">
            {plan.items.map((item) => (
              <div key={item} className="flex gap-3 rounded-[8px] bg-white/8 p-3 text-sm font-medium text-white/82">
                <CheckCircle2 className="mt-0.5 shrink-0 text-white" size={17} />
                {item}
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button href="/register?plan=basic" variant={selectedPlan === "basic" ? "secondary" : "ghost"} className="bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15">
              Basic
            </Button>
            <Button href="/register?plan=ai" variant={selectedPlan === "ai" ? "secondary" : "ghost"} className="bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15">
              Full AI
            </Button>
          </div>
        </Panel>
      </div>
    </main>
  );
}
