ALTER TABLE "Recommendation" ADD COLUMN "placeId" TEXT;
ALTER TABLE "Recommendation" ADD COLUMN "name" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Recommendation" ADD COLUMN "customTitle" TEXT;
ALTER TABLE "Recommendation" ADD COLUMN "customDescription" TEXT;
ALTER TABLE "Recommendation" ADD COLUMN "formattedAddress" TEXT;
ALTER TABLE "Recommendation" ADD COLUMN "latitude" DOUBLE PRECISION;
ALTER TABLE "Recommendation" ADD COLUMN "longitude" DOUBLE PRECISION;
ALTER TABLE "Recommendation" ADD COLUMN "googleMapsUrl" TEXT;
ALTER TABLE "Recommendation" ADD COLUMN "rating" DOUBLE PRECISION;
ALTER TABLE "Recommendation" ADD COLUMN "userRatingsTotal" INTEGER;
ALTER TABLE "Recommendation" ADD COLUMN "openingHours" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Recommendation" ADD COLUMN "website" TEXT;
ALTER TABLE "Recommendation" ADD COLUMN "phoneNumber" TEXT;
ALTER TABLE "Recommendation" ADD COLUMN "photoUrl" TEXT;
ALTER TABLE "Recommendation" ADD COLUMN "isEssential" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Recommendation" ADD COLUMN "isVisible" BOOLEAN NOT NULL DEFAULT true;

UPDATE "Recommendation"
SET
  "name" = COALESCE(NULLIF("title", ''), ''),
  "customTitle" = NULLIF("title", ''),
  "customDescription" = NULLIF("description", ''),
  "formattedAddress" = COALESCE("address", NULL),
  "googleMapsUrl" = COALESCE("url", NULL),
  "photoUrl" = COALESCE("imageUrl", NULL)
WHERE "name" = '';

CREATE INDEX "Recommendation_placeId_idx" ON "Recommendation"("placeId");
