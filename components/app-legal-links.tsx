import { getPaymentUrl, getSiteUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

const siteLinks = [
  { label: "Host guides", href: "/guides" },
  { label: "Wi-Fi QR code generator", href: "/tools/wifi-qr-code" },
  { label: "Welcome book template", href: "/guides/airbnb-welcome-book" },
  { label: "More 5-star reviews", href: "/guides/get-more-airbnb-reviews" }
];

const links = [
  { label: "Pricing", href: "/pricing" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Refunds", href: "/refund" },
  { label: "Contact", href: "/contact" }
];

export function AppLegalLinks({ className }: { className?: string }) {
  const paymentUrl = getPaymentUrl();
  const siteUrl = getSiteUrl();

  return (
    <footer className={cn("text-center text-xs font-semibold leading-6 text-ink/48", className)}>
      <div className="mb-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {siteLinks.map((link) => (
          <a key={link.href} href={`${siteUrl}${link.href}`} className="transition hover:text-ink">
            {link.label}
          </a>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {links.map((link) => (
          <a key={link.href} href={`${paymentUrl}${link.href}`} className="transition hover:text-ink">
            {link.label}
          </a>
        ))}
      </div>
      <p className="mt-2">
        StayNest is a SaaS subscription for rental hosts. Payments are processed securely by Paddle on
        staynest.site.
      </p>
    </footer>
  );
}
