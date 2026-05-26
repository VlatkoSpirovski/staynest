import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { hasBillingAccess, normalizePlanKey } from "@/lib/billing";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Stores the selected plan key right after client-side checkout completes.
 * The webhook remains the authoritative source for subscriptionStatus.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { plan?: string };
  const selectedPlanKey = normalizePlanKey(body.plan);

  // If the webhook hasn't arrived yet, ensure the dashboard reflects the plan the user chose.
  if (selectedPlanKey) {
    await prisma.user.update({
      where: { id: user.id },
      data: { selectedPlan: selectedPlanKey }
    });
  }

  return NextResponse.json({
    status: user.subscriptionStatus,
    ready: hasBillingAccess(user)
  });
}
