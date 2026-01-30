import useSWR from "swr";
import type { GTFSRoute } from "@/types/gtfs";

export function useRoutes() {
  const { data, error, isLoading } = useSWR<GTFSRoute[]>("/api/static/routes", {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  return {
    routes: data ?? [],
    error,
    isLoading,
  };
}
