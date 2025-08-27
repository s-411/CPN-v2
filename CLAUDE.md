# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
CPN (Cost Per Nut) v2 is a complete Next.js 15.5 web application for tracking and analyzing personal relationship metrics. This is a fully implemented MVP with React 19, TypeScript, and Tailwind CSS 4.1.

## Development Commands

### Local Development
```bash
npm run dev        # Start development server at http://localhost:3000 with hot reloading
npm run build      # Build for production
npm run start      # Start production server on ${PORT:-3000}
npm run lint       # Run Next.js ESLint
npm run type-check # Run TypeScript type checking without compilation
```

**MVP Development Focus**: All development is done locally with hot reloading for rapid iteration. Keep browser open at `http://localhost:3000` - changes reflect immediately.

## Architecture Overview

### State Management Architecture
The application uses React Context with useReducer for centralized state management:

- **AppProvider** (`lib/context.tsx`): Wraps entire app in root layout
- **State Management**: useReducer pattern with actions for CRUD operations
- **Data Persistence**: localStorage with automatic sync via storage.ts
- **Real-time Calculations**: Derived state automatically recalculated on data changes
- **Custom Hooks**: `useGirls()`, `useDataEntries()`, `useGlobalStats()` for component access

### Data Flow Pattern
1. **Storage Layer** (`lib/storage.ts`): localStorage CRUD with UUID generation
2. **Context Layer** (`lib/context.tsx`): Global state with real-time metric calculation
3. **Component Layer**: Hooks provide reactive data access
4. **UI Updates**: Automatic re-renders when underlying data changes

### Key Architectural Patterns
- **Modal-based UI**: AddGirlModal, EditGirlModal, EditEntryModal for consistent UX
- **Calculated Metrics**: Real-time computation via `lib/calculations.ts`
- **Responsive Navigation**: Sidebar (desktop) + MobileNav (mobile) with shared navigation items
- **Form Patterns**: Controlled inputs with validation and error states

## File Structure & Key Components

### Layout Structure
- **Root Layout** (`app/layout.tsx`): AppProvider + Sidebar + MobileNav wrapper
- **Navigation**: Responsive with active states and "coming soon" disabled items
- **Pages**: Follow Next.js 15 App Router with dynamic routes for girls/[id]/add-data

### Core Data Models
```typescript
// Girl Profile (lib/types.ts)
interface Girl {
  id: string;           // UUID
  name: string;
  age: number;          // 18+ validation
  nationality: string;  // Now "Ethnicity (Optional)" in UI
  rating: number;       // 5.0-10.0 in 0.5 increments, tile-based UI
  createdAt: Date;
  updatedAt: Date;
}

// Data Entry
interface DataEntry {
  id: string;           // UUID
  girlId: string;       // Foreign key
  date: Date;
  amountSpent: number;
  durationMinutes: number;
  numberOfNuts: number;
  createdAt: Date;
  updatedAt: Date;
}

// Calculated metrics are derived in real-time
interface GirlWithMetrics extends Girl {
  metrics: CalculatedMetrics;
  totalEntries: number;
}
```

### Critical Business Logic
- **Cost per Nut** = Total Spent / Total Nuts
- **Time per Nut** = Total Time / Total Nuts (in minutes)
- **Cost per Hour** = Total Spent / (Total Time in hours)

## Design System Implementation

### Custom CSS Classes (app/globals.css)
```css
.btn-cpn          # Primary yellow buttons with 100px border radius
.input-cpn        # Form inputs with dark theme and yellow focus states
.card-cpn         # Container cards with proper borders and padding
.sidebar-item     # Navigation items with active yellow highlighting
.mobile-nav-item  # Bottom navigation with active states
.table-cpn        # Data tables with hover effects and proper borders
```

### Brand Colors (CSS Variables)
- `--color-cpn-yellow`: #f2f661 (Primary brand color)
- `--color-cpn-dark`: #1f1f1f (Main background)
- `--color-cpn-dark2`: #2a2a2a (Elevated surfaces, cards)
- `--color-cpn-white`: #ffffff (Primary text)
- `--color-cpn-gray`: #ababab (Secondary text, borders)

