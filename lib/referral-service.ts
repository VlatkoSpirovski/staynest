import "server-only";

import { prisma } from "@/lib/prisma";
import { generateReferralCode, normalizeReferralCode, referrerRewardFor } from "@/lib/referrals";

export async function findReferrer(code: string | null | undefined, newUserEmailCanonical?: string | null) {
  const normalized = normalizeReferralCode(code);
  if (!normalized) return null;

  const referrer = await prisma.user.findUnique({
    where: { referralCode: normalized },
    select: { id: true, name: true, role: true, emailCanonical: true }
  });
  if (!referrer || referrer.role === "ADMIN") return null;
  if (newUserEmailCanonical && referrer.emailCanonical && referrer.emailCanonical === newUserEmailCanonical) return null;
  return referrer;
}

export async function ensureReferralCode(userId: string) {
  const existing = await prisma.user.findUnique({ where: { id: userId }, select: { referralCode: true } });
  if (existing?.referralCode) return existing.referralCode;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = generateReferralCode();
    try {
      const updated = await prisma.user.updateMany({ where: { id: userId, referralCode: null }, data: { referralCode: code } });
      if (updated.count === 1) return code;
      const current = await prisma.user.findUnique({ where: { id: userId }, select: { referralCode: true } });
      if (current?.referralCode) return current.referralCode;
    } catch {
      continue;
    }
  }
  return null;
}

export async function referralStats(userId: string) {
  const [invited, paid, user] = await Promise.all([
    prisma.user.count({ where: { referredById: userId } }),
    prisma.user.count({ where: { referredById: userId, referralRewardGrantedAt: { not: null } } }),
    prisma.user.findUnique({ where: { id: userId }, select: { referralCreditMonths: true } })
  ]);
  return { invited, paid, creditMonths: user?.referralCreditMonths ?? 0 };
}

export async function grantReferralRewardIfDue(referredUserId: string) {
  const referred = await prisma.user.findUnique({
    where: { id: referredUserId },
    select: { referredById: true, referralRewardGrantedAt: true }
  });
  if (!referred?.referredById || referred.referralRewardGrantedAt) return null;

  const claim = await prisma.user.updateMany({
    where: { id: referredUserId, referralRewardGrantedAt: null },
    data: { referralRewardGrantedAt: new Date() }
  });
  if (claim.count === 0) return null;

  const referrer = await prisma.user.findUnique({
    where: { id: referred.referredById },
    select: { id: true, role: true, subscriptionStatus: true, trialEndsAt: true, paddleSubscriptionId: true }
  });
  if (!referrer) return null;

  const reward = referrerRewardFor(referrer, new Date());
  if (reward.type === "extendTrial") {
    await prisma.user.update({
      where: { id: referrer.id },
      data: { subscriptionStatus: "TRIALING", trialEndsAt: reward.trialEndsAt, trialReminderSoonSentAt: null, trialReminderEndedSentAt: null }
    });
  } else if (reward.type === "credit") {
    await prisma.user.update({ where: { id: referrer.id }, data: { referralCreditMonths: { increment: reward.months } } });
  }

  console.log("[referrals] Reward granted", { referrerId: referrer.id, referredUserId, reward: reward.type });
  return reward;
}
