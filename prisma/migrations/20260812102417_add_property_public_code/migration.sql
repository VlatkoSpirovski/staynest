-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "publicCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Property_publicCode_key" ON "Property"("publicCode");


-- Backfill short public codes for existing properties, using the same
-- unambiguous alphabet as lib/secure-slug.ts (no 0/O, 1/I/L, U). The subquery is
-- correlated on "id" so each row gets its own code.
UPDATE "Property"
SET "publicCode" = (
  SELECT string_agg(
    substr(
      '23456789abcdefghjkmnpqrstvwxyz',
      1 + (('x' || substr(h, n * 2 - 1, 2))::bit(8)::int % 30),
      1
    ),
    '' ORDER BY n
  )
  FROM (SELECT md5("Property"."id" || clock_timestamp()::text || random()::text) AS h) AS source,
       generate_series(1, 10) AS n
)
WHERE "publicCode" IS NULL;
