# Project Memory - User Preferences and Rules

## Project Overview

This is a DFS (Norwegian Shooting Federation) competition registration **frontend POC** built with Next.js, TypeScript, and shadcn/ui components. Focus is on completing the Påmeldinger (Competition Registration) module with no backend requirements.

## Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **UI Library**: Base UI (coss/ui) components
- **Styling**: Tailwind CSS
- **State Management**: React Context (AuthContext)
- **Icons**: Lucide React

## User Preferences

- Prefer using existing or new Base UI (coss/ui) components
- Norwegian language interface
- Desktop-first design approach
- Clean, modern UI with good UX practices
- Use new Tabs API: `Tabs`, `TabsList`, `TabsTab`, `TabsPanel` (no `TabsTrigger`/`TabsContent`)
- Prefer `Accordion` from `components/ui/accordion` for collapsible sections
- Use Base UI `Frame` component (`components/ui/frame`) for card-like containers instead of custom div structures
- Home page should present a role-aware dashboard: upcoming events, quick actions, my registrations (when logged-in), notifications, stats, calendar and a map, with a hero + search.
 - Use locale-invariant date formatting for SSR/CSR parity (avoid `toLocaleString`/`toLocaleDateString` in markup). Prefer ISO 8601 `yyyy-MM-dd` for attributes/keys.

## Project Structure

- `/app` - Next.js app router pages
- `/components` - Reusable UI components
- `/lib` - Utilities, types, and context providers
- `/public` - Static assets

## Key Features (POC Focus)

- Competition listing and management
- Time slot booking system
- User authentication (demo) with role-based access
- Admin dashboard
- Event creation wizard
- Multi-day competition support
- Class-based access control
- Role-based user system (member, skytterlagsleder, admin)

## POC Scope

- Frontend-only implementation
- Mock data and services
- Focus on Påmeldinger (Competition Registration) completion
- No backend integration required

## Current Status

### ✅ Implemented

- Basic competition listing and filtering
- Time slot booking system for stevner (competitions)
- Support for three event types: stevne, møte, kurs
- Admin dashboard and event creation
- User authentication with role-based access
- Booking dialog with class selection and friend reservation
- Multi-day competition support
- Membership registration with insurance (innmelding)
- Insurance status display in profile

### ✅ Recently Fixed (Jan 2025)

- Bookings now persisted to localStorage via BookingService
- Competition page loads and saves bookings correctly
- "Mine påmeldinger" now displays actual bookings from localStorage
- Modernized list view design for time slot selection with cleaner card-based UI
- Improved visual hierarchy with better spacing and subtle colors
- **Meeting/Course booking**: Simple registration without time slots for møter and kurs
- **Public viewing**: Registrations visible without login, booking requires login
- **Class restrictions**: Visual indicators and validation for slots with allowedClasses
- **Simple booking dialog**: Created for meetings/courses with participant list display

### 🔴 Known Issues (See POC-ANALYSE.md)

- Missing voucher code system
- No email notifications
- Membership data saved to localStorage (POC limitation - needs backend)

### 🟡 Note

- Reservation timeout system (10 minutes) IS implemented in app/arrangement/[id]/page.tsx
- Public registration list view IS implemented (users can view without login)
- Booking without time slots IS implemented for møter/kurs

### 📄 Documentation

- POC-ANALYSE.md contains comprehensive analysis of what's done, what's missing, and what's wrong
- Analyses should include inline citations to `docs/` sources (file path + approx line numbers) when referencing requirements.

## Booking/Reservation Preferences
- Reservation timer should be per-slot, not global page/session
- Start reservation when user clicks a slot and opens the booking dialog
- Show lock state per-slot using `slot.isLocked` computed from active reservations
- Clear reservation on dialog close (if not confirmed) and on successful booking
