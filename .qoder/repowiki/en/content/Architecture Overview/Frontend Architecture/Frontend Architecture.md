# Frontend Architecture

<cite>
**Referenced Files in This Document**
- [main.jsx](file://frontend/src/main.jsx)
- [App.jsx](file://frontend/src/App.jsx)
- [DashboardLayout.jsx](file://frontend/src/layouts/DashboardLayout.jsx)
- [AuthContext.jsx](file://frontend/src/context/AuthContext.jsx)
- [BudgetContext.jsx](file://frontend/src/context/BudgetContext.jsx)
- [ProtectedRoute.jsx](file://frontend/src/components/auth/ProtectedRoute.jsx)
- [AdminRoute.jsx](file://frontend/src/components/auth/AdminRoute.jsx)
- [useAuth.js](file://frontend/src/hooks/useAuth.js)
- [useForm.js](file://frontend/src/hooks/useForm.js)
- [useResponsive.js](file://frontend/src/hooks/useResponsive.js)
- [api.js](file://frontend/src/services/api.js)
- [storage.js](file://frontend/src/utils/storage.js)
- [index.js](file://frontend/src/constants/index.js)
- [Dashboard.jsx](file://frontend/src/pages/user/Dashboard.jsx)
- [AdminLayout.jsx](file://frontend/src/pages/admin/AdminLayout.jsx)
- [package.json](file://frontend/package.json)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)
10. [Appendices](#appendices)

## Introduction
This document describes the frontend architecture of the React-based digital banking dashboard. It covers the component-based structure, layout systems, state management with React Context and custom hooks, routing with protected and role-gated routes, the service layer for API communication, styling and responsive design, and performance optimization strategies. The goal is to help both technical and non-technical readers understand how the frontend is organized and how to extend or maintain it effectively.

## Project Structure
The frontend is organized around a clear separation of concerns:
- Entry point initializes providers and routing.
- Routing defines public, user dashboard, and admin routes with layout wrappers.
- Layouts provide shared UI scaffolding for user and admin areas.
- Pages implement domain-specific views.
- Components encapsulate reusable UI elements and route guards.
- Contexts manage global state for authentication and budgets.
- Hooks encapsulate cross-cutting concerns like forms, auth, and responsiveness.
- Services abstract API communication.
- Utilities centralize storage and constants.

```mermaid
graph TB
subgraph "Entry Point"
main["main.jsx"]
app["App.jsx"]
end
subgraph "Routing"
routes["Routes & Route Guards"]
protected["ProtectedRoute.jsx"]
adminr["AdminRoute.jsx"]
end
subgraph "Layouts"
dashLayout["DashboardLayout.jsx"]
dashPage["Dashboard.jsx"]
adminLayout["AdminLayout.jsx"]
end
subgraph "State Management"
authCtx["AuthContext.jsx"]
budgetCtx["BudgetContext.jsx"]
useAuth["useAuth.js"]
useResp["useResponsive.js"]
useForm["useForm.js"]
end
subgraph "Services"
api["api.js"]
storage["storage.js"]
constants["index.js"]
end
main --> app
app --> routes
routes --> protected
routes --> adminr
routes --> dashLayout
routes --> adminLayout
dashLayout --> dashPage
dashPage --> api
api --> storage
authCtx --> api
budgetCtx --> dashPage
useAuth --> storage
useResp --> dashLayout
useForm --> dashPage
```

**Diagram sources**
- [main.jsx:37-45](file://frontend/src/main.jsx#L37-L45)
- [App.jsx:83-167](file://frontend/src/App.jsx#L83-L167)
- [ProtectedRoute.jsx:27-36](file://frontend/src/components/auth/ProtectedRoute.jsx#L27-L36)
- [AdminRoute.jsx:12-21](file://frontend/src/components/auth/AdminRoute.jsx#L12-L21)
- [DashboardLayout.jsx:14-46](file://frontend/src/layouts/DashboardLayout.jsx#L14-L46)
- [Dashboard.jsx:58-311](file://frontend/src/pages/user/Dashboard.jsx#L58-L311)
- [AdminLayout.jsx:20-142](file://frontend/src/pages/admin/AdminLayout.jsx#L20-L142)
- [AuthContext.jsx:23-45](file://frontend/src/context/AuthContext.jsx#L23-L45)
- [BudgetContext.jsx:22-59](file://frontend/src/context/BudgetContext.jsx#L22-L59)
- [useAuth.js:22-62](file://frontend/src/hooks/useAuth.js#L22-L62)
- [useResponsive.js:25-112](file://frontend/src/hooks/useResponsive.js#L25-L112)
- [useForm.js:19-105](file://frontend/src/hooks/useForm.js#L19-L105)
- [api.js:19-72](file://frontend/src/services/api.js#L19-L72)
- [storage.js:81-99](file://frontend/src/utils/storage.js#L81-L99)
- [index.js:6-62](file://frontend/src/constants/index.js#L6-L62)

**Section sources**
- [main.jsx:10-45](file://frontend/src/main.jsx#L10-L45)
- [App.jsx:83-167](file://frontend/src/App.jsx#L83-L167)
- [DashboardLayout.jsx:14-46](file://frontend/src/layouts/DashboardLayout.jsx#L14-L46)
- [Dashboard.jsx:58-311](file://frontend/src/pages/user/Dashboard.jsx#L58-L311)
- [AdminLayout.jsx:20-142](file://frontend/src/pages/admin/AdminLayout.jsx#L20-L142)

## Core Components
- Entry point and providers: Initializes routing, global providers, and notifications.
- Routing and guards: Public routes, user dashboard routes, admin routes, and route guards.
- Layouts: Shared dashboard and admin scaffolds with responsive behavior.
- Contexts: Global auth and budget state.
- Hooks: Form handling, auth operations, and responsive utilities.
- Services: Centralized API client and storage utilities.
- Constants: Routes, endpoints, storage keys, and UI constants.

Key implementation references:
- Providers and routing bootstrap: [main.jsx:37-45](file://frontend/src/main.jsx#L37-L45)
- Route definitions and guards: [App.jsx:83-167](file://frontend/src/App.jsx#L83-L167)
- Protected route guard: [ProtectedRoute.jsx:27-36](file://frontend/src/components/auth/ProtectedRoute.jsx#L27-L36)
- Admin route guard: [AdminRoute.jsx:12-21](file://frontend/src/components/auth/AdminRoute.jsx#L12-L21)
- Dashboard layout: [DashboardLayout.jsx:14-46](file://frontend/src/layouts/DashboardLayout.jsx#L14-L46)
- Dashboard page: [Dashboard.jsx:58-311](file://frontend/src/pages/user/Dashboard.jsx#L58-L311)
- Admin layout: [AdminLayout.jsx:20-142](file://frontend/src/pages/admin/AdminLayout.jsx#L20-L142)
- Auth context: [AuthContext.jsx:23-45](file://frontend/src/context/AuthContext.jsx#L23-L45)
- Budget context: [BudgetContext.jsx:22-59](file://frontend/src/context/BudgetContext.jsx#L22-L59)
- Auth hook: [useAuth.js:22-62](file://frontend/src/hooks/useAuth.js#L22-L62)
- Responsive hook: [useResponsive.js:25-112](file://frontend/src/hooks/useResponsive.js#L25-L112)
- Form hook: [useForm.js:19-105](file://frontend/src/hooks/useForm.js#L19-L105)
- API service: [api.js:19-72](file://frontend/src/services/api.js#L19-L72)
- Storage utilities: [storage.js:81-99](file://frontend/src/utils/storage.js#L81-L99)
- Constants: [index.js:6-62](file://frontend/src/constants/index.js#L6-L62)

**Section sources**
- [main.jsx:10-45](file://frontend/src/main.jsx#L10-L45)
- [App.jsx:83-167](file://frontend/src/App.jsx#L83-L167)
- [ProtectedRoute.jsx:27-36](file://frontend/src/components/auth/ProtectedRoute.jsx#L27-L36)
- [AdminRoute.jsx:12-21](file://frontend/src/components/auth/AdminRoute.jsx#L12-L21)
- [DashboardLayout.jsx:14-46](file://frontend/src/layouts/DashboardLayout.jsx#L14-L46)
- [Dashboard.jsx:58-311](file://frontend/src/pages/user/Dashboard.jsx#L58-L311)
- [AdminLayout.jsx:20-142](file://frontend/src/pages/admin/AdminLayout.jsx#L20-L142)
- [AuthContext.jsx:23-45](file://frontend/src/context/AuthContext.jsx#L23-L45)
- [BudgetContext.jsx:22-59](file://frontend/src/context/BudgetContext.jsx#L22-L59)
- [useAuth.js:22-62](file://frontend/src/hooks/useAuth.js#L22-L62)
- [useResponsive.js:25-112](file://frontend/src/hooks/useResponsive.js#L25-L112)
- [useForm.js:19-105](file://frontend/src/hooks/useForm.js#L19-L105)
- [api.js:19-72](file://frontend/src/services/api.js#L19-L72)
- [storage.js:81-99](file://frontend/src/utils/storage.js#L81-L99)
- [index.js:6-62](file://frontend/src/constants/index.js#L6-L62)

## Architecture Overview
The frontend follows a layered architecture:
- Presentation layer: Pages and components.
- Routing and navigation: React Router with layout-based routing and guards.
- State management: React Context for auth and budgets, plus custom hooks for forms and responsiveness.
- Service layer: Axios-based API client with interceptors and centralized endpoints.
- Infrastructure: Firebase messaging initialization and service worker registration.

```mermaid
graph TB
ui["UI Layer<br/>Pages & Components"] --> routes["Routing & Guards<br/>ProtectedRoute, AdminRoute"]
routes --> layouts["Layouts<br/>DashboardLayout, AdminLayout"]
layouts --> state["State Management<br/>AuthContext, BudgetContext"]
state --> hooks["Custom Hooks<br/>useAuth, useForm, useResponsive"]
ui --> services["Service Layer<br/>api.js, storage.js"]
services --> backend["Backend API<br/>Axios Interceptor"]
ui --> external["External Integrations<br/>Firebase Messaging"]
```

**Diagram sources**
- [App.jsx:83-167](file://frontend/src/App.jsx#L83-L167)
- [ProtectedRoute.jsx:27-36](file://frontend/src/components/auth/ProtectedRoute.jsx#L27-L36)
- [AdminRoute.jsx:12-21](file://frontend/src/components/auth/AdminRoute.jsx#L12-L21)
- [DashboardLayout.jsx:14-46](file://frontend/src/layouts/DashboardLayout.jsx#L14-L46)
- [AdminLayout.jsx:20-142](file://frontend/src/pages/admin/AdminLayout.jsx#L20-L142)
- [AuthContext.jsx:23-45](file://frontend/src/context/AuthContext.jsx#L23-L45)
- [BudgetContext.jsx:22-59](file://frontend/src/context/BudgetContext.jsx#L22-L59)
- [useAuth.js:22-62](file://frontend/src/hooks/useAuth.js#L22-L62)
- [useForm.js:19-105](file://frontend/src/hooks/useForm.js#L19-L105)
- [useResponsive.js:25-112](file://frontend/src/hooks/useResponsive.js#L25-L112)
- [api.js:19-72](file://frontend/src/services/api.js#L19-L72)
- [storage.js:81-99](file://frontend/src/utils/storage.js#L81-L99)

## Detailed Component Analysis

### Routing and Navigation
- Public routes: Home, login, register, forgot password, reset password, OTP verification.
- User dashboard routes: Nested under a protected layout with sub-routes for accounts, transfers, transactions, budgets, bills, rewards, insights, alerts, settings.
- Admin routes: Protected under an admin layout with sub-routes for users, KYC, transactions, rewards, analytics, alerts, and settings.
- Route guards:
  - ProtectedRoute ensures authenticated, non-admin users can access dashboard routes.
  - AdminRoute ensures only admin users can access admin routes.

```mermaid
sequenceDiagram
participant Browser as "Browser"
participant Router as "React Router"
participant Guard as "ProtectedRoute"
participant Page as "Dashboard Page"
Browser->>Router : Navigate to "/dashboard"
Router->>Guard : Evaluate auth state
Guard->>Guard : Check token and user role
alt Authenticated and not admin
Guard-->>Router : Allow
Router-->>Page : Render Dashboard
else Not authenticated or admin
Guard-->>Router : Redirect to Login
end
```

**Diagram sources**
- [App.jsx:98-139](file://frontend/src/App.jsx#L98-L139)
- [ProtectedRoute.jsx:27-36](file://frontend/src/components/auth/ProtectedRoute.jsx#L27-L36)

**Section sources**
- [App.jsx:83-167](file://frontend/src/App.jsx#L83-L167)
- [ProtectedRoute.jsx:27-36](file://frontend/src/components/auth/ProtectedRoute.jsx#L27-L36)
- [AdminRoute.jsx:12-21](file://frontend/src/components/auth/AdminRoute.jsx#L12-L21)

### Layout Systems
- DashboardLayout: Provides a responsive container with Outlet for nested routes and uses the responsive hook for layout adjustments.
- Dashboard: Implements a collapsible sidebar with icons, active state highlighting, notifications badge, and profile menu. Handles logout and responsive behavior.
- AdminLayout: Mirrors the dashboard layout with admin-specific navigation items and responsive sidebar behavior.

```mermaid
flowchart TD
Start(["Render Layout"]) --> CheckMobile["Check screen size via useResponsive"]
CheckMobile --> IsMobile{"Mobile/Tablet?"}
IsMobile --> |Yes| ApplyMobileStyles["Apply mobile styles<br/>overlay, fixed button"]
IsMobile --> |No| ApplyDesktopStyles["Apply desktop styles<br/>hover-expand sidebar"]
ApplyMobileStyles --> RenderSidebar["Render sidebar with items"]
ApplyDesktopStyles --> RenderSidebar
RenderSidebar --> RenderMain["Render <Outlet/> content"]
RenderMain --> End(["Layout Ready"])
```

**Diagram sources**
- [DashboardLayout.jsx:14-46](file://frontend/src/layouts/DashboardLayout.jsx#L14-L46)
- [Dashboard.jsx:58-311](file://frontend/src/pages/user/Dashboard.jsx#L58-L311)
- [AdminLayout.jsx:20-142](file://frontend/src/pages/admin/AdminLayout.jsx#L20-L142)
- [useResponsive.js:25-112](file://frontend/src/hooks/useResponsive.js#L25-L112)

**Section sources**
- [DashboardLayout.jsx:14-46](file://frontend/src/layouts/DashboardLayout.jsx#L14-L46)
- [Dashboard.jsx:58-311](file://frontend/src/pages/user/Dashboard.jsx#L58-L311)
- [AdminLayout.jsx:20-142](file://frontend/src/pages/admin/AdminLayout.jsx#L20-L142)
- [useResponsive.js:25-112](file://frontend/src/hooks/useResponsive.js#L25-L112)

### State Management
- Authentication context: Holds user and access token, refreshes session on mount, and exposes provider/value.
- Budget context: Manages local budget data, provides budget checks, and applies payment impacts.
- Auth hook: Encapsulates login, logout, user update, and admin detection using storage utilities.
- Responsive hook: Computes viewport size, breakpoints, and responsive helpers.
- Form hook: Provides form state, validation, submission lifecycle, and reset utilities.

```mermaid
classDiagram
class AuthContext {
+auth : object
+setAuth(auth) void
+tryRefresh() Promise
}
class BudgetContext {
+budgets : array
+checkBudget(category, amount) object
+applyPaymentToBudget(category, amount) void
}
class useAuth {
+getCurrentUser() object
+isAuthenticated() boolean
+isAdmin() boolean
+login(userData, tokens) void
+logout() void
+updateUser(data) void
}
class useResponsive {
+screenSize : object
+breakpoints : object
+isMobile() : boolean
+isTablet() : boolean
+isDesktop() : boolean
+getResponsiveValue(...)
+getResponsivePadding(scale)
+getResponsiveFontSize(baseSize)
}
class useForm {
+values : object
+errors : object
+touched : object
+isSubmitting : boolean
+handleChange(e) void
+handleBlur(e) void
+handleSubmit(onSubmit) Promise
+reset() void
+setFieldValue(name, value) void
+setFieldError(name, error) void
}
AuthContext <.. useAuth : "consumes"
BudgetContext <.. Dashboard : "consumes"
useResponsive <.. DashboardLayout : "consumes"
useForm <.. Dashboard : "consumes"
```

**Diagram sources**
- [AuthContext.jsx:23-45](file://frontend/src/context/AuthContext.jsx#L23-L45)
- [BudgetContext.jsx:22-59](file://frontend/src/context/BudgetContext.jsx#L22-L59)
- [useAuth.js:22-62](file://frontend/src/hooks/useAuth.js#L22-L62)
- [useResponsive.js:25-112](file://frontend/src/hooks/useResponsive.js#L25-L112)
- [useForm.js:19-105](file://frontend/src/hooks/useForm.js#L19-L105)
- [Dashboard.jsx:58-311](file://frontend/src/pages/user/Dashboard.jsx#L58-L311)
- [DashboardLayout.jsx:14-46](file://frontend/src/layouts/DashboardLayout.jsx#L14-L46)

**Section sources**
- [AuthContext.jsx:23-45](file://frontend/src/context/AuthContext.jsx#L23-L45)
- [BudgetContext.jsx:22-59](file://frontend/src/context/BudgetContext.jsx#L22-L59)
- [useAuth.js:22-62](file://frontend/src/hooks/useAuth.js#L22-L62)
- [useResponsive.js:25-112](file://frontend/src/hooks/useResponsive.js#L25-L112)
- [useForm.js:19-105](file://frontend/src/hooks/useForm.js#L19-L105)

### Service Layer and Data Fetching
- API client: Creates Axios instance with base URL from environment, attaches Authorization header automatically, and exposes convenience methods for endpoints.
- Storage utilities: Centralized localStorage operations with safe error handling and typed getters/setters for auth data.
- Constants: Centralized routes, API endpoints, storage keys, and UI constants.

```mermaid
sequenceDiagram
participant Page as "Page Component"
participant Hook as "useAuth/useForm"
participant API as "api.js"
participant AX as "Axios Instance"
participant BE as "Backend API"
Page->>Hook : Call login/update/etc.
Hook->>API : Invoke endpoint method
API->>AX : request(method, endpoint, data)
AX->>BE : HTTP request with Authorization header
BE-->>AX : Response
AX-->>API : Response
API-->>Hook : Data or Error
Hook-->>Page : Update state
```

**Diagram sources**
- [api.js:19-72](file://frontend/src/services/api.js#L19-L72)
- [storage.js:81-99](file://frontend/src/utils/storage.js#L81-L99)
- [useAuth.js:22-62](file://frontend/src/hooks/useAuth.js#L22-L62)
- [useForm.js:60-75](file://frontend/src/hooks/useForm.js#L60-L75)

**Section sources**
- [api.js:19-72](file://frontend/src/services/api.js#L19-L72)
- [storage.js:81-99](file://frontend/src/utils/storage.js#L81-L99)
- [index.js:64-132](file://frontend/src/constants/index.js#L64-L132)

### Component Hierarchy and Reusability
- Common components: ResponsiveContainer-like behavior via useResponsive hook.
- User-specific components: Dashboard, Accounts, Transactions, Budgets, Bills, Rewards, Insights, Alerts, Settings.
- Admin-specific components: AdminDashboard, AdminUsers, AdminTransactions, AdminRewards, AdminAnalytics, AdminAlerts, AdminSettings.
- Specialized UI elements: Modals for bills, budgets, payments; charts for insights; quick actions; filters and search.

```mermaid
graph TB
common["Common<br/>useResponsive"] --> dashboard["Dashboard Page"]
common --> admin["AdminLayout"]
dashboard --> modals["Modals<br/>Add/Edit Budget, Bill, Payment"]
dashboard --> charts["Charts<br/>Insights, Spending"]
dashboard --> lists["Lists<br/>Transactions, Budgets"]
admin --> adminViews["Admin Views<br/>Users, Analytics, Alerts"]
```

**Diagram sources**
- [useResponsive.js:25-112](file://frontend/src/hooks/useResponsive.js#L25-L112)
- [Dashboard.jsx:58-311](file://frontend/src/pages/user/Dashboard.jsx#L58-L311)
- [AdminLayout.jsx:20-142](file://frontend/src/pages/admin/AdminLayout.jsx#L20-L142)

**Section sources**
- [Dashboard.jsx:58-311](file://frontend/src/pages/user/Dashboard.jsx#L58-L311)
- [AdminLayout.jsx:20-142](file://frontend/src/pages/admin/AdminLayout.jsx#L20-L142)
- [useResponsive.js:25-112](file://frontend/src/hooks/useResponsive.js#L25-L112)

## Dependency Analysis
- Dependencies: React, React Router, Axios, Lucide icons, Chart.js, Tailwind CSS, Vite.
- Internal dependencies:
  - App.jsx depends on route guards, layouts, and pages.
  - Layouts depend on responsive hook and constants.
  - Contexts depend on services and storage.
  - Hooks depend on storage and constants.

```mermaid
graph LR
react["react"] --- router["react-router-dom"]
axios["axios"] --- api["api.js"]
icons["lucide-react"] --- pages["Dashboard.jsx"]
chart["recharts"] --- insights["Insights Charts"]
tw["tailwindcss"] --- styles["Responsive Styles"]
vite["vite"] --- build["Build Pipeline"]
main["main.jsx"] --> router
main --> api
App["App.jsx"] --> Protected["ProtectedRoute.jsx"]
App --> Admin["AdminRoute.jsx"]
Dashboard["Dashboard.jsx"] --> api
AdminLayout["AdminLayout.jsx"] --> constants["index.js"]
```

**Diagram sources**
- [package.json:12-36](file://frontend/package.json#L12-L36)
- [main.jsx:37-45](file://frontend/src/main.jsx#L37-L45)
- [App.jsx:83-167](file://frontend/src/App.jsx#L83-L167)
- [Dashboard.jsx:58-311](file://frontend/src/pages/user/Dashboard.jsx#L58-L311)
- [AdminLayout.jsx:20-142](file://frontend/src/pages/admin/AdminLayout.jsx#L20-L142)
- [index.js:6-62](file://frontend/src/constants/index.js#L6-L62)

**Section sources**
- [package.json:12-36](file://frontend/package.json#L12-L36)
- [main.jsx:37-45](file://frontend/src/main.jsx#L37-L45)
- [App.jsx:83-167](file://frontend/src/App.jsx#L83-L167)

## Performance Considerations
- Lazy loading and code splitting:
  - Split routes by feature (e.g., user vs admin) and load heavy pages on demand.
  - Use dynamic imports for charts and modals to reduce initial bundle size.
- Rendering optimizations:
  - Memoize derived values and callbacks in contexts and hooks.
  - Use responsive hook to avoid unnecessary re-renders on resize.
- Network optimizations:
  - Centralize API requests and reuse interceptors.
  - Debounce or throttle frequent network calls (e.g., resize handlers).
- Bundle size:
  - Keep icons and chart libraries tree-shaken by importing only used components.
  - Prefer lightweight alternatives where appropriate.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
- Authentication issues:
  - Ensure tokens are persisted and refreshed; verify interceptor attaches Authorization header.
  - Confirm ProtectedRoute and AdminRoute checks align with stored user role.
- API failures:
  - Check base URL environment variable and endpoint constants.
  - Inspect request interceptor and error handling in the API client.
- Storage errors:
  - Validate localStorage operations and fallback behavior.
- Responsive layout problems:
  - Verify breakpoint thresholds and responsive hook usage.
- Build/runtime errors:
  - Review Vite configuration and plugin versions.

**Section sources**
- [AuthContext.jsx:23-45](file://frontend/src/context/AuthContext.jsx#L23-L45)
- [ProtectedRoute.jsx:27-36](file://frontend/src/components/auth/ProtectedRoute.jsx#L27-L36)
- [AdminRoute.jsx:12-21](file://frontend/src/components/auth/AdminRoute.jsx#L12-L21)
- [api.js:19-72](file://frontend/src/services/api.js#L19-L72)
- [storage.js:8-72](file://frontend/src/utils/storage.js#L8-L72)
- [useResponsive.js:25-112](file://frontend/src/hooks/useResponsive.js#L25-L112)
- [package.json:12-36](file://frontend/package.json#L12-L36)

## Conclusion
The frontend employs a clean, modular architecture with strong separation of concerns. Routing is layout-driven with robust guards, state is centralized via Context and custom hooks, and the service layer abstracts API communication. The responsive design and component composition enable scalable UI development. Following the outlined patterns and best practices will help maintain performance, readability, and extensibility.

[No sources needed since this section summarizes without analyzing specific files]

## Appendices
- Styling and responsive design:
  - Tailwind CSS is configured for utility-first styling.
  - Responsive utilities are exposed via the responsive hook and inline styles in layouts.
- External integrations:
  - Firebase messaging is initialized at startup with service worker registration.

**Section sources**
- [Dashboard.jsx:58-311](file://frontend/src/pages/user/Dashboard.jsx#L58-L311)
- [AdminLayout.jsx:20-142](file://frontend/src/pages/admin/AdminLayout.jsx#L20-L142)
- [main.jsx:16-34](file://frontend/src/main.jsx#L16-L34)
- [package.json:32-34](file://frontend/package.json#L32-L34)