import { Bot, Languages, Sparkles } from "lucide-react";

export function AiPlaceholders() {
  const items = [
    { label: "Translate with AI", icon: Languages },
    { label: "Improve text with AI", icon: Sparkles },
    { label: "Generate guest answer", icon: Bot }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            type="button"
            disabled
            title="Coming soon"
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-dashed border-ink/20 bg-mist px-3 text-xs font-semibold text-ink/55"
          >
            <Icon size={15} />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
