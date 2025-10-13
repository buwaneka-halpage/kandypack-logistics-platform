# Kandypack Logistics Platform - Frontend Project Structure

## Table of Contents
- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Dependencies](#project-dependencies)
- [File Structure](#file-structure)
- [Configuration Files](#configuration-files)
- [Component Architecture](#component-architecture)

---

## Overview

This is a modern React-based logistics platform built with React Router v7, Vite, and Tailwind CSS. The application provides a comprehensive dashboard for managing logistics operations, including order management, delivery tracking, store locations, and rail scheduling.

---

## Technology Stack

### Core Framework
- **React v19.1.0** - Latest version of React for building the user interface
- **React Router v7.7.1** - Application routing and navigation (migrated from Remix)
- **TypeScript v5.8.3** - Type-safe JavaScript development
- **Vite v6.3.3** - Modern, fast build tool and development server

### Styling
- **Tailwind CSS v4.1.4** - Utility-first CSS framework
- **@tailwindcss/vite v4.1.4** - Vite integration for Tailwind
- **class-variance-authority v0.7.1** - Type-safe component variants
- **clsx v2.1.1** - Conditional className utility
- **tailwind-merge v3.3.1** - Merge Tailwind classes without conflicts

### UI Components
- **Radix UI** - Headless, accessible component primitives
  - `@radix-ui/react-slot v1.2.3`
  - `radix-ui v1.4.3`
- **Lucide React v0.544.0** - Beautiful icon library
- **shadcn/ui** - Re-usable component library (configured via `components.json`)

### Data Visualization & Tables
- **Recharts v2.15.4** - Composable charting library for React
- **@tanstack/react-table v8.21.3** - Headless table library for building powerful tables

### Maps & Geolocation
- **Leaflet v1.9.4** - Interactive map library
- **React-Leaflet v5.0.0** - React components for Leaflet maps
- **@types/leaflet v1.9.20** - TypeScript definitions for Leaflet

### Development Tools
- **@types/node v20** - Node.js type definitions
- **@types/react v19.1.2** - React type definitions
- **@types/react-dom v19.1.2** - React DOM type definitions
- **vite-tsconfig-paths v5.1.4** - Resolve TypeScript path mappings in Vite
- **tw-animate-css v1.3.8** - Animation utilities for Tailwind

### Server & Deployment
- **@react-router/node v7.7.1** - Node.js adapter for React Router
- **@react-router/serve v7.7.1** - Production server for React Router apps
- **isbot v5.1.27** - Bot detection for server-side rendering
- **Vercel** - Configured for deployment (see `vercel.json`)

---

## Project Dependencies

### Production Dependencies (`dependencies`)

```json
{
  "@radix-ui/react-slot": "^1.2.3",           // Slot primitive for component composition
  "@remix-run/dev": "2.17.1",                  // Legacy Remix dev tools
  "@react-router/dev": "^7.7.1",               // React Router dev tools
  "@react-router/node": "^7.7.1",              // Node.js adapter
  "@react-router/serve": "^7.7.1",             // Production server
  "@tailwindcss/vite": "^4.1.4",               // Tailwind Vite plugin
  "@tanstack/react-table": "^8.21.3",          // Table library
  "class-variance-authority": "^0.7.1",        // Component variants
  "clsx": "^2.1.1",                            // ClassName utility
  "isbot": "^5.1.27",                          // Bot detection
  "leaflet": "^1.9.4",                         // Map library
  "lucide-react": "^0.544.0",                  // Icons
  "radix-ui": "^1.4.3",                        // UI primitives
  "react": "^19.1.0",                          // Core React
  "react-dom": "^19.1.0",                      // React DOM renderer
  "react-leaflet": "^5.0.0",                   // React Leaflet components
  "react-router": "^7.7.1",                    // Core routing
  "react-router-dom": "^7.9.1",                // DOM bindings
  "recharts": "^2.15.4",                       // Charts
  "tailwind-merge": "^3.3.1",                  // Merge Tailwind classes
  "tailwindcss": "^4.1.4",                     // Tailwind CSS
  "typescript": "^5.8.3",                      // TypeScript compiler
  "vite": "^6.3.3",                            // Build tool
  "vite-tsconfig-paths": "^5.1.4"              // TS path resolution
}
```

### Development Dependencies (`devDependencies`)

```json
{
  "@types/leaflet": "^1.9.20",                 // Leaflet types
  "@types/node": "^20",                        // Node.js types
  "@types/react": "^19.1.2",                   // React types
  "@types/react-dom": "^19.1.2",               // React DOM types
  "tw-animate-css": "^1.3.8"                   // Animation utilities
}
```

### Package Overrides

The project uses npm overrides to ensure React Router v7 is used instead of older Remix packages:

```json
{
  "@remix-run/dev": "npm:@react-router/dev@^7.7.1",
  "@remix-run/node": "npm:@react-router/node@^7.7.1",
  "@remix-run/serve": "npm:@react-router/serve@^7.7.1"
}
```

### NPM Scripts

```json
{
  "build": "vite build && vite build --ssr",   // Build client and server
  "dev": "react-router dev",                   // Start dev server
  "start": "react-router-serve ./build/server/index.js", // Start production server
  "typecheck": "react-router typegen && tsc",  // Type checking
  "build:vercel": "vercel build",              // Vercel build
  "deploy:vercel": "vercel --prod"             // Deploy to Vercel
}
```

---

## File Structure

```
UI/
│
├── api/                              # Vercel serverless functions
│   └── index.js                      # Vercel entry point
│
├── app/                              # Main application code
│   ├── app.css                       # Global styles and Tailwind imports
│   ├── root.tsx                      # Root component and layout
│   ├── routes.ts                     # Route configuration
│   │
│   ├── components/                   # React components
│   │   ├── comp-392.tsx              # Custom component
│   │   ├── comp-485.tsx              # Custom component
│   │   ├── ErrorBoundary.tsx         # Error boundary component
│   │   ├── PlaceholderPage.tsx       # Placeholder/fallback component
│   │   ├── UserAvatar.tsx            # User avatar component
│   │   │
│   │   ├── dashboard/                # Dashboard-specific components
│   │   │   ├── AdminOverview.tsx     # Admin dashboard overview
│   │   │   ├── Dashboard.tsx         # Main dashboard component
│   │   │   ├── DashboardHeader.tsx   # Dashboard header with navigation
│   │   │   ├── DashboardLayout.tsx   # Dashboard layout wrapper
│   │   │   ├── DashboardSkeleton.tsx # Loading skeleton for dashboard
│   │   │   ├── DeliveryProgress.tsx  # Delivery progress tracker
│   │   │   ├── LogisticsMap.tsx      # Logistics map visualization
│   │   │   ├── OrderManagementDashboard.tsx # Order management view
│   │   │   ├── Sidebar.tsx           # Dashboard sidebar navigation
│   │   │   ├── StatsCard.tsx         # Statistics card component
│   │   │   ├── StoreLocationsMap.tsx # Store locations map
│   │   │   └── WeeklyOrderChart.tsx  # Weekly order chart
│   │   │
│   │   ├── order-management/         # Order management components
│   │   │   ├── OrderManagement.tsx   # Main order management component
│   │   │   └── README.md             # Order management documentation
│   │   │
│   │   └── ui/                       # shadcn/ui components (reusable)
│   │       ├── alert-dialog.tsx      # Alert dialog component
│   │       ├── avatar.tsx            # Avatar component
│   │       ├── badge.tsx             # Badge component
│   │       ├── button.tsx            # Button component
│   │       ├── card.tsx              # Card component
│   │       ├── chart.tsx             # Chart component
│   │       ├── checkbox.tsx          # Checkbox component
│   │       ├── dropdown-menu.tsx     # Dropdown menu component
│   │       ├── input.tsx             # Input component
│   │       ├── label.tsx             # Label component
│   │       ├── pagination.tsx        # Pagination component
│   │       ├── popover.tsx           # Popover component
│   │       ├── select.tsx            # Select component
│   │       └── table.tsx             # Table component
│   │
│   ├── contexts/                     # React Context providers
│   │   └── SidebarContext.tsx        # Sidebar state management
│   │
│   ├── hooks/                        # Custom React hooks
│   │   └── useAuth.tsx               # Authentication hook
│   │
│   ├── lib/                          # Utility functions
│   │   └── utils.ts                  # Helper utilities (cn, etc.)
│   │
│   └── routes/                       # Route components (pages)
│       ├── admin.tsx                 # Admin page
│       ├── dashboard.tsx             # Dashboard page
│       ├── home.tsx                  # Home page
│       ├── last-mile.tsx             # Last-mile delivery page
│       ├── login.tsx                 # Login page
│       ├── logs.tsx                  # Logs page
│       ├── order-management.tsx      # Order management page
│       ├── rail-scheduling.tsx       # Rail scheduling page
│       ├── reports.tsx               # Reports page
│       ├── routers.tsx               # Routers management page
│       └── stores.tsx                # Stores page
│
├── build/                            # Build output directory
│   ├── client/                       # Client-side build artifacts
│   │   └── assets/                   # JS, CSS, and other assets
│   └── server/                       # Server-side build artifacts
│       └── index.js                  # Server entry point
│
├── public/                           # Static assets
│   └── (static files)                # Images, fonts, etc.
│
├── .react-router/                    # React Router generated files
│   └── types/                        # Auto-generated TypeScript types
│
├── node_modules/                     # NPM dependencies
│
├── .dockerignore                     # Docker ignore patterns
├── .gitignore                        # Git ignore patterns
├── components.json                   # shadcn/ui configuration
├── DASHBOARD_STYLING_README.md       # Dashboard styling guide
├── Dockerfile                        # Docker configuration
├── package.json                      # NPM package configuration
├── package-lock.json                 # NPM lock file
├── react-router.config.ts            # React Router configuration
├── README.md                         # Project README
├── remix.config.js                   # Legacy Remix config (deprecated)
├── tsconfig.json                     # TypeScript configuration
├── vercel.json                       # Vercel deployment configuration
└── vite.config.ts                    # Vite build configuration
```

---

## Configuration Files

### `package.json`
Main package configuration defining:
- Project metadata (`name`, `version`, `type`)
- NPM scripts for building, development, and deployment
- Production and development dependencies
- Package overrides for React Router migration

### `tsconfig.json`
TypeScript compiler configuration:
- **Compiler Options**: ES2022, JSX support, module resolution
- **Paths**: `~/*` alias mapping to `./app/*`
- **Includes**: App files and React Router type definitions
- **Strict Mode**: Enabled for type safety

### `vite.config.ts`
Vite build tool configuration:
- **Plugins**:
  - `@tailwindcss/vite` - Tailwind CSS integration
  - `reactRouter()` - React Router plugin
  - `tsconfigPaths()` - TypeScript path resolution

### `components.json`
shadcn/ui component library configuration:
- **Style**: New York variant
- **Base Color**: Slate
- **CSS Variables**: Enabled
- **Aliases**: Component, utils, ui, lib, hooks paths
- **Icon Library**: Lucide React

### `vercel.json`
Vercel deployment configuration:
- **Install Command**: `npm install`
- **Functions**: Serverless function configuration for `api/index.js`
- **Runtime**: Node.js 20.x

### `react-router.config.ts`
React Router application configuration (replaces `remix.config.js`)

### `Dockerfile`
Docker containerization configuration for deployment

---

## Component Architecture

### Component Categories

#### 1. **UI Components** (`app/components/ui/`)
Reusable, accessible components built with Radix UI primitives and styled with Tailwind CSS. These follow the shadcn/ui pattern and include:
- Form elements (Button, Input, Select, Checkbox)
- Layout components (Card)
- Feedback components (Alert Dialog, Badge)
- Navigation (Dropdown Menu, Pagination)
- Data display (Table, Chart, Avatar)

#### 2. **Dashboard Components** (`app/components/dashboard/`)
Business logic components specific to the logistics dashboard:
- **Layout**: `DashboardLayout`, `DashboardHeader`, `Sidebar`
- **Visualizations**: `WeeklyOrderChart`, `LogisticsMap`, `StoreLocationsMap`
- **Metrics**: `StatsCard`, `DeliveryProgress`
- **Views**: `AdminOverview`, `OrderManagementDashboard`

#### 3. **Feature Components** (`app/components/order-management/`)
Components for specific feature modules like order management

#### 4. **Utility Components**
- `ErrorBoundary.tsx` - Error handling
- `PlaceholderPage.tsx` - Fallback UI
- `UserAvatar.tsx` - User profile display

### State Management

#### Context API
- **SidebarContext** (`app/contexts/SidebarContext.tsx`) - Global sidebar state

#### Custom Hooks
- **useAuth** (`app/hooks/useAuth.tsx`) - Authentication state and logic

### Routing Structure

The application uses file-based routing with React Router v7:
- **Route Files**: Located in `app/routes/`
- **Route Configuration**: Defined in `app/routes.ts`
- **Route Components**: Each route file exports a component for that page

**Available Routes**:
- `/` - Home page
- `/login` - Authentication
- `/dashboard` - Main dashboard
- `/admin` - Admin panel
- `/order-management` - Order management
- `/stores` - Store management
- `/routers` - Router management
- `/last-mile` - Last-mile delivery
- `/rail-scheduling` - Rail scheduling
- `/reports` - Reporting
- `/logs` - System logs

---

## Path Aliases

The project uses TypeScript path aliases for cleaner imports:

```typescript
"~/*": ["./app/*"]
```

**Usage Example**:
```typescript
import { Button } from "~/components/ui/button";
import { useAuth } from "~/hooks/useAuth";
import { cn } from "~/lib/utils";
```

---

## Build & Deployment

### Development
```bash
npm run dev
```
Starts the Vite dev server with React Router in development mode.

### Production Build
```bash
npm run build
```
Creates optimized client and server builds in the `build/` directory.

### Production Server
```bash
npm start
```
Serves the production build using React Router's server.

### Vercel Deployment
```bash
npm run build:vercel  # Build for Vercel
npm run deploy:vercel # Deploy to Vercel production
```

### Type Checking
```bash
npm run typecheck
```
Generates React Router types and runs TypeScript compiler checks.

---

## Key Features

1. **Modern Stack**: React 19, React Router v7, Vite, TypeScript
2. **Type-Safe**: Full TypeScript coverage with strict mode
3. **Accessible UI**: Radix UI primitives for WCAG compliance
4. **Interactive Maps**: Leaflet integration for logistics visualization
5. **Data Visualization**: Recharts for analytics dashboards
6. **Responsive Design**: Tailwind CSS utility-first approach
7. **Server-Side Rendering**: React Router with Node.js adapter
8. **Production Ready**: Vercel deployment configuration
9. **Developer Experience**: Hot module replacement, TypeScript, ESLint

---

## Notes

- The project is migrating from Remix to React Router v7 (note the package overrides)
- Uses the latest React 19.x with concurrent features
- Configured for both traditional Node.js hosting and serverless (Vercel) deployment
- shadcn/ui components can be added via CLI using the `components.json` configuration
- All routes are type-safe thanks to React Router's type generation

---

**Last Updated**: October 13, 2025
