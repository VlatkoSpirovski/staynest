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
  primary: "bg-ink text-white shadow-soft hover:bg-ink/90",
  secondary: "bg-white text-ink ring-1 ring-ink/10 hover:bg-white/80",
  ghost: "bg-transparent text-ink hover:bg-ink/5"
};

export function Button({ children, className, href, type = "button", variant = "primary" }: ButtonProps) {
  const classes = cn(
    "focus-ring inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition",
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
