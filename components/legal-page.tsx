import { Button } from "@/components/ui/button";

export function LegalPage({
  eyebrow,
  title,
  children
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-mist text-ink">
      <div className="mx-auto max-w-3xl px-5 py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <a href="/" className="text-lg font-extrabold">
            StayNest
          </a>
          <Button href="/pricing" variant="secondary">
            Pricing
          </Button>
        </div>
        <article className="rounded-[8px] border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-lagoon">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">{title}</h1>
          <div className="legal-copy mt-7 grid gap-5 text-sm leading-7 text-ink/68">{children}</div>
        </article>
      </div>
    </main>
  );
}
