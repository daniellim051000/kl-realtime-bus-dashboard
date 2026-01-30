import useSWR from "swr";
import { VEHICLE_POLL_INTERVAL } from "@/lib/constants";
import type { VehicleResponse } from "@/types/vehicle";

export function useVehicles() {
  const { data, error, isLoading, mutate } = useSWR<VehicleResponse>(
    "/api/vehicles",
    {
      refreshInterval: VEHICLE_POLL_INTERVAL,
      dedupingInterval: 5000,
    }
  );

  return {
    vehicles: data?.vehicles ?? [],
    fetchedAt: data?.fetchedAt ?? null,
    error,
    isLoading,
    mutate,
  };
}
