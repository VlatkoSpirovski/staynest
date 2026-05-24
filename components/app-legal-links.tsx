import Link from "next/link";
import { cn } from "@/lib/utils";

const links = [
  { label: "Pricing", href: "/pricing" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Refunds", href: "/refund" },
  { label: "Contact", href: "/contact" }
];

export function AppLegalLinks({ className }: { className?: string }) {
  return (
    <footer className={cn("text-center text-xs font-semibold leading-6 text-ink/48", className)}>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="transition hover:text-ink">
            {link.label}
          </Link>
        ))}
      </div>
      <p className="mt-2">StayNest is a monthly SaaS subscription for rental hosts. Payments are processed securely by Paddle.</p>
    </footer>
  );
}
