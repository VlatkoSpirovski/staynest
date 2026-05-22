import { LegalPage } from "@/components/legal-page";

export default function RefundPage() {
  return (
    <LegalPage eyebrow="Refunds" title="Refund Policy">
      <p>Last updated: May 22, 2026</p>
      <p>StayNest is a monthly software subscription for rental hosts.</p>
      <h2 className="text-xl font-bold text-ink">Free Trial</h2>
      <p>New users may start with a 7-day free trial. If you cancel before the trial ends, you will not be charged for the next billing period.</p>
      <h2 className="text-xl font-bold text-ink">Monthly Billing</h2>
      <p>Paid subscriptions renew monthly. You may cancel future renewals from billing support or by contacting us.</p>
      <h2 className="text-xl font-bold text-ink">Refunds</h2>
      <p>If you believe you were charged by mistake, contact us within 14 days of the charge. Refunds are reviewed case by case. We do not generally refund periods where the service was actively used, except where required by law.</p>
      <h2 className="text-xl font-bold text-ink">Service Issues</h2>
      <p>If a technical issue prevents normal use of StayNest, contact us and we will work to resolve it or review a fair refund or credit.</p>
      <h2 className="text-xl font-bold text-ink">Contact</h2>
      <p>For refund requests, contact us at staynest2026@gmail.com.</p>
    </LegalPage>
  );
}
