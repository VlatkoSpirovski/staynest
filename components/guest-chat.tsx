"use client";

import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useGuestLanguage } from "@/components/guest-language";
import { cn } from "@/lib/utils";

type ChatRecommendation = {
  title?: string | null;
  name?: string | null;
  customTitle?: string | null;
  category: string;
  address?: string | null;
  formattedAddress?: string | null;
  googleMapsUrl?: string | null;
  url?: string | null;
  isEssential?: boolean;
  isVisible?: boolean;
};

export type GuestChatContext = {
  wifiName?: string | null;
  wifiPassword?: string | null;
  checkInInfo?: string | null;
  checkOutInfo?: string | null;
  parkingInfo?: string | null;
  houseRules?: string | null;
  emergencyInfo?: string | null;
  hostContactName?: string | null;
  hostPhone?: string | null;
  hostEmail?: string | null;
  aiKnowledge?: string | null;
  recommendations?: ChatRecommendation[];
};

type ChatMessage = {
  role: "guest" | "assistant";
  text: string;
};

function clean(value?: string | null) {
  return value?.trim() || "";
}

function placeTitle(item: ChatRecommendation) {
  return clean(item.customTitle) || clean(item.title) || clean(item.name) || "Recommended place";
}

function placeAddress(item: ChatRecommendation) {
  return clean(item.formattedAddress) || clean(item.address);
}

function formatPlaceAnswer(intro: string, item?: ChatRecommendation) {
  if (!item) return "";

  const address = placeAddress(item);
  const link = clean(item.googleMapsUrl) || clean(item.url);

  return [intro, placeTitle(item), address ? `Address: ${address}` : "", link ? `Map: ${link}` : ""].filter(Boolean).join("\n");
}

