import { cn } from "@/lib/utils";

export function Panel({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={cn("rounded-[8px] border border-ink/10 bg-white p-5 shadow-soft", className)}>{children}</section>;
}

export function Field({
  label,
  children,
  hint
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ink">
      <span>{label}</span>
      {children}
      {hint ? <span className="text-xs font-normal text-ink/55">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "focus-ring min-h-11 w-full rounded-[8px] border border-ink/10 bg-white px-3 text-sm text-ink placeholder:text-ink/35";

export const textareaClass =
  "focus-ring min-h-28 w-full rounded-[8px] border border-ink/10 bg-white px-3 py-3 text-sm text-ink placeholder:text-ink/35";
