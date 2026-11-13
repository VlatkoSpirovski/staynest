export type TrialReminderKind = "soon" | "ended";

export type TrialReminderCandidate = {
  role: string;
  subscriptionStatus: string | null;
  trialEndsAt: Date | null;
  paddleSubscriptionId: string | null;
  trialReminderSoonSentAt: Date | null;
  trialReminderEndedSentAt: Date | null;
};

const DAY_MS = 24 * 60 * 60 * 1000;
export const SOON_WINDOW_MS = 2 * DAY_MS;
export const ENDED_GRACE_MS = 3 * DAY_MS;

export function trialReminderFor(user: TrialReminderCandidate, now: Date): TrialReminderKind | null {
  if (user.role === "ADMIN") return null;
  if (user.subscriptionStatus?.toUpperCase() !== "TRIALING") return null;
  if (user.paddleSubscriptionId) return null;
  if (!user.trialEndsAt) return null;

  const msLeft = user.trialEndsAt.getTime() - now.getTime();

  if (msLeft <= 0) {
    if (user.trialReminderEndedSentAt) return null;
    return -msLeft <= ENDED_GRACE_MS ? "ended" : null;
  }

  if (msLeft <= SOON_WINDOW_MS && !user.trialReminderSoonSentAt) return "soon";
  return null;
}

export function trialReminderEmail(kind: TrialReminderKind, input: { name: string; endsOn: string; billingUrl: string; dashboardUrl: string }) {
  const greeting = `Hi ${input.name || "there"},`;

  if (kind === "soon") {
    const subject = "Your StayNest guide goes offline soon";
    const text = `${greeting}

Your free trial ends on ${input.endsOn}. After that, guests who scan your QR code will no longer see your guide.

Keep it live for EUR 20 per year, everything included: ${input.billingUrl}

Your guide, QR code and recommendations stay exactly as they are.

StayNest`;
    return { subject, text, html: emailHtml(greeting, [`Your free trial ends on <strong>${escapeHtml(input.endsOn)}</strong>. After that, guests who scan your QR code will no longer see your guide.`, "Your guide, QR code and recommendations stay exactly as they are."], "Keep my guide live", input.billingUrl) };
  }

  const subject = "Your StayNest guide is offline for guests";
  const text = `${greeting}

Your free trial ended on ${input.endsOn}, so guests who scan your QR code currently see a "temporarily unavailable" page.

Everything you set up is saved. Put your guide back online for EUR 20 per year: ${input.billingUrl}

You can still edit your guide here: ${input.dashboardUrl}

StayNest`;
  return { subject, text, html: emailHtml(greeting, [`Your free trial ended on <strong>${escapeHtml(input.endsOn)}</strong>, so guests who scan your QR code currently see a “temporarily unavailable” page.`, "Everything you set up is saved. Your QR code keeps working as soon as you subscribe."], "Put my guide back online", input.billingUrl) };
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function emailHtml(greeting: string, paragraphs: string[], cta: string, href: string) {
  const body = paragraphs.map((p) => `<p style="margin:0 0 14px;font-size:15px;line-height:24px;color:#111827">${p}</p>`).join("");
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;padding:24px">
<p style="margin:0 0 14px;font-size:15px;line-height:24px;color:#111827">${escapeHtml(greeting)}</p>
${body}
<p style="margin:22px 0"><a href="${escapeHtml(href)}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:12px">${escapeHtml(cta)}</a></p>
<p style="margin:0;font-size:13px;color:#6b7280">EUR 20 per year, everything included. Cancel any time.</p>
</div>`;
}
