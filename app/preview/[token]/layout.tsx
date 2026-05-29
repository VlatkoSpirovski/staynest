import { PreviewBanner } from "@/components/preview-banner";
import { getPreviewGuideData } from "@/lib/preview-guide-data";
import { recordPreviewEvent } from "@/lib/preview-analytics";
import { notFound } from "next/navigation";

type LayoutProps = {
  params: {
    token: string;
  };
  children: React.ReactNode;
};

export default async function PreviewLayout({ params, children }: LayoutProps) {
  const preview = await getPreviewGuideData(params.token);

  if (!preview) {
    notFound();
  }

  await recordPreviewEvent({ eventName: "preview_opened", previewToken: params.token });

  return (
    <div>
      <PreviewBanner token={params.token} />
      {children}
    </div>
  );
}
