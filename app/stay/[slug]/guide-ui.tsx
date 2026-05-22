import { ArrowLeft } from "lucide-react";

export function MenuLink({
  href,
  icon,
  title,
  subtitle,
  variant = "classic"
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  variant?: "classic" | "modern" | "darkLuxury" | "mediterranean";
}) {
  const isModern = variant === "modern";
  const isDark = variant === "darkLuxury";
  const isCoastal = variant === "mediterranean";
  const cardClass = isModern
    ? "flex min-h-[var(--guide-card-min-height)] items-center gap-3 rounded-[var(--guide-card-radius)] border border-[var(--guide-card-border)] bg-[var(--guide-card-bg)] px-4 py-3 text-left text-[var(--guide-text)] shadow-[var(--guide-card-shadow)] transition hover:-translate-y-0.5"
    : isDark
      ? "grid min-h-[var(--guide-card-min-height)] content-between rounded-[var(--guide-card-radius)] border border-[var(--guide-card-border)] bg-[var(--guide-card-bg)] px-4 py-4 text-left text-[var(--guide-text)] shadow-[var(--guide-card-shadow)] transition hover:-translate-y-0.5 hover:border-[var(--guide-accent)]"
      : isCoastal
        ? "grid min-h-[var(--guide-card-min-height)] place-items-center rounded-[var(--guide-card-radius)] border border-[var(--guide-card-border)] bg-[var(--guide-card-bg)] px-4 py-5 text-center text-[var(--guide-text)] shadow-[var(--guide-card-shadow)] transition hover:-translate-y-0.5"
        : "grid min-h-[var(--guide-card-min-height)] place-items-center rounded-[var(--guide-card-radius)] border border-[var(--guide-card-border)] bg-[var(--guide-card-bg)] px-4 py-6 text-center text-[var(--guide-text)] shadow-[var(--guide-card-shadow)] transition hover:-translate-y-0.5";
  const iconClass = isModern
    ? "grid h-11 w-11 shrink-0 place-items-center rounded-[var(--guide-icon-radius)] bg-[var(--guide-icon-bg)] text-[var(--guide-accent)] shadow-[var(--guide-icon-shadow)]"
    : isDark
      ? "grid h-11 w-11 place-items-center rounded-[var(--guide-icon-radius)] bg-[var(--guide-icon-bg)] text-[var(--guide-accent)] shadow-[var(--guide-icon-shadow)] ring-1 ring-[var(--guide-card-border)]"
      : "grid h-14 w-14 place-items-center rounded-[var(--guide-icon-radius)] bg-[var(--guide-icon-bg)] text-[var(--guide-accent)] shadow-[var(--guide-icon-shadow)]";

  return (
    <a href={href} className={cardClass}>
      <span className={iconClass}>
        {icon}
      </span>
      <span className={isModern ? "min-w-0" : ""}>
        <span className={`${isModern ? "text-sm" : "mt-5 text-base"} block font-extrabold text-[var(--guide-text)]`}>{title}</span>
        <span className={`${isModern ? "text-xs" : "mt-1 text-sm"} block text-[var(--guide-muted)]`}>{subtitle}</span>
      </span>
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
    <main className="min-h-screen bg-[var(--guide-app-bg)] text-[var(--guide-text)]" style={{ fontFamily: "var(--guide-body-font)" }}>
      <div className="mx-auto min-h-screen max-w-[430px] bg-[var(--guide-shell-bg)] px-5 py-5 shadow-[var(--guide-shell-shadow)]">
        <a
          href={backHref}
          className="inline-flex min-h-11 items-center gap-2 rounded-[var(--guide-button-radius)] bg-[var(--guide-elevated-bg)] px-4 text-sm font-bold text-[var(--guide-text)] shadow-sm ring-1 ring-[var(--guide-card-border)]"
        >
          <ArrowLeft size={16} />
          {backLabel}
        </a>
        <div className="mt-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--guide-accent)]">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-[var(--guide-text)]" style={{ fontFamily: "var(--guide-heading-font)" }}>{title}</h1>
        </div>
        <div className="mt-6 grid gap-4">{children}</div>
        <PoweredByStayNest className="mt-8 pb-6" label={poweredByLabel} />
      </div>
    </main>
  );
}

export function MiniCard({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <article className="rounded-[var(--guide-card-radius)] border border-[var(--guide-card-border)] bg-[var(--guide-card-bg)] p-5 text-left text-[var(--guide-text)] shadow-[var(--guide-card-shadow)]">
      <h2 className="text-xl font-extrabold text-[var(--guide-text)]">{title}</h2>
      <div className="mt-3 text-[15px] leading-7 text-[var(--guide-muted)]">{children}</div>
    </article>
  );
}

export function EmptyNote({ children }: { children: React.ReactNode }) {
  return <div className="rounded-[var(--guide-card-radius)] border border-dashed border-[var(--guide-card-border)] bg-[var(--guide-card-bg)] p-4 text-sm leading-6 text-[var(--guide-muted)]">{children}</div>;
}

export function PoweredByStayNest({ className = "", label = "Powered by" }: { className?: string; label?: string }) {
  return (
    <p className={`text-center text-xs font-semibold text-[var(--guide-muted)] ${className}`}>
      {label}{" "}
      <a href="https://staynest.site" target="_blank" rel="noreferrer" className="font-bold text-[var(--guide-text)] underline-offset-2 opacity-70 hover:underline">
        staynest.site
      </a>
    </p>
  );
}
