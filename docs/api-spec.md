# API Specification – Aureus (Modern Digital Banking Dashboard)

This document defines the REST API endpoints used in the application.

/api
Authentication is handled using **JWT access tokens**.

---

## Module A – Authentication

### Register User
POST /auth/register

Creates a new user account.

### Login
POST /auth/login

Authenticates user and returns access & refresh tokens.

### Refresh Token
POST /auth/refresh

Generates a new access token.

### Get Current User
GET /auth/me

Returns logged-in user profile.

---

## Module B – Accounts & Transactions

### Create Account
POST /accounts

### Get User Accounts
GET /accounts


### Update Account
PUT /accounts/{account_id}


### Delete Account
DELETE /accounts/{account_id}

---

### Add Transaction
POST /transactions


### Get Transactions
GET /transactions

Supports filters: date range, account, category.

### Import Transactions (CSV)
POST /transactions/import

---

## Module C – Budgets & Categorization

### Create Budget
POST /budgets

### Get Budgets
GET /budgets

### Update Budget
PUT /budgets/{budget_id}


### Delete Budget
DELETE /budgets/{budget_id}

---

## Module D – Bills & Rewards

### Create Bill
POST /bills

### Get Bills
GET /bills

### Update Bill Status
PUT /bills/{bill_id}

---

### Get Rewards
GET /rewards

### Update Rewards
POST /rewards

---

## Module E – Insights & Alerts

### Cash Flow Insights
GET /insights/cashflow

### Top Merchants
GET /insights/top-merchants

### Budget Alerts
GET /alerts

---

## Admin APIs (Optional)

### Get All Users
GET /admin/users

### Update KYC Status
PUT /admin/users/{user_id}/kyc

---

## Security Notes

- All protected routes require `Authorization: Bearer <token>`
- Tokens are validated using FastAPI dependencies
- Role-based access is enforced for admin routes

---

## Status Codes

- `200 OK` – Success
- `201 Created` – Resource created
- `400 Bad Request` – Validation error
- `401 Unauthorized` – Invalid or missing token
- `403 Forbidden` – Access denied
- `404 Not Found` – Resource not found