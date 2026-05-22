"use client";

import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useGuestLanguage } from "@/components/guest-language";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "guest" | "assistant";
  text: string;
};

export function GuestChat({ slug, propertyName }: { slug: string; propertyName: string }) {
  const { locale, t } = useGuestLanguage();
  const botLabel = useMemo(() => t.chat.propertyBot(propertyName.trim() || "house"), [propertyName, t]);
  const askLabel = propertyName.trim() ? t.chat.askProperty(propertyName.trim()) : t.chat.askYourHost;

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        text: t.chat.intro(botLabel, propertyName)
      }
    ]);
  }, [botLabel, propertyName, t]);

  const suggestedPrompts = [t.chat.promptSupermarket, t.chat.promptCheckout, t.chat.promptWifi];

  function sendMessage(text?: string) {
    const trimmed = (text ?? message).trim();
    if (!trimmed || isPending) return;

    setMessage("");
    setMessages((current) => [...current, { role: "guest", text: trimmed }]);

    startTransition(async () => {
      try {
        const response = await fetch(`/api/stay/${slug}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, locale })
        });
        const data = (await response.json()) as { answer?: string };
        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            text: data.answer || t.chat.errorAnswer
          }
        ]);
      } catch {
        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            text: t.chat.errorNow
          }
        ]);
      }
    });
  }

  return (
    <div className="pointer-events-none fixed bottom-3 right-3 z-30 w-[min(390px,calc(100vw-20px))] sm:right-[max(12px,calc(50%-215px))]">
      <div className="pointer-events-auto ml-auto flex w-full max-w-[min(100%,320px)] flex-col items-end gap-2">
      {open ? (
        <section className="w-full overflow-hidden rounded-[var(--guide-card-radius)] border border-[var(--guide-card-border)] bg-[var(--guide-card-bg)] text-[var(--guide-text)] shadow-[var(--guide-card-shadow)]">
          <div className="flex items-center justify-between bg-[var(--guide-button-bg)] px-4 py-3 text-[var(--guide-button-text)]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] opacity-60">{t.chat.stayAssistant}</p>
              <h2 className="font-bold">{botLabel}</h2>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-white/10">
              <X size={17} />
            </button>
          </div>
          <div className="grid max-h-80 gap-3 overflow-y-auto p-4">
            {messages.length === 1 ? (
              <div className="grid place-items-center py-4 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-[var(--guide-icon-bg)] text-[var(--guide-accent)] shadow-[0_8px_20px_rgba(76,55,37,0.12)] ring-1 ring-[var(--guide-card-border)]">
                  <Sparkles size={22} />
                </div>
                <p className="mt-4 text-sm font-bold text-[var(--guide-text)]">{t.chat.helpTitle}</p>
                <p className="mt-1 text-xs text-[var(--guide-muted)]">{t.chat.helpSubtitle}</p>
              </div>
            ) : null}
            {messages.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={cn(
                  "rounded-[14px] px-3 py-2 text-sm leading-6",
                  item.role === "guest" ? "ml-8 bg-[var(--guide-button-bg)] text-[var(--guide-button-text)]" : "mr-8 bg-[var(--guide-elevated-bg)] text-[var(--guide-text)] ring-1 ring-[var(--guide-card-border)]"
                )}
              >
                {item.text}
              </div>
            ))}
            {isPending ? <div className="mr-8 rounded-[14px] bg-[var(--guide-elevated-bg)] px-3 py-2 text-sm text-[var(--guide-muted)] ring-1 ring-[var(--guide-card-border)]">{t.chat.thinking}</div> : null}
            {messages.length === 1 ? (
              <div className="grid gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="rounded-[14px] border border-[var(--guide-card-border)] bg-[var(--guide-elevated-bg)] px-3 py-2.5 text-left text-xs font-semibold text-[var(--guide-muted)] transition"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="flex gap-2 border-t border-[var(--guide-card-border)] p-3">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              className="min-h-11 min-w-0 flex-1 rounded-[var(--guide-button-radius)] border border-[var(--guide-card-border)] bg-[var(--guide-elevated-bg)] px-4 text-sm text-[var(--guide-text)] outline-none focus:ring-2 focus:ring-[var(--guide-accent)]/30"
              placeholder={t.chat.askAnything}
            />
            <button type="button" onClick={() => sendMessage()} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--guide-button-bg)] text-[var(--guide-button-text)]">
              <Send size={16} />
            </button>
          </div>
        </section>
      ) : null}
        <button
          type="button"
          onClick={() => setOpen(open ? false : true)}
          className="inline-flex min-h-12 max-w-full items-center gap-2 rounded-[var(--guide-button-radius)] bg-[var(--guide-button-bg)] px-5 text-sm font-bold text-[var(--guide-button-text)] shadow-[0_18px_45px_rgba(31,41,51,0.25)]"
        >
          <MessageCircle size={17} />
          <span className="truncate">{askLabel}</span>
        </button>
      </div>
    </div>
  );
}
