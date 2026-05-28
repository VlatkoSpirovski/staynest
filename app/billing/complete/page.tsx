import { AppLegalLinks } from "@/components/app-legal-links";
import { BillingCompleteClient } from "@/components/billing-complete-client";
import { Panel } from "@/components/ui/panel";
import { getAppUrl } from "@/lib/utils";

export default function BillingCompletePage() {
  const dashboardUrl = `${getAppUrl()}/dashboard`;

  return (
    <main className="grid min-h-screen place-items-center bg-mist px-5 py-10 text-ink">
      <Panel className="w-full max-w-md">
        <BillingCompleteClient dashboardUrl={dashboardUrl} />
        <AppLegalLinks className="mt-6 border-t border-ink/10 pt-5" />
      </Panel>
    </main>
  );
}
