import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export async function GET() {
  redirect("/login?error=Apple%20login%20is%20disabled%20for%20the%20MVP.");
}
