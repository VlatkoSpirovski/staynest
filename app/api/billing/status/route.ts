import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { hasBillingAccess } from "@/lib/billing";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ status: null, ready: false }, { status: 401 });
  }

  return NextResponse.json({
    status: user.subscriptionStatus,
    ready: hasBillingAccess(user)
  });
}
