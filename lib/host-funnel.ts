type FunnelUser = { id: string; role: string; createdAt: Date; subscriptionStatus: string | null };
type FunnelProperty = {
  ownerId: string;
  name: string;
  welcomeMessage: string | null;
  wifiName: string | null;
  wifiPassword: string | null;
  checkInInfo: string | null;
  hostPhone: string | null;
  hostEmail: string | null;
};

export type HostFunnel = {
  signedUp: number;
  startedGuide: number;
  essentialsDone: number;
  paying: number;
};

export function hasEssentials(property: FunnelProperty) {
  return Boolean(
    property.name &&
      property.welcomeMessage &&
      property.wifiName &&
      property.wifiPassword &&
      property.checkInInfo &&
      property.hostPhone &&
      property.hostEmail
  );
}

export function hostFunnel(users: FunnelUser[], properties: FunnelProperty[], since?: Date): HostFunnel {
  const owners = users.filter((user) => user.role === "OWNER" && (!since || user.createdAt >= since));
  const ownerIds = new Set(owners.map((user) => user.id));
  const started = new Set<string>();
  const essentials = new Set<string>();
  for (const property of properties) {
    if (!ownerIds.has(property.ownerId) || !property.name) continue;
    started.add(property.ownerId);
    if (hasEssentials(property)) essentials.add(property.ownerId);
  }
  return {
    signedUp: owners.length,
    startedGuide: started.size,
    essentialsDone: essentials.size,
    paying: owners.filter((user) => user.subscriptionStatus?.toUpperCase() === "ACTIVE").length
  };
}
