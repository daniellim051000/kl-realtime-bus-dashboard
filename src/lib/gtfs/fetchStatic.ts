import JSZip from "jszip";
import Papa from "papaparse";
import { GTFS_STATIC_URL } from "@/lib/constants";
import { getCached, setCache } from "./staticCache";
import type { GTFSRoute, GTFSStop, GTFSTrip, GTFSStopTime, GTFSShape } from "@/types/gtfs";

let fetchPromise: Promise<void> | null = null;

async function downloadAndParse(): Promise<void> {
  const res = await fetch(GTFS_STATIC_URL);
  if (!res.ok) throw new Error(`Failed to fetch GTFS static: ${res.status}`);

  const buffer = await res.arrayBuffer();
  const zip = await JSZip.loadAsync(buffer);

  const parseCSV = async <T>(filename: string): Promise<T[]> => {
    const file = zip.file(filename);
    if (!file) return [];
    const text = await file.async("text");
    const result = Papa.parse<T>(text, {
      header: true,
      skipEmptyLines: true,
    });
    return result.data;
  };

  const [routesRaw, stopsRaw, tripsRaw, stopTimesRaw, shapesRaw] = await Promise.all([
    parseCSV<Record<string, string>>("routes.txt"),
    parseCSV<Record<string, string>>("stops.txt"),
    parseCSV<Record<string, string>>("trips.txt"),
    parseCSV<Record<string, string>>("stop_times.txt"),
    parseCSV<Record<string, string>>("shapes.txt"),
  ]);

  const routes: GTFSRoute[] = routesRaw.map((r) => ({
    route_id: String(r.route_id ?? ""),
    agency_id: String(r.agency_id ?? ""),
    route_short_name: String(r.route_short_name ?? ""),
    route_long_name: String(r.route_long_name ?? ""),
    route_type: String(r.route_type ?? ""),
    route_color: r.route_color ? String(r.route_color) : undefined,
    route_text_color: r.route_text_color ? String(r.route_text_color) : undefined,
  }));

  const stops: GTFSStop[] = stopsRaw.map((s) => ({
    stop_id: String(s.stop_id ?? ""),
    stop_name: String(s.stop_name ?? ""),
    stop_lat: parseFloat(s.stop_lat) || 0,
    stop_lon: parseFloat(s.stop_lon) || 0,
    stop_code: s.stop_code ? String(s.stop_code) : undefined,
    zone_id: s.zone_id ? String(s.zone_id) : undefined,
    location_type: s.location_type ? String(s.location_type) : undefined,
  }));

  const trips: GTFSTrip[] = tripsRaw.map((t) => ({
    route_id: String(t.route_id ?? ""),
    service_id: String(t.service_id ?? ""),
    trip_id: String(t.trip_id ?? ""),
    trip_headsign: t.trip_headsign ? String(t.trip_headsign) : undefined,
    direction_id: t.direction_id ? String(t.direction_id) : undefined,
    shape_id: t.shape_id ? String(t.shape_id) : undefined,
  }));

  const stopTimes: GTFSStopTime[] = stopTimesRaw.map((st) => ({
    trip_id: String(st.trip_id ?? ""),
    arrival_time: String(st.arrival_time ?? ""),
    departure_time: String(st.departure_time ?? ""),
    stop_id: String(st.stop_id ?? ""),
    stop_sequence: parseInt(st.stop_sequence) || 0,
  }));

  const shapes: GTFSShape[] = shapesRaw.map((s) => ({
    shape_id: String(s.shape_id ?? ""),
    shape_pt_lat: parseFloat(s.shape_pt_lat) || 0,
    shape_pt_lon: parseFloat(s.shape_pt_lon) || 0,
    shape_pt_sequence: parseInt(s.shape_pt_sequence) || 0,
  }));

  setCache("routes", routes);
  setCache("stops", stops);
  setCache("trips", trips);
  setCache("stop_times", stopTimes);
  setCache("shapes", shapes);
}

export async function ensureStaticData(): Promise<void> {
  // If already cached, skip
  if (getCached("routes")) return;

  // If already fetching, wait for that
  if (fetchPromise) {
    await fetchPromise;
    return;
  }

  fetchPromise = downloadAndParse().finally(() => {
    fetchPromise = null;
  });

  await fetchPromise;
}

export async function getRoutes(): Promise<GTFSRoute[]> {
  await ensureStaticData();
  return getCached<GTFSRoute[]>("routes") ?? [];
}

export async function getStops(): Promise<GTFSStop[]> {
  await ensureStaticData();
  return getCached<GTFSStop[]>("stops") ?? [];
}

export async function getTrips(): Promise<GTFSTrip[]> {
  await ensureStaticData();
  return getCached<GTFSTrip[]>("trips") ?? [];
}

export async function getStopTimes(): Promise<GTFSStopTime[]> {
  await ensureStaticData();
  return getCached<GTFSStopTime[]>("stop_times") ?? [];
}

export async function getShapes(): Promise<GTFSShape[]> {
  await ensureStaticData();
  return getCached<GTFSShape[]>("shapes") ?? [];
}
