import { LegalPage } from "@/components/legal-page";

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Privacy" title="Privacy Policy">
      <p>Last updated: May 25, 2026</p>
      <p>
        This Privacy Policy explains how StayNest (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) collects, uses,
        shares and protects your information when you use our platform. We are committed to protecting your privacy and
        handling your data transparently.
      </p>

      <h2 className="text-xl font-bold text-ink">Information We Collect</h2>
      <p>We collect the following types of information:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>Account Information:</strong> Name, email address, login credentials and account preferences when you
          create an account.
        </li>
        <li>
          <strong>Property Content:</strong> Property details, images, recommendations, contact information, review
          links and guide content that hosts add to their guest guides.
        </li>
        <li>
          <strong>Payment Information:</strong> Payment and billing data is collected and processed by our payment
          provider, Paddle.com. We do not store your credit card details or full payment information on our servers.
        </li>
        <li>
          <strong>Usage Data:</strong> Information about how you interact with StayNest, including pages visited,
          features used and session duration.
        </li>
        <li>
          <strong>Guest Interactions:</strong> Guests who use public guide links or the optional AI chat may have their
          messages processed to generate replies and improve the guide experience.
        </li>
      </ul>

      <h2 className="text-xl font-bold text-ink">How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Provide, maintain and improve StayNest and its features.</li>
        <li>Create and manage your account and publish guest guides.</li>
        <li>Process subscriptions and payments through Paddle.com.</li>
        <li>Send transactional emails such as account verification and password resets.</li>
        <li>Provide customer support and respond to your requests.</li>
        <li>Ensure the security and integrity of our platform.</li>
        <li>Comply with legal obligations.</li>
      </ul>

      <h2 className="text-xl font-bold text-ink">Service Providers</h2>
      <p>
        We work with trusted third-party service providers who process information on our behalf to deliver the service.
        These include:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <strong>Paddle.com</strong> — Payment processing, subscription management, invoicing and tax compliance.
          Paddle acts as the Merchant of Record for all StayNest transactions.
        </li>
        <li>
          <strong>Vercel</strong> — Application hosting and delivery.
        </li>
        <li>
          <strong>Cloudinary</strong> — Image storage and optimization.
        </li>
        <li>
          <strong>OpenAI</strong> — AI-powered features such as the guest chat assistant.
        </li>
        <li>
          <strong>SMTP provider</strong> — Transactional email delivery.
        </li>
      </ul>
      <p>
        These providers process information only as necessary to provide their respective services and are bound by
        appropriate data processing agreements.
      </p>

      <h2 className="text-xl font-bold text-ink">Cookies</h2>
      <p>
        StayNest uses essential cookies to maintain your login session and remember your preferences. We do not use
        third-party advertising or tracking cookies. Paddle.com may set cookies during the checkout process to complete
        your purchase securely.
      </p>

      <h2 className="text-xl font-bold text-ink">Data Retention</h2>
      <p>
        We retain your account and guide data for as long as your account is active or as needed for legal, billing and
        operational purposes. When you delete your account, we will remove your personal data within a reasonable
        timeframe, except where retention is required by law.
      </p>

      <h2 className="text-xl font-bold text-ink">Your Rights</h2>
      <p>
        Depending on your location, you may have certain rights regarding your personal data under applicable data
        protection laws such as the General Data Protection Regulation (GDPR) or the California Consumer Privacy Act
        (CCPA). These rights may include:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>The right to access the personal data we hold about you.</li>
        <li>The right to correct inaccurate or incomplete data.</li>
        <li>The right to request deletion of your personal data.</li>
        <li>The right to restrict or object to processing of your data.</li>
        <li>The right to data portability.</li>
        <li>The right to withdraw consent at any time where processing is based on consent.</li>
      </ul>
      <p>
        You can update or remove property content from your dashboard at any time. To exercise any of these rights or
        request account deletion, contact us at the email below.
      </p>

      <h2 className="text-xl font-bold text-ink">International Data Transfers</h2>
      <p>
        Your information may be transferred to and processed in countries other than your own. Our service providers,
        including Paddle, Vercel and OpenAI, may process data in the United States and other jurisdictions. We ensure
        appropriate safeguards are in place for such transfers in compliance with applicable data protection laws.
      </p>

      <h2 className="text-xl font-bold text-ink">Children&apos;s Privacy</h2>
      <p>
        StayNest is not directed at children under the age of 16. We do not knowingly collect personal information from
        children. If we learn that we have collected data from a child under 16, we will take steps to delete that
        information promptly.
      </p>

      <h2 className="text-xl font-bold text-ink">Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email or
        by posting a notice on the site. Your continued use of StayNest after the changes take effect constitutes your
        acceptance of the updated policy.
      </p>

      <h2 className="text-xl font-bold text-ink">Contact</h2>
      <p>
        For privacy requests or questions, contact us at{" "}
        <a href="mailto:staynest2026@gmail.com" className="font-bold text-lagoon">
          staynest2026@gmail.com
        </a>
        .
      </p>
    </LegalPage>
  );
}
