import { NextRequest, NextResponse } from "next/server";
import { getStopTimes, getTrips } from "@/lib/gtfs/fetchStatic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const stopId = searchParams.get("stop_id");
    const tripId = searchParams.get("trip_id");
    const routeId = searchParams.get("route_id");

    let stopTimes = await getStopTimes();

    if (routeId) {
      const trips = await getTrips();
      const tripIds = new Set(
        trips.filter((t) => t.route_id === routeId).map((t) => t.trip_id)
      );
      stopTimes = stopTimes.filter((st) => tripIds.has(st.trip_id));
    }
    if (stopId) {
      stopTimes = stopTimes.filter((st) => st.stop_id === stopId);
    }
    if (tripId) {
      stopTimes = stopTimes.filter((st) => st.trip_id === tripId);
    }

    return NextResponse.json(stopTimes);
  } catch (err) {
    console.error("Failed to fetch stop times:", err);
    return NextResponse.json(
      { error: "Failed to fetch stop times" },
      { status: 500 }
    );
  }
}
