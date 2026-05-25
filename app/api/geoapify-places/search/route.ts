import { NextResponse } from "next/server";
import { searchGeoapifyPlaces } from "@/lib/geoapify-places";

export const dynamic = "force-dynamic";
export const preferredRegion = "fra1";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query")?.trim() || "";
  const category = url.searchParams.get("category")?.trim() || "";

  if (query.length < 2) return NextResponse.json({ places: [] });
  if (query.length > 160) return NextResponse.json({ error: "Search is too long." }, { status: 400 });

  try {
    const places = await searchGeoapifyPlaces(query, category);
    return NextResponse.json({ places });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Geoapify search failed." },
      { status: 500 }
    );
  }
}
