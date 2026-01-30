import { NextResponse } from "next/server";
import { GTFS_REALTIME_URL } from "@/lib/constants";
import { decodeVehiclePositions } from "@/lib/gtfs/parseProtobuf";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch(GTFS_REALTIME_URL);
    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream API error: ${res.status}` },
        { status: 502 }
      );
    }

    const buffer = await res.arrayBuffer();
    const vehicles = decodeVehiclePositions(new Uint8Array(buffer));

    return NextResponse.json({
      vehicles,
      fetchedAt: Date.now(),
    });
  } catch (err) {
    console.error("Failed to fetch vehicle positions:", err);
    return NextResponse.json(
      { error: "Failed to fetch vehicle positions" },
      { status: 500 }
    );
  }
}
