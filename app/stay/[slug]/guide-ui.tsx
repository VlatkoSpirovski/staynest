import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function MenuLink({
  href,
  onClick,
  icon,
  title,
  subtitle,
  variant = "classic"
}: {
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  variant?: "classic" | "modern" | "darkLuxury" | "mediterranean";
}) {
  const isModern = variant === "modern";
  const isDark = variant === "darkLuxury";
  const isCoastal = variant === "mediterranean";
  const cardClass = isModern
    ? "flex min-h-[var(--guide-card-min-height)] items-center gap-3 rounded-[var(--guide-card-radius)] border border-[var(--guide-card-border)] bg-[var(--guide-card-bg)] px-4 py-3 text-left text-[var(--guide-text)] shadow-[var(--guide-card-shadow)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[var(--guide-card-hover-shadow)]"
    : isDark
      ? "grid min-h-[var(--guide-card-min-height)] content-between rounded-[var(--guide-card-radius)] border border-[var(--guide-card-border)] bg-[var(--guide-card-bg)] px-4 py-4 text-left text-[var(--guide-text)] shadow-[var(--guide-card-shadow)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[var(--guide-accent)] hover:shadow-[var(--guide-card-hover-shadow)]"
      : isCoastal
        ? "grid min-h-[var(--guide-card-min-height)] place-items-center rounded-[var(--guide-card-radius)] border border-[var(--guide-card-border)] bg-[var(--guide-card-bg)] px-4 py-5 text-center text-[var(--guide-text)] shadow-[var(--guide-card-shadow)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[var(--guide-card-hover-shadow)]"
        : "grid min-h-[var(--guide-card-min-height)] place-items-center rounded-[var(--guide-card-radius)] border border-[var(--guide-card-border)] bg-[var(--guide-card-bg)] px-4 py-6 text-center text-[var(--guide-text)] shadow-[var(--guide-card-shadow)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[var(--guide-card-hover-shadow)]";
  const iconClass = isModern
    ? "grid h-11 w-11 shrink-0 place-items-center rounded-[var(--guide-icon-radius)] bg-[var(--guide-icon-bg)] text-[var(--guide-accent)] shadow-[var(--guide-icon-shadow)]"
    : isDark
      ? "grid h-11 w-11 place-items-center rounded-[var(--guide-icon-radius)] bg-[var(--guide-icon-bg)] text-[var(--guide-accent)] shadow-[var(--guide-icon-shadow)] ring-1 ring-[var(--guide-card-border)]"
      : "grid h-14 w-14 place-items-center rounded-[var(--guide-icon-radius)] bg-[var(--guide-icon-bg)] text-[var(--guide-accent)] shadow-[var(--guide-icon-shadow)]";

  return (
    <Link
      href={href}
      prefetch
      onClick={onClick}
      className={cardClass}
      style={{ background: "var(--guide-card-bg)", boxShadow: "var(--guide-card-shadow), var(--guide-card-inset-shadow)", backdropFilter: "var(--guide-card-backdrop)" }}
    >
      <span className={iconClass}>
        {icon}
      </span>
      <span className={isModern ? "min-w-0" : ""}>
          <span className={`${isModern ? "text-sm" : "mt-5 text-base"} block font-black tracking-tight text-[var(--guide-text)]`}>{title}</span>
        <span className={`${isModern ? "text-xs" : "mt-1 text-sm"} block font-semibold text-[var(--guide-muted)]`}>{subtitle}</span>
      </span>
    </Link>
  );
}

export function DetailShell({
  backHref,
  backLabel,
  onBack,
  poweredByLabel,
  eyebrow,
  title,
  children
}: {
  backHref: string;
  backLabel: string;
  onBack?: () => void;
  poweredByLabel: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen text-[var(--guide-text)]" style={{ background: "var(--guide-app-bg)", fontFamily: "var(--guide-body-font)" }}>
      <div className="mx-auto min-h-screen max-w-[430px] px-5 py-5 shadow-[var(--guide-shell-shadow)]" style={{ background: "var(--guide-shell-bg)" }}>
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex min-h-11 items-center gap-2 rounded-[var(--guide-button-radius)] bg-[var(--guide-elevated-bg)] px-4 text-sm font-bold text-[var(--guide-text)] shadow-sm ring-1 ring-[var(--guide-card-border)]"
          >
            <ArrowLeft size={16} />
            {backLabel}
          </button>
        ) : (
          <Link
            href={backHref}
            prefetch
            className="inline-flex min-h-11 items-center gap-2 rounded-[var(--guide-button-radius)] bg-[var(--guide-elevated-bg)] px-4 text-sm font-bold text-[var(--guide-text)] shadow-sm ring-1 ring-[var(--guide-card-border)]"
          >
            <ArrowLeft size={16} />
            {backLabel}
          </Link>
        )}
        <div className="mt-8">
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[var(--guide-accent)]">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-black leading-[1.02] tracking-tight text-[var(--guide-text)]" style={{ fontFamily: "var(--guide-heading-font)" }}>{title}</h1>
        </div>
        <div className="mt-7 grid gap-5">{children}</div>
        <PoweredByStayNest className="mt-8 pb-6" label={poweredByLabel} />
      </div>
    </main>
  );
}

export function MiniCard({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <article className="rounded-[var(--guide-card-radius)] border border-[var(--guide-card-border)] p-5 text-left text-[var(--guide-text)] shadow-[var(--guide-card-shadow)] backdrop-blur-xl" style={{ background: "var(--guide-card-bg)", boxShadow: "var(--guide-card-shadow), var(--guide-card-inset-shadow)", backdropFilter: "var(--guide-card-backdrop)" }}>
      <h2 className="text-xl font-black tracking-tight text-[var(--guide-text)]">{title}</h2>
      <div className="mt-3 text-[15px] leading-7 text-[var(--guide-muted)]">{children}</div>
    </article>
  );
}

export function EmptyNote({ children }: { children: React.ReactNode }) {
  return <div className="rounded-[var(--guide-card-radius)] border border-dashed border-[var(--guide-card-border)] p-4 text-sm leading-6 text-[var(--guide-muted)]" style={{ background: "var(--guide-card-bg)" }}>{children}</div>;
}

export function PoweredByStayNest({ className = "", label = "Powered by" }: { className?: string; label?: string }) {
  return (
    <p className={`text-center text-xs font-semibold text-[var(--guide-muted)] ${className}`}>
      {label}{" "}
      <a href="https://dashboard.staynest.site" target="_blank" rel="noreferrer" className="font-bold text-[var(--guide-text)] underline-offset-2 opacity-70 hover:underline">
        dashboard.staynest.site
      </a>
    </p>
  );
}
