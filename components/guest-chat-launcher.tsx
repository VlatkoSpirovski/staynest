"use client";

import dynamic from "next/dynamic";
import { MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useGuestLanguage } from "@/components/guest-language";

const GuestChat = dynamic(() => import("@/components/guest-chat").then((mod) => mod.GuestChat), {
  loading: () => null,
  ssr: false
});

export function GuestChatLauncher({ slug, propertyName }: { slug: string; propertyName: string }) {
  const { t } = useGuestLanguage();
  const [started, setStarted] = useState(false);
  const askLabel = useMemo(
    () => (propertyName.trim() ? t.chat.askProperty(propertyName.trim()) : t.chat.askYourHost),
    [propertyName, t]
  );

  if (started) {
    return <GuestChat slug={slug} propertyName={propertyName} initialOpen />;
  }

  return (
    <div className="pointer-events-none fixed bottom-3 right-3 z-30 w-[min(390px,calc(100vw-20px))] sm:right-[max(12px,calc(50%-215px))]">
      <div className="pointer-events-auto ml-auto flex w-full max-w-[min(100%,320px)] flex-col items-end gap-2">
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="inline-flex min-h-12 max-w-full items-center gap-2 rounded-[var(--guide-button-radius)] bg-[var(--guide-button-bg)] px-5 text-sm font-bold text-[var(--guide-button-text)] shadow-[0_18px_45px_rgba(31,41,51,0.25)]"
        >
          <MessageCircle size={17} />
          <span className="truncate">{askLabel}</span>
        </button>
      </div>
    </div>
  );
}
