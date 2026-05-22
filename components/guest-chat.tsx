"use client";

import { MessageCircle, Send, X } from "lucide-react";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "guest" | "assistant";
  text: string;
};

export function GuestChat({ slug, propertyName }: { slug: string; propertyName: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: `Hi, I can answer questions about ${propertyName}.`
    }
  ]);
  const [isPending, startTransition] = useTransition();

  function sendMessage() {
    const trimmed = message.trim();
    if (!trimmed || isPending) return;

    setMessage("");
    setMessages((current) => [...current, { role: "guest", text: trimmed }]);

    startTransition(async () => {
      try {
        const response = await fetch(`/api/stay/${slug}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed })
        });
        const data = (await response.json()) as { answer?: string };
        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            text: data.answer || "I could not answer that. Please contact your host."
          }
        ]);
      } catch {
        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            text: "I could not answer right now. Please contact your host."
          }
        ]);
      }
    });
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-30 w-[min(390px,calc(100vw-24px))] -translate-x-1/2">
      {open ? (
        <section className="overflow-hidden rounded-[18px] border border-white/70 bg-[#fbf7ef] shadow-[0_24px_70px_rgba(31,41,51,0.25)]">
          <div className="flex items-center justify-between bg-ink px-4 py-3 text-white">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">Ask StayNest</p>
              <h2 className="font-bold">Guest assistant</h2>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-white/10">
              <X size={17} />
            </button>
          </div>
          <div className="grid max-h-80 gap-3 overflow-y-auto p-4">
            {messages.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={cn(
                  "rounded-[14px] px-3 py-2 text-sm leading-6",
                  item.role === "guest" ? "ml-8 bg-[var(--accent)] text-white" : "mr-8 bg-white text-ink ring-1 ring-ink/10"
                )}
              >
                {item.text}
              </div>
            ))}
            {isPending ? <div className="mr-8 rounded-[14px] bg-white px-3 py-2 text-sm text-ink/55 ring-1 ring-ink/10">Thinking...</div> : null}
          </div>
          <div className="flex gap-2 border-t border-ink/10 p-3">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              className="min-h-11 min-w-0 flex-1 rounded-full border border-ink/10 bg-white px-4 text-sm text-ink outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
              placeholder="Ask about Wi-Fi, parking, checkout..."
            />
            <button type="button" onClick={sendMessage} className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white">
              <Send size={16} />
            </button>
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="ml-auto flex min-h-12 items-center gap-2 rounded-full bg-ink px-5 text-sm font-bold text-white shadow-[0_18px_45px_rgba(31,41,51,0.25)]"
        >
          <MessageCircle size={17} />
          Ask StayNest
        </button>
      )}
    </div>
  );
}
