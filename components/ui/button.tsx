import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "ghost";
};

const variants = {
  primary:
    "bg-[#111827] text-white shadow-[0_18px_50px_rgba(17,24,39,0.26),inset_0_1px_0_rgba(255,255,255,0.12)] hover:bg-[#162033]",
  secondary:
    "border border-[#172234]/10 bg-white text-[#111827] shadow-[0_14px_38px_rgba(17,24,39,0.08)] hover:bg-[#F9FAFB]",
  ghost: "bg-transparent text-[#111827] hover:bg-[#111827]/5"
};

export function Button({ children, className, href, type = "button", variant = "primary" }: ButtonProps) {
  const classes = cn(
    "focus-ring inline-flex min-h-11 items-center justify-center rounded-[16px] px-5 text-sm font-black transition",
    variants[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes}>
      {children}
    </button>
  );
}
