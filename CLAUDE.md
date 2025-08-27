# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
CPN (Cost Per Nut) v2 is a Next.js 15.5 web application for tracking and analyzing personal relationship metrics. This is currently in the planning/design phase with documentation and design assets prepared but no code implementation yet.

## Tech Stack Requirements
Based on `/docs/digitalocean-requirements.md`:
- **Node.js**: 22.x (DigitalOcean default)
- **Next.js**: 15.5 (with output: 'standalone' for deployment)
- **Tailwind CSS**: 4.1 with @tailwindcss/postcss plugin
- **Package Manager**: npm (bundled with Node 22)
- **Deployment Target**: DigitalOcean App Platform (Post-MVP)

## Project Setup Commands

### Initial Setup (when implementing)
```bash
npm init -y
npm install next@15.5.0 react@19.0.0 react-dom@19.0.0
npm install tailwindcss@4.1.0 @tailwindcss/postcss@4.1.0 postcss@8.4.41
npm install -D typescript@5.6.2
```

### Local Development Setup (MVP)
**IMPORTANT**: All MVP development is done locally with hot reloading for rapid iteration.

```bash
npm run dev      # Starts Next.js dev server at http://localhost:3000 with hot reloading
```

The development server provides:
- **Hot Module Replacement (HMR)**: Changes appear instantly in browser
- **Fast Refresh**: React component state preserved during edits
- **Error Overlay**: Instant error feedback in browser
- **Auto-compilation**: Automatic TypeScript/JSX compilation on save

Access the site at `http://localhost:3000` and keep the browser open while developing. Changes will reflect immediately without manual refresh.

### Production Commands
```bash
npm run build    # Build for production (when ready)
npm run start    # Start production server on ${PORT:-3000}
```

### Build & Deploy (DigitalOcean - Post-MVP)
- **Build Command**: `npm ci && npm run build`
- **Run Command**: `npm start`

## Core Application Structure

### Pages & Features (from PRD)
1. **Girls Page** (Dashboard) - Profile management hub
2. **Add Data Page** - Individual data entry with real-time statistics
3. **Overview Page** - Table view of all profiles with metrics
4. **Analytics Page** - Charts and insights
5. **Data Entry Page** - Quick general data entry
6. **Settings & Profile** (future - greyed out in MVP)

### Design System
- **Typography**:
  - Headers: National-2-Condensed-Bold (`font-heading`)
  - Body: ESKlarheitGrotesk-Rg (`font-body`)
- **Colors**: 
  - Brand Yellow: `cpn-yellow` (rgb(242 246 97))
  - Dark: `cpn-dark` (rgb(31 31 31))
  - Dark2: `cpn-dark2` (rgb(42 42 42)) - Slightly lighter dark for elevated surfaces
  - White: `cpn-white` (rgb(255 255 255))
  - Gray: `cpn-gray` (rgb(171 171 171))
- **Button Radius**: `rounded-cpn-button` (100px)

### Data Models
```javascript
// Girl Profile
{
  id: string (UUID),
  name: string,
  age: number (18+ validation),
  nationality: string,
  rating: number (5.0-10.0, 0.5 increments),
  createdAt: timestamp,
  updatedAt: timestamp
}

// Data Entry
{
  id: string (UUID),
  girlId: string (foreign key),
  date: date,
  amountSpent: number,
  durationMinutes: number,
  numberOfNuts: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Key Calculations
- **Cost per Nut** = Total Spent / Total Nuts
- **Time per Nut** = Total Time / Total Nuts  
- **Cost per Hour** = Total Spent / (Total Time in hours)

## Configuration Files Setup

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.digitaloceanspaces.com' },
      { protocol: 'https', hostname: '**.supabase.co' }
    ]
  }
};
module.exports = nextConfig;
```

### postcss.config.mjs (Tailwind v4)
```javascript
export default {
  plugins: {
    "@tailwindcss/postcss": {}
  }
}
```

### app/globals.css
```css
@import "tailwindcss";
/* Custom styles follow */
```

## Environment Variables
For local development (MVP), use a `.env.local` file:
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

For production deployment:
```
NEXT_PUBLIC_APP_URL=https://cpn.yourdomain.com
NODE_ENV=production
DATABASE_URL=<pooled connection string port 6543>
```

## Implementation Priorities
1. **Phase 1**: Core data flow (Girls page, Add Data page, local storage)
2. **Phase 2**: Views and analytics (Overview table, Analytics charts, Data Entry)
3. **Phase 3**: Polish (animations, error handling, mobile optimization)

## Key Development Guidelines
- Use local storage for MVP (no backend/auth initially)
- Real-time calculation updates (<100ms)
- Mobile-first responsive design
- Form validation on all inputs
- Two-step confirmation for deletions
- Keep calculator-like simplicity in UX
- Prioritize fast local development with hot reloading

## Testing Approach
When implementing tests, check for test scripts in package.json and follow the established patterns in the codebase.