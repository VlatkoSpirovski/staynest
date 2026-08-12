import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { hasBillingAccess } from "@/lib/billing";
import { reconcilePaddleStatus } from "@/lib/paddle-sync";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ status: null, ready: false }, { status: 401 });
  }

  const reconciled = await reconcilePaddleStatus(user);
  const current = reconciled.status ?? user.subscriptionStatus;

  return NextResponse.json({
    status: current,
    ready: hasBillingAccess({ ...user, subscriptionStatus: current })
  });
}
