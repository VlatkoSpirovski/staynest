import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody) as PaddleWebhook;
  const eventType = event.event_type || "";
  const data = event.data || {};
  const plan = data.custom_data?.plan === "ai" ? "ai" : data.custom_data?.plan === "basic" ? "basic" : undefined;
  const userId = data.custom_data?.userId;
  const customerId = data.customer_id || undefined;
  const subscriptionId = eventType.startsWith("subscription.") ? data.id : data.subscription_id || undefined;
  const transactionId = eventType.startsWith("transaction.") ? data.id : undefined;
  const status = subscriptionStatus(eventType, data.status);
  const trialEndsAt = status === "TRIALING" ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : undefined;

  const where = userId
    ? { id: userId }
    : subscriptionId
      ? { paddleSubscriptionId: subscriptionId }
      : customerId
        ? { paddleCustomerId: customerId }
        : null;

  if (!where) {
    return NextResponse.json({ received: true, ignored: true });
  }

  await prisma.user.updateMany({
    where,
    data: {
      ...(plan ? { selectedPlan: plan } : {}),
      ...(status ? { subscriptionStatus: status } : {}),
      ...(trialEndsAt ? { trialEndsAt } : {}),
      ...(customerId ? { paddleCustomerId: customerId } : {}),
      ...(subscriptionId ? { paddleSubscriptionId: subscriptionId } : {}),
      ...(transactionId ? { paddleTransactionId: transactionId } : {})
    }
  });

  return NextResponse.json({ received: true });
}
