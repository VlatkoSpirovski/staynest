import { NextResponse } from "next/server";
import { googlePhotoUrl } from "@/lib/google-places";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const reference = url.searchParams.get("reference")?.trim() || "";
  const width = Number(url.searchParams.get("width") || 800);
  if (!reference) return NextResponse.json({ error: "Missing photo reference." }, { status: 400 });

  try {
    const response = await fetch(googlePhotoUrl(reference, Number.isFinite(width) ? width : 800), {
      redirect: "follow",
      next: { revalidate: 60 * 60 * 24 * 30 }
    });
    if (!response.ok) throw new Error("Google photo failed.");
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const body = await response.arrayBuffer();
    return new Response(body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=2592000, stale-while-revalidate=86400"
      }
    });
  } catch {
    return NextResponse.json({ error: "Google photo failed." }, { status: 500 });
  }
}
