/**
 * Inspect and repair a single account's billing state.
 *
 * Use when someone cannot get past the paywall. Shows exactly why the gate is
 * closing before changing anything.
 *
 *   npx tsx prisma/fix-account-access.ts you@example.com              # diagnose only
 *   npx tsx prisma/fix-account-access.ts you@example.com --activate   # mark ACTIVE
 *   npx tsx prisma/fix-account-access.ts you@example.com --trial 30   # grant N more days
 *
 * Point DATABASE_URL at the environment you mean to touch:
 *   DATABASE_URL="<neon-url>" npx tsx prisma/fix-account-access.ts ...
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const email = process.argv[2]?.toLowerCase().trim();
const activate = process.argv.includes("--activate");
const trialIndex = process.argv.indexOf("--trial");
const trialDays = trialIndex !== -1 ? Number(process.argv[trialIndex + 1]) : null;

function hasAccess(status: string | null, trialEndsAt: Date | null) {
  const value = status?.toUpperCase();
  if (value === "ACTIVE") return true;
  if (value !== "TRIALING") return false;
  return trialEndsAt ? trialEndsAt.getTime() > Date.now() : true;
}

async function main() {
  if (!email) {
    console.error("Usage: npx tsx prisma/fix-account-access.ts <email> [--activate] [--trial <days>]");
    process.exitCode = 1;
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      mustChangePassword: true,
      subscriptionStatus: true,
      trialEndsAt: true,
      selectedPlan: true,
      paddleCustomerId: true,
      paddleSubscriptionId: true,
      paddleTransactionId: true,
      _count: { select: { properties: true, sessions: true } }
    }
  });

  if (!user) {
    console.error(`No account found for ${email}`);
    process.exitCode = 1;
    return;
  }

  const access = hasAccess(user.subscriptionStatus, user.trialEndsAt);
  console.log(`
Account            ${user.email}  (${user.name})
Role               ${user.role}
Must change pw     ${user.mustChangePassword}
Subscription       ${user.subscriptionStatus ?? "(none)"}
Trial ends         ${user.trialEndsAt?.toISOString() ?? "(none)"}
Selected plan      ${user.selectedPlan ?? "(none)"}
Paddle customer    ${user.paddleCustomerId ?? "(none)"}
Paddle subscription${user.paddleSubscriptionId ? " " + user.paddleSubscriptionId : " (none)"}
Paddle transaction ${user.paddleTransactionId ?? "(none)"}
Properties         ${user._count.properties}
Active sessions    ${user._count.sessions}

Passes the paywall? ${access ? "YES" : "NO"}${
    access ? "" : "  <-- /dashboard redirects this account to /billing"
  }
`);

  if (!activate && trialDays === null) {
    console.log("Diagnosis only. Re-run with --activate or --trial <days> to repair.");
    return;
  }

  const data = activate
    ? { subscriptionStatus: "ACTIVE" as const }
    : {
        subscriptionStatus: "TRIALING" as const,
        trialEndsAt: new Date(Date.now() + (trialDays || 7) * 24 * 60 * 60 * 1000)
      };

  const updated = await prisma.user.update({ where: { id: user.id }, data });
  console.log(
    `Updated: subscriptionStatus=${updated.subscriptionStatus}` +
      (updated.trialEndsAt ? `, trialEndsAt=${updated.trialEndsAt.toISOString()}` : "")
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
