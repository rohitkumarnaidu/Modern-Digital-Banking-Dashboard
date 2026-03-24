# Backend Architecture

<cite>
**Referenced Files in This Document**
- [backend/README.md](file://backend/README.md)
- [backend/app/main.py](file://backend/app/main.py)
- [backend/app/config.py](file://backend/app/config.py)
- [backend/app/database.py](file://backend/app/database.py)
- [backend/app/dependencies.py](file://backend/app/dependencies.py)
- [backend/app/routers/auth.py](file://backend/app/routers/auth.py)
- [backend/app/auth/router.py](file://backend/app/auth/router.py)
- [backend/app/accounts/router.py](file://backend/app/accounts/router.py)
- [backend/app/accounts/service.py](file://backend/app/accounts/service.py)
- [backend/app/models/account.py](file://backend/app/models/account.py)
- [backend/app/models/user.py](file://backend/app/models/user.py)
- [backend/app/utils/jwt.py](file://backend/app/utils/jwt.py)
- [backend/app/utils/hash_password.py](file://backend/app/utils/hash_password.py)
- [backend/app/services/auth_service.py](file://backend/app/services/auth_service.py)
- [backend/alembic/env.py](file://backend/alembic/env.py)
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

## Introduction
This document describes the backend architecture of a FastAPI-based banking system. It explains the layered architecture separating presentation (routers), business logic (services), and data access (models), documents the MVC-like flow, dependency injection system, modular router organization, database abstraction via SQLAlchemy ORM, session management, transaction handling, and configuration management. It also covers authentication services, account management, transaction processing, administrative functions, error handling, logging, and middleware integration.

## Project Structure
The backend follows a modular FastAPI structure:
- Entry point initializes the application, registers routers, sets CORS, and performs startup tasks.
- Configuration centralizes environment variables and settings.
- Database module defines the engine, session factory, and dependency provider.
- Shared dependencies define reusable authentication and authorization helpers.
- Feature modules (auth, accounts, transactions, etc.) organize routers, services, schemas, and models.
- Alembic manages database migrations.

```mermaid
graph TB
subgraph "Entry Point"
MAIN["app/main.py"]
end
subgraph "Configuration"
CFG["app/config.py"]
end
subgraph "Database"
DBMOD["app/database.py"]
ALEMBIC["alembic/env.py"]
end
subgraph "Security & Auth"
DEPS["app/dependencies.py"]
JWTUTIL["app/utils/jwt.py"]
HASHUTIL["app/utils/hash_password.py"]
end
subgraph "Features"
AUTHR["app/routers/auth.py"]
AUTHROUTER["app/auth/router.py"]
ACCROUTER["app/accounts/router.py"]
ACCSERVICE["app/accounts/service.py"]
MODELS["app/models/*.py"]
end
MAIN --> AUTHR
MAIN --> AUTHROUTER
MAIN --> ACCROUTER
MAIN --> DEPS
MAIN --> DBMOD
MAIN --> CFG
AUTHR --> JWTUTIL
AUTHR --> HASHUTIL
AUTHROUTER --> JWTUTIL
ACCROUTER --> ACCSERVICE
ACCSERVICE --> MODELS
DBMOD --> MODELS
ALEMBIC --> DBMOD
CFG --> DBMOD
CFG --> JWTUTIL
```

**Diagram sources**
- [backend/app/main.py:56-85](file://backend/app/main.py#L56-L85)
- [backend/app/config.py:57-72](file://backend/app/config.py#L57-L72)
- [backend/app/database.py:24-51](file://backend/app/database.py#L24-L51)
- [backend/app/dependencies.py:14-69](file://backend/app/dependencies.py#L14-L69)
- [backend/app/routers/auth.py:16-315](file://backend/app/routers/auth.py#L16-L315)
- [backend/app/auth/router.py:21-180](file://backend/app/auth/router.py#L21-L180)
- [backend/app/accounts/router.py:36-109](file://backend/app/accounts/router.py#L36-L109)
- [backend/app/accounts/service.py:55-111](file://backend/app/accounts/service.py#L55-L111)
- [backend/alembic/env.py:40-58](file://backend/alembic/env.py#L40-L58)

**Section sources**
- [backend/README.md:27-44](file://backend/README.md#L27-L44)
- [backend/app/main.py:56-85](file://backend/app/main.py#L56-L85)

## Core Components
- Application entry point: Initializes FastAPI, registers routers, sets CORS, and runs startup tasks.
- Configuration: Centralized settings loaded from environment variables with safe defaults.
- Database: Engine and session factory with dependency provider for route handlers.
- Shared dependencies: OAuth2 bearer scheme, token decoding, and current user/admin resolution.
- Feature routers: Modular API endpoints under feature-specific namespaces.
- Services: Encapsulate business logic and coordinate with models and database sessions.
- Models: SQLAlchemy ORM entities representing domain objects.
- Utilities: JWT encoding/decoding and password hashing utilities.

**Section sources**
- [backend/app/main.py:56-109](file://backend/app/main.py#L56-L109)
- [backend/app/config.py:57-72](file://backend/app/config.py#L57-L72)
- [backend/app/database.py:24-51](file://backend/app/database.py#L24-L51)
- [backend/app/dependencies.py:14-69](file://backend/app/dependencies.py#L14-L69)
- [backend/app/routers/auth.py:16-315](file://backend/app/routers/auth.py#L16-L315)
- [backend/app/accounts/service.py:55-111](file://backend/app/accounts/service.py#L55-L111)
- [backend/app/models/account.py:31-57](file://backend/app/models/account.py#L31-L57)
- [backend/app/models/user.py:37-65](file://backend/app/models/user.py#L37-L65)
- [backend/app/utils/jwt.py:11-26](file://backend/app/utils/jwt.py#L11-L26)
- [backend/app/utils/hash_password.py:5-10](file://backend/app/utils/hash_password.py#L5-L10)

## Architecture Overview
The system follows a layered architecture:
- Presentation layer: FastAPI routers expose endpoints grouped by feature.
- Business logic layer: Services encapsulate domain rules and orchestrate data access.
- Data access layer: SQLAlchemy ORM models and session dependency provide persistence.

```mermaid
graph TB
CLIENT["Client (Frontend)"]
MAIN["FastAPI App (main.py)"]
R_AUTH["Auth Router (/auth)"]
R_ACCOUNTS["Accounts Router (/accounts)"]
SVC_AUTH["Auth Service"]
SVC_ACCOUNTS["Accounts Service"]
DB["SQLAlchemy ORM<br/>Models + Session"]
CFG["Settings (config.py)"]
DEP["Shared Dependencies"]
CLIENT --> MAIN
MAIN --> R_AUTH
MAIN --> R_ACCOUNTS
R_AUTH --> DEP
R_ACCOUNTS --> DEP
R_AUTH --> SVC_AUTH
R_ACCOUNTS --> SVC_ACCOUNTS
SVC_AUTH --> DB
SVC_ACCOUNTS --> DB
DB --> CFG
```

**Diagram sources**
- [backend/app/main.py:56-85](file://backend/app/main.py#L56-L85)
- [backend/app/routers/auth.py:16-315](file://backend/app/routers/auth.py#L16-L315)
- [backend/app/accounts/router.py:36-109](file://backend/app/accounts/router.py#L36-L109)
- [backend/app/accounts/service.py:55-111](file://backend/app/accounts/service.py#L55-L111)
- [backend/app/database.py:24-51](file://backend/app/database.py#L24-L51)
- [backend/app/config.py:57-72](file://backend/app/config.py#L57-L72)
- [backend/app/dependencies.py:14-69](file://backend/app/dependencies.py#L14-L69)

## Detailed Component Analysis

### Application Entry Point and Middleware
- Initializes FastAPI app with metadata.
- Registers modular routers for user and admin features.
- Adds CORS middleware with environment-driven origins.
- Startup event initializes Firebase integration.

```mermaid
sequenceDiagram
participant Client as "Client"
participant App as "FastAPI App"
participant Router as "Auth Router"
participant Dep as "Shared Dependencies"
participant DB as "Database Session"
Client->>App : HTTP Request
App->>Router : Route match
Router->>Dep : get_current_user()
Dep->>DB : get_db()
DB-->>Dep : Session
Dep-->>Router : Current User
Router-->>Client : Response
```

**Diagram sources**
- [backend/app/main.py:56-109](file://backend/app/main.py#L56-L109)
- [backend/app/dependencies.py:51-69](file://backend/app/dependencies.py#L51-L69)
- [backend/app/database.py:45-51](file://backend/app/database.py#L45-L51)

**Section sources**
- [backend/app/main.py:56-109](file://backend/app/main.py#L56-L109)

### Configuration Management
- Loads environment variables from a dedicated .env file.
- Normalizes legacy keys to canonical names.
- Provides typed settings for database URL, JWT secrets, algorithms, and token expirations.
- Supplies defaults for development with warnings.

```mermaid
flowchart TD
Start(["Load Settings"]) --> EnvCheck["Check .env presence"]
EnvCheck --> LoadEnv["Load environment variables"]
LoadEnv --> NormalizeKeys["Normalize legacy keys"]
NormalizeKeys --> Defaults{"Required keys present?"}
Defaults --> |No| SetDefaults["Set development-safe defaults<br/>and print warnings"]
Defaults --> |Yes| Proceed["Proceed with validated settings"]
SetDefaults --> Proceed
Proceed --> Export["Expose settings object"]
```

**Diagram sources**
- [backend/app/config.py:32-56](file://backend/app/config.py#L32-L56)
- [backend/app/config.py:57-72](file://backend/app/config.py#L57-L72)

**Section sources**
- [backend/app/config.py:32-72](file://backend/app/config.py#L32-L72)

### Database Abstraction and Session Management
- Creates SQLAlchemy engine with pre-ping.
- Defines scoped session factory and declarative base.
- Provides dependency to supply a database session per request.
- Alembic integration uses the same Base and settings for migrations.

```mermaid
classDiagram
class DatabaseEngine {
+create_engine(url, pool_pre_ping)
}
class SessionFactory {
+sessionmaker(bind=engine)
}
class DeclarativeBase {
+declarative_base()
}
class GetDB {
+get_db() Session
}
DatabaseEngine --> SessionFactory : "bind"
SessionFactory --> DeclarativeBase : "used by models"
GetDB --> SessionFactory : "creates session"
```

**Diagram sources**
- [backend/app/database.py:24-51](file://backend/app/database.py#L24-L51)
- [backend/alembic/env.py:40-58](file://backend/alembic/env.py#L40-L58)

**Section sources**
- [backend/app/database.py:24-51](file://backend/app/database.py#L24-L51)
- [backend/alembic/env.py:40-58](file://backend/alembic/env.py#L40-L58)

### Shared Dependencies and Authorization
- OAuth2 password bearer scheme for token-based authentication.
- Decodes and validates access tokens, extracts subject, and loads user.
- Enforces admin-only access via a dedicated dependency.
- Raises standardized HTTP exceptions for invalid credentials.

```mermaid
flowchart TD
A["Incoming Request"] --> B["OAuth2 Bearer Token"]
B --> C["Decode Access Token"]
C --> D{"Token type == access?"}
D --> |No| E["HTTP 401 Credentials Invalid"]
D --> |Yes| F["Extract subject (user_id)"]
F --> G["Fetch User from DB"]
G --> H{"User exists?"}
H --> |No| E
H --> |Yes| I["Return Current User"]
```

**Diagram sources**
- [backend/app/dependencies.py:17-58](file://backend/app/dependencies.py#L17-L58)

**Section sources**
- [backend/app/dependencies.py:14-69](file://backend/app/dependencies.py#L14-L69)

### Authentication Router (Feature Router)
- Provides registration, login, OTP-based flows, and protected profile retrieval.
- Issues access tokens and refresh cookies with secure attributes controlled by environment.
- Handles integrity errors and logs unexpected exceptions.

```mermaid
sequenceDiagram
participant FE as "Frontend"
participant AR as "Auth Router"
participant AS as "Auth Service"
participant DB as "Database Session"
participant UT as "JWT Utils"
FE->>AR : POST /auth/register
AR->>DB : Persist new user
DB-->>AR : User saved
AR-->>FE : UserResponse
FE->>AR : POST /auth/login
AR->>AS : authenticate_user(...)
AS->>UT : create_access_token(user_id)
UT-->>AS : access_token
AS-->>AR : user + token pair
AR-->>FE : {access_token, user}
```

**Diagram sources**
- [backend/app/auth/router.py:75-120](file://backend/app/auth/router.py#L75-L120)
- [backend/app/services/auth_service.py:15-29](file://backend/app/services/auth_service.py#L15-L29)
- [backend/app/utils/jwt.py:11-26](file://backend/app/utils/jwt.py#L11-L26)

**Section sources**
- [backend/app/auth/router.py:75-120](file://backend/app/auth/router.py#L75-L120)
- [backend/app/services/auth_service.py:15-29](file://backend/app/services/auth_service.py#L15-L29)
- [backend/app/utils/jwt.py:11-26](file://backend/app/utils/jwt.py#L11-L26)

### Accounts Router and Service
- Router enforces PIN validation and delegates to service for business logic.
- Service ensures uniqueness by masked last-4 digits, hashes PIN, and manages account lifecycle.
- Models define account entity with foreign key to user and PIN hash.

```mermaid
sequenceDiagram
participant FE as "Frontend"
participant AR as "Accounts Router"
participant AS as "Accounts Service"
participant DB as "Database Session"
participant M as "Account Model"
FE->>AR : POST /accounts
AR->>AS : create_account(user, account_data)
AS->>DB : Query existing active account by last-4
DB-->>AS : Existing ID or None
AS->>M : Instantiate Account with masked number and hashed PIN
AS->>DB : Commit and refresh
DB-->>AS : Saved Account
AS-->>AR : AccountResponse
AR-->>FE : Response
```

**Diagram sources**
- [backend/app/accounts/router.py:61-69](file://backend/app/accounts/router.py#L61-L69)
- [backend/app/accounts/service.py:55-76](file://backend/app/accounts/service.py#L55-L76)
- [backend/app/models/account.py:31-57](file://backend/app/models/account.py#L31-L57)

**Section sources**
- [backend/app/accounts/router.py:61-69](file://backend/app/accounts/router.py#L61-L69)
- [backend/app/accounts/service.py:55-111](file://backend/app/accounts/service.py#L55-L111)
- [backend/app/models/account.py:31-57](file://backend/app/models/account.py#L31-L57)

### User Model and Relationships
- Represents users with identity, credentials, roles, KYC status, and timestamps.
- Establishes a cascading relationship to accounts.

```mermaid
erDiagram
USERS {
int id PK
string name
string email UK
string password
string phone
boolean is_admin
date dob
string pin_code
enum kyc_status
timestamp created_at
timestamp last_login
}
ACCOUNTS {
int id PK
int user_id FK
string bank_name
string account_type
string masked_account
string currency
numeric balance
string pin_hash
boolean is_active
timestamp created_at
}
USERS ||--o{ ACCOUNTS : "owns"
```

**Diagram sources**
- [backend/app/models/user.py:37-65](file://backend/app/models/user.py#L37-L65)
- [backend/app/models/account.py:31-57](file://backend/app/models/account.py#L31-L57)

**Section sources**
- [backend/app/models/user.py:37-65](file://backend/app/models/user.py#L37-L65)
- [backend/app/models/account.py:31-57](file://backend/app/models/account.py#L31-L57)

### JWT and Password Utilities
- JWT utilities encode/decode tokens with configurable algorithm and expiry.
- Password utilities provide bcrypt-based hashing and verification.

```mermaid
flowchart TD
A["Create Access Token"] --> B["Encode payload with secret and algorithm"]
B --> C["Return signed JWT"]
D["Verify Password"] --> E["Compare plain vs hashed"]
E --> F{"Match?"}
F --> |Yes| G["True"]
F --> |No| H["False"]
```

**Diagram sources**
- [backend/app/utils/jwt.py:11-26](file://backend/app/utils/jwt.py#L11-L26)
- [backend/app/utils/hash_password.py:5-10](file://backend/app/utils/hash_password.py#L5-L10)

**Section sources**
- [backend/app/utils/jwt.py:11-26](file://backend/app/utils/jwt.py#L11-L26)
- [backend/app/utils/hash_password.py:5-10](file://backend/app/utils/hash_password.py#L5-L10)

### Transaction Processing and Additional Modules
- Transactions module organizes endpoints and services for transfer and transaction history.
- Modular routers under app/routers group endpoints by functional area (user, admin, analytics, etc.).
- Administrative functions leverage shared dependencies to enforce role-based access.

[No sources needed since this section provides a conceptual overview of additional modules]

## Dependency Analysis
- Coupling: Routers depend on shared dependencies and services; services depend on models and database sessions; models depend on the declarative base.
- Cohesion: Each feature module encapsulates related routers, services, schemas, and models.
- External dependencies: SQLAlchemy ORM, Alembic migrations, Pydantic settings, JWT library, and environment variable loading.

```mermaid
graph LR
Routers["Feature Routers"] --> Services["Services"]
Services --> Models["ORM Models"]
Models --> DB["SQLAlchemy Engine/Session"]
Routers --> SharedDeps["Shared Dependencies"]
SharedDeps --> DB
Config["Settings"] --> DB
Config --> JWT["JWT Utils"]
```

**Diagram sources**
- [backend/app/accounts/router.py:25-35](file://backend/app/accounts/router.py#L25-L35)
- [backend/app/accounts/service.py:17-24](file://backend/app/accounts/service.py#L17-L24)
- [backend/app/models/account.py:24-28](file://backend/app/models/account.py#L24-L28)
- [backend/app/database.py:24-51](file://backend/app/database.py#L24-L51)
- [backend/app/dependencies.py:5-12](file://backend/app/dependencies.py#L5-L12)
- [backend/app/config.py:57-72](file://backend/app/config.py#L57-L72)
- [backend/app/utils/jwt.py:6-7](file://backend/app/utils/jwt.py#L6-L7)

**Section sources**
- [backend/app/accounts/router.py:25-35](file://backend/app/accounts/router.py#L25-L35)
- [backend/app/accounts/service.py:17-24](file://backend/app/accounts/service.py#L17-L24)
- [backend/app/models/account.py:24-28](file://backend/app/models/account.py#L24-L28)
- [backend/app/database.py:24-51](file://backend/app/database.py#L24-L51)
- [backend/app/dependencies.py:5-12](file://backend/app/dependencies.py#L5-L12)
- [backend/app/config.py:57-72](file://backend/app/config.py#L57-L72)
- [backend/app/utils/jwt.py:6-7](file://backend/app/utils/jwt.py#L6-L7)

## Performance Considerations
- Use database pre-ping to handle stale connections.
- Keep business logic in services to minimize ORM overhead in routers.
- Prefer bulk operations and pagination for list endpoints.
- Cache infrequent reads and avoid heavy computations in request handlers.
- Use appropriate indexes on frequently filtered columns (e.g., user_id, email).

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
- CORS issues: Verify allowed origins environment variable and middleware configuration.
- Authentication failures: Confirm JWT secrets, token type validation, and user existence checks.
- Database connectivity: Check DATABASE_URL and ensure migrations are applied.
- Session leaks: Ensure sessions are closed after yielding in dependencies.
- Logging: Use structured logging and capture stack traces for unhandled exceptions.

**Section sources**
- [backend/app/main.py:91-109](file://backend/app/main.py#L91-L109)
- [backend/app/dependencies.py:17-58](file://backend/app/dependencies.py#L17-L58)
- [backend/app/database.py:45-51](file://backend/app/database.py#L45-L51)
- [backend/app/config.py:42-56](file://backend/app/config.py#L42-L56)

## Conclusion
The backend employs a clean, layered architecture with strong separation of concerns. Routers handle presentation, services encapsulate business logic, and models provide data access via SQLAlchemy. Dependency injection simplifies authentication and session management. Configuration is centralized and environment-aware. The modular router organization and shared dependencies enable scalable growth across user and admin features. Alembic ensures consistent database evolution. Together, these patterns deliver a maintainable, testable, and secure foundation for the banking platform.