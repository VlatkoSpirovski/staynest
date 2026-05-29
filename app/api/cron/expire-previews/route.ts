import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordPreviewEvent } from "@/lib/preview-analytics";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

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

  return NextResponse.json({ expired: expiredPreviews.length });
}
