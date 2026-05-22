import "server-only";

import { randomBytes, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAppUrl } from "@/lib/utils";

const sessionCookieName = "staynest_session";
const sessionTtlDays = 30;

function sessionCookieDomain() {
  return process.env.SESSION_COOKIE_DOMAIN || (process.env.NODE_ENV === "production" ? ".staynest.site" : undefined);
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getSessionCookieName() {
  return sessionCookieName;
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + sessionTtlDays * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      tokenHash: hashToken(token),
      userId,
      expiresAt
    }
  });

  cookies().set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    domain: sessionCookieDomain(),
    path: "/",
    expires: expiresAt
  });
}

export async function destroySession() {
  const token = cookies().get(sessionCookieName)?.value;
  if (token) {
    await prisma.session.deleteMany({
      where: {
        tokenHash: hashToken(token)
      }
    });
  }

  cookies().set(sessionCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    domain: sessionCookieDomain(),
    path: "/",
    expires: new Date(0)
  });
}

export async function getCurrentUser() {
  const token = cookies().get(sessionCookieName)?.value;
  if (!token) {
    return null;
  }

  const session = await prisma.session.findFirst({
    where: {
      tokenHash: hashToken(token),
      expiresAt: {
        gt: new Date()
      }
    },
    include: {
      user: true
    }
  });

  return session?.user ?? null;
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/dashboard");
  }

  return user;
}

export async function requireReadyUser() {
  const user = await requireCurrentUser();
  if (user.mustChangePassword) {
    redirect("/change-password");
  }

  return user;
}

export async function requireAdminUser() {
  const user = await requireReadyUser();
  if (user.role !== "ADMIN") {
    redirect(`${getAppUrl()}/dashboard`);
  }

  return user;
}
