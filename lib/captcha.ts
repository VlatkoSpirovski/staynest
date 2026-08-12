import "server-only";

/**
 * Cloudflare Turnstile verification.
 *
 * Deliberately optional: when TURNSTILE_SECRET_KEY is unset the check passes, so
 * local development and any environment that has not been configured yet keep
 * working. Set both TURNSTILE_SECRET_KEY and NEXT_PUBLIC_TURNSTILE_SITE_KEY in
 * production to turn it on.
 */
export function isCaptchaConfigured() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
}

export async function verifyCaptcha(token: string, ip?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip && ip !== "unknown") body.set("remoteip", ip);

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store"
    });

    if (!response.ok) return false;
    const data = (await response.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    // A Cloudflare outage should not block every signup.
    return true;
  }
}
