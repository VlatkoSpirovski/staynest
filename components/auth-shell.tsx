import { AppLegalLinks } from "@/components/app-legal-links";

export function AuthShell({
  title,
  subtitle,
  children,
  legal = true
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  legal?: boolean;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-sn-canvas px-5 py-10 text-sn-ink">
      <section className="w-full max-w-[420px] rounded-[28px] border border-sn-line/8 bg-white p-6 shadow-[0_24px_70px_rgba(17,24,39,0.06)] sm:p-8">
        <a href="/" className="inline-flex items-center gap-2 text-sm font-bold">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/staynest-logo.png" alt="" className="h-8 w-8 object-contain" />
          StayNest
        </a>
        <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.02em]">{title}</h1>
        {subtitle ? <p className="mt-2 text-[15px] text-sn-muted">{subtitle}</p> : null}
        {children}
      </section>
      {legal ? <AppLegalLinks className="mt-10 max-w-md text-sn-muted" /> : null}
    </main>
  );
}

export function AuthAlert({ tone, children }: { tone: "error" | "success"; children: React.ReactNode }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`mt-5 rounded-2xl px-4 py-3 text-sm font-medium ${tone === "error" ? "bg-red-50 text-red-700" : "bg-sn-accent-soft text-sn-accent"}`}
    >
      {children}
    </div>
  );
}

export const authButtonClass = "min-h-12 rounded-full bg-sn-ink text-[15px] font-semibold text-white hover:bg-sn-ink/90";
