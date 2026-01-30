export const GTFS_REALTIME_URL =
  "https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-bus-kl";

export const GTFS_STATIC_URL =
  "https://api.data.gov.my/gtfs-static/prasarana?category=rapid-bus-kl";

export const MAP_CENTER: [number, number] = [3.139, 101.6869];
export const MAP_ZOOM = 12;

export const VEHICLE_POLL_INTERVAL = 30_000; // 30 seconds
export const STATIC_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
