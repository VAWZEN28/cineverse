# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## 🎬 Project Overview

Cineverse is a modern movie rating and discovery platform built with React 18, TypeScript, and Tailwind CSS. The application integrates with The Movie Database (TMDB) API for real movie data while maintaining local state for user preferences.

## ⚡ Essential Commands

### Development
```bash
npm run dev           # Start development server (port 8080)
npm run build         # Production build
npm run build:dev     # Development build
npm run preview       # Preview production build
npm run lint          # Run ESLint
```

### Common Development Tasks
```bash
# Run single component in isolation (check Storybook if added)
npm run dev -- --open   # Auto-open browser

# Type checking
npx tsc --noEmit        # Check types without building

# Clean install
rm -rf node_modules package-lock.json && npm install
```

## 🏗️ Architecture Overview

### Core Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system + Radix UI primitives
- **Routing**: React Router DOM (BrowserRouter)
- **State Management**: React Context (AuthContext) + localStorage
- **HTTP Client**: Fetch API with TMDB service wrapper
- **Data Fetching**: TanStack React Query

### Key Architectural Patterns

#### 1. Service Layer Architecture
The app uses a service layer pattern with clear separation:
- `tmdbService.ts`: External API integration (TMDB API)
- `movieService.ts`: Business logic layer that orchestrates TMDB data with local storage
- Local storage for user preferences (ratings, likes, bookmarks)

#### 2. Dual Data Strategy
- **Primary**: TMDB API for movie data (with fallback to local sample data)
- **Secondary**: localStorage for user interactions and preferences
- Graceful degradation when API is unavailable

#### 3. Component Structure
```
src/
├── components/           # Reusable components
│   ├── ui/              # Radix UI + custom styled components
│   ├── MovieCard.tsx    # Core movie display component
│   ├── MovieDetailsModal.tsx
│   └── ...
├── pages/               # Route components
├── contexts/            # React Context providers
├── lib/                 # Services and utilities
└── App.tsx             # Main app with providers
```

### State Management Strategy

#### JWT Authentication System
- **AuthContext**: Enhanced with JWT token management, role-based access control, and automatic token refresh
- **AuthService**: Handles login, registration, token validation, and refresh logic
- **Token Storage**: Secure token storage with automatic cleanup on logout
- **Role-Based Access Control**: Four user roles (Admin, Moderator, User, Guest) with granular permissions
- **Protected Routes**: Route-level authentication and authorization guards

#### Authentication Flow
1. **Login**: Validates credentials and receives JWT tokens (access + refresh)
2. **Token Management**: Automatic token refresh before expiration
3. **Authorization**: Role and permission-based access control
4. **Session Management**: Activity tracking and session timeout
5. **Security Monitoring**: Rate limiting, device fingerprinting, and security event logging

#### Movie Data Flow
1. **API Layer**: `tmdbService` handles all TMDB API calls with automatic JWT token attachment
2. **Business Layer**: `movieService` combines TMDB data with user preferences
3. **UI Layer**: Components consume processed data via async functions with role-based rendering
4. **Persistence**: User interactions stored in localStorage with specific keys:
   - `cineverse_access_token` / `cineverse_refresh_token`
   - `cineverse_user_ratings`
   - `cineverse_liked_movies` 
   - `cineverse_bookmarked_movies`

### Design System Integration

#### Tailwind Configuration
- Custom color system using HSL values in CSS variables
- Cinema-themed color palette (golden primary, rich purple secondary)
- Custom gradients and shadow definitions
- Component variants using `class-variance-authority`

#### Component Library
- Radix UI primitives for accessibility
- Custom styled components in `src/components/ui/`
- Consistent design tokens via CSS custom properties

## 🔧 Development Guidelines

### Authentication & Authorization
- **JWT Tokens**: All authenticated requests automatically include JWT tokens via API interceptors
- **Role Checks**: Use `useRoleCheck()` hook or `RoleBased` components for conditional rendering
- **Protected Routes**: Wrap routes with `ProtectedRoute`, `UserRoute`, `AdminRoute`, etc.
- **Permission System**: Check permissions using `hasPermission()` from AuthContext
- **Demo Credentials**: 
  - Admin: `admin@cineverse.com` / `password123`
  - Moderator: `mod@cineverse.com` / `password123` 
  - User: `user@example.com` / `password123`

### API Integration
- All TMDB API calls go through `tmdbService` with automatic JWT token attachment
- Use `apiClient` for authenticated requests to backend services
- Always implement fallback for API failures and authentication errors
- Use environment variables for API keys (currently hardcoded - needs improvement)
- TMDB API rate limiting considerations

### Security Best Practices
- **Rate Limiting**: Authentication attempts are rate-limited (5 attempts per 15 minutes)
- **Session Management**: User activity is tracked for automatic session timeout
- **Token Refresh**: Access tokens automatically refresh before expiration
- **Input Sanitization**: Use `sanitizeInput` utilities for user-generated content
- **Device Fingerprinting**: Additional security layer for suspicious activity detection

### TypeScript Patterns
- Interfaces defined for all data structures (`Movie`, `TMDBMovie`, `AuthUser`, etc.)
- Strict typing for service layer functions and authentication flows
- Config allows some flexibility (`noImplicitAny: false`, `strictNullChecks: false`)
- Role and permission enums for type safety

### Component Development
- Use Radix UI primitives as base
- Follow existing naming conventions for UI components
- Implement proper loading and error states
- Use role-based rendering with `RoleBased`, `AdminOnly`, `AuthenticatedOnly` components
- Maintain responsive design principles

### Styling Approach
- Utility-first with Tailwind
- Custom CSS properties for design tokens in `src/index.css`
- Component-specific styles via Tailwind classes
- Consistent use of design system colors and spacing
- Role badges and verification status indicators

### Local Storage Management
- Use `STORAGE_KEYS` constant for consistent key naming
- Implement proper error handling for localStorage operations
- JWT tokens stored securely with automatic cleanup
- User activity and security events logged locally
- Consider data migration strategies when updating storage schemas

## 🚨 Important Considerations

### TMDB API Integration
- API key is currently hardcoded (security concern)
- Implement proper environment variable management
- Handle rate limiting and error responses gracefully
- Image URLs require proper construction via service methods

### Performance Considerations
- Movie data fetching happens on component mount
- Consider implementing virtualization for large movie lists
- Optimize image loading with proper sizing

### Browser Compatibility
- Modern browser features used (localStorage, fetch)
- Vite dev server runs on port 8080 with IPv6 support
- CSS custom properties and modern CSS features

### Development Server Notes
- Server configured to bind to `::` (IPv6) on port 8080
- Hot reload enabled via Vite
- Path aliases configured (`@/` maps to `./src/`)