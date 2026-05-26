import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { hasBillingAccess } from "@/lib/billing";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Immediately transitions a user from PENDING to TRIALING after client-side
 * checkout completion. This bridges the gap between the Paddle overlay closing
 * and the webhook arriving (which can take several seconds). The webhook will
 * overwrite this with the authoritative status when it arrives.
 */
export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Only transition from PENDING or NULL — never override a webhook-set status
  if (!user.subscriptionStatus || user.subscriptionStatus === "PENDING") {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: "TRIALING",
        trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    return NextResponse.json({ status: "TRIALING", ready: true });
  }

  return NextResponse.json({
    status: user.subscriptionStatus,
    ready: hasBillingAccess(user)
  });
}
