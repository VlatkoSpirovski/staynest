import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { hasBillingAccess, normalizePlanKey } from "@/lib/billing";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Stores the selected plan key right after client-side checkout completes.
 * In production, the webhook remains the authoritative source for subscriptionStatus.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { plan?: string };
  const selectedPlanKey = normalizePlanKey(body.plan);

  const isDev = process.env.NODE_ENV !== "production";
  const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      selectedPlan: selectedPlanKey,
      ...(isDev
        ? {
            subscriptionStatus: "TRIALING",
            trialEndsAt
          }
        : {})
    }
  });

  return NextResponse.json({
    status: updatedUser.subscriptionStatus,
    ready: hasBillingAccess(updatedUser)
  });
}
