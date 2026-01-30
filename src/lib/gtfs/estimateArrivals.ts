import type { GTFSStopTime, GTFSTrip } from "@/types/gtfs";
import type { Vehicle } from "@/types/vehicle";

export interface ArrivalEstimate {
  routeId: string;
  tripId: string;
  vehicleId: string;
  vehicleLabel: string;
  minutesAway: number;
  scheduledArrival: string;
}

function parseTimeToMinutes(timeStr: string): number {
  const parts = timeStr.split(":");
  if (parts.length < 3) return 0;
  return parseInt(parts[0]) * 60 + parseInt(parts[1]) + parseInt(parts[2]) / 60;
}

export function estimateArrivals(
  stopId: string,
  vehicles: Vehicle[],
  stopTimes: GTFSStopTime[],
  trips: GTFSTrip[]
): ArrivalEstimate[] {
  // Find all stop_times for this stop
  const stopTimesForStop = stopTimes.filter((st) => st.stop_id === stopId);
  if (stopTimesForStop.length === 0) return [];

  // Build a set of trip IDs that serve this stop
  const tripIdsForStop = new Set(stopTimesForStop.map((st) => st.trip_id));

  // Build trip -> route mapping
  const tripToRoute = new Map<string, string>();
  for (const trip of trips) {
    tripToRoute.set(trip.trip_id, trip.route_id);
  }

  // Build a map: trip_id -> stop_sequence at our target stop
  const tripStopSequence = new Map<string, number>();
  const tripArrivalTime = new Map<string, string>();
  for (const st of stopTimesForStop) {
    tripStopSequence.set(st.trip_id, st.stop_sequence);
    tripArrivalTime.set(st.trip_id, st.arrival_time);
  }

  // Find active vehicles on trips that serve this stop
  const estimates: ArrivalEstimate[] = [];

  for (const vehicle of vehicles) {
    if (!vehicle.tripId || !tripIdsForStop.has(vehicle.tripId)) continue;

    const targetSequence = tripStopSequence.get(vehicle.tripId);
    if (targetSequence === undefined) continue;

    // Get current vehicle stop sequence
    const vehicleStopTimes = stopTimes
      .filter((st) => st.trip_id === vehicle.tripId)
      .sort((a, b) => a.stop_sequence - b.stop_sequence);

    // Find the vehicle's current position in the sequence
    const currentStopTime = vehicleStopTimes.find(
      (st) => st.stop_id === vehicle.stopId
    );

    if (!currentStopTime) continue;

    const currentSequence = currentStopTime.stop_sequence;

    // Only estimate if the vehicle hasn't passed the stop yet
    if (currentSequence > targetSequence) continue;

    // Estimate time based on scheduled times
    const currentTime = parseTimeToMinutes(currentStopTime.departure_time);
    const targetStopTime = stopTimesForStop.find(
      (st) => st.trip_id === vehicle.tripId
    );
    if (!targetStopTime) continue;

    const arrivalTimeMinutes = parseTimeToMinutes(targetStopTime.arrival_time);
    const minutesAway = Math.max(0, Math.round(arrivalTimeMinutes - currentTime));

    estimates.push({
      routeId: tripToRoute.get(vehicle.tripId) ?? vehicle.routeId,
      tripId: vehicle.tripId,
      vehicleId: vehicle.id,
      vehicleLabel: vehicle.label || vehicle.id,
      minutesAway,
      scheduledArrival: targetStopTime.arrival_time,
    });
  }

  return estimates.sort((a, b) => a.minutesAway - b.minutesAway);
}
