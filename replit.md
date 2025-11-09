# PsicoBienestar - Psychology & Wellness Platform

## Overview

PsicoBienestar is a psychology and wellness platform offering online courses, therapy sessions, and mental health resources. The application provides a warm, accessible interface for users to explore courses on topics like anxiety management, mindfulness, and emotional regulation, while also enabling them to book individual therapy appointments.

**Core Purpose**: Connect mental health professionals with clients through educational content and therapy scheduling, all within an inviting, trustworthy digital environment.

**Key Features**:
- Course catalog and enrollment system with payment processing (Stripe)
- Therapy appointment booking with calendar interface
- User authentication system (JWT + sessions)
- Student area with course access and progress tracking
- Admin panel for platform management
- Blog/articles section for mental health resources
- Email notifications (Resend integration)
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
- Page-level components in `/client/src/pages/` (Home, Courses, Booking, Services, About, Blog, StudentArea, Login, Register, Checkout, AdminDashboard, AdminUsers)
- Reusable UI components from shadcn/ui in `/client/src/components/ui/`
- Shared Header component with navigation and user authentication dropdown
- AuthContext for global authentication state management

**State Management Strategy**:
- React Query for API data caching and synchronization
- AuthContext (React Context API) for global authentication state
- Local component state with React hooks for UI interactions
- No additional global state management library (Redux/Zustand) - lean architecture

### Backend Architecture

**Technology Stack**:
- **Express.js** server with TypeScript
- **Node.js** runtime
- **PostgreSQL** database with Drizzle ORM
- **Passport.js** with JWT strategy for authentication
- **bcrypt** for password hashing
- **express-session** for session management

**API Design**:
- RESTful endpoints under `/api/` prefix
- Authentication: POST `/api/auth/register`, POST `/api/auth/login`, POST `/api/auth/logout`, GET `/api/auth/me`
- Appointments: POST/GET `/api/appointments` (authenticated)
- Enrollments: POST `/api/enrollments`, GET `/api/enrollments/user` (authenticated)
- Payments: POST `/api/create-checkout-session`, POST `/api/webhook/stripe` (Stripe integration)
- Admin endpoints under `/api/admin/` (admin-only):
  - GET `/api/admin/dashboard` - Statistics
  - GET `/api/admin/users`, PATCH `/api/admin/users/:id/role`, DELETE `/api/admin/users/:id`
  - GET `/api/admin/courses`, PATCH `/api/admin/courses/:id/publish`, PATCH `/api/admin/courses/:id/feature`
  - GET `/api/admin/appointments`, PATCH `/api/admin/appointments/:id/status`, PATCH `/api/admin/appointments/:id/video-link`
  - GET `/api/admin/enrollments`

**Storage Pattern**:
The application uses an interface-based storage abstraction (`IStorage`) implemented with `DbStorage` class that wraps Drizzle ORM operations. This abstraction keeps business logic independent of database implementation details.

**Database Integration**: PostgreSQL database accessed via Drizzle ORM with type-safe queries. All storage operations use the `IStorage` interface for consistency and maintainability.

### Database Schema

**Active Schema** (Drizzle ORM with PostgreSQL):

- **users table**: Platform user accounts
  - Fields: id (varchar/UUID), email (unique), fullName, passwordHash, role ('student' | 'admin' | 'therapist'), createdAt
  
- **appointments table**: Therapy session bookings
  - Fields: id (varchar/UUID), userId (foreign key), appointmentDate, appointmentTime, status ('pending' | 'confirmed' | 'completed' | 'cancelled'), notes, videoLink, createdAt
  
- **courses table**: Course catalog
  - Fields: id (varchar/UUID), title, description, price, duration, topics (array), isPublished, isFeatured, image, createdAt

- **enrollments table**: Course enrollment and payment tracking
  - Fields: id (varchar/UUID), userId (foreign key), courseId (foreign key), status ('pending' | 'active' | 'completed'), paymentStatus ('pending' | 'paid' | 'failed'), stripeSessionId, amount, createdAt

**Current State**: All tables actively used in production with Drizzle migrations managed via `npm run db:push`.

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
- `SESSION_SECRET`: Secret key for express-session
- `STRIPE_SECRET_KEY`: Stripe API key for payment processing
- `VITE_STRIPE_PUBLIC_KEY`: Stripe publishable key (frontend)
- `RESEND_API_KEY`: Resend API key for email notifications

