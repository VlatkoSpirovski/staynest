import { redirect } from "next/navigation";
import { getGoogleAuthorizationUrl, setOAuthPlan, setOAuthPreviewToken } from "@/lib/oauth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  let authorizationUrl: string;
  try {
    const plan = new URL(request.url).searchParams.get("plan");
    const previewToken = new URL(request.url).searchParams.get("previewToken");
    setOAuthPlan(plan);
    setOAuthPreviewToken(previewToken);
    authorizationUrl = getGoogleAuthorizationUrl();
  } catch (error) {
    redirect(`/login?error=${encodeURIComponent(error instanceof Error ? error.message : "Google login failed.")}`);
  }

  redirect(authorizationUrl);
}
