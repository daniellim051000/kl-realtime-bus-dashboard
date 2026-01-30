import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import type { Vehicle } from "@/types/vehicle";

export function decodeVehiclePositions(buffer: Uint8Array): Vehicle[] {
  const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(buffer);

  return feed.entity
    .filter((entity) => entity.vehicle?.position)
    .map((entity) => {
      const v = entity.vehicle!;
      const pos = v.position!;
      const trip = v.trip;
      const vehicle = v.vehicle;

      return {
        id: entity.id,
        label: vehicle?.label ?? "",
        licensePlate: vehicle?.licensePlate ?? "",
        lat: pos.latitude,
        lng: pos.longitude,
        bearing: pos.bearing ?? 0,
        speed: pos.speed ?? 0,
        routeId: trip?.routeId ?? "",
        tripId: trip?.tripId ?? "",
        stopId: v.stopId ?? "",
        currentStatus: vehicleStatusToString(v.currentStatus),
        timestamp: Number(v.timestamp ?? 0),
      };
    });
}

function vehicleStatusToString(
  status: GtfsRealtimeBindings.transit_realtime.VehiclePosition.VehicleStopStatus | null | undefined
): string {
  const VehicleStopStatus =
    GtfsRealtimeBindings.transit_realtime.VehiclePosition.VehicleStopStatus;
  switch (status) {
    case VehicleStopStatus.INCOMING_AT:
      return "INCOMING_AT";
    case VehicleStopStatus.STOPPED_AT:
      return "STOPPED_AT";
    case VehicleStopStatus.IN_TRANSIT_TO:
      return "IN_TRANSIT_TO";
    default:
      return "UNKNOWN";
  }
}
