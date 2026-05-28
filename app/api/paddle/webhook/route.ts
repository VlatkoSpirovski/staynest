import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizePlanKey } from "@/lib/billing";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const preferredRegion = "fra1";

type PaddleWebhook = {
  event_id?: string;
  event_type?: string;
  data?: {
    id?: string;
    status?: string;
    customer_id?: string | null;
    subscription_id?: string | null;
    custom_data?: {
      userId?: string;
      plan?: string;
      planKey?: string;
      billingInterval?: string;
    } | null;
  };
};

function parseSignature(header: string) {
  return Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim().split("="))
      .filter((part): part is [string, string] => part.length === 2)
  );
}

function verifyPaddleSignature(rawBody: string, signatureHeader: string | null, secret: string) {
  if (!signatureHeader || !secret) return false;
  const parts = parseSignature(signatureHeader);
  const timestamp = parts.ts;
  const signature = parts.h1;
  if (!timestamp || !signature) return false;

  const ageSeconds = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(ageSeconds) || ageSeconds > 5 * 60) return false;

  const expected = createHmac("sha256", secret).update(`${timestamp}:${rawBody}`).digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  const signatureBuffer = Buffer.from(signature, "hex");
  return expectedBuffer.length === signatureBuffer.length && timingSafeEqual(expectedBuffer, signatureBuffer);
}

function subscriptionStatus(eventType: string, paddleStatus?: string | null) {
  if (eventType === "transaction.completed") return "ACTIVE";
  if (eventType === "transaction.payment_failed") return "PAST_DUE";
  if (eventType === "subscription.trialing") return "TRIALING";
  if (eventType === "subscription.activated" || eventType === "subscription.resumed") return "ACTIVE";
  if (eventType === "subscription.paused") return "PAUSED";
  if (eventType === "subscription.canceled") return "CANCELED";
  if (eventType === "subscription.past_due") return "PAST_DUE";
  if (eventType === "subscription.created" || eventType === "subscription.updated") {
    return paddleStatus ? paddleStatus.toUpperCase() : "ACTIVE";
  }
  return null;
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;

  if (!verifyPaddleSignature(rawBody, request.headers.get("paddle-signature"), webhookSecret || "")) {
    console.error("[paddle-webhook] Signature verification FAILED", {
      hasSecret: Boolean(webhookSecret),
      hasSignatureHeader: Boolean(request.headers.get("paddle-signature"))
    });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: PaddleWebhook;
  try {
    event = JSON.parse(rawBody) as PaddleWebhook;
  } catch {
    return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
  }
  const eventType = event.event_type || "";
  const data = event.data || {};
  const selectedPlanKey = data.custom_data?.planKey ? normalizePlanKey(data.custom_data.planKey) : undefined;
  const userId = data.custom_data?.userId;
  const customerId = data.customer_id || undefined;
  const subscriptionId = eventType.startsWith("subscription.") ? data.id : data.subscription_id || undefined;
  const transactionId = eventType.startsWith("transaction.") ? data.id : undefined;
  const status = subscriptionStatus(eventType, data.status);
  const trialEndsAt = status === "TRIALING" ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : undefined;

  console.log("[paddle-webhook] Received", { eventType, userId, customerId, subscriptionId, transactionId, status, selectedPlanKey });

  const where = userId
    ? { id: userId }
    : subscriptionId
      ? { paddleSubscriptionId: subscriptionId }
      : customerId
        ? { paddleCustomerId: customerId }
        : null;

  if (!where) {
    console.warn("[paddle-webhook] No user lookup key found — ignoring event", { eventType, customData: data.custom_data });
    return NextResponse.json({ received: true, ignored: true });
  }

  const result = await prisma.user.updateMany({
    where,
    data: {
      ...(selectedPlanKey ? { selectedPlan: selectedPlanKey } : {}),
      ...(status ? { subscriptionStatus: status } : {}),
      ...(trialEndsAt ? { trialEndsAt } : {}),
      ...(customerId ? { paddleCustomerId: customerId } : {}),
      ...(subscriptionId ? { paddleSubscriptionId: subscriptionId } : {}),
      ...(transactionId ? { paddleTransactionId: transactionId } : {})
    }
  });

  console.log("[paddle-webhook] Updated", { where, matchedCount: result.count });

  return NextResponse.json({ received: true });
}
