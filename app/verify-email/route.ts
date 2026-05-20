import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, hashToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    redirect("/login?error=Verification%20link%20is%20missing.");
  }

  const verificationToken = await prisma.emailVerificationToken.findFirst({
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

  if (!verificationToken) {
    redirect("/login?error=Verification%20link%20is%20invalid%20or%20expired.");
  }

  await prisma.user.update({
    where: {
      id: verificationToken.userId
    },
    data: {
      emailVerifiedAt: new Date()
    }
  });

  await prisma.emailVerificationToken.deleteMany({
    where: {
      userId: verificationToken.userId
    }
  });

  await createSession(verificationToken.userId);
  redirect("/dashboard");
}
