import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function CollapsibleSection({
  title,
  eyebrow,
  children,
  defaultOpen = true,
  className
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <details className={cn("group rounded-[8px] border border-ink/10 bg-white shadow-soft", className)} open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5">
        <div>
          {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.16em] text-lagoon sm:text-sm sm:normal-case sm:tracking-normal">{eyebrow}</p> : null}
          <h2 className="text-xl font-bold leading-tight sm:text-2xl">{title}</h2>
        </div>
        <ChevronDown className="text-ink/45 transition group-open:rotate-180" size={20} />
      </summary>
      <div className="border-t border-ink/10 p-3 sm:p-5">{children}</div>
    </details>
  );
}
