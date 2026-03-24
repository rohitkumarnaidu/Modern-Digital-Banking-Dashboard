# Architecture Overview

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [backend/app/main.py](file://backend/app/main.py)
- [backend/app/config.py](file://backend/app/config.py)
- [backend/app/database.py](file://backend/app/database.py)
- [backend/app/auth/router.py](file://backend/app/auth/router.py)
- [backend/app/auth/service.py](file://backend/app/auth/service.py)
- [backend/app/accounts/service.py](file://backend/app/accounts/service.py)
- [backend/app/transactions/service.py](file://backend/app/transactions/service.py)
- [backend/app/firebase/firebase.py](file://backend/app/firebase/firebase.py)
- [frontend/src/App.jsx](file://frontend/src/App.jsx)
- [frontend/src/services/api.js](file://frontend/src/services/api.js)
- [frontend/src/constants/index.js](file://frontend/src/constants/index.js)
- [frontend/src/context/AuthContext.jsx](file://frontend/src/context/AuthContext.jsx)
- [frontend/src/utils/storage.js](file://frontend/src/utils/storage.js)
- [frontend/vite.config.js](file://frontend/vite.config.js)
- [backend/alembic.ini](file://backend/alembic.ini)
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
This document presents the architecture of the Modern Digital Banking Dashboard, a full-stack banking application with a React frontend and a FastAPI backend. The system integrates user authentication, account and transaction management, budgeting, bill payments, rewards, financial insights, alerts, and push notifications. It follows a layered architecture with clear separation of concerns across frontend routing, API orchestration, business logic services, and persistent data storage. Cross-cutting concerns include security (JWT, OTP, PIN verification), observability, and operational scalability.

## Project Structure
The repository is organized into two primary directories:
- frontend: React application with Vite, routing, context providers, and API service layer
- backend: FastAPI application with routers, services, models, utilities, and Alembic migrations

```mermaid
graph TB
subgraph "Frontend (React)"
FE_App["App.jsx"]
FE_Routes["Routes & Layouts"]
FE_Context["AuthContext.jsx"]
FE_API["services/api.js"]
FE_Constants["constants/index.js"]
FE_Utils["utils/storage.js"]
FE_Vite["vite.config.js"]
end
subgraph "Backend (FastAPI)"
BE_Main["app/main.py"]
BE_Config["app/config.py"]
BE_DB["app/database.py"]
BE_Auth_Router["app/auth/router.py"]
BE_Auth_Service["app/auth/service.py"]
BE_Accounts_Service["app/accounts/service.py"]
BE_Transactions_Service["app/transactions/service.py"]
BE_Firebase["app/firebase/firebase.py"]
BE_Alembic["alembic.ini"]
end
FE_Routes --> FE_API
FE_Context --> FE_API
FE_API --> BE_Main
FE_Constants --> FE_API
FE_Utils --> FE_API
FE_Vite --> FE_Routes
BE_Main --> BE_Auth_Router
BE_Main --> BE_Accounts_Service
BE_Main --> BE_Transactions_Service
BE_Main --> BE_DB
BE_Config --> BE_DB
BE_DB --> BE_Alembic
BE_Auth_Router --> BE_Auth_Service
BE_Auth_Service --> BE_Firebase
```

**Diagram sources**
- [frontend/src/App.jsx:78-168](file://frontend/src/App.jsx#L78-L168)
- [frontend/src/services/api.js:19-31](file://frontend/src/services/api.js#L19-L31)
- [frontend/src/constants/index.js:64-132](file://frontend/src/constants/index.js#L64-L132)
- [frontend/src/context/AuthContext.jsx:23-46](file://frontend/src/context/AuthContext.jsx#L23-L46)
- [frontend/src/utils/storage.js:81-92](file://frontend/src/utils/storage.js#L81-L92)
- [frontend/vite.config.js:22-29](file://frontend/vite.config.js#L22-L29)
- [backend/app/main.py:56-89](file://backend/app/main.py#L56-L89)
- [backend/app/config.py:57-72](file://backend/app/config.py#L57-L72)
- [backend/app/database.py:29-50](file://backend/app/database.py#L29-L50)
- [backend/app/auth/router.py:21-26](file://backend/app/auth/router.py#L21-L26)
- [backend/app/auth/service.py:43-54](file://backend/app/auth/service.py#L43-L54)
- [backend/app/accounts/service.py:55-75](file://backend/app/accounts/service.py#L55-L75)
- [backend/app/transactions/service.py:105-149](file://backend/app/transactions/service.py#L105-L149)
- [backend/app/firebase/firebase.py:7-17](file://backend/app/firebase/firebase.py#L7-L17)
- [backend/alembic.ini:1-37](file://backend/alembic.ini#L1-L37)

**Section sources**
- [README.md:24-73](file://README.md#L24-L73)
- [backend/app/main.py:56-89](file://backend/app/main.py#L56-L89)
- [frontend/src/App.jsx:78-168](file://frontend/src/App.jsx#L78-L168)

## Core Components
- Frontend
  - Routing and layout: centralized in the main application component with protected and admin routes
  - API service: Axios-based client with automatic bearer token injection
  - Context: global authentication state management
  - Utilities: storage abstraction for tokens and user data
  - Constants: route and endpoint definitions
- Backend
  - Application entry: FastAPI app registration and CORS configuration
  - Configuration: environment-driven settings for database and JWT
  - Database: SQLAlchemy engine/session and declarative base
  - Authentication: login, registration, OTP, and token issuance
  - Services: business logic for accounts, transactions, and related workflows
  - Integrations: Firebase for push notifications

**Section sources**
- [frontend/src/App.jsx:78-168](file://frontend/src/App.jsx#L78-L168)
- [frontend/src/services/api.js:19-31](file://frontend/src/services/api.js#L19-L31)
- [frontend/src/context/AuthContext.jsx:23-46](file://frontend/src/context/AuthContext.jsx#L23-L46)
- [frontend/src/utils/storage.js:81-92](file://frontend/src/utils/storage.js#L81-L92)
- [frontend/src/constants/index.js:64-132](file://frontend/src/constants/index.js#L64-L132)
- [backend/app/main.py:56-89](file://backend/app/main.py#L56-L89)
- [backend/app/config.py:57-72](file://backend/app/config.py#L57-L72)
- [backend/app/database.py:29-50](file://backend/app/database.py#L29-L50)
- [backend/app/auth/router.py:21-26](file://backend/app/auth/router.py#L21-L26)
- [backend/app/auth/service.py:43-54](file://backend/app/auth/service.py#L43-L54)
- [backend/app/accounts/service.py:55-75](file://backend/app/accounts/service.py#L55-L75)
- [backend/app/transactions/service.py:105-149](file://backend/app/transactions/service.py#L105-L149)
- [backend/app/firebase/firebase.py:7-17](file://backend/app/firebase/firebase.py#L7-L17)

## Architecture Overview
The system follows a classic layered architecture:
- Presentation Layer (React): handles UI, routing, state, and API communication
- API Gateway/Entry (FastAPI): central endpoint registration, middleware, and CORS
- Domain Services (FastAPI): business logic encapsulated per domain (accounts, transactions, auth)
- Persistence (PostgreSQL): data stored with SQLAlchemy ORM and managed via Alembic migrations
- Integrations: Firebase for push notifications; SMTP for OTP emails

```mermaid
graph TB
Client["Browser"]
Router["React Router (App.jsx)"]
API["Axios Client (services/api.js)"]
FastAPI["FastAPI App (main.py)"]
CORS["CORS Middleware"]
AuthRouter["Auth Router (/auth/*)"]
AccountsSvc["Accounts Service"]
TxnSvc["Transactions Service"]
DB["SQLAlchemy Engine/Session"]
PG["PostgreSQL"]
Firebase["Firebase Admin SDK"]
Client --> Router
Router --> API
API --> FastAPI
FastAPI --> CORS
FastAPI --> AuthRouter
FastAPI --> AccountsSvc
FastAPI --> TxnSvc
AccountsSvc --> DB
TxnSvc --> DB
DB --> PG
AuthRouter --> Firebase
```

**Diagram sources**
- [frontend/src/App.jsx:78-168](file://frontend/src/App.jsx#L78-L168)
- [frontend/src/services/api.js:19-31](file://frontend/src/services/api.js#L19-L31)
- [backend/app/main.py:56-89](file://backend/app/main.py#L56-L89)
- [backend/app/auth/router.py:21-26](file://backend/app/auth/router.py#L21-L26)
- [backend/app/accounts/service.py:55-75](file://backend/app/accounts/service.py#L55-L75)
- [backend/app/transactions/service.py:105-149](file://backend/app/transactions/service.py#L105-L149)
- [backend/app/database.py:29-50](file://backend/app/database.py#L29-L50)
- [backend/app/firebase/firebase.py:7-17](file://backend/app/firebase/firebase.py#L7-L17)

## Detailed Component Analysis

### Authentication Flow
The authentication flow supports cookie-based login, OTP verification, and JWT issuance. The frontend stores tokens and attaches Authorization headers automatically.

```mermaid
sequenceDiagram
participant Browser as "Browser"
participant Router as "React Router (App.jsx)"
participant API as "Axios Client (services/api.js)"
participant AuthRouter as "Auth Router (auth/router.py)"
participant AuthService as "Auth Service (auth/service.py)"
participant DB as "Database (database.py)"
participant Firebase as "Firebase (firebase.py)"
Browser->>Router : Navigate to Login
Router->>API : POST /auth/login/cookie
API->>AuthRouter : HTTP request
AuthRouter->>AuthService : authenticate_user(identifier, password)
AuthService->>DB : Query user & verify password
DB-->>AuthService : User or None
AuthService->>AuthService : Optional OTP send (2FA)
alt OTP required
AuthService-->>AuthRouter : {otp_required, user_id}
AuthRouter-->>API : {otp_required, user_id}
API-->>Browser : Prompt OTP
Browser->>API : POST /auth/verify-otp
API->>AuthRouter : Verify OTP
AuthRouter->>AuthService : Issue tokens
AuthService->>Firebase : Notify login (optional)
Firebase-->>AuthService : Sent
AuthService-->>AuthRouter : Tokens + User
else No OTP
AuthService-->>AuthRouter : User
AuthRouter-->>API : {access_token, user}
end
API-->>Browser : Store tokens & redirect
```

**Diagram sources**
- [frontend/src/App.jsx:78-168](file://frontend/src/App.jsx#L78-L168)
- [frontend/src/services/api.js:19-31](file://frontend/src/services/api.js#L19-L31)
- [backend/app/auth/router.py:104-139](file://backend/app/auth/router.py#L104-L139)
- [backend/app/auth/service.py:205-224](file://backend/app/auth/service.py#L205-L224)
- [backend/app/database.py:45-50](file://backend/app/database.py#L45-L50)
- [backend/app/firebase/firebase.py:20-28](file://backend/app/firebase/firebase.py#L20-L28)

**Section sources**
- [backend/app/auth/router.py:104-139](file://backend/app/auth/router.py#L104-L139)
- [backend/app/auth/service.py:205-224](file://backend/app/auth/service.py#L205-L224)
- [frontend/src/services/api.js:19-31](file://frontend/src/services/api.js#L19-L31)
- [frontend/src/context/AuthContext.jsx:26-42](file://frontend/src/context/AuthContext.jsx#L26-L42)

### API Communication Protocol
- Base URL: configured in the frontend and proxied during development
- Token handling: Authorization header with Bearer token injected by the Axios interceptor
- Endpoint definitions: centralized constants for routes and API endpoints
- CORS: configured in the backend with environment override

```mermaid
flowchart TD
Start(["Frontend Action"]) --> BuildReq["Build Request<br/>headers + params"]
BuildReq --> Interceptor["Attach Auth Header<br/>Authorization: Bearer"]
Interceptor --> ProxyDev{"Development?<br/>vite.config proxy"}
ProxyDev --> |Yes| Proxy["Proxy to Render Host"]
ProxyDev --> |No| Direct["Call VITE_API_BASE_URL"]
Proxy --> Send["HTTP Request"]
Direct --> Send
Send --> FastAPI["FastAPI Router"]
FastAPI --> Service["Domain Service"]
Service --> DB["SQLAlchemy Session"]
DB --> Resp["Response"]
Resp --> End(["Update UI State"])
```

**Diagram sources**
- [frontend/vite.config.js:22-29](file://frontend/vite.config.js#L22-L29)
- [frontend/src/services/api.js:19-31](file://frontend/src/services/api.js#L19-L31)
- [frontend/src/constants/index.js:64-132](file://frontend/src/constants/index.js#L64-L132)
- [backend/app/main.py:91-109](file://backend/app/main.py#L91-L109)

**Section sources**
- [frontend/vite.config.js:22-29](file://frontend/vite.config.js#L22-L29)
- [frontend/src/services/api.js:19-31](file://frontend/src/services/api.js#L19-L31)
- [frontend/src/constants/index.js:64-132](file://frontend/src/constants/index.js#L64-L132)
- [backend/app/main.py:91-109](file://backend/app/main.py#L91-L109)

### Data Flow: Account Creation and PIN Verification
The accounts service enforces uniqueness by last digits, masks PAN-like numbers, and requires PIN verification for sensitive operations.

```mermaid
flowchart TD
A["User Input (Add Account)"] --> B["Accounts Service (create_account)"]
B --> C{"Existing Active Account<br/>by last 4 digits?"}
C --> |Yes| E["HTTP 400: Already Added"]
C --> |No| D["Create Account Record<br/>Mask PAN, Hash PIN"]
D --> F["Commit & Refresh"]
F --> G["Return Account"]
E --> H(["Show Error"])
G --> H
```

**Diagram sources**
- [backend/app/accounts/service.py:55-75](file://backend/app/accounts/service.py#L55-L75)

**Section sources**
- [backend/app/accounts/service.py:55-75](file://backend/app/accounts/service.py#L55-L75)

### Data Flow: Transaction Processing and Budget Validation
The transactions service validates budgets, updates balances, and notifies users based on settings.

```mermaid
flowchart TD
T0["Transaction Request"] --> T1["Load User Account"]
T1 --> T2{"Debit?"}
T2 --> |Yes| T3["Detect Category"]
T3 --> T4["Fetch Active Budget (Month/Year)"]
T4 --> T5{"Limit Exceeded?"}
T5 --> |Yes| TErr["HTTP 400: Budget Exceeded"]
T5 --> |No| T6["Create Transaction Record"]
T2 --> |No| T6
T6 --> T7["Update Account Balance"]
T7 --> T8{"Debit?"}
T8 --> |Yes| T9["Increment Budget Spent"]
T8 --> |No| T10["Skip Budget Update"]
T9 --> T11["Check User Settings for Alerts"]
T10 --> T11
T11 --> T12["Notify (Email/Push) if Enabled"]
T12 --> T13["Commit & Return Transaction"]
TErr --> TEnd(["Show Error"])
T13 --> TEnd
```

**Diagram sources**
- [backend/app/transactions/service.py:105-149](file://backend/app/transactions/service.py#L105-L149)

**Section sources**
- [backend/app/transactions/service.py:105-149](file://backend/app/transactions/service.py#L105-L149)

### State Management Across the Full-Stack Application
- Frontend state: React Context manages user and access token; local storage persists tokens and user data
- Backend state: FastAPI app lifecycle initializes integrations; database sessions scoped per request
- Token lifecycle: Access tokens are short-lived; refresh token handling occurs via a dedicated endpoint

```mermaid
stateDiagram-v2
[*] --> Unauthenticated
Unauthenticated --> Authenticating : "Login"
Authenticating --> OTPRequired : "2FA enabled"
OTPRequired --> Authenticated : "OTP Verified"
Authenticated --> UsingApp : "Access Token Valid"
UsingApp --> Refreshing : "Access Token Expired"
Refreshing --> Authenticated : "New Access Token"
UsingApp --> Logout : "Logout"
Authenticated --> Logout : "Logout"
Logout --> Unauthenticated : "Tokens Cleared"
```

**Diagram sources**
- [frontend/src/context/AuthContext.jsx:26-42](file://frontend/src/context/AuthContext.jsx#L26-L42)
- [frontend/src/utils/storage.js:94-99](file://frontend/src/utils/storage.js#L94-L99)
- [backend/app/auth/router.py:122-139](file://backend/app/auth/router.py#L122-L139)

**Section sources**
- [frontend/src/context/AuthContext.jsx:26-42](file://frontend/src/context/AuthContext.jsx#L26-L42)
- [frontend/src/utils/storage.js:94-99](file://frontend/src/utils/storage.js#L94-L99)
- [backend/app/auth/router.py:122-139](file://backend/app/auth/router.py#L122-L139)

### Component Interactions
- Routing and guards: ProtectedRoute and AdminRoute wrap page components
- API layer: services/api.js centralizes HTTP calls and interceptors
- Context: AuthContext coordinates token refresh and exposes user state
- Constants: centralized route and endpoint definitions

```mermaid
classDiagram
class App {
+routes
+layout
}
class ProtectedRoute {
+guards
}
class AdminRoute {
+guards
}
class AuthContext {
+authState
+tryRefresh()
}
class APIService {
+axiosInstance
+interceptors
}
class StorageUtils {
+get/set/clear
}
App --> ProtectedRoute : "wraps"
App --> AdminRoute : "wraps"
ProtectedRoute --> AuthContext : "reads"
AdminRoute --> AuthContext : "reads"
AuthContext --> APIService : "uses"
APIService --> StorageUtils : "reads/writes tokens"
```

**Diagram sources**
- [frontend/src/App.jsx:78-168](file://frontend/src/App.jsx#L78-L168)
- [frontend/src/context/AuthContext.jsx:23-46](file://frontend/src/context/AuthContext.jsx#L23-L46)
- [frontend/src/services/api.js:19-31](file://frontend/src/services/api.js#L19-L31)
- [frontend/src/utils/storage.js:81-92](file://frontend/src/utils/storage.js#L81-L92)

**Section sources**
- [frontend/src/App.jsx:78-168](file://frontend/src/App.jsx#L78-L168)
- [frontend/src/context/AuthContext.jsx:23-46](file://frontend/src/context/AuthContext.jsx#L23-L46)
- [frontend/src/services/api.js:19-31](file://frontend/src/services/api.js#L19-L31)
- [frontend/src/utils/storage.js:81-92](file://frontend/src/utils/storage.js#L81-L92)

## Dependency Analysis
- Frontend depends on:
  - React Router for navigation
  - Axios for HTTP requests
  - Local storage for persistence
  - Firebase for push notifications (configured in the app)
- Backend depends on:
  - FastAPI for routing and ASGI server
  - SQLAlchemy for ORM and sessions
  - Pydantic settings for environment configuration
  - Alembic for migrations
  - Firebase Admin SDK for push notifications

```mermaid
graph LR
FE_Router["React Router"] --> FE_API["Axios"]
FE_API --> BE_Main["FastAPI main.py"]
BE_Main --> BE_Routers["Routers"]
BE_Routers --> BE_Services["Services"]
BE_Services --> BE_DB["SQLAlchemy"]
BE_DB --> BE_PG["PostgreSQL"]
BE_Services --> BE_Firebase["Firebase Admin"]
BE_Config["Settings"] --> BE_DB
```

**Diagram sources**
- [frontend/src/App.jsx:78-168](file://frontend/src/App.jsx#L78-L168)
- [frontend/src/services/api.js:19-31](file://frontend/src/services/api.js#L19-L31)
- [backend/app/main.py:56-89](file://backend/app/main.py#L56-L89)
- [backend/app/database.py:29-50](file://backend/app/database.py#L29-L50)
- [backend/app/config.py:57-72](file://backend/app/config.py#L57-L72)
- [backend/app/firebase/firebase.py:7-17](file://backend/app/firebase/firebase.py#L7-L17)

**Section sources**
- [backend/app/main.py:56-89](file://backend/app/main.py#L56-L89)
- [backend/app/database.py:29-50](file://backend/app/database.py#L29-L50)
- [backend/app/config.py:57-72](file://backend/app/config.py#L57-L72)
- [backend/alembic.ini:1-37](file://backend/alembic.ini#L1-L37)

## Performance Considerations
- Database pooling and pre-ping: configured in the database layer to improve connection reliability
- Request-scoped sessions: ensures proper resource cleanup and isolation
- Lightweight interceptors: minimal overhead for token injection
- Environment-driven CORS: flexible origins configuration for production deployments
- Recommendations:
  - Enable connection pooling and monitor pool exhaustion
  - Use pagination for large datasets (transactions, admin analytics)
  - Cache non-sensitive data (e.g., static lists) on the frontend
  - Offload heavy computations to background tasks if needed

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
- Authentication failures:
  - Verify environment variables for JWT secrets and database URL
  - Confirm OTP delivery via SMTP and Firebase credentials
- CORS errors:
  - Ensure allowed origins include frontend host and Vercel domains
- Database connectivity:
  - Check DATABASE_URL and network access to the hosted PostgreSQL instance
- Token issues:
  - Confirm token storage keys and interceptor usage
  - Validate token expiration and refresh flow

**Section sources**
- [backend/app/config.py:57-72](file://backend/app/config.py#L57-L72)
- [backend/app/auth/router.py:24-31](file://backend/app/auth/router.py#L24-L31)
- [backend/app/database.py:29-50](file://backend/app/database.py#L29-L50)
- [frontend/src/utils/storage.js:81-92](file://frontend/src/utils/storage.js#L81-L92)
- [frontend/src/services/api.js:19-31](file://frontend/src/services/api.js#L19-L31)

## Conclusion
The Modern Digital Banking Dashboard employs a clean separation of concerns with a React frontend and a FastAPI backend. The architecture emphasizes security (JWT, OTP, PIN verification), maintainability (layered services, centralized configuration), and scalability (SQLAlchemy, Alembic, and cloud-hosted PostgreSQL). With robust authentication, state management, and integration points, the system provides a solid foundation for further enhancements and production deployment.

[No sources needed since this section summarizes without analyzing specific files]

## Appendices

### System Boundaries and Integration Points
- Internal boundaries:
  - Frontend: UI, routing, context, and API layer
  - Backend: routers, services, models, and utilities
- External integrations:
  - PostgreSQL (Neon cloud)
  - Firebase Admin SDK (push notifications)
  - SMTP (OTP delivery)

**Section sources**
- [README.md:112-141](file://README.md#L112-L141)
- [backend/app/firebase/firebase.py:7-17](file://backend/app/firebase/firebase.py#L7-L17)
- [backend/app/config.py:57-72](file://backend/app/config.py#L57-L72)

### Infrastructure Requirements and Deployment Topology
- Frontend: Vercel deployment with SPA routing support
- Backend: Render hosting with PostgreSQL on Neon cloud
- Environment variables: database credentials, JWT secrets, SMTP, and Firebase credentials

**Section sources**
- [README.md:317-333](file://README.md#L317-L333)
- [README.md:278-314](file://README.md#L278-L314)