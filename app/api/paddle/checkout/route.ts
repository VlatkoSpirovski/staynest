import { NextResponse } from "next/server";
import { requireReadyUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const preferredRegion = "fra1";

type CheckoutRequest = {
  plan?: string;
};

type PaddleErrorResponse = {
  error?: {
    code?: string;
    detail?: string;
    type?: string;
  };
};

type PaddleTransactionResponse = {
  data?: {
    id?: string;
  };
};

function paddleApiBase() {
  return process.env.PADDLE_ENV === "sandbox" ? "https://sandbox-api.paddle.com" : "https://api.paddle.com";
}

function paddleConfigError(apiKey: string, priceId: string | undefined) {
  if (!apiKey) return "PADDLE_API_KEY is missing in Vercel.";
  if (!priceId) return "The selected Paddle price ID is missing in Vercel.";
  if (!priceId.startsWith("pri_")) return "The selected Paddle price ID must start with pri_.";
  if (process.env.PADDLE_ENV === "production" && apiKey.startsWith("pdl_sandbox_")) {
    return "PADDLE_ENV is production, but PADDLE_API_KEY is a sandbox key.";
  }
  if (process.env.PADDLE_ENV === "sandbox" && apiKey.startsWith("pdl_live_")) {
    return "PADDLE_ENV is sandbox, but PADDLE_API_KEY is a live key.";
  }
  return "";
}

function paddleErrorMessage(status: number, payload: PaddleErrorResponse) {
  const detail = payload.error?.detail || payload.error?.code || payload.error?.type;
  return detail ? `Paddle rejected checkout (${status}): ${detail}` : `Paddle rejected checkout (${status}).`;
}

export async function POST(request: Request) {
  const user = await requireReadyUser();
  const body = (await request.json().catch(() => ({}))) as CheckoutRequest;
  const plan = body.plan === "ai" ? "ai" : "basic";
  const priceId = plan === "ai" ? process.env.PADDLE_AI_PRICE_ID : process.env.PADDLE_BASIC_PRICE_ID;
  const apiKey = process.env.PADDLE_API_KEY || "";
  const configError = paddleConfigError(apiKey, priceId);

  if (configError) {
    return NextResponse.json({ error: configError }, { status: 400 });
  }

  const response = await fetch(`${paddleApiBase()}/transactions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      items: [{ price_id: priceId, quantity: 1 }],
      collection_mode: "automatic",
      custom_data: {
        userId: user.id,
        plan
      }
    })
  });

  const payload = (await response.json().catch(() => ({}))) as PaddleErrorResponse & PaddleTransactionResponse;

  if (!response.ok || !payload.data?.id) {
    return NextResponse.json({ error: paddleErrorMessage(response.status, payload) }, { status: 400 });
  }

  return NextResponse.json({ transactionId: payload.data.id });
}
