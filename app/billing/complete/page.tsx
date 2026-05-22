import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export default function BillingCompletePage() {
  return (
    <main className="grid min-h-screen place-items-center bg-mist px-5 py-10 text-ink">
      <Panel className="w-full max-w-md text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-[8px] bg-olive text-white">
          <CheckCircle2 size={22} />
        </div>
        <h1 className="mt-5 text-2xl font-bold">PayPal subscription connected</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          Your StayNest account is ready. You can now create and manage your guest guide.
        </p>
        <Button href="/dashboard" className="mt-6 w-full">
          Open dashboard
        </Button>
      </Panel>
    </main>
  );
}
