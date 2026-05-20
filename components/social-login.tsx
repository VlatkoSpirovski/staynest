import { Apple, Chrome } from "lucide-react";

export function SocialLogin() {
  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-ink/45">
        <div className="h-px flex-1 bg-ink/10" />
        Or continue with
        <div className="h-px flex-1 bg-ink/10" />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <a
          href="/auth/google"
          className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-ink ring-1 ring-ink/10 transition hover:bg-white/80"
        >
          <Chrome size={16} />
          Google
        </a>
        <a
          href="/auth/apple"
          className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-ink/90"
        >
          <Apple size={17} />
          Apple
        </a>
      </div>
    </div>
  );
}
