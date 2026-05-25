import { LegalPage } from "@/components/legal-page";
import { getAppUrl } from "@/lib/utils";

export default function RefundPage() {
  const appUrl = getAppUrl();

  return (
    <LegalPage eyebrow="Refunds" title="Refund Policy">
      <p>Last updated: May 25, 2026</p>
      <p>
        We want you to be completely satisfied with StayNest. If for any reason you are not happy with your purchase, we
        offer a straightforward, no-questions-asked refund policy.
      </p>

      <h2 className="text-xl font-bold text-ink">30-Day Money-Back Guarantee</h2>
      <p>
        If you are not satisfied with StayNest for any reason, you may request a full refund within 30 days of your
        initial purchase or renewal. No questions asked.
      </p>

      <h2 className="text-xl font-bold text-ink">How to Request a Refund</h2>
      <p>To request a refund, you can:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          Email us at{" "}
          <a href="mailto:staynest2026@gmail.com" className="font-bold text-lagoon">
            staynest2026@gmail.com
          </a>{" "}
          with your account email and order details.
        </li>
        <li>
          Use your StayNest dashboard at{" "}
          <a href={`${appUrl}/dashboard`} className="font-bold text-lagoon">
            dashboard.staynest.site/dashboard
          </a>{" "}
          to manage your account and subscription.
        </li>
        <li>
          Contact Paddle Buyer Support at{" "}
          <a href="https://paddle.net" className="font-bold text-lagoon" target="_blank" rel="noopener noreferrer">
            paddle.net
          </a>{" "}
          — Paddle.com is the Merchant of Record for all StayNest orders and handles payment processing and returns.
        </li>
      </ul>
      <p>
        Approved refunds are processed to the original payment method. Card refunds typically take 3–5 working days to
        be credited back by the payment provider, while some banks may take longer.
      </p>

      <h2 className="text-xl font-bold text-ink">Subscription Cancellation</h2>
      <p>
        You can cancel your StayNest subscription at any time from your account dashboard or by emailing{" "}
        <a href="mailto:staynest2026@gmail.com" className="font-bold text-lagoon">
          staynest2026@gmail.com
        </a>
        . When you cancel:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>You keep access to paid features until the end of your current billing period.</li>
        <li>No further charges will be made after cancellation.</li>
        <li>
          If you cancel within 30 days of your initial purchase or most recent renewal, you are eligible for a full
          refund of that charge.
        </li>
      </ul>

      <h2 className="text-xl font-bold text-ink">Free Trial</h2>
      <p>
        If you signed up for a free trial, you will not be charged until the trial period ends. You can cancel at any
        time during the trial without being charged.
      </p>

      <h2 className="text-xl font-bold text-ink">Complaints</h2>
      <p>
        We aim to acknowledge billing and refund complaints within 2 business days and resolve them within 14 business
        days. If a Paddle payment issue is not resolved to your satisfaction, you may contact Paddle Buyer Support at{" "}
        <a href="https://paddle.net" className="font-bold text-lagoon" target="_blank" rel="noopener noreferrer">
          paddle.net
        </a>
        .
      </p>

      <h2 className="text-xl font-bold text-ink">Contact</h2>
      <p>
        For any questions about refunds or billing, contact us at{" "}
        <a href="mailto:staynest2026@gmail.com" className="font-bold text-lagoon">
          staynest2026@gmail.com
        </a>
        .
      </p>
    </LegalPage>
  );
}
