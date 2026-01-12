# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run test` - Run tests with vitest
- `npx tsx <file>.ts` - Run TypeScript files directly

## Architecture

This is a React-based web application using TanStack Start (SSR framework) with file-based routing. The app consists of three main tools:

### Tech Stack
- **Framework**: TanStack Start (built on Vite + Vinxi/Nitro) with React 19
- **Routing**: TanStack Router with file-based routing (routes in `src/routes/`)
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (two separate instances)
  - Main Supabase: User authentication and inventory data
  - Tracking Supabase: Shipment tracking data
- **External APIs**: Purolator SOAP API for shipment tracking

### Routing Structure

Routes are file-based under `src/routes/`:
- `src/routes/__root.tsx` - Root layout with HTML document structure
- `src/routes/index.tsx` - Dashboard home page
- `src/routes/sign-maker/` - Sign printer tool
- `src/routes/scan/` - Barcode scanner tool
- `src/routes/tracking/` - Purolator shipment tracking
- `src/routes/api/` - Server endpoints (e.g., `/api/cron` for daily shipment updates)

Use `createFileRoute()` to define routes. The `beforeLoad` option handles auth redirects:

```ts
export const Route = createFileRoute('/sign-maker/')({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw redirect({ to: '/login' })
  },
  component: App,
})
```

### Server Functions (Server Actions)

Server-side code lives in `src/server/` and uses `createServerFn` from `@tanstack/react-start`:

```ts
export const addShipment = createServerFn({ method: "POST" })
  .inputValidator((pin: string) => pin)
  .handler(async ({ data: pin }) => {
    // Server-side code with access to process.env
  })
```

These functions automatically run server-side and can be called from client components.

### Supabase Integration

Two separate Supabase instances:
- `src/lib/supabase.ts` - Main instance (user auth, inventory)
- `src/lib/tracking-supabase.ts` - Tracking instance (shipments)

Environment variables (`.env`):
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` - Main Supabase
- `VITE_TRACKING_SUPABASE_URL` / `VITE_TRACKING_SUPABASE_KEY` - Tracking Supabase
- `PUROLATOR_KEY` / `PUROLATOR_PASSWORD` / `PUROLATOR_ENDPOINT` - Purolator API

### Purolator API Integration

Located in `src/lib/purolator.ts`. Uses the `soap` package with a WSDL file at `src/data/ShipmentTrackingService.wsdl`.

Key request structure:
```ts
const args = {
  TrackingSearchCriteria: {
    searches: {
      search: [{ trackingId: pin }]
    }
  }
}
```

Response path used by app: `result.SearchResults.SearchResult[0].Shipment.status.description`

### Database Schema

The tracking feature uses a `user_shipments` table (see `src/data/schema.sql`). Run this SQL in Supabase SQL Editor to set up.

### Component Organization

- `src/components/ui/` - Reusable UI components (shadcn-style)
- `src/components/sign-maker/` - Sign printer feature components
- `src/components/tracking/` - Shipment tracking feature components
- `src/components/scanner/` - Barcode scanner components

### Path Aliases

`@/*` maps to `./src/*` (configured in `tsconfig.json` and `vite.config.ts`)

### Test Scripts

The repository includes test scripts for validating API integration:
- `test-purolator-api.ts` - Tests Purolator API endpoints
- `diagnose-purolator.ts` - Debugs authentication issues
- `test-data-structure.ts` - Validates response structure parsing

Run with: `npx tsx <script-name>.ts`
