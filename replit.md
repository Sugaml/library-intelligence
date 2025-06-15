# Overview

This is a full-stack library management system built for a university environment. The application serves both students and librarians with role-based access control and comprehensive book management features. It's designed as a modern web application using React for the frontend and Express.js for the backend, with PostgreSQL as the database layer.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety across the stack
- **API Pattern**: RESTful API with conventional HTTP methods
- **Middleware**: Custom logging and error handling middleware
- **Development**: Hot reloading with Vite integration in development mode

## Database Architecture
- **Database**: PostgreSQL (configured via Drizzle)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Centralized schema definition with Zod validation
- **Migrations**: Drizzle Kit for database schema management

# Key Components

## Authentication System
- Role-based access control (Student vs Librarian)
- Simple credential-based authentication (username/password)
- Client-side auth state management with localStorage persistence
- Protected routes with role-specific redirects

## Book Management
- Complete CRUD operations for book inventory
- Program-specific categorization (MBA, MBAIT, MBAFC, MBA GLM)
- Copy tracking (total vs available copies)
- Search and filtering capabilities
- Cover image support with fallback handling

## Library Operations
- Book borrowing and return system
- Due date tracking and renewal functionality
- Fine calculation and payment tracking
- Book request system for unavailable items
- QR code scanning interface for quick operations

## User Management
- Student registration and profile management
- Program-based user categorization
- Activity tracking and history
- Notification system for important updates

## Analytics Dashboard
- Library statistics and metrics
- Program-wise book distribution
- Borrowing patterns and trends
- Overdue tracking and fine management

# Data Flow

## Authentication Flow
1. User submits credentials via login form
2. Backend validates against user database
3. User object (without password) returned to client
4. Client stores auth state and redirects based on role
5. Protected routes check auth state before rendering

## Book Operations Flow
1. User searches/browses book catalog
2. Available books displayed with real-time copy counts
3. Borrow requests update inventory and create borrowed_books records
4. Due dates calculated and fine tracking initiated
5. Return operations update inventory and close borrow records

## Data Persistence
- All operations use Drizzle ORM for database interactions
- Centralized schema ensures type safety across frontend/backend
- Real-time updates via React Query invalidation
- Optimistic updates for better user experience

# External Dependencies

## Frontend Dependencies
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI primitive components
- **wouter**: Lightweight routing solution
- **date-fns**: Date manipulation and formatting
- **class-variance-authority**: Utility for conditional CSS classes
- **tailwindcss**: Utility-first CSS framework

## Backend Dependencies
- **drizzle-orm**: Type-safe ORM for PostgreSQL
- **@neondatabase/serverless**: PostgreSQL driver for serverless environments
- **express**: Web application framework
- **connect-pg-simple**: PostgreSQL session store
- **zod**: Runtime type validation

## Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Static type checking
- **esbuild**: Fast JavaScript bundler for production
- **tsx**: TypeScript execution engine for development

# Deployment Strategy

## Build Process
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations ensure schema consistency

## Environment Configuration
- Development: Hot reloading with Vite middleware integration
- Production: Optimized builds with static asset serving
- Database: PostgreSQL connection via DATABASE_URL environment variable

## Replit Integration
- Configured for Replit's autoscale deployment target
- Port 5000 mapped to external port 80
- Workflows defined for development and production modes
- PostgreSQL module enabled for database provisioning

# Changelog

```
Changelog:
- June 15, 2025. Initial setup
```

# User Preferences

```
Preferred communication style: Simple, everyday language.
```