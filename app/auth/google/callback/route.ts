import { redirect } from "next/navigation";
import { getGoogleProfile, signInWithOAuthProfile, verifyOAuthState } from "@/lib/oauth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  if (!verifyOAuthState(params.get("state"))) {
    redirect("/login?error=Google%20login%20expired.%20Please%20try%20again.");
  }

  const code = params.get("code");
  if (!code) {
    redirect("/login?error=Google%20did%20not%20return%20a%20code.");
  }

  let result: Awaited<ReturnType<typeof signInWithOAuthProfile>>;
  try {
    const profile = await getGoogleProfile(code);
    result = await signInWithOAuthProfile(profile);
  } catch (error) {
    redirect(`/login?error=${encodeURIComponent(error instanceof Error ? error.message : "Google login failed.")}`);
  }

  redirect(result.isNewUser ? `/billing?plan=${result.selectedPlan}` : "/dashboard");
}
