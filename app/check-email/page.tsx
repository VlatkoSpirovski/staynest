import { MailCheck } from "lucide-react";
import { AppLegalLinks } from "@/components/app-legal-links";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export const metadata = {
  title: "Check your email",
  robots: {
    index: false,
    follow: false
  }
};

type CheckEmailPageProps = {
  searchParams?: {
    email?: string;
    resent?: string;
  };
};

export default function CheckEmailPage({ searchParams }: CheckEmailPageProps) {
  const email = searchParams?.email || "";

  return (
    <main className="grid min-h-screen place-items-center bg-mist px-5 py-10 text-ink">
      <Panel className="w-full max-w-md text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-[8px] bg-lagoon text-white">
          <MailCheck size={23} />
        </div>
        <h1 className="mt-5 text-2xl font-bold">Confirm your email</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          We sent a confirmation link to <span className="font-semibold text-ink">{email || "your email address"}</span>.
          Open the link to finish registration.
        </p>
        <Button href="/login" variant="ghost" className="mt-3 w-full">
          Back to login
        </Button>
        <p className="mt-5 text-xs leading-5 text-ink/50">
          In local development without SMTP credentials, the confirmation link is printed in the dev server terminal.
        </p>
        <AppLegalLinks className="mt-6 border-t border-ink/10 pt-5" />
      </Panel>
    </main>
  );
}
