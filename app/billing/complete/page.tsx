import { CheckCircle2 } from "lucide-react";
import { AppLegalLinks } from "@/components/app-legal-links";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export default function BillingCompletePage() {
  return (
    <main className="grid min-h-screen place-items-center bg-mist px-5 py-10 text-ink">
      <Panel className="w-full max-w-md text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-[8px] bg-olive text-white">
          <CheckCircle2 size={22} />
        </div>
        <h1 className="mt-5 text-2xl font-bold">Checkout complete</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          Paddle is confirming the subscription. Your dashboard will update automatically after the webhook arrives.
        </p>
        <Button href="/dashboard" className="mt-6 w-full">
          Open dashboard
        </Button>
        <AppLegalLinks className="mt-6 border-t border-ink/10 pt-5" />
      </Panel>
    </main>
  );
}
