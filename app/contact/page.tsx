import { LegalPage } from "@/components/legal-page";

export default function ContactPage() {
  return (
    <LegalPage eyebrow="Contact" title="Contact StayNest">
      <p>StayNest is a digital guest guide and AI concierge SaaS for rental hosts.</p>
      <h2 className="text-xl font-bold text-ink">Support</h2>
      <p>
        For account, billing, refund, privacy, or product support, contact us at{" "}
        <a href="mailto:staynest2026@gmail.com" className="font-bold text-lagoon">
          staynest2026@gmail.com
        </a>
        .
      </p>
      <h2 className="text-xl font-bold text-ink">Billing</h2>
      <p>StayNest subscriptions are billed monthly after any free trial. Payments, tax calculation, and recurring billing are processed securely by Paddle.</p>
      <h2 className="text-xl font-bold text-ink">Policies</h2>
      <p>
        Please review our <a href="/terms" className="font-bold text-lagoon">Terms of Service</a>,{" "}
        <a href="/privacy" className="font-bold text-lagoon">Privacy Policy</a>, and{" "}
        <a href="/refund" className="font-bold text-lagoon">Refund Policy</a>.
      </p>
    </LegalPage>
  );
}
