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

export type PublicGuideStatus = "live" | "paused" | "missing";

export async function canServePublicGuide(lookup: PublicGuideLookup) {
  return (await publicGuideStatus(lookup)) === "live";
}

export async function publicGuideStatus(lookup: PublicGuideLookup): Promise<PublicGuideStatus> {
  const slug = "slug" in lookup ? lookup.slug : undefined;
  const publicCode = "publicCode" in lookup ? lookup.publicCode : undefined;

  if (slug && isExamplePublicGuide(slug)) return "live";
  if (publicCode === examplePublicGuide.publicCode) return "live";

  if (!slug && !publicCode) return "missing";

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

  if (!property) return "missing";
  const owner = property.owner;
  if (hasBillingAccess(owner)) return "live";

  const hasPaddleHandle = Boolean(owner.paddleSubscriptionId || owner.paddleTransactionId || owner.paddleCustomerId);
  if (!hasPaddleHandle) return "paused";

  const throttle = await rateLimit(`paddle-reconcile:${owner.id}`, 1, RECONCILE_WINDOW_SECONDS);
  if (!throttle.allowed) return "paused";

  try {
    const reconciled = await reconcilePaddleStatus(owner);
    return hasBillingAccess({ ...owner, subscriptionStatus: reconciled.status ?? owner.subscriptionStatus }) ? "live" : "paused";
  } catch {
    return "paused";
  }
}