### Typography
- **Headings**: National2Condensed font (`font-heading`)
- **Body**: ESKlarheit font (`font-body`)
- **Font files**: Located in both `/design/fonts/` and `/public/fonts/`

## Special Implementation Details

### Hotness Rating System
- **UI**: Tile-based selection (5.0-10.0 in 0.5 increments)
- **Layout**: Two rows - 5.0-7.5 (6 tiles), 8.0-10.0 (5 tiles)
- **Labels**: "5.0-6.0: Below Average" and "8.5-10.0: Exceptional"
- **Default**: 6.0 rating for new profiles

### Form Patterns
- **Ethnicity Field**: Dropdown with "Prefer not to say" default, optional analytics
- **Validation**: Real-time with error states
- **Modals**: Consistent patterns across Add/Edit operations

### Navigation Behavior
- **Active States**: Yellow highlighting for current page
- **Route Matching**: Special handling for `/girls` route (dashboard)
- **Disabled Items**: Grayed out "coming soon" features (Leaderboards, Share, Subscription)

## Next.js 15 Specific Notes

### Params Handling
Dynamic routes use `params` which is now a Promise in Next.js 15. Current implementation acknowledges the warning but remains functional:
```typescript
// TODO: Next.js 15 - params is now a Promise, will be fixed in future version
const id = params.id; // Shows warning but app functions correctly
```

### App Router Structure
- Uses new App Router with proper TypeScript integration
- Server/Client components properly separated with 'use client' directives
- Metadata API used in layout.tsx for SEO

## Development Roadmap Strategy

**Current Strategy**: Complete local feature set before design perfection (see Roadmap.md)

### Phase-Based Development Approach
1. **Phase 1**: Complete Feature Set - Local Implementation (ROUGH but functional)
2. **Phase 2**: Design System Perfection (with full system context)
3. **Phase 3**: UX Flow Enhancement (across complete application)
4. **Phases 4-8**: Advanced features, optimization, and Supabase migration

### Subscription Tier Implementation
- **Free Tier ("Boyfriend Mode")**: 1 girl max, dashboard access with strategic paywalls
- **Premium Tier ("Player Mode")**: 50 girls max (hidden limit), full features, $1.99/week
- **Lifetime Access**: Everything plus API access and priority support

### Paywall Strategy
- **Free users can navigate and click** throughout the app
- **Strategic paywalls** appear when accessing premium features (Leaderboards, Analytics, etc.)
- **Beautiful conversion-focused paywalls** with testimonials, feature lists, and upgrade CTAs
- **Dashboard remains accessible** to demonstrate core value proposition

### Development Workflow

#### Phase 1 - Feature Implementation (Current)
1. Build rough but complete versions of all features
2. Focus on functionality over visual polish
3. Create placeholder pages for: Leaderboards, Share, Profile, Settings, Billing, Data Vault
4. Implement mock multi-user data for testing complete feature set

#### Post-Phase 1 - System-Wide Polish
1. Design system perfection with full feature context
2. Component consistency across entire application
3. UX flow enhancement with complete user journeys

### Mock Data Strategy
- Create realistic multi-user datasets for testing
- Simulate leaderboard competition and rankings
- Generate data vault aggregate statistics
- Test all features with varied data scenarios

### Data Management
- All data persists to localStorage during local development
- State changes trigger real-time metric recalculation
- CRUD operations available via custom hooks
- Supabase migration planned after complete local feature set

## Tech Stack
- **Framework**: Next.js 15.5 with App Router
- **UI**: React 19.0.0 with TypeScript 5.6.2
- **Styling**: Tailwind CSS 4.1.0 with custom theme
- **Icons**: Heroicons 2.2.0
- **Charts**: Recharts 3.1.2 (for analytics)
- **Node**: 22.x (DigitalOcean deployment ready)

## Configuration Files
- **next.config.js**: Standalone output for deployment + image domains
- **postcss.config.mjs**: Tailwind CSS 4.0 PostCSS plugin
- **tsconfig.json**: Strict TypeScript with path aliases (@/)
- **.gitignore**: Excludes node_modules, .next, .env.local