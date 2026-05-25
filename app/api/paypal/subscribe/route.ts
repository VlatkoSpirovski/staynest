import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireReadyUser } from "@/lib/auth";
import { getPaymentUrl } from "@/lib/utils";

function paypalBaseUrl() {
  return process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}

function planIdFor(plan: string) {
  return plan === "ai" ? process.env.PAYPAL_AI_PLAN_ID : process.env.PAYPAL_BASIC_PLAN_ID;
}

export async function GET(request: Request) {
  const user = await requireReadyUser();
  const plan = new URL(request.url).searchParams.get("plan") === "ai" ? "ai" : "basic";
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const planId = planIdFor(plan);

  if (!clientId || !clientSecret || !planId) {
    return NextResponse.redirect(`${getPaymentUrl()}/billing?plan=${plan}&error=${encodeURIComponent("PayPal is not configured yet.")}`);
  }

  const baseUrl = paypalBaseUrl();
  const tokenResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "content-type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials",
    cache: "no-store"
  });

  if (!tokenResponse.ok) {
    return NextResponse.redirect(`${getPaymentUrl()}/billing?plan=${plan}&error=${encodeURIComponent("PayPal authorization failed.")}`);
  }

  const tokenData = (await tokenResponse.json()) as { access_token: string };
  const subscriptionResponse = await fetch(`${baseUrl}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${tokenData.access_token}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      plan_id: planId,
      custom_id: user.id,
      application_context: {
        brand_name: "StayNest",
        locale: "en-US",
        shipping_preference: "NO_SHIPPING",
        user_action: "SUBSCRIBE_NOW",
        return_url: `${getPaymentUrl()}/billing/complete`,
        cancel_url: `${getPaymentUrl()}/billing?plan=${plan}`
      }
    }),
    cache: "no-store"
  });

  if (!subscriptionResponse.ok) {
    return NextResponse.redirect(`${getPaymentUrl()}/billing?plan=${plan}&error=${encodeURIComponent("Could not create PayPal subscription.")}`);
  }

  const subscription = (await subscriptionResponse.json()) as {
    id?: string;
    links?: Array<{ href: string; rel: string }>;
  };
  const approveUrl = subscription.links?.find((link) => link.rel === "approve")?.href;

  if (!approveUrl) {
    return NextResponse.redirect(`${getPaymentUrl()}/billing?plan=${plan}&error=${encodeURIComponent("PayPal did not return an approval link.")}`);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      selectedPlan: plan,
      paypalSubscriptionId: subscription.id,
      subscriptionStatus: "PENDING"
    }
  });

  return NextResponse.redirect(approveUrl);
}
