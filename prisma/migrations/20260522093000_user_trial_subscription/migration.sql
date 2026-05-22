ALTER TABLE "User" ADD COLUMN "selectedPlan" TEXT;
ALTER TABLE "User" ADD COLUMN "trialEndsAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "subscriptionStatus" TEXT;
ALTER TABLE "User" ADD COLUMN "paypalSubscriptionId" TEXT;
