export interface Vehicle {
  id: string;
  label: string;
  licensePlate: string;
  lat: number;
  lng: number;
  bearing: number;
  speed: number;
  routeId: string;
  tripId: string;
  stopId: string;
  currentStatus: string;
  timestamp: number;
}

export interface VehicleResponse {
  vehicles: Vehicle[];
  fetchedAt: number;
}
