# Frontend Guide - Attenda

The Attenda frontend is a Single Page Application (SPA) built with **React** and **Vite**, designed to provide a fast, fluid, and premium "Concierge" user experience.

## Navigation Map

```mermaid
graph TD
    L[Landing Page] --> Login[Login / Register]
    Login --> Dashboard[Dashboard Overview]
    Guests[Guest Management]
    Events[My Events / Create Event]
    Tasks[Task List]
    Settings[Settings]

    Dashboard --> Guests
    Dashboard --> Events
    Dashboard --> Tasks
    Dashboard --> Settings
```

## Directory Structure (`/src`)

- **`/components`**:
    - **`layout/`**: Contains `Navbar`, `Footer`, and `MainLayout` for public pages.
    - **`dashboard/`**: Dashboard-specific components (`Sidebar`, `GuestDrawer`, `DashboardLayout`).
- **`/pages`**:
    - Public marketing pages (`Landing`, `Pricing`, `AboutUs`).
    - **`dashboard/`**: Protected views for event and guest management.
- **`/lib/api.js`**: **Unified API Client**. Centralized Fetch wrapper that handles Bearer tokens and target URL resolution (`127.0.0.1` for dev stability).
- **`/contexts`**:
    - **`AuthContext.jsx`**: Manages authentication state and user session via Supabase.

## Management Features

### 1. Guest Management (`Guests.jsx`)
The dashboard's flagship view, providing full control over the attendee list.
- **Dynamic Filtering**: Name search and instant filtering by RSVP status and groups.
- **Bulk Actions**: Multi-selection system with an animated toolbar for batch guest deletion.
- **Import/Export**:
    - Pre-configured CSV template download.
    - Direct CSV import with event capacity limit validation.
- **Safety**: The "Clear List" button requires a keyword confirmation ("BORRAR") to prevent accidents.

### 2. Core Dashboard Components
- **`GuestDrawer.jsx`**: Sliding side panel for adding or editing guest details (RSVP, dietary restrictions, notes).
- **`ConfirmationModal.jsx`**: Premium design component for critical actions, supporting loading states and keyword validation.
- **`Sidebar.jsx`**: Persistent side navigation with active states and glassmorphism design.

## Aesthetics & Styling
The application uses **Tailwind CSS v4** for styling:
- **Glassmorphism**: Panels with translucent backgrounds and backdrop blur.
- **Sheen Effect**: Subtle shine micro-animations on interactive containers to accentuate premium elements.
- **Micro-interactions**: Framer Motion is used for smooth modal entries and toolbars.
- **Mobile-First**: Fully optimized for mobile devices through the `MobileBottomNav`.

## Theme Support & Dark Mode
The dashboard supports a high-fidelity **Dark Mode** integrated directly via CSS variables.

### 1. Style Tokens (`dashboard-theme.css`)
Developers MUST use theme tokens for all surface, text, and border colors to ensure theme compatibility:
- **Surfaces**: `var(--color-surface-container-lowest)` (panels), `var(--color-surface-container-low)` (hover/secondary).
- **Text**: `var(--color-primary)` (primary text), `var(--color-secondary)` (supporting text).
- **Overlays**: Use `bg-[var(--color-primary)]/10 dark:bg-black/40 backdrop-blur-sm` for modal/drawer backdrops.

### 2. Priority & Status Badges
To maintain a premium look in dark mode, avoid solid high-contrast backgrounds. Instead, use semi-transparent utility combinations:
- **Red/High**: `bg-red-500/10 text-red-500`
- **Orange/Mid**: `bg-orange-500/10 text-orange-500`
- **Blue/Low**: `bg-blue-500/10 text-blue-500`

### 3. Usage Pattern
The `ThemeContext` adds the `.dark` class to the HTML root. Components should be styled using CSS variables that automatically swap values based on this class.

---
*For details on the database and infrastructure services, see [ARCHITECTURE_AUTH.md](./ARCHITECTURE_AUTH.md).*
