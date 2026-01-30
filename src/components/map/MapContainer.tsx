"use client";

import dynamic from "next/dynamic";
import type { Vehicle } from "@/types/vehicle";
import type { GTFSStop, GTFSShape } from "@/types/gtfs";

const DynamicMap = dynamic(() => import("./DynamicMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-gray-100">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

interface MapWrapperProps {
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

export default function MapWrapper(props: MapWrapperProps) {
  return <DynamicMap {...props} />;
}
