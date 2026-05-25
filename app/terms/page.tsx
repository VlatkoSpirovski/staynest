import { LegalPage } from "@/components/legal-page";

export default function TermsPage() {
  return (
    <LegalPage eyebrow="Terms" title="Terms of Service">
      <p>Last updated: May 25, 2026</p>
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of StayNest, a software-as-a-service
        platform that lets rental and accommodation owners create digital guest guides. By creating an account or using
        StayNest, you agree to be bound by these Terms.
      </p>

      <h2 className="text-xl font-bold text-ink">Service Description</h2>
      <p>
        StayNest is a self-serve SaaS product. Hosts use StayNest to create public, mobile-first guest guides containing
        property details, local recommendations, QR codes, review links and optional AI-powered features. Hosts are
        responsible for the accuracy, legality and completeness of all content they publish through StayNest.
      </p>

      <h2 className="text-xl font-bold text-ink">Accounts</h2>
      <p>
        You must provide accurate account information and keep your login credentials secure. You are responsible for all
        activity that occurs under your account. StayNest reserves the right to suspend or terminate accounts that
        violate these Terms.
      </p>

      <h2 className="text-xl font-bold text-ink">Payment &amp; Billing</h2>
      <p>
        Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant of Record for all
        our orders. Paddle provides all customer service inquiries and handles returns.
      </p>
      <p>
        Paid plans are billed on a recurring monthly basis after any free trial period. Plan features and prices are
        listed on our{" "}
        <a href="/pricing" className="font-bold text-lagoon">
          pricing page
        </a>
        . If payment fails, access to paid features may be limited or suspended until payment is resolved. All prices
        are inclusive of applicable taxes, which are calculated and collected by Paddle based on your location.
      </p>

      <h2 className="text-xl font-bold text-ink">Subscriptions &amp; Cancellation</h2>
      <p>
        You may cancel your subscription at any time from your account dashboard. Upon cancellation, you will retain
        access to paid features until the end of your current billing period. No further charges will be made after
        cancellation. Cancelling a subscription does not automatically trigger a refund for the current billing period —
        please see our{" "}
        <a href="/refund" className="font-bold text-lagoon">
          Refund Policy
        </a>{" "}
        for details.
      </p>

      <h2 className="text-xl font-bold text-ink">AI Features</h2>
      <p>
        AI-powered import and guest assistant features are best-effort tools provided for convenience. Hosts must review
        all AI-generated content before sharing it with guests. StayNest does not guarantee that AI output is complete,
        accurate or error-free.
      </p>

      <h2 className="text-xl font-bold text-ink">Intellectual Property</h2>
      <p>
        StayNest retains all rights, title and interest in the platform, its design, code and branding. You retain
        ownership of all content you upload or create through StayNest. By using the service, you grant StayNest a
        limited license to host, display and distribute your content solely for the purpose of providing the service.
      </p>

      <h2 className="text-xl font-bold text-ink">Acceptable Use</h2>
      <p>
        You may not use StayNest for illegal content, harmful instructions, spam, fraud, or content that infringes the
        rights of others. StayNest reserves the right to remove content or suspend accounts that violate this policy.
      </p>

      <h2 className="text-xl font-bold text-ink">Limitation of Liability</h2>
      <p>
        StayNest is provided on an &quot;as is&quot; and &quot;as available&quot; basis. To the maximum extent permitted
        by law, StayNest and its operators shall not be liable for any indirect, incidental, special, consequential or
        punitive damages, including but not limited to lost revenue, lost profits, guest disputes, property issues, or
        inaccurate host-provided content.
      </p>

      <h2 className="text-xl font-bold text-ink">Governing Law</h2>
      <p>
        These Terms are governed by and construed in accordance with the laws of the Republic of North Macedonia,
        without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the
        exclusive jurisdiction of the courts of North Macedonia.
      </p>

      <h2 className="text-xl font-bold text-ink">Changes to Terms</h2>
      <p>
        We may update these Terms from time to time. If we make material changes, we will notify you by email or by
        posting a notice on the site. Continued use of StayNest after changes take effect constitutes acceptance of the
        revised Terms.
      </p>

      <h2 className="text-xl font-bold text-ink">Contact</h2>
      <p>
        For questions about these Terms, contact us at{" "}
        <a href="mailto:staynest2026@gmail.com" className="font-bold text-lagoon">
          staynest2026@gmail.com
        </a>
        .
      </p>
    </LegalPage>
  );
}
