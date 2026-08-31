import "server-only";

import { hasBillingAccess } from "@/lib/billing";
import { examplePublicGuide, isExamplePublicGuide } from "@/lib/example-public-guide";
import { prisma } from "@/lib/prisma";

type PublicGuideLookup =
  | { slug: string; publicCode?: never }
  | { slug?: never; publicCode: string };

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
          subscriptionStatus: true,
          trialEndsAt: true
        }
      }
    }
  });

  return property ? hasBillingAccess(property.owner) : false;
}
