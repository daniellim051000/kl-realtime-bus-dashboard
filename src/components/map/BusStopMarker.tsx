"use client";

import { memo } from "react";
import { CircleMarker, Popup } from "react-leaflet";
import type { GTFSStop } from "@/types/gtfs";

interface BusStopMarkerProps {
  stop: GTFSStop;
  isSelected: boolean;
  onClick: (stopId: string) => void;
}

function BusStopMarkerComponent({ stop, isSelected, onClick }: BusStopMarkerProps) {
  return (
    <CircleMarker
      center={[stop.stop_lat, stop.stop_lon]}
      radius={isSelected ? 8 : 5}
      pathOptions={{
        color: isSelected ? "#dc2626" : "#6366f1",
        fillColor: isSelected ? "#dc2626" : "#818cf8",
        fillOpacity: 0.8,
        weight: 2,
      }}
      eventHandlers={{
        click: () => onClick(stop.stop_id),
      }}
    >
      <Popup>
        <div className="text-sm">
          <strong>{stop.stop_name}</strong>
          <div>ID: {stop.stop_id}</div>
        </div>
      </Popup>
    </CircleMarker>
  );
}

export default memo(BusStopMarkerComponent);
