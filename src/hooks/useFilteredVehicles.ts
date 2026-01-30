import { useMemo } from "react";
import type { Vehicle } from "@/types/vehicle";

export function useFilteredVehicles(
  vehicles: Vehicle[],
  selectedRouteIds: Set<string>
) {
  return useMemo(() => {
    if (selectedRouteIds.size === 0) return vehicles;
    return vehicles.filter((v) => selectedRouteIds.has(v.routeId));
  }, [vehicles, selectedRouteIds]);
}
