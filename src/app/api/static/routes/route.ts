import { NextResponse } from "next/server";
import { getRoutes } from "@/lib/gtfs/fetchStatic";

export async function GET() {
  try {
    const routes = await getRoutes();
    return NextResponse.json(routes);
  } catch (err) {
    console.error("Failed to fetch routes:", err);
    return NextResponse.json(
      { error: "Failed to fetch routes" },
      { status: 500 }
    );
  }
}
