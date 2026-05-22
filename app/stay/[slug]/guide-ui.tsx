import { ArrowLeft } from "lucide-react";

export function MenuLink({
  href,
  icon,
  title,
  subtitle
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <a
      href={href}
      className="grid min-h-44 place-items-center rounded-[18px] border border-white/70 bg-[#f3eadc] px-4 py-6 text-center shadow-[0_12px_35px_rgba(76,55,37,0.08)] transition hover:-translate-y-0.5 hover:bg-[#f8f1e8]"
    >
      <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-[var(--accent)] shadow-[0_8px_20px_rgba(76,55,37,0.12)]">
        {icon}
      </span>
      <span className="mt-5 block text-base font-extrabold text-ink">{title}</span>
      <span className="mt-1 block text-sm text-ink/60">{subtitle}</span>
    </a>
  );
}

export function DetailShell({
  backHref,
  backLabel,
  poweredByLabel,
  eyebrow,
  title,
  children
}: {
  backHref: string;
  backLabel: string;
  poweredByLabel: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#2f302e] text-ink">
      <div className="mx-auto min-h-screen max-w-[430px] bg-[#f1e7d8] px-5 py-5 shadow-2xl">
        <a
          href={backHref}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-bold text-ink shadow-sm ring-1 ring-ink/10"
        >
          <ArrowLeft size={16} />
          {backLabel}
        </a>
        <div className="mt-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--accent)]">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-ink">{title}</h1>
        </div>
        <div className="mt-6 grid gap-4">{children}</div>
        <PoweredByStayNest className="mt-8 pb-6" label={poweredByLabel} />
      </div>
    </main>
  );
}

export function MiniCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="rounded-[18px] border border-ink/10 bg-[#fbf7ef] p-5 text-left shadow-[0_10px_28px_rgba(76,55,37,0.08)]">
      <h2 className="text-xl font-extrabold text-ink">{title}</h2>
      <div className="mt-3 text-[15px] leading-7 text-ink/68">{children}</div>
    </article>
  );
}

export function EmptyNote({ children }: { children: React.ReactNode }) {
  return <div className="rounded-[16px] border border-dashed border-ink/15 bg-white/45 p-4 text-sm leading-6 text-ink/60">{children}</div>;
}

export function PoweredByStayNest({ className = "", label = "Powered by" }: { className?: string; label?: string }) {
  return (
    <p className={`text-center text-xs font-semibold text-ink/45 ${className}`}>
      {label}{" "}
      <a href="https://staynest.site" target="_blank" rel="noreferrer" className="font-bold text-ink/55 underline-offset-2 hover:text-ink/75 hover:underline">
        staynest.site
      </a>
    </p>
  );
}
