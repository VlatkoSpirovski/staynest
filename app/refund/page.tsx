import { LegalPage } from "@/components/legal-page";

export default function RefundPage() {
  return (
    <LegalPage eyebrow="Refunds" title="Refund Policy">
      <p>Last updated: May 25, 2026</p>
      <p>StayNest is sold through Paddle, which acts as the Merchant of Record for purchases and subscriptions.</p>
      <h2 className="text-xl font-bold text-ink">Paddle Refund Policy</h2>
      <p>
        Refunds for StayNest purchases are handled according to Paddle&apos;s Refund Policy and Buyer Terms. StayNest does not apply additional refund
        qualifiers, exceptions, or conditions beyond Paddle&apos;s policy.
      </p>
      <h2 className="text-xl font-bold text-ink">Refund Requests</h2>
      <p>
        To request a refund, please contact Paddle Buyer Support at{" "}
        <a href="https://paddle.net" className="font-bold text-lagoon">
          paddle.net
        </a>
        .
      </p>
      <h2 className="text-xl font-bold text-ink">Subscriptions</h2>
      <p>StayNest subscriptions are billed monthly after any free trial. You may cancel future subscription renewals before the next billing date.</p>
      <h2 className="text-xl font-bold text-ink">Questions</h2>
      <p>
        For product or account support, contact StayNest at{" "}
        <a href="mailto:staynest2026@gmail.com" className="font-bold text-lagoon">
          staynest2026@gmail.com
        </a>
        .
      </p>
    </LegalPage>
  );
}
