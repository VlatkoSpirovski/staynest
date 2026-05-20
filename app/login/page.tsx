import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, inputClass, Panel } from "@/components/ui/panel";
import { loginOwner } from "@/app/auth-actions";

type LoginPageProps = {
  searchParams?: {
    error?: string;
    next?: string;
    reset?: string;
  };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-mist px-5 py-10 text-ink">
      <Panel className="w-full max-w-md">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-lagoon text-white">
            <Home size={19} />
          </div>
          <div>
            <h1 className="text-xl font-bold">StayNest</h1>
            <p className="text-sm text-ink/60">Owner login</p>
          </div>
        </div>
        {searchParams?.error ? (
          <div className="mb-4 rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {searchParams.error}
          </div>
        ) : null}
        {searchParams?.reset ? (
          <div className="mb-4 rounded-[8px] border border-olive/20 bg-olive/10 px-3 py-2 text-sm font-medium text-olive">
            Password reset. You can log in now.
          </div>
        ) : null}
        <form action={loginOwner} className="grid gap-4">
          <input type="hidden" name="next" value={searchParams?.next || "/dashboard"} />
          <Field label="Email">
            <input name="email" className={inputClass} defaultValue="owner@villabeti.com" type="email" autoComplete="email" required />
          </Field>
          <Field label="Password">
            <input name="password" className={inputClass} type="password" autoComplete="current-password" required />
          </Field>
          <Button type="submit" className="mt-2">
            Continue to Dashboard
          </Button>
        </form>
        <Button href="/forgot-password" variant="ghost" className="mt-4 w-full">
          Forgot password?
        </Button>
        <p className="mt-5 text-sm leading-6 text-ink/55">New accounts are created by the StayNest platform admin.</p>
      </Panel>
    </main>
  );
}
