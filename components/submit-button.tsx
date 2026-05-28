"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

export function SubmitButton({
  children,
  pendingText = "Saving...",
  variant = "primary",
  className,
  form,
  disabled = false
}: {
  children: React.ReactNode;
  pendingText?: string;
  variant?: "primary" | "secondary";
  className?: string;
  form?: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  const variantClass =
    variant === "primary"
      ? "bg-ink text-white shadow-soft hover:bg-ink/90"
      : "bg-white text-ink ring-1 ring-ink/10 hover:bg-white/80";

  return (
    <button
      type="submit"
      form={form}
      disabled={pending || disabled}
      className={cn(
        "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variantClass,
        className
      )}
    >
      {pending ? <Loader2 className="animate-spin" size={16} /> : null}
      {pending ? pendingText : children}
    </button>
  );
}
