"use client";

import type { Vehicle } from "@/types/vehicle";
import type { GTFSRoute } from "@/types/gtfs";

interface BusDetailProps {
  vehicle: Vehicle | null;
  routes: GTFSRoute[];
  onBack: () => void;
}

export default function BusDetail({ vehicle, routes, onBack }: BusDetailProps) {
  if (!vehicle) {
    return (
      <div className="py-8 text-center text-sm text-gray-500">
        Vehicle not found.
        <button onClick={onBack} className="mt-2 block w-full text-blue-600 hover:underline">
          Back to routes
        </button>
      </div>
    );
  }

  const route = routes.find((r) => r.route_id === vehicle.routeId);

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to routes
      </button>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {vehicle.label || `Bus ${vehicle.id}`}
        </h3>

        <dl className="mt-3 space-y-2 text-sm">
          {vehicle.licensePlate && (
            <div className="flex justify-between">
              <dt className="text-gray-500">License Plate</dt>
              <dd className="font-medium text-gray-900">{vehicle.licensePlate}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-gray-500">Vehicle ID</dt>
            <dd className="font-mono text-gray-900">{vehicle.id}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Route</dt>
            <dd className="font-medium text-gray-900">
              {route ? `${route.route_short_name} - ${route.route_long_name}` : vehicle.routeId}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Speed</dt>
            <dd className="text-gray-900">{(vehicle.speed * 3.6).toFixed(0)} km/h</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Bearing</dt>
            <dd className="text-gray-900">{vehicle.bearing.toFixed(0)}°</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Status</dt>
            <dd className="text-gray-900">
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  vehicle.currentStatus === "STOPPED_AT"
                    ? "bg-yellow-100 text-yellow-800"
                    : vehicle.currentStatus === "IN_TRANSIT_TO"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {vehicle.currentStatus.replace(/_/g, " ")}
              </span>
            </dd>
          </div>
          {vehicle.stopId && (
            <div className="flex justify-between">
              <dt className="text-gray-500">Current Stop</dt>
              <dd className="font-mono text-gray-900">{vehicle.stopId}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-gray-500">Last Updated</dt>
            <dd className="text-gray-900">
              {vehicle.timestamp
                ? new Date(vehicle.timestamp * 1000).toLocaleTimeString()
                : "Unknown"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
