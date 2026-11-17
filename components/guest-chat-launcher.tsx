"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useGuestLanguage } from "@/components/guest-language";
import type { GuestChatContext } from "@/components/guest-chat";
import { GuideConciergeButton, GuideConciergeDock } from "@/components/guide-kit";

const GuestChat = dynamic(() => import("@/components/guest-chat").then((mod) => mod.GuestChat), {
  loading: () => null,
  ssr: false
});

export function GuestChatLauncher({ slug, propertyName, context, chatApiUrl }: { slug: string; propertyName: string; context?: GuestChatContext; chatApiUrl?: string }) {
  const { t } = useGuestLanguage();
  const [started, setStarted] = useState(false);
  const askLabel = useMemo(
    () => (propertyName.trim() ? t.chat.askProperty(propertyName.trim()) : t.chat.askYourHost),
    [propertyName, t]
  );

  if (started) {
    return <GuestChat slug={slug} propertyName={propertyName} context={context} chatApiUrl={chatApiUrl} initialOpen />;
  }

  return (
    <GuideConciergeDock>
      <GuideConciergeButton label={askLabel} hint={t.chat.conciergeHint} onClick={() => setStarted(true)} expanded={false} />
    </GuideConciergeDock>
  );
}
