-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailCanonical" TEXT;

-- CreateTable
CREATE TABLE "RateLimit" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "bucket" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RateLimit_bucket_idx" ON "RateLimit"("bucket");

-- CreateIndex
CREATE UNIQUE INDEX "RateLimit_key_bucket_key" ON "RateLimit"("key", "bucket");

-- CreateIndex
CREATE INDEX "User_emailCanonical_idx" ON "User"("emailCanonical");


-- Backfill the dedup key for existing accounts, mirroring lib/email-identity.ts:
-- strip +tags on providers that alias them, and additionally strip dots on Gmail.
UPDATE "User"
SET "emailCanonical" = CASE
  WHEN split_part("email", '@', 2) IN ('gmail.com', 'googlemail.com')
    THEN replace(split_part(split_part("email", '@', 1), '+', 1), '.', '') || '@gmail.com'
  WHEN split_part("email", '@', 2) IN (
    'outlook.com', 'hotmail.com', 'live.com', 'fastmail.com',
    'protonmail.com', 'proton.me', 'icloud.com', 'me.com'
  )
    THEN split_part(split_part("email", '@', 1), '+', 1) || '@' || split_part("email", '@', 2)
  ELSE "email"
END
WHERE "emailCanonical" IS NULL;
