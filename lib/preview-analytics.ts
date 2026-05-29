import "server-only";

import { prisma } from "@/lib/prisma";

type PreviewEventMetadata = Record<string, string | number | boolean | null>;

export async function recordPreviewEvent({
  eventName,
  previewToken,
  propertyId,
  metadata
}: {
  eventName: "preview_created" | "preview_opened" | "preview_claim_clicked" | "preview_claimed" | "preview_expired";
  previewToken?: string | null;
  propertyId?: string | null;
  metadata?: PreviewEventMetadata;
}) {
  try {
    await prisma.previewAnalyticsEvent.create({
      data: {
        eventName,
        previewToken: previewToken || null,
        propertyId: propertyId || null,
        metadata: metadata || undefined
      }
    });
  } catch (error) {
    console.warn("[preview-analytics] Failed to record event", { eventName, previewToken, error });
  }
}
