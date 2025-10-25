# PsicoBienestar - Psychology & Wellness Platform

## Overview

PsicoBienestar is a psychology and wellness platform offering online courses, therapy sessions, and mental health resources. The application provides a warm, accessible interface for users to explore courses on topics like anxiety management, mindfulness, and emotional regulation, while also enabling them to book individual therapy appointments.

**Core Purpose**: Connect mental health professionals with clients through educational content and therapy scheduling, all within an inviting, trustworthy digital environment.

**Key Features**:
- Course catalog and enrollment system
- Therapy appointment booking with calendar interface
- Student/alumni registration and management
- Blog/articles section for mental health resources
- Responsive, mobile-first design with custom brand identity

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**:
- **React 18** with TypeScript for type-safe component development
- **Wouter** for lightweight client-side routing (SPA architecture)
- **TanStack Query (React Query)** for server state management and data fetching
- **Vite** as the build tool and development server

**Design System**:
- **Tailwind CSS** with custom color palette focused on warmth and accessibility
- **shadcn/ui** component library (Radix UI primitives with custom styling)
- **Custom brand colors**: Crema (#FDFBF5) background, Dorado (#C6A969) accents, Marron (#4E443A) text
- **Inter font family** for modern, legible typography

**Component Structure**:
- Page-level components in `/client/src/pages/` (Home, Courses, Booking, Services, About, Blog, StudentArea)
- Reusable UI components from shadcn/ui in `/client/src/components/ui/`
- Shared Header component with navigation

**State Management Strategy**:
- React Query for API data caching and synchronization
- Local component state with React hooks for UI interactions
- No global state management library (Redux/Zustand) - lean architecture

### Backend Architecture

**Technology Stack**:
- **Express.js** server with TypeScript
- **Node.js** runtime
- In-memory storage pattern with interface-based design for future database migration

**API Design**:
- RESTful endpoints under `/api/` prefix
- Student management: POST/GET `/api/students`
- Appointment management: POST/GET `/api/appointments`
- Static course and article data served from client-side constants

**Storage Pattern**:
The application uses an interface-based storage abstraction (`IStorage`) allowing for easy migration from in-memory storage to persistent databases. Current implementation uses `MemStorage` class with Map-based data structures.

**Why in-memory storage**: Simplified MVP deployment without database dependencies. The storage interface ensures zero refactoring needed when migrating to PostgreSQL/Drizzle ORM.

### Database Schema

**Planned Schema** (Drizzle ORM with PostgreSQL):

The codebase includes Drizzle configuration and schema definitions for future database integration:

- **students table**: User profiles for course enrollees
  - Fields: id (UUID), name, email (unique), createdAt
  
- **appointments table**: Therapy session bookings
  - Fields: id (UUID), name, email, date, time, createdAt

**Current State**: Schema defined in `/shared/schema.ts` but using in-memory implementation. Database migration ready via `npm run db:push`.

### Build and Deployment

**Development Mode**:
- Vite dev server with HMR for frontend
- Express server in middleware mode proxying to Vite
- TypeScript compilation on-the-fly with tsx

**Production Build**:
1. Frontend: `vite build` → outputs to `dist/public`
2. Backend: `esbuild` bundles server code → outputs to `dist/index.js`
3. Server serves static frontend files from `dist/public`

**Environment Variables**:
- `DATABASE_URL`: PostgreSQL connection string (required for Drizzle migrations)
- `NODE_ENV`: production/development mode switching

### Validation and Type Safety

**Shared Schema Layer**:
- Zod schemas for runtime validation (`insertStudentSchema`, `insertAppointmentSchema`)
- TypeScript types inferred from Drizzle schema definitions
- Shared types between client and server via `/shared/` directory

**Benefits**: Type safety across full stack, single source of truth for data models, automatic validation on API requests.

## External Dependencies

### UI Component Libraries
- **Radix UI**: Headless accessible component primitives (dialogs, dropdowns, accordions, etc.)
- **shadcn/ui**: Pre-styled components built on Radix UI
- **Lucide React**: Icon library for consistent iconography

### Data Fetching & Forms
- **TanStack Query**: Server state management, caching, background refetching
- **React Hook Form**: Form state management with `@hookform/resolvers` for Zod integration

### Styling & Utilities
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant styling
- **clsx** + **tailwind-merge**: Conditional className composition
- **date-fns**: Date manipulation for calendar functionality

### Database (Planned Integration)
- **Drizzle ORM**: TypeScript ORM for PostgreSQL
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **drizzle-zod**: Generate Zod schemas from Drizzle tables

### Development Tools
- **Vite**: Build tool with fast HMR
- **TypeScript**: Type safety across codebase
- **esbuild**: Production bundler for server code
- **@replit/vite-plugin-***: Replit-specific development enhancements

### Notable Architectural Decisions

**SPA vs MPA**: Chose single-page application architecture with client-side routing for seamless navigation, critical for the therapeutic user experience where interruptions should be minimized.

**In-memory storage**: Deliberately started with in-memory storage to simplify initial deployment. The `IStorage` interface pattern ensures migration to PostgreSQL requires only swapping the storage implementation class without touching business logic.

**Static course data**: Courses and articles are defined as TypeScript constants rather than database records. This decision prioritizes simplicity for content that changes infrequently and allows for easy content management through code.

**No authentication system**: MVP focuses on appointment booking and course exploration without user accounts. Email-based identification used for both students and appointments allows future migration to proper authentication.