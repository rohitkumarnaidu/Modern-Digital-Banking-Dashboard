# Key Features

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [backend/app/main.py](file://backend/app/main.py)
- [frontend/src/App.jsx](file://frontend/src/App.jsx)
- [frontend/src/pages/user/Dashboard.jsx](file://frontend/src/pages/user/Dashboard.jsx)
- [frontend/src/pages/user/Accounts.jsx](file://frontend/src/pages/user/Accounts.jsx)
- [frontend/src/pages/user/SendMoney.jsx](file://frontend/src/pages/user/SendMoney.jsx)
- [frontend/src/pages/user/Budgets.jsx](file://frontend/src/pages/user/Budgets.jsx)
- [frontend/src/pages/user/Bills.jsx](file://frontend/src/pages/user/Bills.jsx)
- [backend/app/auth/router.py](file://backend/app/auth/router.py)
- [backend/app/accounts/router.py](file://backend/app/accounts/router.py)
- [backend/app/transfers/router.py](file://backend/app/transfers/router.py)
- [backend/app/budgets/router.py](file://backend/app/budgets/router.py)
- [backend/app/bills/router.py](file://backend/app/bills/router.py)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Feature Analysis](#detailed-feature-analysis)
6. [Feature Relationships and Workflows](#feature-relationships-and-workflows)
7. [Dependency Analysis](#dependency-analysis)
8. [Performance Considerations](#performance-considerations)
9. [Troubleshooting Guide](#troubleshooting-guide)
10. [Conclusion](#conclusion)

## Introduction
This document presents the complete feature set of the Modern Digital Banking Dashboard, a full-stack banking application designed to simulate real-world banking experiences. It covers user authentication and profile management, multi-account banking, real-time transaction processing (including UPI, bank transfers, and self-account transfers), intelligent budget management, automated bill payment and reminders, rewards and loyalty programs, financial insights and analytics, admin dashboards for oversight, KYC verification workflows, and real-time push notifications. The guide includes user workflows, feature screenshots, and integration examples to help both technical and non-technical stakeholders understand how features relate and deliver a cohesive banking experience.

## Project Structure
The application follows a clear separation of concerns:
- Frontend: React + Vite with protected routes, admin routes, and reusable components.
- Backend: FastAPI with modular routers for authentication, accounts, transfers, budgets, bills, insights, alerts, and admin panels.
- Database: PostgreSQL with SQLAlchemy ORM and Alembic migrations.
- Notifications: Firebase Cloud Messaging (FCM) for real-time push notifications.

```mermaid
graph TB
subgraph "Frontend (React)"
FE_App["App.jsx<br/>Routing & Layout"]
FE_Dash["Dashboard.jsx<br/>Main Layout"]
FE_Auth["Auth Pages<br/>Login, Register, OTP"]
FE_Accounts["Accounts.jsx<br/>Manage Accounts"]
FE_Transfers["SendMoney.jsx<br/>Transfer Hub"]
FE_Budgets["Budgets.jsx<br/>Budget Management"]
FE_Bills["Bills.jsx<br/>Bill Reminders & Payments"]
end
subgraph "Backend (FastAPI)"
BE_Main["main.py<br/>App Entry & Routers"]
BE_Auth["auth/router.py<br/>Auth Endpoints"]
BE_Accounts["accounts/router.py<br/>Account CRUD"]
BE_Transfers["transfers/router.py<br/>Transfer Processing"]
BE_Budgets["budgets/router.py<br/>Budget CRUD & Summary"]
BE_Bills["bills/router.py<br/>Bill Reminders & Payments"]
end
subgraph "Database & Services"
DB["PostgreSQL<br/>SQLAlchemy Models"]
FCM["Firebase FCM<br/>Push Notifications"]
end
FE_App --> FE_Dash
FE_Dash --> FE_Accounts
FE_Dash --> FE_Transfers
FE_Dash --> FE_Budgets
FE_Dash --> FE_Bills
FE_Dash --> BE_Main
FE_Accounts --> BE_Accounts
FE_Transfers --> BE_Transfers
FE_Budgets --> BE_Budgets
FE_Bills --> BE_Bills
BE_Main --> BE_Auth
BE_Main --> BE_Accounts
BE_Main --> BE_Transfers
BE_Main --> BE_Budgets
BE_Main --> BE_Bills
BE_Main --> DB
BE_Main --> FCM
```

**Diagram sources**
- [backend/app/main.py:56-85](file://backend/app/main.py#L56-L85)
- [frontend/src/App.jsx:78-167](file://frontend/src/App.jsx#L78-L167)
- [frontend/src/pages/user/Dashboard.jsx:58-311](file://frontend/src/pages/user/Dashboard.jsx#L58-L311)

**Section sources**
- [README.md:24-73](file://README.md#L24-L73)
- [backend/app/main.py:56-85](file://backend/app/main.py#L56-L85)
- [frontend/src/App.jsx:78-167](file://frontend/src/App.jsx#L78-L167)

## Core Components
- Authentication and Profile Management: JWT-based login, OTP verification, password reset, and profile updates.
- Multi-Account Banking: Create, list, update, delete accounts with PIN security.
- Money Transfers: UPI, Bank-to-Bank, and Self transfers with transaction PIN verification.
- Budget Management: Create monthly budgets by category, track spending, and view summaries.
- Bill Payments and Reminders: Add bill reminders, pay bills, and manage upcoming/overdue bills.
- Rewards and Loyalty: Track reward points across programs.
- Financial Insights: Monthly spending, category breakdown, and cash flow analytics.
- Admin Dashboard: System-wide analytics, user management, KYC approvals, transaction monitoring, and alert management.
- KYC Verification: Identity confirmation workflow integrated into account management.
- Real-Time Notifications: Push notifications via Firebase FCM.

**Section sources**
- [README.md](file://README.md)
- [backend/app/auth/router.py:75-180](file://backend/app/auth/router.py#L75-L180)
- [backend/app/accounts/router.py:61-109](file://backend/app/accounts/router.py#L61-L109)
- [backend/app/transfers/router.py:13-24](file://backend/app/transfers/router.py#L13-L24)
- [backend/app/budgets/router.py:26-81](file://backend/app/budgets/router.py#L26-L81)
- [backend/app/bills/router.py:26-81](file://backend/app/bills/router.py#L26-L81)

## Architecture Overview
The system uses a layered architecture:
- Presentation Layer: React frontend with protected and admin routes.
- API Layer: FastAPI routers exposing REST endpoints.
- Business Logic Layer: Services orchestrating domain logic.
- Persistence Layer: PostgreSQL with SQLAlchemy models.
- Integration Layer: Firebase for push notifications.

```mermaid
graph TB
Client["Browser"]
FE_Router["React Router<br/>Protected/Admin Routes"]
API["FastAPI App<br/>Routers & Dependencies"]
AuthSvc["Auth Service<br/>JWT, OTP"]
AccSvc["Accounts Service<br/>Account CRUD"]
TransSvc["Transfers Service<br/>Transfer Processing"]
BudgetSvc["Budgets Service<br/>Budget CRUD & Summary"]
BillSvc["Bills Service<br/>Reminders & Payments"]
DB["PostgreSQL<br/>SQLAlchemy ORM"]
FCM["Firebase Admin SDK"]
Client --> FE_Router
FE_Router --> API
API --> AuthSvc
API --> AccSvc
API --> TransSvc
API --> BudgetSvc
API --> BillSvc
API --> DB
API --> FCM
```

**Diagram sources**
- [backend/app/main.py:29-85](file://backend/app/main.py#L29-L85)
- [frontend/src/App.jsx:78-167](file://frontend/src/App.jsx#L78-L167)

**Section sources**
- [backend/app/main.py:29-85](file://backend/app/main.py#L29-L85)
- [frontend/src/App.jsx:78-167](file://frontend/src/App.jsx#L78-L167)

## Detailed Feature Analysis

### User Authentication and Profile Management
- Registration, login, and logout with JWT access tokens.
- OTP-based password reset and resend OTP endpoints.
- Profile updates and security settings (PIN change, device management).
- ProtectedRoute guards ensure only authenticated users access protected pages.

```mermaid
sequenceDiagram
participant U as "User"
participant FE as "Frontend"
participant API as "FastAPI Auth Router"
participant DB as "PostgreSQL"
U->>FE : Open Login Page
FE->>API : POST /auth/login
API->>DB : Authenticate user
DB-->>API : User record
API-->>FE : Access token + user info
FE->>FE : Store token, redirect to Dashboard
```

**Diagram sources**
- [backend/app/auth/router.py:104-119](file://backend/app/auth/router.py#L104-L119)
- [frontend/src/App.jsx:98-104](file://frontend/src/App.jsx#L98-L104)

**Section sources**
- [backend/app/auth/router.py:75-180](file://backend/app/auth/router.py#L75-L180)
- [frontend/src/App.jsx:78-167](file://frontend/src/App.jsx#L78-L167)

### Multi-Account Banking
- Users can list, add, and delete accounts with PIN verification.
- PIN creation enforces numeric 4-digit requirement.
- Account change PIN endpoint updates hashed PIN securely.

```mermaid
flowchart TD
Start(["User opens Accounts"]) --> List["Fetch Accounts"]
List --> HasAcc{"Has Accounts?"}
HasAcc --> |Yes| Actions["Check Balance / Change PIN / Remove"]
HasAcc --> |No| AddPrompt["Show Add Account Prompt"]
Actions --> End(["Done"])
AddPrompt --> Add["POST /accounts"]
Add --> PinVerify["PIN Verification"]
PinVerify --> Success{"Valid PIN?"}
Success --> |Yes| Save["Save Account"]
Success --> |No| Error["Show Error"]
Save --> End
Error --> End
```

**Diagram sources**
- [backend/app/accounts/router.py:61-109](file://backend/app/accounts/router.py#L61-L109)
- [frontend/src/pages/user/Accounts.jsx:52-91](file://frontend/src/pages/user/Accounts.jsx#L52-L91)

**Section sources**
- [backend/app/accounts/router.py:61-109](file://backend/app/accounts/router.py#L61-L109)
- [frontend/src/pages/user/Accounts.jsx:16-419](file://frontend/src/pages/user/Accounts.jsx#L16-L419)

### Real-Time Transaction Processing (UPI, Bank Transfers, Self Transfers)
- Transfer hub allows selecting an account and choosing transfer type.
- Transfer processing validates sender account and applies transaction PIN verification.
- Transaction history supports filtering and CSV import.

```mermaid
sequenceDiagram
participant U as "User"
participant FE as "SendMoney.jsx"
participant API as "Transfers Router"
participant SVC as "Transfers Service"
participant DB as "PostgreSQL"
U->>FE : Select From Account & Transfer Type
FE->>API : POST /transfers
API->>SVC : send_money(payload)
SVC->>DB : Validate sender, process transfer
DB-->>SVC : Transfer result
SVC-->>API : TransferResponse
API-->>FE : Success/Error
FE->>U : Show Payment Result Page
```

**Diagram sources**
- [frontend/src/pages/user/SendMoney.jsx:37-192](file://frontend/src/pages/user/SendMoney.jsx#L37-L192)
- [backend/app/transfers/router.py:13-24](file://backend/app/transfers/router.py#L13-L24)

**Section sources**
- [frontend/src/pages/user/SendMoney.jsx:1-260](file://frontend/src/pages/user/SendMoney.jsx#L1-L260)
- [backend/app/transfers/router.py:13-24](file://backend/app/transfers/router.py#L13-L24)

### Intelligent Budget Management
- Create monthly budgets by category with limit amounts.
- Track spent amounts and compute remaining budget.
- View summaries and filter budgets by category.

```mermaid
flowchart TD
Start(["Open Budgets"]) --> Fetch["GET /budgets?month&year"]
Fetch --> Budgets{"Any budgets?"}
Budgets --> |No| Create["Add Budget Modal"]
Budgets --> |Yes| Summary["Compute Totals & Remaining"]
Summary --> Edit["Edit/Delete Budget"]
Create --> Save["POST /budgets"]
Save --> Fetch
Edit --> Update["PATCH /budgets/{id}"]
Edit --> Remove["DELETE /budgets/{id}"]
Update --> Fetch
Remove --> Fetch
```

**Diagram sources**
- [backend/app/budgets/router.py:26-81](file://backend/app/budgets/router.py#L26-L81)
- [frontend/src/pages/user/Budgets.jsx:19-66](file://frontend/src/pages/user/Budgets.jsx#L19-L66)

**Section sources**
- [backend/app/budgets/router.py:26-81](file://backend/app/budgets/router.py#L26-L81)
- [frontend/src/pages/user/Budgets.jsx:1-191](file://frontend/src/pages/user/Budgets.jsx#L1-L191)

### Automated Bill Payment System (Reminders and Recharges)
- Add bill reminders with due dates and auto-pay options.
- Pay bills via selected accounts; supports multiple bill types (mobile, electricity, FASTag, Google Play, credit card, subscriptions).
- Upcoming/overdue status computed based on due date.

```mermaid
sequenceDiagram
participant U as "User"
participant FE as "Bills.jsx"
participant API as "Bills Router"
participant SVC as "Bills Service"
participant DB as "PostgreSQL"
U->>FE : Open Recharge & Bills
FE->>API : GET /bills
API->>SVC : get_user_bills()
SVC->>DB : Query bills
DB-->>SVC : Bills list
SVC-->>API : BillOut[]
API-->>FE : Render cards & status
U->>FE : Click bill type (e.g., Mobile)
FE->>FE : Open corresponding modal
U->>FE : Submit payment
FE->>API : POST /bills/pay
API->>SVC : pay_bill()
SVC->>DB : Record transaction
DB-->>SVC : Transaction
SVC-->>API : Success
API-->>FE : Redirect to result page
```

**Diagram sources**
- [frontend/src/pages/user/Bills.jsx:38-439](file://frontend/src/pages/user/Bills.jsx#L38-L439)
- [backend/app/bills/router.py:26-81](file://backend/app/bills/router.py#L26-L81)

**Section sources**
- [frontend/src/pages/user/Bills.jsx:1-439](file://frontend/src/pages/user/Bills.jsx#L1-L439)
- [backend/app/bills/router.py:26-81](file://backend/app/bills/router.py#L26-L81)

### Rewards and Loyalty Program
- View available reward programs and user rewards.
- Track points accumulation and redemption across programs.

**Section sources**
- [README.md](file://README.md)

### Comprehensive Financial Insights and Analytics
- Monthly spending trends, category breakdown, and financial summaries.
- Insights dashboard integrates charts and analytics for informed decisions.

**Section sources**
- [README.md](file://README.md)

### Admin Dashboard for User Management and System Oversight
- Admin dashboard provides system statistics and metrics.
- Manage users, monitor transactions, approve KYC, configure rewards, and manage alerts.

**Section sources**
- [README.md](file://README.md)

### KYC Verification Workflow
- Integrated into account management; users can verify identity and OTP during sensitive operations.
- Admin panel reviews and approves KYC applications.

**Section sources**
- [README.md](file://README.md)
- [frontend/src/pages/user/Accounts.jsx:258-262](file://frontend/src/pages/user/Accounts.jsx#L258-L262)

### Real-Time Push Notifications
- Firebase Cloud Messaging initialized at app startup.
- Notifications integrated into dashboard header with unread count.

**Section sources**
- [backend/app/main.py:59-61](file://backend/app/main.py#L59-L61)
- [frontend/src/pages/user/Dashboard.jsx:119-131](file://frontend/src/pages/user/Dashboard.jsx#L119-L131)

## Feature Relationships and Workflows
The features are interconnected:
- Authentication enables access to all user features.
- Accounts are prerequisites for transfers, bill payments, and budget tracking.
- Budgets rely on transaction history to compute spent amounts.
- Bill reminders feed into payment processing and transaction recording.
- Admin dashboards oversee user activities, KYC, and system-wide alerts.
- Notifications keep users informed about transfers, bill due dates, and system alerts.

```mermaid
graph TB
Auth["Authentication"]
Accounts["Accounts"]
Transfers["Transfers"]
Budgets["Budgets"]
Bills["Bills"]
Insights["Insights"]
Alerts["Alerts"]
Admin["Admin Panel"]
FCM["Push Notifications"]
Auth --> Accounts
Auth --> Transfers
Auth --> Budgets
Auth --> Bills
Auth --> Insights
Auth --> Alerts
Accounts --> Transfers
Accounts --> Bills
Transfers --> Insights
Bills --> Insights
Budgets --> Insights
Alerts --> FCM
Admin --> Auth
Admin --> Accounts
Admin --> Transfers
Admin --> Budgets
Admin --> Bills
Admin --> Alerts
```

[No sources needed since this diagram shows conceptual relationships, not direct code mappings]

## Dependency Analysis
- Frontend routing depends on protected routes and admin routes.
- Backend routers depend on SQLAlchemy models and services.
- Firebase initialization occurs at app startup for notifications.
- Cross-origin requests are configured for development and deployment domains.

```mermaid
graph TB
FE_Routes["frontend/src/App.jsx"]
BE_Main["backend/app/main.py"]
BE_Auth["backend/app/auth/router.py"]
BE_Accounts["backend/app/accounts/router.py"]
BE_Transfers["backend/app/transfers/router.py"]
BE_Budgets["backend/app/budgets/router.py"]
BE_Bills["backend/app/bills/router.py"]
FE_Routes --> BE_Main
BE_Main --> BE_Auth
BE_Main --> BE_Accounts
BE_Main --> BE_Transfers
BE_Main --> BE_Budgets
BE_Main --> BE_Bills
```

**Diagram sources**
- [frontend/src/App.jsx:78-167](file://frontend/src/App.jsx#L78-L167)
- [backend/app/main.py:29-85](file://backend/app/main.py#L29-L85)

**Section sources**
- [frontend/src/App.jsx:78-167](file://frontend/src/App.jsx#L78-L167)
- [backend/app/main.py:91-109](file://backend/app/main.py#L91-L109)

## Performance Considerations
- Use pagination and filters for large datasets (transactions, bills, budgets).
- Optimize chart rendering by limiting data points to relevant periods.
- Cache frequently accessed account lists and user profiles.
- Minimize network requests by batching operations where feasible.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
- Authentication failures: Verify credentials and ensure OTP is valid and unexpired.
- Account deletion errors: Confirm 4-digit numeric PIN matches stored hash.
- Transfer failures: Validate sender account ownership and sufficient balance; ensure PIN verification succeeds.
- Budget creation conflicts: Check for existing budget in the same category for the month/year.
- Bill payment errors: Confirm account selection and bill status (not paid).

**Section sources**
- [backend/app/auth/router.py:141-163](file://backend/app/auth/router.py#L141-L163)
- [backend/app/accounts/router.py:86-108](file://backend/app/accounts/router.py#L86-L108)
- [backend/app/transfers/router.py:13-24](file://backend/app/transfers/router.py#L13-L24)
- [backend/app/budgets/router.py:32-35](file://backend/app/budgets/router.py#L32-L35)
- [backend/app/bills/router.py:26-37](file://backend/app/bills/router.py#L26-L37)

## Conclusion
The Modern Digital Banking Dashboard delivers a comprehensive, secure, and user-friendly banking experience. Its modular backend and intuitive frontend enable seamless account management, real-time transfers, intelligent budgeting, automated bill payments, insightful analytics, robust admin oversight, KYC workflows, and real-time notifications. The documented features, workflows, and integrations provide a blueprint for extending functionality while maintaining strong security and scalability.