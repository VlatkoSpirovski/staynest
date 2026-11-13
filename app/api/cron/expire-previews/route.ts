import { NextResponse } from "next/server";
import { isAuthorizedCronRequest } from "@/lib/cron-auth";
import { prisma } from "@/lib/prisma";
import { recordPreviewEvent } from "@/lib/preview-analytics";
import { pruneRateLimits } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isAuthorizedCronRequest(request.headers.get("authorization"), process.env.CRON_SECRET, process.env.NODE_ENV)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Piggyback the rate-limit sweep on the existing cron so closed windows do
  // not accumulate forever.
  const prunedRateLimits = await pruneRateLimits();

  const expiredPreviews = await prisma.propertyPreview.findMany({
    where: {
      claimedPropertyId: null,
      expiresAt: {
        lte: new Date()
      }
    },
    select: {
      id: true,
      token: true
    }
  });

  for (const preview of expiredPreviews) {
    await recordPreviewEvent({ eventName: "preview_expired", previewToken: preview.token });
  }

  if (expiredPreviews.length > 0) {
    await prisma.propertyPreview.deleteMany({
      where: {
        id: {
          in: expiredPreviews.map((preview) => preview.id)
        }
      }
    });
  }

  return NextResponse.json({ expired: expiredPreviews.length, prunedRateLimits });
}
