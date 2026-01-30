# KL Bus Tracker

Real-time dashboard showing live Prasarana bus positions in Kuala Lumpur on an interactive Leaflet map.

## Features

- Live bus positions updated every 30 seconds
- Interactive Leaflet map with SVG arrow markers rotated by bearing
- Route filtering and search
- Bus stop markers along selected routes
- Estimated arrival times at stops
- Route polylines drawn from GTFS shape data
- Sidebar with route list, bus detail, and stop detail panels
- Responsive layout

## Tech Stack

- **Framework:** Next.js 16 / React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Map:** Leaflet + react-leaflet
- **Data Fetching:** SWR (30s polling for realtime, one-shot for static)
- **GTFS:** gtfs-realtime-bindings (Protobuf), JSZip + PapaParse (static CSV)

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Install & Run

```bash
npm install
npm run dev        # Start development server at http://localhost:3000
```

No environment variables are required — the app proxies all requests to public data.gov.my APIs server-side.

### Available Scripts

| Command          | Description              |
| ---------------- | ------------------------ |
| `npm run dev`    | Start development server |
| `npm run build`  | Production build         |
| `npm run start`  | Start production server  |
| `npm run lint`   | Run ESLint               |

## Project Structure

```
src/
├── app/
│   ├── DashboardClient.tsx          # Main orchestrator: hooks, reducer, props
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Entry page
│   ├── globals.css                  # Global styles
│   └── api/
│       ├── vehicles/route.ts        # Realtime vehicle positions (Protobuf)
│       └── static/
│           ├── routes/route.ts      # GTFS routes
│           ├── stops/route.ts       # GTFS stops
│           ├── trips/route.ts       # GTFS trips
│           ├── shapes/route.ts      # GTFS shapes
│           └── stop-times/route.ts  # GTFS stop times (filterable)
├── components/
│   ├── map/
│   │   ├── MapContainer.tsx         # Dynamic import wrapper (SSR disabled)
│   │   ├── DynamicMap.tsx           # Leaflet map with all layers
│   │   ├── BusMarker.tsx            # SVG arrow marker per vehicle
│   │   ├── BusStopMarker.tsx        # Stop circle marker
│   │   └── RoutePolyline.tsx        # Route shape polyline
│   ├── sidebar/
│   │   ├── Sidebar.tsx              # Sidebar shell with conditional panels
│   │   ├── RouteList.tsx            # Route listing panel
│   │   ├── RouteCard.tsx            # Individual route card
│   │   ├── SearchBar.tsx            # Route/stop search input
│   │   ├── BusDetail.tsx            # Selected bus detail panel
│   │   └── StopDetail.tsx           # Selected stop detail panel
│   ├── providers/
│   │   └── SWRProvider.tsx          # SWR configuration provider
│   └── ui/
│       ├── Badge.tsx                # Status badge
│       ├── ErrorBanner.tsx          # Error display
│       ├── RefreshIndicator.tsx     # Data refresh indicator
│       └── Spinner.tsx              # Loading spinner
├── hooks/
│   ├── useVehicles.ts               # SWR hook for realtime vehicles
│   ├── useRoutes.ts                 # SWR hook for GTFS routes
│   ├── useStops.ts                  # SWR hook for GTFS stops
│   ├── useTrips.ts                  # SWR hook for GTFS trips
│   ├── useShapes.ts                 # SWR hook for GTFS shapes
│   ├── useFilteredVehicles.ts       # Derived filtered vehicle list
│   ├── useRouteStopIds.ts           # Stop IDs for a selected route
│   └── useEstimatedArrivals.ts      # ETA computation hook
├── lib/
│   ├── constants.ts                 # App-wide constants
│   ├── dashboardReducer.ts          # UI state machine (selection, navigation)
│   └── gtfs/
│       ├── staticCache.ts           # In-memory cache with 24h TTL
│       ├── fetchStatic.ts           # ZIP download, CSV parse, type coercion
│       ├── parseProtobuf.ts         # Protobuf vehicle position decoder
│       └── estimateArrivals.ts      # ETA algorithm
└── types/
    ├── gtfs.ts                      # GTFS data interfaces
    ├── vehicle.ts                   # Vehicle position types
    └── ui.ts                        # UI state types
```

## Architecture

### Data Flow

```
Browser (SWR, 30s poll) ──► /api/vehicles ──► data.gov.my GTFS-realtime (Protobuf)
Browser (SWR, once)     ──► /api/static/* ──► data.gov.my GTFS-static  (ZIP → CSV)
```

All external API calls are made server-side by Next.js API routes, solving CORS restrictions and keeping Protobuf decoding off the client.

### Key Decisions

- **Leaflet SSR workaround** — Leaflet accesses `window` at import time, so `MapContainer.tsx` uses `next/dynamic` with `ssr: false`. All map components are `"use client"`.
- **GTFS static caching** — The static GTFS ZIP (~several MB) is downloaded once, parsed with JSZip + PapaParse, and cached in-memory with a 24-hour TTL (`lib/gtfs/staticCache.ts`). All static API routes share this single cached download.
- **Protobuf server-side decoding** — Vehicle positions arrive as Protobuf, decoded with `gtfs-realtime-bindings` in the `/api/vehicles` route. Long integer types are converted with `Number()`.
- **Type coercion** — PapaParse runs with `dynamicTyping: false` to prevent numeric route names from being cast to numbers. Fields are manually coerced in `fetchStatic.ts`.
- **Reducer-based UI state** — Sidebar navigation (selected route, vehicle, stop, search query, sidebar view) is managed via `useReducer` in `DashboardClient.tsx`. SWR handles all server data independently.

## API Routes

| Endpoint                  | Method | Description                          | Query Params                          |
| ------------------------- | ------ | ------------------------------------ | ------------------------------------- |
| `/api/vehicles`           | GET    | Realtime vehicle positions           | —                                     |
| `/api/static/routes`      | GET    | All GTFS routes                      | —                                     |
| `/api/static/stops`       | GET    | All GTFS stops                       | —                                     |
| `/api/static/trips`       | GET    | All GTFS trips                       | —                                     |
| `/api/static/shapes`      | GET    | All GTFS shapes                      | —                                     |
| `/api/static/stop-times`  | GET    | GTFS stop times (filterable)         | `?stop_id=` or `?trip_id=`            |

## Data Sources

- **Realtime vehicle positions:** [data.gov.my GTFS-realtime (Prasarana rapid-bus-kl)](https://api.data.gov.my/gtfs-realtime/vehicle-position/prasarana?category=rapid-bus-kl)
- **Static GTFS data:** [data.gov.my GTFS-static (Prasarana rapid-bus-kl)](https://api.data.gov.my/gtfs-static/prasarana?category=rapid-bus-kl)

## License

No license file is currently included in this repository.
