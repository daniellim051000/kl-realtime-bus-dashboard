# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KL Bus Tracker — a real-time dashboard showing live Prasarana bus positions in Kuala Lumpur on a Leaflet map, with route filtering, bus stop markers, search, and estimated arrival times.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

No test framework is configured.

## Architecture

**Data flow:** Browser polls Next.js API routes via SWR, API routes proxy to data.gov.my (solving CORS and Protobuf decoding server-side).

```
Browser (SWR, 30s poll) → /api/vehicles → data.gov.my GTFS-realtime (Protobuf)
Browser (SWR, once)     → /api/static/* → data.gov.my GTFS-static (ZIP → CSV)
```

**Key architectural decisions:**
- Leaflet requires `next/dynamic` with `ssr: false` — all map code lives in `"use client"` components. `MapContainer.tsx` is the dynamic wrapper; `DynamicMap.tsx` is the actual Leaflet map.
- Static GTFS data (routes, stops, trips, stop_times, shapes) is downloaded once as a ZIP, parsed with JSZip + PapaParse, and cached in-memory with 24h TTL (`lib/gtfs/staticCache.ts`). All static API routes share this single cached download.
- PapaParse is used with `dynamicTyping: false` — fields are manually coerced to correct types in `fetchStatic.ts` to avoid numeric route names breaking string operations.
- Protobuf vehicle positions are decoded server-side using `gtfs-realtime-bindings`. Long types must be converted with `Number()`.
- UI state (selected route/vehicle/stop, search, sidebar view) is managed via `useReducer` in `DashboardClient.tsx`. SWR handles all server data.

**API routes:**
- `/api/vehicles` — `force-dynamic`, decodes Protobuf, returns `{ vehicles, fetchedAt }`
- `/api/static/routes|stops|trips|shapes` — returns full parsed arrays
- `/api/static/stop-times` — supports `?stop_id=` and `?trip_id=` query filters for performance

## Key Source Locations

- `src/app/DashboardClient.tsx` — Main orchestrator: wires all hooks, reducer, and passes props to Sidebar + Map
- `src/lib/gtfs/` — Server-side GTFS infrastructure (ZIP fetch, Protobuf decode, cache, ETA algorithm)
- `src/lib/dashboardReducer.ts` — State machine for sidebar navigation and selection
- `src/hooks/` — SWR data hooks + derived state hooks (filtering, ETA computation)
- `src/components/map/` — Leaflet map with bus markers (SVG arrows rotated by bearing), stop markers, route polylines
- `src/components/sidebar/` — Sidebar with conditional panels (route list, bus detail, stop detail)
- `src/types/` — TypeScript interfaces for GTFS data, vehicles, and UI state

## External APIs

- **Realtime**: `https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-bus-kl` (Protobuf, updates every ~30s)
- **Static**: `https://api.data.gov.my/gtfs-static/prasarana?category=rapid-bus-kl` (ZIP containing routes.txt, stops.txt, trips.txt, stop_times.txt, shapes.txt)
