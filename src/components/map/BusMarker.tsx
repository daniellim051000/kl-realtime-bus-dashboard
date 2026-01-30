"use client";

import { memo } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Vehicle } from "@/types/vehicle";

interface BusMarkerProps {
  vehicle: Vehicle;
  isSelected: boolean;
  onClick: (id: string) => void;
}

function createBusIcon(bearing: number, isSelected: boolean): L.DivIcon {
  const color = isSelected ? "#2563eb" : "#16a34a";
  const size = isSelected ? 28 : 22;

  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="transform:rotate(${bearing}deg)" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="${color}" stroke="white" stroke-width="2"/>
      <path d="M12 4 L16 14 L12 12 L8 14 Z" fill="white"/>
    </svg>`,
  });
}

function BusMarkerComponent({ vehicle, isSelected, onClick }: BusMarkerProps) {
  const icon = createBusIcon(vehicle.bearing, isSelected);

  return (
    <Marker
      position={[vehicle.lat, vehicle.lng]}
      icon={icon}
      eventHandlers={{
        click: () => onClick(vehicle.id),
      }}
      zIndexOffset={isSelected ? 1000 : 0}
    >
      <Popup>
        <div className="text-sm">
          <strong>{vehicle.label || vehicle.id}</strong>
          {vehicle.licensePlate && <div>Plate: {vehicle.licensePlate}</div>}
          <div>Route: {vehicle.routeId}</div>
          <div>Speed: {(vehicle.speed * 3.6).toFixed(0)} km/h</div>
        </div>
      </Popup>
    </Marker>
  );
}

export default memo(BusMarkerComponent);
