import { useMemo } from "react";
import useSWR from "swr";
import type { GTFSStopTime } from "@/types/gtfs";

export function useRouteStopIds(routeIds: Set<string>) {
  const swrKey = useMemo(() => {
    if (routeIds.size === 0) return null;
    const sorted = [...routeIds].sort().join(",");
    return `/api/static/stop-times?route_ids=${sorted}`;
  }, [routeIds]);

  const { data, isLoading } = useSWR<GTFSStopTime[]>(swrKey, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const routeStopIds = useMemo(
    () => new Set(data?.map((st) => st.stop_id)),
    [data]
  );

  return { routeStopIds, isLoading };
}
