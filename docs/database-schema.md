# Database Schema – Aureus Modern Digital Banking Platform

Aureus is a Modern Digital Banking Dashboard developed as part of the Infosys Springboard Internship.

This document describes the PostgreSQL database schema used in the **Modern Digital Banking Dashboard** application.

The schema is designed to support authentication, accounts, transactions, budgeting, bills, rewards, insights, and alerts.

---

## 1. Users

Stores user authentication and profile information.

| Column Name   | Type        | Constraints |
|--------------|------------|-------------|
| id           | INTEGER    | Primary Key |
| name         | VARCHAR    | Not Null |
| email        | VARCHAR    | Unique, Not Null |
| password     | VARCHAR    | Not Null (hashed) |
| phone        | VARCHAR    | Nullable |
| kyc_status   | ENUM       | `unverified`, `verified`, `rejected` |
| is_admin     | BOOLEAN    | Default: false |
| created_at  | TIMESTAMP  | Default: current timestamp |

---

## 2. Accounts

Stores user-linked bank accounts.

| Column Name       | Type        | Constraints |
|------------------|------------|-------------|
| id               | INTEGER    | Primary Key |
| user_id          | INTEGER    | Foreign Key → users.id |
| bank_name        | VARCHAR    | Not Null |
| account_type     | ENUM       | `savings`, `checking`, `credit_card`, `loan`, `investment` |
| masked_account   | VARCHAR    | Not Null |
| currency         | CHAR(3)    | ISO currency code |
| balance          | NUMERIC    | Default: 0 |
| created_at       | TIMESTAMP  | Default: current timestamp |

---

## 3. Transactions

Stores transaction history for accounts.

| Column Name   | Type        | Constraints |
|--------------|------------|-------------|
| id           | INTEGER    | Primary Key |
| account_id  | INTEGER    | Foreign Key → accounts.id |
| description | VARCHAR    | Not Null |
| category    | VARCHAR    | Nullable |
| amount      | NUMERIC    | Not Null |
| currency    | CHAR(3)    | ISO currency code |
| txn_type    | ENUM       | `debit`, `credit` |
| merchant    | VARCHAR    | Nullable |
| txn_date    | TIMESTAMP  | Not Null |
| posted_date | TIMESTAMP  | Nullable |

---

## 4. Budgets

Tracks monthly budgets per category.

| Column Name     | Type        | Constraints |
|----------------|------------|-------------|
| id             | INTEGER    | Primary Key |
| user_id        | INTEGER    | Foreign Key → users.id |
| month          | INTEGER    | 1–12 |
| year           | INTEGER    | Not Null |
| category       | VARCHAR    | Not Null |
| limit_amount   | NUMERIC    | Not Null |
| spent_amount   | NUMERIC    | Default: 0 |
| created_at     | TIMESTAMP  | Default: current timestamp |

---

## 5. Bills

Stores bill reminders and payment status.

| Column Name   | Type        | Constraints |
|--------------|------------|-------------|
| id           | INTEGER    | Primary Key |
| user_id      | INTEGER    | Foreign Key → users.id |
| biller_name  | VARCHAR    | Not Null |
| due_date     | DATE       | Not Null |
| amount_due   | NUMERIC    | Not Null |
| status       | ENUM       | `upcoming`, `paid`, `overdue` |
| auto_pay     | BOOLEAN    | Default: false |
| created_at   | TIMESTAMP  | Default: current timestamp |

---

## 6. Rewards

Tracks reward points and programs.

| Column Name     | Type        | Constraints |
|----------------|------------|-------------|
| id             | INTEGER    | Primary Key |
| user_id        | INTEGER    | Foreign Key → users.id |
| program_name   | VARCHAR    | Not Null |
| points_balance | INTEGER    | Default: 0 |
| last_updated   | TIMESTAMP  | Default: current timestamp |

---

## 7. Alerts

Stores system-generated alerts.

| Column Name   | Type        | Constraints |
|--------------|------------|-------------|
| id           | INTEGER    | Primary Key |
| user_id      | INTEGER    | Foreign Key → users.id |
| type         | ENUM       | `low_balance`, `bill_due`, `budget_exceeded` |
| message      | TEXT       | Not Null |
| created_at   | TIMESTAMP  | Default: current timestamp |

---

## 8. Admin Logs (Optional)

Tracks admin actions for audit purposes.

| Column Name   | Type        | Constraints |
|--------------|------------|-------------|
| id           | INTEGER    | Primary Key |
| admin_id     | INTEGER    | Foreign Key → users.id |
| action       | TEXT       | Not Null |
| target_type  | VARCHAR    | Not Null |
| target_id    | INTEGER    | Nullable |
| timestamp    | TIMESTAMP  | Default: current timestamp |

---

## Notes

- All relationships are enforced using foreign keys.
- Passwords are securely hashed.
- JWT authentication is used for access control.
- Schema supports scalability and modular feature expansion.
