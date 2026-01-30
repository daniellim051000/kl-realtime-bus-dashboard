"use client";

import { useReducer, useMemo, useCallback } from "react";
import { dashboardReducer, initialDashboardState } from "@/lib/dashboardReducer";
import { useVehicles } from "@/hooks/useVehicles";
import { useRoutes } from "@/hooks/useRoutes";
import { useStops } from "@/hooks/useStops";
import { useTrips } from "@/hooks/useTrips";
import { useShapes } from "@/hooks/useShapes";
import { useFilteredVehicles } from "@/hooks/useFilteredVehicles";
import { useEstimatedArrivals } from "@/hooks/useEstimatedArrivals";
import { useRouteStopIds } from "@/hooks/useRouteStopIds";
import MapWrapper from "@/components/map/MapContainer";
import Sidebar from "@/components/sidebar/Sidebar";
import RefreshIndicator from "@/components/ui/RefreshIndicator";
import ErrorBanner from "@/components/ui/ErrorBanner";
import Spinner from "@/components/ui/Spinner";

export default function DashboardClient() {
  const [state, dispatch] = useReducer(dashboardReducer, initialDashboardState);

  const { vehicles, fetchedAt, error: vehicleError, isLoading: vehiclesLoading, mutate } = useVehicles();
  const { routes, isLoading: routesLoading } = useRoutes();
  const { stops } = useStops();
  const { trips } = useTrips();
  const { shapes } = useShapes();

  const filteredVehicles = useFilteredVehicles(vehicles, state.selectedRouteId);
  const arrivals = useEstimatedArrivals(state.selectedStopId, vehicles, trips);
  const { routeStopIds } = useRouteStopIds(state.selectedRouteId);

  // Get stops for selected route
  const routeStops = useMemo(() => {
    if (!state.selectedRouteId || routeStopIds.size === 0) return [];
    return stops.filter((s) => routeStopIds.has(s.stop_id));
  }, [state.selectedRouteId, stops, routeStopIds]);

  // Get shape IDs for selected route
  const shapeIds = useMemo(() => {
    if (!state.selectedRouteId) return [];
    return [
      ...new Set(
        trips
          .filter((t) => t.route_id === state.selectedRouteId && t.shape_id)
          .map((t) => t.shape_id!)
      ),
    ];
  }, [state.selectedRouteId, trips]);

  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v.id === state.selectedVehicleId) ?? null,
    [vehicles, state.selectedVehicleId]
  );

  const selectedStop = useMemo(
    () => stops.find((s) => s.stop_id === state.selectedStopId) ?? null,
    [stops, state.selectedStopId]
  );

  const handleRouteClick = useCallback(
    (routeId: string) => {
      dispatch({
        type: "SELECT_ROUTE",
        routeId: routeId === state.selectedRouteId ? null : routeId,
      });
    },
    [state.selectedRouteId]
  );

  const handleVehicleClick = useCallback((vehicleId: string) => {
    dispatch({ type: "SELECT_VEHICLE", vehicleId });
  }, []);

  const handleStopClick = useCallback((stopId: string) => {
    dispatch({ type: "SELECT_STOP", stopId });
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    dispatch({ type: "SET_SEARCH", query });
  }, []);

  const handleBack = useCallback(() => {
    dispatch({ type: "BACK_TO_ROUTES" });
  }, []);

  if (vehiclesLoading && vehicles.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <div className="order-2 h-[40vh] w-full overflow-hidden md:order-1 md:h-full md:w-96">
        <Sidebar
          view={state.sidebarView}
          routes={routes}
          vehicles={vehicles}
          selectedRouteId={state.selectedRouteId}
          selectedVehicle={selectedVehicle}
          selectedStop={selectedStop}
          arrivals={arrivals}
          searchQuery={state.searchQuery}
          routesLoading={routesLoading}
          onSearchChange={handleSearchChange}
          onRouteClick={handleRouteClick}
          onBack={handleBack}
        />
      </div>

      {/* Map */}
      <div className="relative order-1 flex-1 md:order-2">
        {vehicleError && (
          <div className="absolute left-3 top-3 z-[1000] max-w-sm">
            <ErrorBanner
              message="Failed to load vehicle positions"
              onRetry={() => mutate()}
            />
          </div>
        )}

        <RefreshIndicator fetchedAt={fetchedAt} />

        <MapWrapper
          vehicles={filteredVehicles}
          stops={state.selectedRouteId ? routeStops : []}
          shapes={shapes}
          shapeIds={shapeIds}
          selectedVehicleId={state.selectedVehicleId}
          selectedStopId={state.selectedStopId}
          showStops={!!state.selectedRouteId}
          onVehicleClick={handleVehicleClick}
          onStopClick={handleStopClick}
        />
      </div>
    </div>
  );
}
