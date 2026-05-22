import { LegalPage } from "@/components/legal-page";

export default function TermsPage() {
  return (
    <LegalPage eyebrow="Terms" title="Terms of Service">
      <p>Last updated: May 22, 2026</p>
      <p>StayNest provides digital guest guide software for rental owners and hosts. By creating an account or using StayNest, you agree to these terms.</p>
      <h2 className="text-xl font-bold text-ink">Service</h2>
      <p>StayNest lets hosts create public guest guides with property details, recommendations, review links, QR codes and optional AI features. Hosts are responsible for the accuracy, legality and completeness of all content they publish.</p>
      <h2 className="text-xl font-bold text-ink">Accounts</h2>
      <p>You must provide accurate account information and keep your login credentials secure. You are responsible for activity under your account.</p>
      <h2 className="text-xl font-bold text-ink">Subscriptions</h2>
      <p>Paid plans are billed monthly after any free trial. Plan features and prices are listed on the pricing page. If payment fails, access to paid features may be limited or suspended.</p>
      <h2 className="text-xl font-bold text-ink">AI Features</h2>
      <p>AI import and guest assistant features are best-effort tools. Hosts must review AI-generated content before sharing it with guests. StayNest does not guarantee that AI output is complete or error-free.</p>
      <h2 className="text-xl font-bold text-ink">Acceptable Use</h2>
      <p>You may not use StayNest for illegal content, harmful instructions, spam, fraud, or content that infringes the rights of others.</p>
      <h2 className="text-xl font-bold text-ink">Liability</h2>
      <p>StayNest is provided as software-as-a-service. To the maximum extent permitted by law, StayNest is not liable for indirect damages, lost revenue, guest disputes, property issues or inaccurate host-provided content.</p>
      <h2 className="text-xl font-bold text-ink">Contact</h2>
      <p>For questions about these terms, contact us at staynest2026@gmail.com.</p>
    </LegalPage>
  );
}
