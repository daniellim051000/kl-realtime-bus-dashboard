import useSWR from "swr";
import type { GTFSShape } from "@/types/gtfs";

export function useShapes() {
  const { data, error, isLoading } = useSWR<GTFSShape[]>("/api/static/shapes", {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  return {
    shapes: data ?? [],
    error,
    isLoading,
  };
}
