export type PaddleWebhookStatusInput = {
  eventType: string;
  paddleStatus?: string | null;
  checkoutMode?: string | null;
  origin?: string | null;
};

const RECURRING_ORIGINS = new Set(["subscription_recurring", "subscription_charge", "subscription_update"]);

export function webhookStatus({ eventType, paddleStatus, checkoutMode, origin }: PaddleWebhookStatusInput) {
  if (eventType === "transaction.completed") {
    if (origin && RECURRING_ORIGINS.has(origin)) return "ACTIVE";
    return checkoutMode === "card-required-trial" ? "TRIALING" : "ACTIVE";
  }
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

export function resolveStatus(current: string | null | undefined, incoming: string | null, eventType: string) {
  if (!incoming) return null;
  const isTransactionEvent = eventType.startsWith("transaction.");
  if (isTransactionEvent && incoming === "TRIALING" && current?.toUpperCase() === "ACTIVE") return null;
  return incoming;
}
