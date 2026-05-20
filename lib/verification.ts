import "server-only";

import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { getAppUrl } from "@/lib/utils";

const verificationTtlHours = 24;

export async function sendVerificationEmail(user: { id: string; email: string; name: string }) {
  await prisma.emailVerificationToken.deleteMany({
    where: {
      userId: user.id
    }
  });

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + verificationTtlHours * 60 * 60 * 1000);

  await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt
    }
  });

  const verifyUrl = `${getAppUrl()}/verify-email?token=${token}`;

  await sendEmail({
    to: user.email,
    subject: "Confirm your StayNest account",
    text: `Hi ${user.name},\n\nConfirm your StayNest account here:\n${verifyUrl}\n\nThis link expires in 24 hours.`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#1f2933">
        <h1 style="font-size:24px">Confirm your StayNest account</h1>
        <p>Hi ${user.name},</p>
        <p>Confirm your email address to finish setting up your StayNest owner account.</p>
        <p><a href="${verifyUrl}" style="display:inline-block;background:#1f2933;color:white;padding:12px 18px;border-radius:999px;text-decoration:none;font-weight:700">Confirm email</a></p>
        <p style="color:#6b7280;font-size:14px">This link expires in 24 hours.</p>
      </div>
    `
  });
}
