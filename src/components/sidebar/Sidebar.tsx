"use client";

import type { Vehicle } from "@/types/vehicle";
import type { GTFSRoute, GTFSStop } from "@/types/gtfs";
import type { SidebarView } from "@/types/ui";
import type { ArrivalEstimate } from "@/lib/gtfs/estimateArrivals";
import SearchBar from "./SearchBar";
import RouteList from "./RouteList";
import BusDetail from "./BusDetail";
import StopDetail from "./StopDetail";

interface SidebarProps {
  view: SidebarView;
  routes: GTFSRoute[];
  vehicles: Vehicle[];
  selectedRouteIds: Set<string>;
  selectedVehicle: Vehicle | null;
  selectedStop: GTFSStop | null;
  arrivals: ArrivalEstimate[];
  searchQuery: string;
  routesLoading: boolean;
  onSearchChange: (query: string) => void;
  onRouteClick: (routeId: string) => void;
  onClearRoutes: () => void;
  onBack: () => void;
}

export default function Sidebar({
  view,
  routes,
  vehicles,
  selectedRouteIds,
  selectedVehicle,
  selectedStop,
  arrivals,
  searchQuery,
  routesLoading,
  onSearchChange,
  onRouteClick,
  onClearRoutes,
  onBack,
}: SidebarProps) {
  return (
    <aside className="flex h-full flex-col border-r border-gray-200 bg-gray-50">
      <div className="border-b border-gray-200 bg-white px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900">KL Bus Tracker</h1>
        <p className="text-xs text-gray-500">Live Prasarana bus positions</p>
      </div>

      <div className="px-4 py-3">
        <SearchBar query={searchQuery} onChange={onSearchChange} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {routesLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : view === "busDetail" ? (
          <BusDetail vehicle={selectedVehicle} routes={routes} onBack={onBack} />
        ) : view === "stopDetail" ? (
          <StopDetail
            stop={selectedStop}
            routes={routes}
            arrivals={arrivals}
            onBack={onBack}
          />
        ) : (
          <RouteList
            routes={routes}
            vehicles={vehicles}
            searchQuery={searchQuery}
            selectedRouteIds={selectedRouteIds}
            onRouteClick={onRouteClick}
          />
        )}
      </div>

      {selectedRouteIds.size > 0 && view === "routes" && (
        <div className="border-t border-gray-200 bg-white px-4 py-2">
          <button
            onClick={onClearRoutes}
            className="w-full text-center text-sm text-blue-600 hover:underline"
          >
            Clear all ({selectedRouteIds.size} selected)
          </button>
        </div>
      )}
    </aside>
  );
}
