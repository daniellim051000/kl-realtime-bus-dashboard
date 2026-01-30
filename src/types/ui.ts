export type SidebarView = "routes" | "busDetail" | "stopDetail";

export interface DashboardState {
  selectedRouteId: string | null;
  selectedVehicleId: string | null;
  selectedStopId: string | null;
  searchQuery: string;
  sidebarView: SidebarView;
}

export type DashboardAction =
  | { type: "SELECT_ROUTE"; routeId: string | null }
  | { type: "SELECT_VEHICLE"; vehicleId: string | null }
  | { type: "SELECT_STOP"; stopId: string | null }
  | { type: "SET_SEARCH"; query: string }
  | { type: "SET_SIDEBAR_VIEW"; view: SidebarView }
  | { type: "BACK_TO_ROUTES" };
