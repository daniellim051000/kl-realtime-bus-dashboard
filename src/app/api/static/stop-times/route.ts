import { NextRequest, NextResponse } from "next/server";
import { getStopTimes, getTrips } from "@/lib/gtfs/fetchStatic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const stopId = searchParams.get("stop_id");
    const tripId = searchParams.get("trip_id");
    const routeId = searchParams.get("route_id");
    const routeIdsParam = searchParams.get("route_ids");

    // Unify single route_id and comma-separated route_ids into one Set
    const routeIdSet = new Set<string>();
    if (routeId) routeIdSet.add(routeId);
    if (routeIdsParam) {
      for (const id of routeIdsParam.split(",")) {
        const trimmed = id.trim();
        if (trimmed) routeIdSet.add(trimmed);
      }
    }

    let stopTimes = await getStopTimes();

    if (routeIdSet.size > 0) {
      const trips = await getTrips();
      const tripIds = new Set(
        trips.filter((t) => routeIdSet.has(t.route_id)).map((t) => t.trip_id)
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
