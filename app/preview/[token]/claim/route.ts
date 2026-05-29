import { redirect } from "next/navigation";
import { recordPreviewEvent } from "@/lib/preview-analytics";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    token: string;
  };
};

export async function GET(_request: Request, { params }: RouteContext) {
  await recordPreviewEvent({ eventName: "preview_claim_clicked", previewToken: params.token });
  redirect(`/register?plan=basic&previewToken=${encodeURIComponent(params.token)}`);
}
