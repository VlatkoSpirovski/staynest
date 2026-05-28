import { cn } from "@/lib/utils";

export function Panel({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[24px] border border-[#172234]/8 bg-white p-5 shadow-[0_30px_90px_rgba(17,24,39,0.10),inset_0_1px_0_rgba(255,255,255,1)]",
        className
      )}
    >
      {children}
    </section>
  );
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
    <label className="grid gap-2 text-sm font-bold text-[#162033]">
      <span>{label}</span>
      {children}
      {hint ? <span className="text-xs font-semibold text-[#162033]/52">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "focus-ring min-h-11 w-full rounded-[16px] border border-[#172234]/10 bg-[#F9FAFB] px-3 text-sm font-semibold text-[#162033] shadow-[inset_0_1px_2px_rgba(17,24,39,0.04)] placeholder:text-[#162033]/32";

export const textareaClass =
  "focus-ring min-h-28 w-full rounded-[16px] border border-[#172234]/10 bg-[#F9FAFB] px-3 py-3 text-sm font-semibold text-[#162033] shadow-[inset_0_1px_2px_rgba(17,24,39,0.04)] placeholder:text-[#162033]/32";
