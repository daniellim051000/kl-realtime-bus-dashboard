import useSWR from "swr";
import { useMemo } from "react";
import type { Vehicle } from "@/types/vehicle";
import type { GTFSStopTime, GTFSTrip } from "@/types/gtfs";
import { estimateArrivals } from "@/lib/gtfs/estimateArrivals";

export function useEstimatedArrivals(
  stopId: string | null,
  vehicles: Vehicle[],
  trips: GTFSTrip[]
) {
  const { data: stopTimes } = useSWR<GTFSStopTime[]>(
    stopId ? `/api/static/stop-times?stop_id=${stopId}` : null,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  return useMemo(() => {
    if (!stopId || !stopTimes || stopTimes.length === 0) return [];
    return estimateArrivals(stopId, vehicles, stopTimes, trips);
  }, [stopId, vehicles, stopTimes, trips]);
}
