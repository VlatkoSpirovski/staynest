import { NextResponse } from "next/server";
import { billingUrl } from "@/lib/billing";
import { isAuthorizedCronRequest } from "@/lib/cron-auth";
import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { ENDED_GRACE_MS, SOON_WINDOW_MS, trialReminderEmail, trialReminderFor } from "@/lib/trial-reminders";
import { getAppUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isAuthorizedCronRequest(request.headers.get("authorization"), process.env.CRON_SECRET, process.env.NODE_ENV)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const candidates = await prisma.user.findMany({
    where: {
      role: "OWNER",
      subscriptionStatus: "TRIALING",
      paddleSubscriptionId: null,
      trialEndsAt: { gte: new Date(now.getTime() - ENDED_GRACE_MS), lte: new Date(now.getTime() + SOON_WINDOW_MS) }
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      selectedPlan: true,
      subscriptionStatus: true,
      trialEndsAt: true,
      paddleSubscriptionId: true,
      trialReminderSoonSentAt: true,
      trialReminderEndedSentAt: true
    }
  });

  let sent = 0;
  let failed = 0;

  for (const user of candidates) {
    const kind = trialReminderFor(user, now);
    if (!kind || !user.trialEndsAt) continue;

    const field = kind === "soon" ? "trialReminderSoonSentAt" : "trialReminderEndedSentAt";
    const claim = await prisma.user.updateMany({ where: { id: user.id, [field]: null }, data: { [field]: now } });
    if (claim.count === 0) continue;

    const email = trialReminderEmail(kind, {
      name: user.name,
      endsOn: user.trialEndsAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
      billingUrl: billingUrl(user.selectedPlan),
      dashboardUrl: `${getAppUrl()}/dashboard`
    });

    try {
      await sendEmail({ to: user.email, ...email });
      sent += 1;
    } catch (error) {
      failed += 1;
      await prisma.user.update({ where: { id: user.id }, data: { [field]: null } });
      console.error("[trial-reminders] Send failed", { userId: user.id, kind, error: error instanceof Error ? error.message : "unknown" });
    }
  }

  console.log("[trial-reminders] Done", { candidates: candidates.length, sent, failed });
  return NextResponse.json({ candidates: candidates.length, sent, failed });
}
