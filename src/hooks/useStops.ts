import useSWR from "swr";
import type { GTFSStop } from "@/types/gtfs";

export function useStops() {
  const { data, error, isLoading } = useSWR<GTFSStop[]>("/api/static/stops", {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  return {
    stops: data ?? [],
    error,
    isLoading,
  };
}
