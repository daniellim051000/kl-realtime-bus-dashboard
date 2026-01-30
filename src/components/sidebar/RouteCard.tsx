"use client";

import { memo } from "react";
import type { GTFSRoute } from "@/types/gtfs";
import Badge from "@/components/ui/Badge";

interface RouteCardProps {
  route: GTFSRoute;
  activeBusCount: number;
  isSelected: boolean;
  onClick: (routeId: string) => void;
}

function RouteCardComponent({ route, activeBusCount, isSelected, onClick }: RouteCardProps) {
  return (
    <button
      onClick={() => onClick(route.route_id)}
      className={`w-full rounded-lg border p-3 text-left transition-colors ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="inline-block rounded px-2 py-0.5 text-xs font-bold text-white"
              style={{
                backgroundColor: route.route_color
                  ? `#${route.route_color}`
                  : "#6366f1",
              }}
            >
              {route.route_short_name}
            </span>
            <span className="truncate text-sm font-medium text-gray-900">
              {route.route_long_name}
            </span>
          </div>
        </div>
        <Badge count={activeBusCount} />
      </div>
    </button>
  );
}

export default memo(RouteCardComponent);
