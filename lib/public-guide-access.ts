import "server-only";

import { hasBillingAccess } from "@/lib/billing";
import { examplePublicGuide, isExamplePublicGuide } from "@/lib/example-public-guide";
import { prisma } from "@/lib/prisma";

type PublicGuideLookup =
  | { slug: string; publicCode?: never }
  | { slug?: never; publicCode: string };

export async function canServePublicGuide(lookup: PublicGuideLookup) {
  if ("slug" in lookup && isExamplePublicGuide(lookup.slug)) return true;
  if ("publicCode" in lookup && lookup.publicCode === examplePublicGuide.publicCode) return true;

  const property = await prisma.property.findFirst({
    where: "slug" in lookup ? { slug: lookup.slug } : { publicCode: lookup.publicCode },
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
