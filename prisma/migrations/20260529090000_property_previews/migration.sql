-- CreateTable
CREATE TABLE IF NOT EXISTS "PropertyPreview" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "listingUrl" TEXT,
    "name" TEXT,
    "description" TEXT,
    "welcomeMessage" TEXT,
    "coverImageUrl" TEXT,
    "checkInInfo" TEXT,
    "checkOutInfo" TEXT,
    "parkingInfo" TEXT,
    "houseRules" TEXT,
    "facilities" TEXT,
    "emergencyInfo" TEXT,
    "hostContactName" TEXT,
    "aiKnowledge" TEXT,
    "locationInfo" TEXT,
    "recommendationsDraft" TEXT,
    "essentialsDraft" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "claimedPropertyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyPreview_pkey" PRIMARY KEY ("id")
);

-- Existing development databases may already have the first preview table
-- from the initial implementation pass. Keep this migration safe to rerun.
ALTER TABLE "PropertyPreview" ADD COLUMN IF NOT EXISTS "locationInfo" TEXT;
ALTER TABLE "PropertyPreview" ADD COLUMN IF NOT EXISTS "recommendationsDraft" TEXT;
ALTER TABLE "PropertyPreview" ADD COLUMN IF NOT EXISTS "essentialsDraft" TEXT;

-- CreateTable
CREATE TABLE IF NOT EXISTS "PreviewAnalyticsEvent" (
    "id" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "previewToken" TEXT,
    "propertyId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PreviewAnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "PropertyPreview_token_key" ON "PropertyPreview"("token");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "PropertyPreview_expiresAt_idx" ON "PropertyPreview"("expiresAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "PropertyPreview_claimedPropertyId_idx" ON "PropertyPreview"("claimedPropertyId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "PreviewAnalyticsEvent_eventName_createdAt_idx" ON "PreviewAnalyticsEvent"("eventName", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "PreviewAnalyticsEvent_previewToken_createdAt_idx" ON "PreviewAnalyticsEvent"("previewToken", "createdAt");
