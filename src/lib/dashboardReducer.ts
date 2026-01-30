import type { DashboardState, DashboardAction } from "@/types/ui";

export const initialDashboardState: DashboardState = {
  selectedRouteIds: new Set<string>(),
  selectedVehicleId: null,
  selectedStopId: null,
  searchQuery: "",
  sidebarView: "routes",
};

export function dashboardReducer(
  state: DashboardState,
  action: DashboardAction
): DashboardState {
  switch (action.type) {
    case "TOGGLE_ROUTE": {
      const next = new Set(state.selectedRouteIds);
      if (next.has(action.routeId)) {
        next.delete(action.routeId);
      } else {
        next.add(action.routeId);
      }
      return {
        ...state,
        selectedRouteIds: next,
        selectedVehicleId: null,
        selectedStopId: null,
        sidebarView: "routes",
      };
    }
    case "CLEAR_ROUTES":
      return {
        ...state,
        selectedRouteIds: new Set<string>(),
        selectedVehicleId: null,
        selectedStopId: null,
        sidebarView: "routes",
      };
    case "SELECT_VEHICLE":
      return {
        ...state,
        selectedVehicleId: action.vehicleId,
        selectedStopId: null,
        sidebarView: action.vehicleId ? "busDetail" : "routes",
      };
    case "SELECT_STOP":
      return {
        ...state,
        selectedStopId: action.stopId,
        selectedVehicleId: null,
        sidebarView: action.stopId ? "stopDetail" : "routes",
      };
    case "SET_SEARCH":
      return {
        ...state,
        searchQuery: action.query,
      };
    case "SET_SIDEBAR_VIEW":
      return {
        ...state,
        sidebarView: action.view,
      };
    case "BACK_TO_ROUTES":
      return {
        ...state,
        selectedVehicleId: null,
        selectedStopId: null,
        sidebarView: "routes",
      };
    default:
      return state;
  }
}
