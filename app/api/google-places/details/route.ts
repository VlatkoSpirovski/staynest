import { NextResponse } from "next/server";
import { getGooglePlaceDetails } from "@/lib/google-places";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const placeId = new URL(request.url).searchParams.get("placeId")?.trim() || "";
  if (!placeId) return NextResponse.json({ error: "Missing placeId." }, { status: 400 });
  if (placeId.length > 220) return NextResponse.json({ error: "Invalid placeId." }, { status: 400 });

  try {
    const place = await getGooglePlaceDetails(placeId);
    return NextResponse.json({ place });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Google Place Details failed." },
      { status: 500 }
    );
  }
}
