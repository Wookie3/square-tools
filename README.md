# Square Tools

A React-based web application built with TanStack Start, providing three main productivity tools: sign printing, barcode scanning, and shipment tracking.

## Features

- **Sign Printer** - Create and print custom signs
- **Barcode Scanner** - Scan and process barcodes
- **Shipment Tracking** - Track Purolator shipments with real-time updates

## Tech Stack

- **Framework**: TanStack Start (built on Vite + Vinxi/Nitro) with React 19
- **Routing**: TanStack Router with file-based routing
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (two separate instances)
  - Main Supabase: User authentication and inventory data
  - Tracking Supabase: Shipment tracking data
- **External APIs**: Purolator SOAP API for shipment tracking

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Setup

Create a `.env` file with the following variables:

```env
# Main Supabase (auth, inventory)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Tracking Supabase (shipments)
VITE_TRACKING_SUPABASE_URL=your_tracking_supabase_url
VITE_TRACKING_SUPABASE_KEY=your_tracking_supabase_key

# Purolator API
PUROLATOR_KEY=your_purolator_key
PUROLATOR_PASSWORD=your_purolator_password
PUROLATOR_ENDPOINT=your_purolator_endpoint
```

### Database Setup

Run the SQL schema in Supabase SQL Editor to set up the tracking feature:
```bash
# See src/data/schema.sql
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Running Tests

```bash
npm run test
```

## Project Structure

```
square-tools/
├── src/
│   ├── routes/           # File-based routing
│   │   ├── index.tsx    # Dashboard home
│   │   ├── sign-maker/  # Sign printer tool
│   │   ├── scan/        # Barcode scanner
│   │   ├── tracking/    # Shipment tracking
│   │   └── api/         # Server endpoints
│   ├── components/      # React components
│   │   ├── ui/          # Reusable UI components
│   │   ├── sign-maker/  # Sign feature components
│   │   ├── tracking/    # Tracking components
│   │   └── scanner/     # Scanner components
│   ├── server/          # Server functions
│   ├── lib/             # Utility libraries
│   │   ├── supabase.ts          # Main Supabase client
│   │   ├── tracking-supabase.ts # Tracking Supabase client
│   │   └── purolator.ts         # Purolator API integration
│   └── data/            # Static data
│       ├── schema.sql   # Database schema
│       └── ShipmentTrackingService.wsdl  # Purolator WSDL
├── public/              # Static assets
└── package.json
```

## Routing

Routes are defined using `createFileRoute()` in `src/routes/`. The `beforeLoad` option handles authentication redirects:

```ts
export const Route = createFileRoute('/sign-maker/')({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw redirect({ to: '/login' })
  },
  component: App,
})
```

## Server Functions

Server-side code uses `createServerFn` from `@tanstack/react-start`:

```ts
export const addShipment = createServerFn({ method: "POST" })
  .inputValidator((pin: string) => pin)
  .handler(async ({ data: pin }) => {
    // Server-side code with access to process.env
  })
```

These functions automatically run server-side and can be called from client components.

## Purolator API Integration

The Purolator tracking feature uses the `soap` package with a WSDL file at `src/data/ShipmentTrackingService.wsdl`.

**Request Structure:**
```ts
const args = {
  TrackingSearchCriteria: {
    searches: {
      search: [{ trackingId: pin }]
    }
  }
}
```

**Response Path:** `result.SearchResults.SearchResult[0].Shipment.status.description`

## Test Scripts

The repository includes test scripts for validating API integration:

- `test-purolator-api.ts` - Tests Purolator API endpoints
- `diagnose-purolator.ts` - Debugs authentication issues
- `test-data-structure.ts` - Validates response structure parsing

Run with:
```bash
npx tsx <script-name>.ts
```

## License

MIT
