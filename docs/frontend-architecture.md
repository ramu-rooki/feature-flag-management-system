# Phase 7 - Frontend Architecture

## Component Hierarchy
The frontend uses a strictly typed component hierarchy based on Atomic Design principles.
- **Atoms**: `Button`, `Input`, `LoadingSpinner`, `ErrorMessage`
- **Molecules**: `Card`, `Modal`, `EmptyState`
- **Organisms**: `Table`, `DashboardLayout` (Navigation + Sidebar)
- **Templates**: Protected and Layout wrappers
- **Pages**: Top-level route components (`LoginPage`, `FeatureFlagsPage`, etc.)

## Routing Architecture
Routing is strictly managed through `react-router-dom` using nested routes and an advanced `ProtectedRoute` wrapper. 
1. **Public Routes**: `/login`, `/signup`
2. **Dashboard Layout Wrapper**: Handles the sidebar and global user state presentation.
3. **Role Guards**: 
   - `[Role.SUPER_ADMIN]`: `/super-admin/*`
   - `[Role.ORG_ADMIN]`: `/admin/*`
   - `[Role.END_USER]`: `/user`
   Unauthorized users are actively redirected to their proper homepage or login screen without exposing UI elements.

## State Management
- **Auth State**: Governed by `AuthContext`. It synchronizes React State with browser `localStorage` to persist the JWT and user information between page reloads.
- **Form/UI State**: Managed via standard React `useState`. Modals and inputs use strict controlled-component patterns.

## API Integration Guide
- **Client Base**: Centralized in `src/api/client.ts` (`axios`).
- **Authorization Injection**: An Axios request interceptor injects `Bearer <token>` on every outgoing request automatically.
- **Global Error Handling**: An Axios response interceptor monitors for `401 Unauthorized` responses. If a token expires or is rejected, it instantly cleans up `localStorage` and redirects the user to `/login`.

## Testing Scenarios

1. **Login & RBAC Test**: Log in using a `SUPER_ADMIN` account and verify routing restricts access to `/admin` or `/user`.
2. **Signup Flow**: Go to `/signup`, input details including an existing `organizationId`, and complete creation. Then login to verify.
3. **CRUD Organizations**: As a `SUPER_ADMIN`, click "Create Organization", verify submission, and see it populate in the list.
4. **CRUD Feature Flags**: As an `ORG_ADMIN`, create a flag. Validate it appears in the table. Toggle the status. Refresh the page to verify persistence.
5. **Feature Check**: As an `END_USER` or `ORG_ADMIN`, enter a valid and invalid feature key into the Feature Check form to ensure `Enabled` or `Disabled` correctly reports based on multi-tenant JWT context.
