import useSWR from "swr";
import type { GTFSStopTime } from "@/types/gtfs";

export function useRouteStopIds(routeId: string | null) {
  const { data, isLoading } = useSWR<GTFSStopTime[]>(
    routeId ? `/api/static/stop-times?route_id=${routeId}` : null,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const routeStopIds = new Set(data?.map((st) => st.stop_id));

  return { routeStopIds, isLoading };
}