function words(value: string) {
  return value
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

function aiKnowledgeAnswer(message: string, aiKnowledge?: string | null) {
  const knowledge = clean(aiKnowledge);
  if (!knowledge) return "";

  const questionWords = new Set(words(message));
  if (!questionWords.size) return "";

  const sections = knowledge
    .split(/\n{2,}|(?<=\.)\s+(?=[A-Z0-9])/)
    .map((section) => section.trim())
    .filter((section) => section.length > 20);

  const best = sections
    .map((section) => {
      const sectionWords = new Set(words(section));
      let score = 0;
      questionWords.forEach((word) => {
        if (sectionWords.has(word)) score += 1;
      });

      return { section, score };
    })
    .sort((a, b) => b.score - a.score)[0];

  if (!best || best.score < Math.min(2, questionWords.size)) return "";

  return best.section.length > 650 ? `${best.section.slice(0, 647).trim()}...` : best.section;
}

function localAnswer(message: string, propertyName: string, context?: GuestChatContext) {
  if (!context) return "";

  const lower = message.toLowerCase();
  const visibleRecommendations = (context.recommendations || []).filter((item) => item.isVisible !== false);
  const findPlace = (pattern: RegExp) => visibleRecommendations.find((item) => pattern.test(item.category.toLowerCase()) || pattern.test(placeTitle(item).toLowerCase()));

  if (/\b(wi-?fi|wifi|internet|password|network)\b/.test(lower)) {
    const network = clean(context.wifiName);
    const password = clean(context.wifiPassword);
    if (network || password) {
      return [`Wi-Fi for ${propertyName}:`, network ? `Network: ${network}` : "", password ? `Password: ${password}` : ""].filter(Boolean).join("\n");
    }
  }

  if (/\b(check.?out|checkout|leave|departure)\b/.test(lower) && clean(context.checkOutInfo)) {
    return context.checkOutInfo || "";
  }

  if (/\b(check.?in|checkin|arrival|arrive)\b/.test(lower) && clean(context.checkInInfo)) {
    return context.checkInInfo || "";
  }

  if (/\b(parking|park|car)\b/.test(lower) && clean(context.parkingInfo)) {
    return context.parkingInfo || "";
  }

  if (/\b(rule|rules|house)\b/.test(lower) && clean(context.houseRules)) {
    return context.houseRules || "";
  }

  if (/\b(emergency|urgent|doctor|hospital|police|ambulance)\b/.test(lower) && clean(context.emergencyInfo)) {
    return context.emergencyInfo || "";
  }

  if (/\b(contact|host|phone|call|whatsapp|email)\b/.test(lower)) {
    const contact = [
      clean(context.hostContactName) || "Host",
      clean(context.hostPhone) ? `Phone: ${context.hostPhone}` : "",
      clean(context.hostEmail) ? `Email: ${context.hostEmail}` : ""
    ].filter(Boolean);

    if (contact.length > 1) return contact.join("\n");
  }

  if (/\b(supermarket|grocery|groceries|market|shop)\b/.test(lower)) {
    return formatPlaceAnswer("Nearest supermarket:", findPlace(/supermarket|grocery|market|convenience/));
  }

  if (/\b(pharmacy|chemist|medicine)\b/.test(lower)) {
    return formatPlaceAnswer("Nearest pharmacy:", findPlace(/pharmacy/));
  }

  if (/\b(restaurant|food|eat|dinner|lunch|breakfast|cafe|bar)\b/.test(lower)) {
    return formatPlaceAnswer("Recommended nearby place:", findPlace(/restaurant|cafe|bar|food|bakery/));
  }

  const hostKnowledgeAnswer = aiKnowledgeAnswer(message, context.aiKnowledge);
  if (hostKnowledgeAnswer) return hostKnowledgeAnswer;

  return "";
}

export function GuestChat({ slug, propertyName, context, initialOpen = false }: { slug: string; propertyName: string; context?: GuestChatContext; initialOpen?: boolean }) {
  const { t } = useGuestLanguage();
  const botLabel = useMemo(() => t.chat.propertyBot(propertyName.trim() || "house"), [propertyName, t]);
  const askLabel = propertyName.trim() ? t.chat.askProperty(propertyName.trim()) : t.chat.askYourHost;

  const [open, setOpen] = useState(initialOpen);
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
  const chatElevatedStyle = { background: "var(--guide-chat-elevated-bg)" };

  function sendMessage(text?: string) {
    const trimmed = (text ?? message).trim();
    if (!trimmed || isPending) return;

    setMessage("");
    setMessages((current) => [...current, { role: "guest", text: trimmed }]);

    const instantAnswer = localAnswer(trimmed, propertyName, context);
    if (instantAnswer) {
      setMessages((current) => [...current, { role: "assistant", text: instantAnswer }]);
      return;
    }

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
        <section
          className="w-full overflow-hidden rounded-[var(--guide-card-radius)] border text-[var(--guide-text)] shadow-[var(--guide-chat-shadow)]"
          style={{ background: "var(--guide-chat-bg)", borderColor: "var(--guide-chat-border)" }}
        >
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
                <div
                  className="grid h-14 w-14 place-items-center rounded-full text-[var(--guide-accent)] shadow-[0_8px_20px_rgba(76,55,37,0.12)] ring-1 ring-[var(--guide-chat-border)]"
                  style={{ background: "var(--guide-icon-bg)" }}
                >
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
                  item.role === "guest" ? "ml-8 bg-[var(--guide-button-bg)] text-[var(--guide-button-text)]" : "mr-8 text-[var(--guide-text)] ring-1 ring-[var(--guide-chat-border)]"
                )}
                style={item.role === "assistant" ? chatElevatedStyle : undefined}
              >
                {item.text}
              </div>
            ))}
            {isPending ? (
              <div className="mr-8 rounded-[14px] px-3 py-2 text-sm text-[var(--guide-muted)] ring-1 ring-[var(--guide-chat-border)]" style={chatElevatedStyle}>
                {t.chat.thinking}
              </div>
            ) : null}
            {messages.length === 1 ? (
              <div className="grid gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="rounded-[14px] border border-[var(--guide-chat-border)] px-3 py-2.5 text-left text-xs font-semibold text-[var(--guide-muted)] transition"
                    style={chatElevatedStyle}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="flex gap-2 border-t border-[var(--guide-chat-border)] p-3">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              className="min-h-11 min-w-0 flex-1 rounded-[var(--guide-button-radius)] border border-[var(--guide-chat-border)] px-4 text-sm text-[var(--guide-text)] outline-none focus:ring-2 focus:ring-[var(--guide-accent)]/30"
              style={chatElevatedStyle}
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
