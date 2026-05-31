import { ArrowLeft, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { requireAdminUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Preview analytics",
  robots: {
    index: false,
    follow: false
  }
};

const funnelEvents = [
  "preview_created",
  "preview_opened",
  "preview_claim_clicked",
  "preview_claimed",
  "preview_expired"
];

function metadataValue(metadata: unknown, key: string) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return null;
  const value = (metadata as Record<string, unknown>)[key];
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? value : null;
}

function seconds(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "-";
  return `${(value / 1000).toFixed(1)}s`;
}

async function getPreviewAnalytics() {
  const [eventCounts, activePreviews, recentEvents] = await Promise.all([
    prisma.previewAnalyticsEvent.groupBy({
      by: ["eventName"],
      _count: {
        eventName: true
      }
    }),
    prisma.propertyPreview.count({
      where: {
        claimedPropertyId: null,
        expiresAt: {
          gt: new Date()
        }
      }
    }),
    prisma.previewAnalyticsEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 12
    })
  ]);

  const counts = new Map(eventCounts.map((item) => [item.eventName, item._count.eventName]));
  const created = counts.get("preview_created") || 0;
  const claimed = counts.get("preview_claimed") || 0;

  return {
    activePreviews,
    conversionRate: created > 0 ? Math.round((claimed / created) * 100) : 0,
    counts,
    recentEvents
  };
}

export default async function PreviewAnalyticsPage() {
  await requireAdminUser();
  const analytics = await getPreviewAnalytics();

  return (
    <main className="min-h-screen bg-mist px-4 py-8 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-lagoon">Admin analytics</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">Property preview funnel</h1>
          </div>
          <Button href="/admin" variant="secondary" className="gap-2">
            <ArrowLeft size={16} />
            Back to admin
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Panel>
            <p className="text-sm font-bold text-ink/55">Active temporary previews</p>
            <p className="mt-3 text-4xl font-black">{analytics.activePreviews}</p>
          </Panel>
          <Panel>
            <p className="text-sm font-bold text-ink/55">Preview to claimed</p>
            <p className="mt-3 text-4xl font-black">{analytics.conversionRate}%</p>
          </Panel>
          <Panel>
            <p className="text-sm font-bold text-ink/55">Claimed guides</p>
            <p className="mt-3 text-4xl font-black">{analytics.counts.get("preview_claimed") || 0}</p>
          </Panel>
        </div>

        <Panel className="mt-5">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-lagoon" />
            <h2 className="text-lg font-black tracking-tight">Funnel events</h2>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-5">
            {funnelEvents.map((eventName) => (
              <div key={eventName} className="rounded-[14px] border border-ink/8 bg-mist/70 p-4">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-ink/45">{eventName.replace(/_/g, " ")}</p>
                <p className="mt-2 text-3xl font-black">{analytics.counts.get(eventName) || 0}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="mt-5">
          <h2 className="text-lg font-black tracking-tight">Recent events</h2>
          <div className="mt-4 overflow-hidden rounded-[14px] border border-ink/8">
            <table className="w-full text-left text-sm">
              <thead className="bg-ink text-white">
                <tr>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Preview</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">AI</th>
                  <th className="px-4 py-3">Chars</th>
                  <th className="px-4 py-3">Property</th>
                  <th className="px-4 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/8 bg-white">
                {analytics.recentEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="px-4 py-3 font-bold">{event.eventName}</td>
                    <td className="px-4 py-3 font-mono text-xs">{event.previewToken || "-"}</td>
                    <td className="px-4 py-3">{seconds(metadataValue(event.metadata, "sourceDurationMs"))}</td>
                    <td className="px-4 py-3">{seconds(metadataValue(event.metadata, "aiDurationMs"))}</td>
                    <td className="px-4 py-3">{metadataValue(event.metadata, "contentChars") || "-"}</td>
                    <td className="px-4 py-3 font-mono text-xs">{event.propertyId || "-"}</td>
                    <td className="px-4 py-3">{event.createdAt.toLocaleString()}</td>
                  </tr>
                ))}
                {analytics.recentEvents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center font-semibold text-ink/50">
                      No preview events yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </main>
  );
}
