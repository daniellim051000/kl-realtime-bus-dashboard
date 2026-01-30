"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { MAP_CENTER, MAP_ZOOM } from "@/lib/constants";
import BusMarker from "./BusMarker";
import BusStopMarker from "./BusStopMarker";
import RoutePolyline from "./RoutePolyline";
import type { Vehicle } from "@/types/vehicle";
import type { GTFSStop, GTFSShape } from "@/types/gtfs";

interface DynamicMapProps {
  vehicles: Vehicle[];
  stops: GTFSStop[];
  shapes: GTFSShape[];
  shapeIds: string[];
  selectedVehicleId: string | null;
  selectedStopId: string | null;
  showStops: boolean;
  onVehicleClick: (id: string) => void;
  onStopClick: (id: string) => void;
}

function FitBoundsOnVehicles({ vehicles }: { vehicles: Vehicle[] }) {
  const map = useMap();

  useEffect(() => {
    if (vehicles.length === 0) return;
    // Only fit bounds on initial load or major changes, not every update
  }, [map, vehicles.length]);

  return null;
}

export default function DynamicMap({
  vehicles,
  stops,
  shapes,
  shapeIds,
  selectedVehicleId,
  selectedStopId,
  showStops,
  onVehicleClick,
  onStopClick,
}: DynamicMapProps) {
  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={MAP_ZOOM}
      className="h-full w-full"
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBoundsOnVehicles vehicles={vehicles} />

      {shapeIds.map((shapeId) => (
        <RoutePolyline key={shapeId} shapes={shapes} shapeId={shapeId} />
      ))}

      {showStops &&
        stops.map((stop) => (
          <BusStopMarker
            key={stop.stop_id}
            stop={stop}
            isSelected={stop.stop_id === selectedStopId}
            onClick={onStopClick}
          />
        ))}

      {vehicles.map((vehicle) => (
        <BusMarker
          key={vehicle.id}
          vehicle={vehicle}
          isSelected={vehicle.id === selectedVehicleId}
          onClick={onVehicleClick}
        />
      ))}
    </MapContainer>
  );
}
