export function isAuthorizedCronRequest(
  authorizationHeader: string | null,
  cronSecret: string | undefined,
  nodeEnv: string | undefined
) {
  if (!cronSecret) return nodeEnv !== "production";
  return authorizationHeader === `Bearer ${cronSecret}`;
}
