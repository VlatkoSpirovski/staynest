"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession, hashToken, requireCurrentUser } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { hashPassword, verifyPassword } from "@/lib/password";
import { passwordRulesText, validatePassword } from "@/lib/password-policy";
import { billingUrl, normalizePlanKey, normalizeTier } from "@/lib/billing";
import { getAppUrl } from "@/lib/utils";

function stringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(email: string) {
  return email.toLowerCase().trim();
}

function redirectWithError(path: string, message: string): never {
  const separator = path.includes("?") ? "&" : "?";
  redirect(`${path}${separator}error=${encodeURIComponent(message)}`);
}

function safeRedirectTarget(value: string) {
  if (value.startsWith("/")) return value;

  try {
    const url = new URL(value);
    const allowedHosts = new Set([
      "staynest.site",
      "www.staynest.site",
      "dashboard.staynest.site",
      "admin.staynest.site",
      "localhost",
      "127.0.0.1"
    ]);
    return allowedHosts.has(url.hostname) ? url.toString() : "/dashboard";
  } catch {
    return "/dashboard";
  }
}

export async function registerOwner(formData: FormData) {
  const name = stringValue(formData, "name");
  const email = normalizeEmail(stringValue(formData, "email"));
  const password = stringValue(formData, "password");
  const confirmPassword = stringValue(formData, "confirmPassword");
  const planKey = normalizePlanKey(stringValue(formData, "plan"));
  const plan = normalizeTier(planKey);
  const registerPath = `/register?plan=${encodeURIComponent(planKey)}`;

  if (!name || !email || !password) {
    redirectWithError(registerPath, "Please complete every required field.");
  }

  if (password !== confirmPassword) {
    redirectWithError(registerPath, "Passwords do not match.");
  }

  const passwordErrors = validatePassword(password);
  if (passwordErrors.length > 0) {
    redirectWithError(registerPath, `Password must include ${passwordErrors.join(", ")}.`);
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    redirectWithError(registerPath, "An account with this email already exists. Please log in.");
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashPassword(password),
      emailVerifiedAt: new Date(),
      selectedPlan: plan,
      subscriptionStatus: "PENDING"
    }
  });

  await createSession(user.id);
  redirect(billingUrl(planKey));
}

export async function loginOwner(formData: FormData) {
  const email = normalizeEmail(stringValue(formData, "email"));
  const password = stringValue(formData, "password");
  const next = stringValue(formData, "next") || "/dashboard";

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
    redirectWithError(`/login?next=${encodeURIComponent(next)}`, "Invalid email or password.");
  }

  await createSession(user.id);

  if (user.mustChangePassword) {
    redirect("/change-password");
  }

  redirect(safeRedirectTarget(next));
}

export async function changePassword(formData: FormData) {
  const user = await requireCurrentUser();
  const currentPassword = stringValue(formData, "currentPassword");
  const newPassword = stringValue(formData, "newPassword");
  const confirmPassword = stringValue(formData, "confirmPassword");

  if (!user.passwordHash || !verifyPassword(currentPassword, user.passwordHash)) {
    redirectWithError("/change-password", "Current password is incorrect.");
  }

  if (newPassword !== confirmPassword) {
    redirectWithError("/change-password", "New passwords do not match.");
  }

  const passwordErrors = validatePassword(newPassword);
  if (passwordErrors.length > 0) {
    redirectWithError("/change-password", `Password must include ${passwordErrors.join(", ")}.`);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: hashPassword(newPassword),
      mustChangePassword: false
    }
  });

  redirect("/dashboard");
}

export async function logoutOwner() {
  await destroySession();
  redirect("/login");
}

export async function requestPasswordReset(formData: FormData) {
  const email = normalizeEmail(stringValue(formData, "email"));
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    const token = randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(token),
        expiresAt
      }
    });

    const resetUrl = `${getAppUrl()}/reset-password?token=${token}`;
    await sendEmail({
      to: user.email,
      subject: "Reset your StayNest password",
      text: `Reset your StayNest password here:\n${resetUrl}\n\nThis link expires in 1 hour.\n\n${passwordRulesText()}`,
      html: `
        <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#1f2933">
          <h1 style="font-size:24px">Reset your StayNest password</h1>
          <p>Use the link below to set a new password. It expires in 1 hour.</p>
          <p><a href="${resetUrl}" style="display:inline-block;background:#1f2933;color:white;padding:12px 18px;border-radius:999px;text-decoration:none;font-weight:700">Reset password</a></p>
          <p style="color:#6b7280;font-size:14px">${passwordRulesText()}</p>
        </div>
      `
    });
  }

  redirect(`/forgot-password?sent=1&email=${encodeURIComponent(email)}`);
}

export async function resetPassword(formData: FormData) {
  const token = stringValue(formData, "token");
  const newPassword = stringValue(formData, "newPassword");
  const confirmPassword = stringValue(formData, "confirmPassword");

  if (newPassword !== confirmPassword) {
    redirectWithError(`/reset-password?token=${encodeURIComponent(token)}`, "Passwords do not match.");
  }

  const passwordErrors = validatePassword(newPassword);
  if (passwordErrors.length > 0) {
    redirectWithError(`/reset-password?token=${encodeURIComponent(token)}`, `Password must include ${passwordErrors.join(", ")}.`);
  }

  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash: hashToken(token),
      expiresAt: { gt: new Date() }
    }
  });

  if (!resetToken) {
    redirectWithError("/forgot-password", "Reset link is invalid or expired.");
  }

  await prisma.user.update({
    where: { id: resetToken.userId },
    data: {
      passwordHash: hashPassword(newPassword),
      mustChangePassword: false
    }
  });

  await prisma.passwordResetToken.deleteMany({ where: { userId: resetToken.userId } });
  redirect("/login?reset=1");
}
