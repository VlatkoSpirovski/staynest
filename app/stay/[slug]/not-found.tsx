import { Button } from "@/components/ui/button";

export default function GuideNotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-mist px-5 text-center text-ink">
      <div>
        <h1 className="text-3xl font-bold">Guide not found</h1>
        <p className="mt-3 max-w-md text-ink/60">This guest guide is not available. Please check the link or contact your host.</p>
        <Button href="/" className="mt-6">
          Go to StayNest
        </Button>
      </div>
    </main>
  );
}
