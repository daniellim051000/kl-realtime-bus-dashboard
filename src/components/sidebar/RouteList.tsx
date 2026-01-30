"use client";

import { useMemo } from "react";
import type { GTFSRoute } from "@/types/gtfs";
import type { Vehicle } from "@/types/vehicle";
import RouteCard from "./RouteCard";

interface RouteListProps {
  routes: GTFSRoute[];
  vehicles: Vehicle[];
  searchQuery: string;
  selectedRouteId: string | null;
  onRouteClick: (routeId: string) => void;
}

export default function RouteList({
  routes,
  vehicles,
  searchQuery,
  selectedRouteId,
  onRouteClick,
}: RouteListProps) {
  const busCountByRoute = useMemo(() => {
    const counts = new Map<string, number>();
    for (const v of vehicles) {
      counts.set(v.routeId, (counts.get(v.routeId) ?? 0) + 1);
    }
    return counts;
  }, [vehicles]);

  const filteredRoutes = useMemo(() => {
    if (!searchQuery) return routes;
    const q = searchQuery.toLowerCase();
    return routes.filter(
      (r) =>
        r.route_short_name.toLowerCase().includes(q) ||
        r.route_long_name.toLowerCase().includes(q) ||
        r.route_id.toLowerCase().includes(q)
    );
  }, [routes, searchQuery]);

  // Sort routes: those with active buses first, then alphabetically
  const sortedRoutes = useMemo(() => {
    return [...filteredRoutes].sort((a, b) => {
      const countA = busCountByRoute.get(a.route_id) ?? 0;
      const countB = busCountByRoute.get(b.route_id) ?? 0;
      if (countA !== countB) return countB - countA;
      return a.route_short_name.localeCompare(b.route_short_name);
    });
  }, [filteredRoutes, busCountByRoute]);

  if (sortedRoutes.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-gray-500">
        {searchQuery ? "No routes match your search." : "No routes available."}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sortedRoutes.map((route) => (
        <RouteCard
          key={route.route_id}
          route={route}
          activeBusCount={busCountByRoute.get(route.route_id) ?? 0}
          isSelected={route.route_id === selectedRouteId}
          onClick={onRouteClick}
        />
      ))}
    </div>
  );
}
