ALTER TABLE "Property" ADD COLUMN "translationLocales" TEXT[] NOT NULL DEFAULT ARRAY['en']::TEXT[];
ALTER TABLE "Property" ADD COLUMN "translations" JSONB;
ALTER TABLE "GuideSection" ADD COLUMN "translations" JSONB;
ALTER TABLE "Recommendation" ADD COLUMN "translations" JSONB;
