import useSWR from "swr";
import type { GTFSTrip } from "@/types/gtfs";

export function useTrips() {
  const { data, error, isLoading } = useSWR<GTFSTrip[]>("/api/static/trips", {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  return {
    trips: data ?? [],
    error,
    isLoading,
  };
}
