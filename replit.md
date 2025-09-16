# Overview

This is a Hebrew RTL horse riding event management system built with Next.js and Supabase. The application allows public users to view published riding events and their results, while admins can sign in using magic links to publish/unpublish events. The system supports viewing event details, classes, and rider results with scoring and eligibility information.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Next.js App Router**: Modern React framework with server-side rendering capabilities
- **TypeScript**: Full type safety across the application
- **Tailwind CSS**: Utility-first CSS framework with RTL (right-to-left) language support for Hebrew
- **shadcn/ui Components**: Comprehensive UI component library built on Radix UI primitives
- **React Query**: Server state management for data fetching and caching

## Authentication & Authorization
- **Supabase Auth**: Magic link authentication system for admin users
- **Role-based Access Control**: User profiles table with admin/user role distinction
- **Route Protection**: AdminGuard component and server-side auth checks protect admin routes
- **Multiple Client Types**: 
  - Browser client for public operations
  - Server client with cookie-based auth for protected routes
  - Admin client with service role key for privileged operations

## Database Design (Supabase/PostgreSQL)
- **Events**: Core event entities with publish/draft status
- **Classes**: Event categories/divisions
- **Riders & Horses**: Participant entities
- **Pairs**: Rider-horse combinations
- **Results**: Competition results with scoring and eligibility
- **User Profiles**: Admin role management

## State Management
- **React Query**: Handles server state, caching, and mutations
- **React Hooks**: Local component state management
- **Optimistic Updates**: Immediate UI feedback with server synchronization

## Content Localization
- **Hebrew RTL Support**: Full right-to-left text direction
- **Date Formatting**: Hebrew locale date display
- **UI Text**: Hebrew language throughout the interface

## API Architecture
- **Next.js API Routes**: Server-side API endpoints for admin operations
- **Supabase Client APIs**: Direct database operations for public data
- **RESTful Design**: Standard HTTP methods for CRUD operations

# External Dependencies

## Core Infrastructure
- **Supabase**: Backend-as-a-Service providing PostgreSQL database, authentication, and real-time capabilities
- **Neon Database**: PostgreSQL hosting (via @neondatabase/serverless)

## UI & Styling
- **Radix UI**: Accessible component primitives for complex UI components
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Google Fonts**: Inter font family

## Development & Build Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundling
- **Drizzle ORM**: Type-safe database schema and migrations

## Authentication & Security
- **@supabase/ssr**: Server-side rendering support for Supabase
- **@supabase/auth-helpers**: Authentication utilities

## Data Management
- **React Hook Form**: Form validation and management
- **Zod**: Runtime type validation
- **date-fns**: Date manipulation utilities