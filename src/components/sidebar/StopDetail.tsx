"use client";

import type { GTFSStop, GTFSRoute } from "@/types/gtfs";
import type { ArrivalEstimate } from "@/lib/gtfs/estimateArrivals";

interface StopDetailProps {
  stop: GTFSStop | null;
  routes: GTFSRoute[];
  arrivals: ArrivalEstimate[];
  onBack: () => void;
}

export default function StopDetail({ stop, routes, arrivals, onBack }: StopDetailProps) {
  if (!stop) {
    return (
      <div className="py-8 text-center text-sm text-gray-500">
        Stop not found.
        <button onClick={onBack} className="mt-2 block w-full text-blue-600 hover:underline">
          Back to routes
        </button>
      </div>
    );
  }

  const routeMap = new Map(routes.map((r) => [r.route_id, r]));

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
        <h3 className="text-lg font-semibold text-gray-900">{stop.stop_name}</h3>
        <p className="text-xs text-gray-500">ID: {stop.stop_id}</p>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-semibold text-gray-700">Estimated Arrivals</h4>
        {arrivals.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500">
            No active buses approaching this stop.
          </div>
        ) : (
          <div className="space-y-2">
            {arrivals.map((arrival) => {
              const route = routeMap.get(arrival.routeId);
              return (
                <div
                  key={`${arrival.tripId}-${arrival.vehicleId}`}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-block rounded bg-indigo-600 px-2 py-0.5 text-xs font-bold text-white">
                        {route?.route_short_name ?? arrival.routeId}
                      </span>
                      <span className="truncate text-xs text-gray-500">
                        Bus {arrival.vehicleLabel}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-gray-400">
                      Scheduled: {arrival.scheduledArrival}
                    </div>
                  </div>
                  <div className="ml-3 text-right">
                    <span className="text-lg font-bold text-green-600">
                      {arrival.minutesAway}
                    </span>
                    <span className="ml-1 text-xs text-gray-500">min</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
