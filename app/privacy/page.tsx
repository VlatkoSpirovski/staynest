import { LegalPage } from "@/components/legal-page";

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Privacy" title="Privacy Policy">
      <p>Last updated: May 22, 2026</p>
      <p>This policy explains how StayNest collects and uses information when hosts and guests use the service.</p>
      <h2 className="text-xl font-bold text-ink">Information We Collect</h2>
      <p>We collect account information such as name, email address and login details. Hosts may add property information, contact details, images, recommendations, review links and guide content.</p>
      <h2 className="text-xl font-bold text-ink">Guest Use</h2>
      <p>Guests can open public guide links and may use optional AI chat. Guest messages may be processed to generate replies and improve the guide experience.</p>
      <h2 className="text-xl font-bold text-ink">How We Use Information</h2>
      <p>We use information to provide accounts, publish guest guides, generate QR links, process subscriptions, provide support, secure the service and improve product functionality.</p>
      <h2 className="text-xl font-bold text-ink">Service Providers</h2>
      <p>We may use service providers for hosting, databases, payments, image storage, email delivery and AI processing. These providers process information only as needed to provide the service.</p>
      <h2 className="text-xl font-bold text-ink">Data Retention</h2>
      <p>We retain account and guide data while an account is active or as needed for legal, billing and operational purposes.</p>
      <h2 className="text-xl font-bold text-ink">Your Choices</h2>
      <p>You can update or remove property content in your dashboard. You may request account or data deletion by contacting us.</p>
      <h2 className="text-xl font-bold text-ink">Contact</h2>
      <p>For privacy requests, contact us at staynest2026@gmail.com.</p>
    </LegalPage>
  );
}
