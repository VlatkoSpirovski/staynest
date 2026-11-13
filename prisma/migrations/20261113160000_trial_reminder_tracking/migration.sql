-- AlterTable
ALTER TABLE "User" ADD COLUMN     "trialReminderEndedSentAt" TIMESTAMP(3),
ADD COLUMN     "trialReminderSoonSentAt" TIMESTAMP(3);

