import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-mist px-5 py-10 text-ink">
      <Panel className="w-full max-w-md text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-[8px] bg-lagoon text-white">
          <Home size={22} />
        </div>
        <h1 className="mt-5 text-2xl font-bold">Registration is invite-only</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          StayNest owner accounts are created by the platform admin for this MVP. If you own a rental property,
          ask the admin to create your account and temporary password.
        </p>
        <Button href="/login" className="mt-6 w-full">
          Go to login
        </Button>
      </Panel>
    </main>
  );
}
