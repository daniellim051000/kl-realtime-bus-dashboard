import { useMemo } from "react";
import type { Vehicle } from "@/types/vehicle";

export function useFilteredVehicles(
  vehicles: Vehicle[],
  selectedRouteId: string | null
) {
  return useMemo(() => {
    if (!selectedRouteId) return vehicles;
    return vehicles.filter((v) => v.routeId === selectedRouteId);
  }, [vehicles, selectedRouteId]);
}
