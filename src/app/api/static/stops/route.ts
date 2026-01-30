import { NextResponse } from "next/server";
import { getStops } from "@/lib/gtfs/fetchStatic";

export async function GET() {
  try {
    const stops = await getStops();
    return NextResponse.json(stops);
  } catch (err) {
    console.error("Failed to fetch stops:", err);
    return NextResponse.json(
      { error: "Failed to fetch stops" },
      { status: 500 }
    );
  }
}
