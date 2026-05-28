import { LegalPage } from "@/components/legal-page";
import { getAppUrl, getPaymentUrl } from "@/lib/utils";

export const metadata = {
  title: "Contact",
  description: "Contact StayNest support for account, billing, refunds, privacy, or product help.",
  alternates: {
    canonical: "/contact"
  }
};

export default function ContactPage() {
  const appUrl = getAppUrl();
  const paymentUrl = getPaymentUrl();

  return (
    <LegalPage eyebrow="Contact" title="Contact StayNest">
      <p>
        StayNest is a digital guest guide and AI concierge SaaS for rental hosts, available at{" "}
        <a href={appUrl} className="font-bold text-lagoon">
          dashboard.staynest.site
        </a>
        .
      </p>
      <h2 className="text-xl font-bold text-ink">Support</h2>
      <p>
        For account, billing, refund, privacy, or product support, contact us at{" "}
        <a href="mailto:staynest2026@gmail.com" className="font-bold text-lagoon">
          staynest2026@gmail.com
        </a>
        .
      </p>
      <h2 className="text-xl font-bold text-ink">Billing</h2>
      <p>
        StayNest subscriptions are billed monthly or yearly after any free trial. Payments, tax calculation, invoicing, and
        recurring billing are processed securely by Paddle.com, the Merchant of Record for StayNest orders.
      </p>
      <h2 className="text-xl font-bold text-ink">Response Times &amp; Complaints</h2>
      <p>
        We aim to acknowledge support requests within 2 business days and resolve complaints within 14 business days.
        If your issue concerns a Paddle payment and is not resolved to your satisfaction, you may also contact Paddle
        Buyer Support at{" "}
        <a href="https://paddle.net" className="font-bold text-lagoon" target="_blank" rel="noopener noreferrer">
          paddle.net
        </a>
        .
      </p>
      <h2 className="text-xl font-bold text-ink">Policies</h2>
      <p>
        Please review our <a href={`${paymentUrl}/terms`} className="font-bold text-lagoon">Terms of Service</a>,{" "}
        <a href={`${paymentUrl}/privacy`} className="font-bold text-lagoon">Privacy Policy</a>, and{" "}
        <a href={`${paymentUrl}/refund`} className="font-bold text-lagoon">Refund Policy</a>.
      </p>
    </LegalPage>
  );
}
