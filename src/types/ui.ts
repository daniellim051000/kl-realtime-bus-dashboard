export type SidebarView = "routes" | "busDetail" | "stopDetail";

export interface DashboardState {
  selectedRouteIds: Set<string>;
  selectedVehicleId: string | null;
  selectedStopId: string | null;
  searchQuery: string;
  sidebarView: SidebarView;
}

export type DashboardAction =
  | { type: "TOGGLE_ROUTE"; routeId: string }
  | { type: "CLEAR_ROUTES" }
  | { type: "SELECT_VEHICLE"; vehicleId: string | null }
  | { type: "SELECT_STOP"; stopId: string | null }
  | { type: "SET_SEARCH"; query: string }
  | { type: "SET_SIDEBAR_VIEW"; view: SidebarView }
  | { type: "BACK_TO_ROUTES" };
