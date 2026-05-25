import { NextResponse } from "next/server";
import { autocompleteGooglePlaces } from "@/lib/google-places";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("query")?.trim() || "";
  if (query.length < 2) return NextResponse.json({ predictions: [] });
  if (query.length > 160) return NextResponse.json({ error: "Search is too long." }, { status: 400 });

  try {
    const predictions = await autocompleteGooglePlaces(query);
    return NextResponse.json({ predictions });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Google Places search failed." },
      { status: 500 }
    );
  }
}
