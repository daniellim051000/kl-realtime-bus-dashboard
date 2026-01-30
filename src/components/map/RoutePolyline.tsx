"use client";

import { memo } from "react";
import { Polyline } from "react-leaflet";
import type { GTFSShape } from "@/types/gtfs";
import type { LatLngExpression } from "leaflet";

interface RoutePolylineProps {
  shapes: GTFSShape[];
  shapeId: string;
  color?: string;
}

function RoutePolylineComponent({ shapes, shapeId, color = "#6366f1" }: RoutePolylineProps) {
  const shapePoints = shapes
    .filter((s) => s.shape_id === shapeId)
    .sort((a, b) => a.shape_pt_sequence - b.shape_pt_sequence)
    .map((s): LatLngExpression => [s.shape_pt_lat, s.shape_pt_lon]);

  if (shapePoints.length === 0) return null;

  return (
    <Polyline
      positions={shapePoints}
      pathOptions={{
        color,
        weight: 4,
        opacity: 0.7,
      }}
    />
  );
}

export default memo(RoutePolylineComponent);
