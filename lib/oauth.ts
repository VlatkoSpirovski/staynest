import "server-only";

import { createPrivateKey, randomBytes, sign } from "node:crypto";
import { OAuthProvider } from "@prisma/client";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { getAppUrl } from "@/lib/utils";

const oauthStateCookie = "staynest_oauth_state";
const oauthPlanCookie = "staynest_oauth_plan";

type OAuthProfile = {
  provider: OAuthProvider;
  providerAccountId: string;
  email: string;
  name: string;
  emailVerified: boolean;
};

export function createOAuthState() {
  const state = randomBytes(24).toString("base64url");
  cookies().set(oauthStateCookie, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 10 * 60
  });
  return state;
}

export function setOAuthPlan(plan: string | null) {
  if (plan !== "basic" && plan !== "ai") {
    cookies().delete(oauthPlanCookie);
    return;
  }

  const selectedPlan = plan;
  cookies().set(oauthPlanCookie, selectedPlan, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 10 * 60
  });
}

function consumeOAuthPlan() {
  const value = cookies().get(oauthPlanCookie)?.value;
  const selectedPlan = value === "basic" || value === "ai" ? value : null;
  cookies().delete(oauthPlanCookie);
  return selectedPlan;
}

export function verifyOAuthState(state: string | null) {
  const expectedState = cookies().get(oauthStateCookie)?.value;
  cookies().delete(oauthStateCookie);
  return Boolean(state && expectedState && state === expectedState);
}

export function getGoogleAuthorizationUrl() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("Google login is not configured.");
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${getAppUrl()}/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
    state: createOAuthState()
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export function getAppleAuthorizationUrl() {
  const clientId = process.env.APPLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("Apple login is not configured.");
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${getAppUrl()}/auth/apple/callback`,
    response_type: "code",
    response_mode: "form_post",
    scope: "name email",
    state: createOAuthState()
  });

  return `https://appleid.apple.com/auth/authorize?${params}`;
}

export async function getGoogleProfile(code: string): Promise<OAuthProfile> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Google login is not configured.");
  }

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `${getAppUrl()}/auth/google/callback`,
      grant_type: "authorization_code"
    })
  });

  if (!tokenResponse.ok) {
    throw new Error("Google login failed.");
  }

  const tokenData = (await tokenResponse.json()) as { access_token: string };
  const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      authorization: `Bearer ${tokenData.access_token}`
    }
  });

  if (!profileResponse.ok) {
    throw new Error("Could not read Google profile.");
  }

  const profile = (await profileResponse.json()) as {
    id: string;
    email: string;
    name?: string;
    verified_email?: boolean;
  };

  return {
    provider: OAuthProvider.GOOGLE,
    providerAccountId: profile.id,
    email: profile.email.toLowerCase(),
    name: profile.name || profile.email,
    emailVerified: Boolean(profile.verified_email)
  };
}

export async function getAppleProfile(code: string, rawUser?: string | null): Promise<OAuthProfile> {
  const clientId = process.env.APPLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("Apple login is not configured.");
  }

  const clientSecret = createAppleClientSecret();

  const tokenResponse = await fetch("https://appleid.apple.com/auth/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `${getAppUrl()}/auth/apple/callback`,
      grant_type: "authorization_code"
    })
  });

  if (!tokenResponse.ok) {
    throw new Error("Apple login failed.");
  }

  const tokenData = (await tokenResponse.json()) as { id_token: string };
  const claims = decodeJwtPayload(tokenData.id_token) as {
    sub: string;
    email?: string;
    email_verified?: string | boolean;
  };
  const appleUser = rawUser ? (JSON.parse(rawUser) as { name?: { firstName?: string; lastName?: string } }) : null;
  const name = [appleUser?.name?.firstName, appleUser?.name?.lastName].filter(Boolean).join(" ");

  if (!claims.email) {
    throw new Error("Apple did not return an email address.");
  }

  return {
    provider: OAuthProvider.APPLE,
    providerAccountId: claims.sub,
    email: claims.email.toLowerCase(),
    name: name || claims.email,
    emailVerified: claims.email_verified === true || claims.email_verified === "true"
  };
}

export async function signInWithOAuthProfile(profile: OAuthProfile) {
  const selectedPlan = consumeOAuthPlan();
  const existingAccount = await prisma.oAuthAccount.findUnique({
    where: {
      provider_providerAccountId: {
        provider: profile.provider,
        providerAccountId: profile.providerAccountId
      }
    },
    include: {
      user: true
    }
  });

  if (existingAccount) {
    await createSession(existingAccount.userId);
    return { user: existingAccount.user, isNewUser: false, selectedPlan };
  }

  const user = await prisma.user.upsert({
    where: { email: profile.email },
    update: {
      name: profile.name,
      emailVerifiedAt: profile.emailVerified ? new Date() : undefined,
      oauthAccounts: {
        create: {
          provider: profile.provider,
          providerAccountId: profile.providerAccountId
        }
      }
    },
    create: {
      name: profile.name,
      email: profile.email,
      emailVerifiedAt: profile.emailVerified ? new Date() : null,
      selectedPlan: selectedPlan ?? "basic",
      trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      subscriptionStatus: "TRIALING",
      oauthAccounts: {
        create: {
          provider: profile.provider,
          providerAccountId: profile.providerAccountId
        }
      }
    }
  });

  await createSession(user.id);
  return { user, isNewUser: true, selectedPlan: selectedPlan ?? "basic" };
}

function createAppleClientSecret() {
  const clientId = process.env.APPLE_CLIENT_ID;
  const teamId = process.env.APPLE_TEAM_ID;
  const keyId = process.env.APPLE_KEY_ID;
  const privateKey = process.env.APPLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientId || !teamId || !keyId || !privateKey) {
    throw new Error("Apple login is not configured.");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "ES256", kid: keyId }));
  const payload = base64Url(
    JSON.stringify({
      iss: teamId,
      iat: now,
      exp: now + 60 * 60 * 24 * 180,
      aud: "https://appleid.apple.com",
      sub: clientId
    })
  );
  const signature = sign("sha256", Buffer.from(`${header}.${payload}`), createPrivateKey(privateKey));

  return `${header}.${payload}.${base64Url(signature)}`;
}

function decodeJwtPayload(token: string) {
  const payload = token.split(".")[1];
  if (!payload) {
    throw new Error("Invalid provider token.");
  }

  return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
}

function base64Url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}
