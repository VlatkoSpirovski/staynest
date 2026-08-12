import "server-only";

import { prisma } from "@/lib/prisma";

/**
 * Reconciles a user's subscription state directly against the Paddle API.
 *
 * Webhooks are the normal path, but they are asynchronous and fail quietly: a
 * missing or mismatched PADDLE_WEBHOOK_SECRET makes every delivery 400, and the
 * app never learns that someone paid. That stranded paying owners behind the
 * paywall with no way out. This pulls the truth from Paddle on demand instead, so
 * activation no longer depends on a webhook arriving.
 */

type PaddleTransaction = {
  data?: {
    id?: string;
    status?: string;
    customer_id?: string | null;
    subscription_id?: string | null;
  };
};

type PaddleSubscription = {
  data?: {
    id?: string;
    status?: string;
    customer_id?: string | null;
  };
};

type PaddleSubscriptionList = {
  data?: Array<{ id?: string; status?: string; customer_id?: string | null }>;
};

type PaddleCustomerList = {
  data?: Array<{ id?: string; email?: string }>;
};

function paddleApiBase() {
  return process.env.PADDLE_ENV === "sandbox" ? "https://sandbox-api.paddle.com" : "https://api.paddle.com";
}

async function paddleGet<T>(path: string): Promise<T | null> {
  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(`${paddleApiBase()}${path}`, {
      headers: { authorization: `Bearer ${apiKey}` },
      cache: "no-store"
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

/** Maps a Paddle subscription status onto the values stored on User. */
function mapSubscriptionStatus(status?: string | null) {
  switch (status) {
    case "active":
      return "ACTIVE";
    case "trialing":
      return "TRIALING";
    case "past_due":
      return "PAST_DUE";
    case "paused":
      return "PAUSED";
    case "canceled":
      return "CANCELED";
    default:
      return null;
  }
}

export type PaddleReconcileResult = {
  changed: boolean;
  status: string | null;
};

export async function reconcilePaddleStatus(user: {
  id: string;
  email: string;
  subscriptionStatus: string | null;
  paddleCustomerId: string | null;
  paddleSubscriptionId: string | null;
  paddleTransactionId: string | null;
}): Promise<PaddleReconcileResult> {
  if (user.subscriptionStatus?.toUpperCase() === "ACTIVE") {
    return { changed: false, status: user.subscriptionStatus };
  }

  let status: string | null = null;
  let subscriptionId = user.paddleSubscriptionId;
  let customerId = user.paddleCustomerId;

  // A known subscription is the most direct answer.
  if (subscriptionId) {
    const result = await paddleGet<PaddleSubscription>(`/subscriptions/${subscriptionId}`);
    status = mapSubscriptionStatus(result?.data?.status);
    customerId = result?.data?.customer_id ?? customerId;
  }

  // Otherwise fall back to the transaction this app created at checkout.
  if (!status && user.paddleTransactionId) {
    const result = await paddleGet<PaddleTransaction>(`/transactions/${user.paddleTransactionId}`);
    const txStatus = result?.data?.status;
    subscriptionId = result?.data?.subscription_id ?? subscriptionId;
    customerId = result?.data?.customer_id ?? customerId;

    if (txStatus === "completed" || txStatus === "paid") {
      status = "ACTIVE";
    }

    // A completed transaction usually points at a subscription; prefer its status.
    if (subscriptionId && !status) {
      const sub = await paddleGet<PaddleSubscription>(`/subscriptions/${subscriptionId}`);
      status = mapSubscriptionStatus(sub?.data?.status);
    }
  }

  // Accounts that paid before the app started storing a transaction id have no
  // handle at all, so fall back to matching the Paddle customer by email.
  if (!status && !customerId) {
    const customers = await paddleGet<PaddleCustomerList>(`/customers?email=${encodeURIComponent(user.email)}`);
    customerId = customers?.data?.[0]?.id ?? null;
  }

  // Last resort: look up any subscription attached to the customer.
  if (!status && customerId) {
    const result = await paddleGet<PaddleSubscriptionList>(`/subscriptions?customer_id=${encodeURIComponent(customerId)}`);
    const live = result?.data?.find((item) => item.status === "active" || item.status === "trialing");
    if (live) {
      subscriptionId = live.id ?? subscriptionId;
      status = mapSubscriptionStatus(live.status);
    }
  }

  if (!status) {
    return { changed: false, status: user.subscriptionStatus };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: status,
      ...(subscriptionId ? { paddleSubscriptionId: subscriptionId } : {}),
      ...(customerId ? { paddleCustomerId: customerId } : {})
    }
  });

  return { changed: status !== user.subscriptionStatus, status };
}
