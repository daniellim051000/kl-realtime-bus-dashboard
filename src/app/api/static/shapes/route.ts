import { NextResponse } from "next/server";
import { getShapes } from "@/lib/gtfs/fetchStatic";

export async function GET() {
  try {
    const shapes = await getShapes();
    return NextResponse.json(shapes);
  } catch (err) {
    console.error("Failed to fetch shapes:", err);
    return NextResponse.json(
      { error: "Failed to fetch shapes" },
      { status: 500 }
    );
  }
}
