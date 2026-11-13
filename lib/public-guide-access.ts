import "server-only";

import { hasBillingAccess } from "@/lib/billing";
import { examplePublicGuide, isExamplePublicGuide } from "@/lib/example-public-guide";
import { reconcilePaddleStatus } from "@/lib/paddle-sync";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

type PublicGuideLookup =
  | { slug: string; publicCode?: never }
  | { slug?: never; publicCode: string };

const RECONCILE_WINDOW_SECONDS = 60 * 60;

export async function canServePublicGuide(lookup: PublicGuideLookup) {
  const slug = "slug" in lookup ? lookup.slug : undefined;
  const publicCode = "publicCode" in lookup ? lookup.publicCode : undefined;

  if (slug && isExamplePublicGuide(slug)) return true;
  if (publicCode === examplePublicGuide.publicCode) return true;

  if (!slug && !publicCode) return false;

  const property = await prisma.property.findFirst({
    where: slug ? { slug } : { publicCode },
    select: {
      owner: {
        select: {
          id: true,
          email: true,
          role: true,
          subscriptionStatus: true,
          trialEndsAt: true,
          paddleCustomerId: true,
          paddleSubscriptionId: true,
          paddleTransactionId: true
        }
      }
    }
  });

  if (!property) return false;
  const owner = property.owner;
  if (hasBillingAccess(owner)) return true;

  const hasPaddleHandle = Boolean(owner.paddleSubscriptionId || owner.paddleTransactionId || owner.paddleCustomerId);
  if (!hasPaddleHandle) return false;

  const throttle = await rateLimit(`paddle-reconcile:${owner.id}`, 1, RECONCILE_WINDOW_SECONDS);
  if (!throttle.allowed) return false;

  try {
    const reconciled = await reconcilePaddleStatus(owner);
    return hasBillingAccess({ ...owner, subscriptionStatus: reconciled.status ?? owner.subscriptionStatus });
  } catch {
    return false;
  }
}