### Validation and Type Safety

**Shared Schema Layer**:
- Zod schemas for runtime validation (user registration, appointments, enrollments)
- TypeScript types inferred from Drizzle schema definitions
- Shared types between client and server via `/shared/` directory

**Benefits**: Type safety across full stack, single source of truth for data models, automatic validation on API requests.

## Authentication System

**Implementation**:
- **JWT tokens** stored in httpOnly cookies for secure client-side authentication
- **Passport.js** with local strategy for credential validation
- **bcrypt** for password hashing (10 rounds)
- **express-session** for server-side session management
- **AuthContext** on frontend for global authentication state

**User Roles**:
- `student` (default): Can enroll in courses, book appointments, access student area
- `therapist`: Future role for therapy providers (planned feature)
- `admin`: Full platform access including admin panel

**Protected Routes**:
- Backend: Middleware (`authMiddleware`, `requireAdminMiddleware`) protects endpoints
- Frontend: AuthContext checks and redirects for protected pages

## Payment Integration

**Stripe Integration**:
- Checkout Sessions for secure payment processing
- Webhook handling for payment confirmation
- Automatic enrollment activation on successful payment
- Test mode and production mode support via environment variables

**Payment Flow**:
1. User selects course and clicks "Inscribirse"
2. System creates enrollment with status 'pending'
3. Stripe Checkout Session created with enrollment details
4. User completes payment on Stripe's secure page
5. Webhook receives payment confirmation
6. Enrollment status updated to 'active', payment marked as 'paid'
7. Welcome email sent to user

## Admin Panel

**Features**:
- **Dashboard**: Platform statistics (users, courses, appointments, revenue)
- **User Management**: View all users, change roles, delete users
- **Course Management** (API ready, UI simplified for MVP)
- **Appointment Management** (API ready, UI simplified for MVP)
- **Enrollment Management** (API ready, UI simplified for MVP)

**Security**:
- Backend: Chained middleware (authMiddlewareWithUser → requireAdminMiddleware)
- Frontend: Role-based access control with redirect for non-admins
- Admin cannot delete themselves
- All admin endpoints require authenticated admin user

**Routes**:
- `/admin` - Main dashboard with statistics
- `/admin/users` - User management interface

## Email Notifications

**Resend Integration**:
- Welcome emails on user registration
- Enrollment confirmation emails on successful payment
- Email templates with platform branding

**Templates**:
- User registration: Welcome message with getting started information
- Course enrollment: Confirmation with access details

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

### Database & Authentication
- **Drizzle ORM**: TypeScript ORM for PostgreSQL
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **drizzle-zod**: Generate Zod schemas from Drizzle tables
- **Passport.js**: Authentication middleware
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT token generation and validation

### Payment & Email
- **Stripe**: Payment processing (@stripe/stripe-js, stripe)
- **Resend**: Transactional email service

### Development Tools
- **Vite**: Build tool with fast HMR
- **TypeScript**: Type safety across codebase
- **esbuild**: Production bundler for server code
- **@replit/vite-plugin-***: Replit-specific development enhancements

### Notable Architectural Decisions

**SPA vs MPA**: Chose single-page application architecture with client-side routing for seamless navigation, critical for the therapeutic user experience where interruptions should be minimized.

**Storage abstraction**: Interface-based storage pattern (`IStorage`) separates business logic from database implementation. Allows for clean database changes without touching route handlers.

**Static course catalog**: Courses are defined in the database but articles/blog posts remain as TypeScript constants for easy content management. Admins can publish/unpublish courses via admin panel.

**JWT + Session hybrid**: Uses JWT tokens in httpOnly cookies combined with server-side sessions for robust authentication. Balances security (httpOnly cookies prevent XSS) with stateful session management.

**Role-based access**: Three-tier user system (student, therapist, admin) enables future expansion of therapist-specific features while maintaining clean access control for admin panel.

**External video conferencing**: Deliberately chose not to implement in-app video calls. Therapists use external tools (Google Meet, Zoom) and can add video links to confirmed appointments via admin panel.