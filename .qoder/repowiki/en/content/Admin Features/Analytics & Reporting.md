# Analytics & Reporting

<cite>
**Referenced Files in This Document**
- [backend/app/routers/admin_analytics.py](file://backend/app/routers/admin_analytics.py)
- [backend/app/services/admin_analytics.py](file://backend/app/services/admin_analytics.py)
- [backend/app/schemas/admin_analytics.py](file://backend/app/schemas/admin_analytics.py)
- [backend/app/models/user.py](file://backend/app/models/user.py)
- [backend/app/models/transaction.py](file://backend/app/models/transaction.py)
- [backend/app/models/reward.py](file://backend/app/models/reward.py)
- [backend/app/routers/admin_dashboard.py](file://backend/app/routers/admin_dashboard.py)
- [backend/app/services/admin_dashboard.py](file://backend/app/services/admin_dashboard.py)
- [backend/app/insights/router.py](file://backend/app/insights/router.py)
- [backend/app/insights/service.py](file://backend/app/insights/service.py)
- [backend/app/insights/schemas.py](file://backend/app/insights/schemas.py)
- [backend/app/exports/router.py](file://backend/app/exports/router.py)
- [backend/app/exports/csv_export.py](file://backend/app/exports/csv_export.py)
- [backend/app/exports/pdf_export.py](file://backend/app/exports/pdf_export.py)
- [frontend/src/pages/admin/AdminAnalytics.jsx](file://frontend/src/pages/admin/AdminAnalytics.jsx)
- [frontend/src/constants/index.js](file://frontend/src/constants/index.js)
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
This document explains the admin analytics and reporting capabilities of the Modern Digital Banking Dashboard. It covers usage statistics, financial metrics, user engagement reports, and system performance analytics. It documents report generation, data export options, and the current state of customizable dashboard widgets. It also explains analytics data sources, aggregation methods, reporting frequency, and how to leverage trend analysis and comparative reporting for administrative decision-making.

## Project Structure
The analytics and reporting features span backend routers and services, data models, and frontend pages. The backend exposes admin analytics endpoints and integrates with user, transaction, and reward models. The frontend renders summaries, top-user activity, and provides export capabilities.

```mermaid
graph TB
subgraph "Backend"
RAA["Router: admin_analytics.py"]
SAA["Service: admin_analytics.py"]
RAD["Router: admin_dashboard.py"]
SAD["Service: admin_dashboard.py"]
IR["Router: insights/router.py"]
IS["Service: insights/service.py"]
ER["Router: exports/router.py"]
ECSV["Export: csv_export.py"]
EPDF["Export: pdf_export.py"]
MU["Model: user.py"]
MT["Model: transaction.py"]
MR["Model: reward.py"]
end
subgraph "Frontend"
FA["AdminAnalytics.jsx"]
FC["constants/index.js"]
end
FA --> FC
FA --> |"HTTP GET"| RAA
RAA --> SAA
SAA --> MU
SAA --> MT
SAA --> MR
FA --> |"HTTP GET"| RAD
RAD --> SAD
SAD --> MU
SAD --> MT
SAD --> MR
FA --> |"HTTP GET"| IR
IR --> IS
IS --> MT
IS --> MU
FA --> |"HTTP GET"| ER
ER --> ECSV
ER --> EPDF
```

**Diagram sources**
- [backend/app/routers/admin_analytics.py:1-21](file://backend/app/routers/admin_analytics.py#L1-L21)
- [backend/app/services/admin_analytics.py:1-60](file://backend/app/services/admin_analytics.py#L1-L60)
- [backend/app/routers/admin_dashboard.py:1-14](file://backend/app/routers/admin_dashboard.py#L1-L14)
- [backend/app/services/admin_dashboard.py:1-42](file://backend/app/services/admin_dashboard.py#L1-L42)
- [backend/app/insights/router.py:1-52](file://backend/app/insights/router.py#L1-L52)
- [backend/app/insights/service.py:1-148](file://backend/app/insights/service.py#L1-L148)
- [backend/app/exports/router.py:1-51](file://backend/app/exports/router.py#L1-L51)
- [backend/app/exports/csv_export.py:1-65](file://backend/app/exports/csv_export.py#L1-L65)
- [backend/app/exports/pdf_export.py:1-72](file://backend/app/exports/pdf_export.py#L1-L72)
- [frontend/src/pages/admin/AdminAnalytics.jsx:1-429](file://frontend/src/pages/admin/AdminAnalytics.jsx#L1-L429)
- [frontend/src/constants/index.js:127-128](file://frontend/src/constants/index.js#L127-L128)

**Section sources**
- [backend/app/routers/admin_analytics.py:1-21](file://backend/app/routers/admin_analytics.py#L1-L21)
- [backend/app/services/admin_analytics.py:1-60](file://backend/app/services/admin_analytics.py#L1-L60)
- [frontend/src/pages/admin/AdminAnalytics.jsx:1-429](file://frontend/src/pages/admin/AdminAnalytics.jsx#L1-L429)

## Core Components
- Admin Analytics Summary: Provides system-wide counts for total users, KYC statuses, total transactions, and rewards issued.
- Top Users by Activity: Returns top users ranked by transaction count and total transaction amount.
- Admin Dashboard Summary: Provides daily operational KPIs such as pending KYC, today’s transactions, and unread alerts.
- User Insights: Per-user financial summaries, monthly spending, category breakdowns, and daily dashboard insights.
- Data Exports: CSV export of user transactions and PDF receipts for individual transactions.

**Section sources**
- [backend/app/services/admin_analytics.py:25-33](file://backend/app/services/admin_analytics.py#L25-L33)
- [backend/app/services/admin_analytics.py:36-59](file://backend/app/services/admin_analytics.py#L36-L59)
- [backend/app/services/admin_dashboard.py:35-41](file://backend/app/services/admin_dashboard.py#L35-L41)
- [backend/app/insights/service.py:71-94](file://backend/app/insights/service.py#L71-L94)
- [backend/app/insights/service.py:97-109](file://backend/app/insights/service.py#L97-L109)
- [backend/app/insights/service.py:112-129](file://backend/app/insights/service.py#L112-L129)
- [backend/app/insights/service.py:132-147](file://backend/app/insights/service.py#L132-L147)
- [backend/app/exports/csv_export.py:22-64](file://backend/app/exports/csv_export.py#L22-L64)
- [backend/app/exports/pdf_export.py:24-71](file://backend/app/exports/pdf_export.py#L24-L71)

## Architecture Overview
The admin analytics feature set is composed of:
- Backend routers exposing REST endpoints for analytics and exports.
- Services implementing SQL queries and aggregations over user, transaction, and reward models.
- Frontend pages consuming these endpoints and rendering KPI cards, tables, and insights.
- Optional export utilities for CSV and PDF.

```mermaid
sequenceDiagram
participant FE as "AdminAnalytics.jsx"
participant API as "FastAPI Backend"
participant SAA as "admin_analytics Service"
participant SAD as "admin_dashboard Service"
participant IS as "insights Service"
participant ER as "exports Router"
FE->>API : GET /admin/analytics/summary
API->>SAA : get_admin_analytics_summary()
SAA-->>API : {summary}
API-->>FE : JSON summary
FE->>API : GET /admin/analytics/top-users
API->>SAA : get_top_users_by_activity()
SAA-->>API : [{top users}]
API-->>FE : JSON top users
FE->>API : GET /admin/dashboard/summary
API->>SAD : get_admin_dashboard_summary()
SAD-->>API : {dashboard summary}
API-->>FE : JSON dashboard summary
FE->>API : GET /insights/summary | /insights/monthly | /insights/categories | /insights/dashboard/daily
API->>IS : get_*()
IS-->>API : {insights}
API-->>FE : JSON insights
FE->>API : GET /exports/transactions/csv | /exports/transactions/{id}/pdf
API->>ER : export_*()
ER-->>FE : Streamed file
```

**Diagram sources**
- [frontend/src/pages/admin/AdminAnalytics.jsx:43-59](file://frontend/src/pages/admin/AdminAnalytics.jsx#L43-L59)
- [backend/app/routers/admin_analytics.py:13-20](file://backend/app/routers/admin_analytics.py#L13-L20)
- [backend/app/services/admin_analytics.py:25-59](file://backend/app/services/admin_analytics.py#L25-L59)
- [backend/app/routers/admin_dashboard.py:11-13](file://backend/app/routers/admin_dashboard.py#L11-L13)
- [backend/app/services/admin_dashboard.py:35-41](file://backend/app/services/admin_dashboard.py#L35-L41)
- [backend/app/insights/router.py:17-51](file://backend/app/insights/router.py#L17-L51)
- [backend/app/insights/service.py:71-147](file://backend/app/insights/service.py#L71-L147)
- [backend/app/exports/router.py:33-50](file://backend/app/exports/router.py#L33-L50)

## Detailed Component Analysis

### Admin Analytics Summary
- Purpose: Provide a high-level overview of system usage and compliance.
- Data sources: users, transactions, rewards.
- Aggregation methods:
  - Count of users.
  - Count of users grouped by KYC status.
  - Count of transactions.
  - Count of rewards.
- Output model: AdminAnalyticsSummary.

```mermaid
flowchart TD
Start(["Call get_admin_analytics_summary"]) --> QUsers["Count users"]
QUsers --> QKYC["Count users by KYC status"]
QKYC --> QTxns["Count transactions"]
QTxns --> QRew["Count rewards"]
QRew --> Build["Build summary dict"]
Build --> End(["Return summary"])
```

**Diagram sources**
- [backend/app/services/admin_analytics.py:25-33](file://backend/app/services/admin_analytics.py#L25-L33)
- [backend/app/models/user.py:31-34](file://backend/app/models/user.py#L31-L34)
- [backend/app/models/transaction.py:32-58](file://backend/app/models/transaction.py#L32-L58)
- [backend/app/models/reward.py:5-13](file://backend/app/models/reward.py#L5-L13)

**Section sources**
- [backend/app/services/admin_analytics.py:25-33](file://backend/app/services/admin_analytics.py#L25-L33)
- [backend/app/schemas/admin_analytics.py:4-10](file://backend/app/schemas/admin_analytics.py#L4-L10)

### Top Users by Activity
- Purpose: Identify most active users by transaction volume and spend.
- Data sources: users joined with transactions.
- Aggregation methods:
  - Group by user.
  - Count transactions and sum amounts.
  - Order by transaction count descending.
- Output model: TopUserAnalytics.

```mermaid
flowchart TD
Start(["Call get_top_users_by_activity"]) --> Join["Join User and Transaction"]
Join --> Group["Group by User.id"]
Group --> Agg["Aggregate count(txn), sum(amount)"]
Agg --> Order["Order by count desc"]
Order --> Limit["Limit N (default 5)"]
Limit --> Map["Map to TopUserAnalytics"]
Map --> End(["Return list"])
```

**Diagram sources**
- [backend/app/services/admin_analytics.py:36-59](file://backend/app/services/admin_analytics.py#L36-L59)
- [backend/app/models/user.py:37-64](file://backend/app/models/user.py#L37-L64)
- [backend/app/models/transaction.py:32-58](file://backend/app/models/transaction.py#L32-L58)

**Section sources**
- [backend/app/services/admin_analytics.py:36-59](file://backend/app/services/admin_analytics.py#L36-L59)
- [backend/app/schemas/admin_analytics.py:13-17](file://backend/app/schemas/admin_analytics.py#L13-L17)

### Admin Dashboard Summary
- Purpose: Daily operational snapshot for admin dashboard.
- Data sources: users, transactions, alerts.
- Aggregation methods:
  - Total users.
  - Pending KYC users.
  - Transactions for today.
  - Unread alerts.

```mermaid
flowchart TD
Start(["Call get_admin_dashboard_summary"]) --> TU["Count users"]
TU --> PK["Count pending KYC"]
PK --> TT["Count today's transactions"]
TT --> UA["Count unread alerts"]
UA --> Build["Build dashboard summary"]
Build --> End(["Return summary"])
```

**Diagram sources**
- [backend/app/services/admin_dashboard.py:35-41](file://backend/app/services/admin_dashboard.py#L35-L41)
- [backend/app/models/user.py:31-34](file://backend/app/models/user.py#L31-L34)
- [backend/app/models/transaction.py:32-58](file://backend/app/models/transaction.py#L32-L58)
- [backend/app/models/alert.py](file://backend/app/models/alert.py)

**Section sources**
- [backend/app/services/admin_dashboard.py:35-41](file://backend/app/services/admin_dashboard.py#L35-L41)
- [backend/app/routers/admin_dashboard.py:11-13](file://backend/app/routers/admin_dashboard.py#L11-L13)

### User Insights (Per-User)
- Purpose: Provide personal finance insights for users.
- Endpoints:
  - Summary: total income, total expense, savings.
  - Monthly spending: daily aggregated amounts for a given month/year.
  - Category breakdown: spending by category for a given month/year.
  - Dashboard daily insights: income/expense over a recent number of days.
- Data sources: transactions, accounts.
- Aggregation methods:
  - Sum amounts by type (credit/debit).
  - Group by date or category.
  - Fill missing dates with zeros for consistent series.

```mermaid
sequenceDiagram
participant FE as "AdminAnalytics.jsx"
participant IR as "insights/router.py"
participant IS as "insights/service.py"
FE->>IR : GET /insights/summary
IR->>IS : get_insights_summary(user_id)
IS-->>IR : {total_income, total_expense, savings}
IR-->>FE : JSON summary
FE->>IR : GET /insights/monthly?month&year
IR->>IS : get_monthly_spending(user_id, month, year)
IS-->>IR : [{date, amount}]
IR-->>FE : JSON monthly
FE->>IR : GET /insights/categories?month&year
IR->>IS : get_category_breakdown(user_id, month, year)
IS-->>IR : [{category, amount}]
IR-->>FE : JSON categories
FE->>IR : GET /insights/dashboard/daily?days
IR->>IS : get_dashboard_daily_insights(user_id, days)
IS-->>IR : [{date, income, expense}]
IR-->>FE : JSON daily
```

**Diagram sources**
- [backend/app/insights/router.py:17-51](file://backend/app/insights/router.py#L17-L51)
- [backend/app/insights/service.py:71-147](file://backend/app/insights/service.py#L71-L147)
- [backend/app/insights/schemas.py:4-17](file://backend/app/insights/schemas.py#L4-L17)

**Section sources**
- [backend/app/insights/service.py:71-94](file://backend/app/insights/service.py#L71-L94)
- [backend/app/insights/service.py:97-109](file://backend/app/insights/service.py#L97-L109)
- [backend/app/insights/service.py:112-129](file://backend/app/insights/service.py#L112-L129)
- [backend/app/insights/service.py:132-147](file://backend/app/insights/service.py#L132-L147)

### Data Exports
- CSV Export: Streams a CSV of all user transactions with headers for ID, account, date, type, category, description, amount, and currency.
- PDF Receipt: Generates a PDF receipt for a single transaction with labeled fields.

```mermaid
sequenceDiagram
participant FE as "AdminAnalytics.jsx"
participant ER as "exports/router.py"
participant ECSV as "csv_export.py"
participant EPDF as "pdf_export.py"
FE->>ER : GET /exports/transactions/csv
ER->>ECSV : export_transactions_csv(user_id)
ECSV-->>ER : StreamingResponse(csv)
ER-->>FE : CSV file
FE->>ER : GET /exports/transactions/{id}/pdf
ER->>EPDF : generate_transaction_pdf(transaction)
EPDF-->>ER : StreamingResponse(pdf)
ER-->>FE : PDF file
```

**Diagram sources**
- [backend/app/exports/router.py:33-50](file://backend/app/exports/router.py#L33-L50)
- [backend/app/exports/csv_export.py:22-64](file://backend/app/exports/csv_export.py#L22-L64)
- [backend/app/exports/pdf_export.py:24-71](file://backend/app/exports/pdf_export.py#L24-L71)

**Section sources**
- [backend/app/exports/csv_export.py:22-64](file://backend/app/exports/csv_export.py#L22-L64)
- [backend/app/exports/pdf_export.py:24-71](file://backend/app/exports/pdf_export.py#L24-L71)

### Frontend Integration and Rendering
- The Admin Analytics page fetches:
  - Admin analytics summary.
  - Top users by activity.
  - Renders KPI cards, KYC overview, transaction overview, and a top users table.
- API endpoints used:
  - /admin/analytics/summary
  - /admin/analytics/top-users

```mermaid
sequenceDiagram
participant Page as "AdminAnalytics.jsx"
participant Const as "constants/index.js"
participant BE as "admin_analytics Router"
Page->>Const : Read API_ENDPOINTS
Const-->>Page : ADMIN_ANALYTICS_SUMMARY, ADMIN_ANALYTICS_TOP_USERS
Page->>BE : GET /admin/analytics/summary
BE-->>Page : JSON summary
Page->>BE : GET /admin/analytics/top-users
BE-->>Page : JSON top users
Page-->>Page : Render cards and table
```

**Diagram sources**
- [frontend/src/pages/admin/AdminAnalytics.jsx:43-59](file://frontend/src/pages/admin/AdminAnalytics.jsx#L43-L59)
- [frontend/src/constants/index.js:127-128](file://frontend/src/constants/index.js#L127-L128)

**Section sources**
- [frontend/src/pages/admin/AdminAnalytics.jsx:28-59](file://frontend/src/pages/admin/AdminAnalytics.jsx#L28-L59)
- [frontend/src/constants/index.js:127-128](file://frontend/src/constants/index.js#L127-L128)

## Dependency Analysis
- Backend routers depend on services for computation and SQLAlchemy sessions for persistence.
- Services depend on models for schema definitions and query constructs.
- Frontend depends on centralized constants for endpoint URLs and consumes backend JSON responses.
- Exports depend on streaming responses to deliver downloadable content.

```mermaid
graph LR
FE["AdminAnalytics.jsx"] --> EP["constants/index.js"]
FE --> RAA["admin_analytics Router"]
RAA --> SAA["admin_analytics Service"]
SAA --> MU["user Model"]
SAA --> MT["transaction Model"]
SAA --> MR["reward Model"]
FE --> RAD["admin_dashboard Router"]
RAD --> SAD["admin_dashboard Service"]
FE --> IR["insights Router"]
IR --> IS["insights Service"]
FE --> ER["exports Router"]
ER --> ECSV["csv_export"]
ER --> EPDF["pdf_export"]
```

**Diagram sources**
- [frontend/src/pages/admin/AdminAnalytics.jsx:1-429](file://frontend/src/pages/admin/AdminAnalytics.jsx#L1-L429)
- [frontend/src/constants/index.js:127-128](file://frontend/src/constants/index.js#L127-L128)
- [backend/app/routers/admin_analytics.py:1-21](file://backend/app/routers/admin_analytics.py#L1-L21)
- [backend/app/services/admin_analytics.py:1-60](file://backend/app/services/admin_analytics.py#L1-L60)
- [backend/app/routers/admin_dashboard.py:1-14](file://backend/app/routers/admin_dashboard.py#L1-L14)
- [backend/app/services/admin_dashboard.py:1-42](file://backend/app/services/admin_dashboard.py#L1-L42)
- [backend/app/insights/router.py:1-52](file://backend/app/insights/router.py#L1-L52)
- [backend/app/insights/service.py:1-148](file://backend/app/insights/service.py#L1-L148)
- [backend/app/exports/router.py:1-51](file://backend/app/exports/router.py#L1-L51)
- [backend/app/exports/csv_export.py:1-65](file://backend/app/exports/csv_export.py#L1-L65)
- [backend/app/exports/pdf_export.py:1-72](file://backend/app/exports/pdf_export.py#L1-L72)

**Section sources**
- [backend/app/services/admin_analytics.py:1-60](file://backend/app/services/admin_analytics.py#L1-L60)
- [backend/app/services/admin_dashboard.py:1-42](file://backend/app/services/admin_dashboard.py#L1-L42)
- [backend/app/insights/service.py:1-148](file://backend/app/insights/service.py#L1-L148)
- [backend/app/exports/csv_export.py:1-65](file://backend/app/exports/csv_export.py#L1-L65)
- [backend/app/exports/pdf_export.py:1-72](file://backend/app/exports/pdf_export.py#L1-L72)

## Performance Considerations
- Aggregation queries:
  - Use indexed columns (user_id, txn_date) to optimize joins and filters.
  - Prefer scalar counts and coalesced sums to minimize Python-side computation.
- Pagination and limits:
  - Top users query applies a limit to avoid large result sets.
- Streaming exports:
  - CSV and PDF exports stream responses to reduce memory overhead.
- Frequency:
  - Admin dashboard summary computes daily counts; consider caching for repeated reads during a single session.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
- Admin analytics summary returns zeros:
  - Verify user and transaction data exists; confirm KYC status enum values match expectations.
- Top users list empty:
  - Confirm users have associated transactions; check join conditions and grouping.
- Export endpoints fail:
  - Ensure user is authenticated; verify transaction ownership checks for PDF receipts.
- Insight endpoints return unexpected totals:
  - Confirm month and year parameters; verify date extraction and grouping logic.

**Section sources**
- [backend/app/services/admin_analytics.py:36-59](file://backend/app/services/admin_analytics.py#L36-L59)
- [backend/app/exports/router.py:25-50](file://backend/app/exports/router.py#L25-L50)
- [backend/app/insights/service.py:97-147](file://backend/app/insights/service.py#L97-L147)

## Conclusion
The admin analytics and reporting subsystem delivers essential usage statistics, financial metrics, and user engagement insights. It aggregates data from users, transactions, and rewards, and surfaces them via dedicated endpoints. The frontend renders actionable summaries and top-user rankings, while export utilities enable CSV and PDF downloads. Extending the system with scheduled reporting, trend analysis, and customizable dashboard widgets would further enhance administrative decision-making.

[No sources needed since this section summarizes without analyzing specific files]

## Appendices

### API Definitions
- Admin Analytics Summary
  - Method: GET
  - Path: /admin/analytics/summary
  - Response: AdminAnalyticsSummary
- Top Users by Activity
  - Method: GET
  - Path: /admin/analytics/top-users
  - Response: List[TopUserAnalytics]
- Admin Dashboard Summary
  - Method: GET
  - Path: /admin/dashboard/summary
  - Response: AdminDashboardSummary
- User Insights
  - Summary: GET /insights/summary → InsightsSummary
  - Monthly Spending: GET /insights/monthly?month={int}&year={int} → List[MonthlySpendingItem]
  - Category Breakdown: GET /insights/categories?month={int}&year={int} → List[CategoryBreakdownItem]
  - Dashboard Daily: GET /insights/dashboard/daily?days={int} → List[DailyInsightItem]
- Exports
  - CSV: GET /exports/transactions/csv → text/csv
  - PDF Receipt: GET /exports/transactions/{id}/pdf → application/pdf

**Section sources**
- [backend/app/routers/admin_analytics.py:13-20](file://backend/app/routers/admin_analytics.py#L13-L20)
- [backend/app/routers/admin_dashboard.py:11-13](file://backend/app/routers/admin_dashboard.py#L11-L13)
- [backend/app/insights/router.py:17-51](file://backend/app/insights/router.py#L17-L51)
- [backend/app/exports/router.py:33-50](file://backend/app/exports/router.py#L33-L50)
- [frontend/src/constants/index.js:127-128](file://frontend/src/constants/index.js#L127-L128)