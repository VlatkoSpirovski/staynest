import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { hasBillingAccess, normalizePlanKey } from "@/lib/billing";
import { prisma } from "@/lib/prisma";
import { reconcilePaddleStatus } from "@/lib/paddle-sync";
import { isTrustedAppRequest } from "@/lib/request-security";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Stores the selected plan key right after client-side checkout completes, then
 * asks Paddle for the latest status. Webhooks remain the normal authoritative
 * path, but this avoids stranding a just-checked-out owner if delivery is slow.
 */
export async function POST(request: Request) {
  if (!isTrustedAppRequest(request)) {
    return NextResponse.json({ error: "Untrusted request origin" }, { status: 403 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (user.mustChangePassword) {
    return NextResponse.json({ error: "Password change required" }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as { plan?: string };
  const selectedPlanKey = normalizePlanKey(body.plan);

  // Only records the plan the owner picked. Trial access starts after Paddle
  // confirms checkout as TRIALING or ACTIVE.
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { selectedPlan: selectedPlanKey }
  });

  // Confirm the payment with Paddle directly rather than waiting on a webhook.
  const reconciled = await reconcilePaddleStatus(updatedUser);
  const current = reconciled.status ?? updatedUser.subscriptionStatus;

  return NextResponse.json({
    status: current,
    ready: hasBillingAccess({ ...updatedUser, subscriptionStatus: current })
  });
}
