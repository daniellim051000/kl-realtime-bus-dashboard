import { NextResponse } from "next/server";
import { getTrips } from "@/lib/gtfs/fetchStatic";

export async function GET() {
  try {
    const trips = await getTrips();
    return NextResponse.json(trips);
  } catch (err) {
    console.error("Failed to fetch trips:", err);
    return NextResponse.json(
      { error: "Failed to fetch trips" },
      { status: 500 }
    );
  }
}
