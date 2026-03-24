# 🏦 Aureus – Modern Digital Banking Dashboard

**Aureus** is a full-stack digital banking application developed as part of the  
**Infosys Springboard – Modern Digital Banking Dashboard internship project**.

It simulates real-world banking systems including UPI payments, account management, KYC workflows, admin controls, transaction analytics, budgeting, bill payments, rewards, and push notifications.

---

## 📋 Table of Contents

- [Project Structure](#-project-structure)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)

---

## 📦 Project Structure

```
Modern-Digital-Banking-Dashboard/
│
├── frontend/                    # React + Vite application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── auth/            # Authentication components
│   │   │   ├── common/          # Common UI components
│   │   │   └── user/            # User-specific components
│   │   ├── pages/
│   │   │   ├── user/            # 35+ user dashboard pages
│   │   │   └── admin/           # 10 admin panel pages
│   │   ├── context/             # React Context providers
│   │   ├── hooks/               # Custom React hooks
│   │   ├── services/            # API service layer
│   │   ├── utils/               # Utility functions
│   │   ├── constants/           # App constants & API endpoints
│   │   └── styles/              # Global styles
│   ├── public/                  # Static assets
│   └── dist/                    # Production build
│
├── backend/                     # FastAPI backend
│   ├── app/
│   │   ├── models/              # SQLAlchemy ORM models
│   │   ├── routers/             # API route handlers
│   │   ├── services/            # Business logic layer
│   │   ├── utils/               # Utility modules
│   │   ├── auth/                # Authentication module
│   │   ├── accounts/            # Account management
│   │   ├── transactions/        # Transaction handling
│   │   ├── transfers/           # Money transfer logic
│   │   ├── budgets/             # Budget management
│   │   ├── bills/               # Bill payments
│   │   ├── rewards/             # Rewards program
│   │   ├── insights/            # Financial insights
│   │   ├── alerts/              # Alert system
│   │   ├── exports/             # CSV & PDF exports
│   │   ├── firebase/            # Push notifications
│   │   └── tasks/               # Background tasks
│   ├── alembic/                 # Database migrations
│   └── scripts/                 # Utility scripts
│
├── docs/                        # Documentation
│   ├── api-spec.md              # API specification
│   └── database-schema.md       # Database documentation
│
└── README.md
```

---

## ✨ Key Features

### 👤 User Features

| Feature | Description |
|---------|-------------|
| **Authentication** | Secure JWT-based auth with access & refresh tokens, OTP verification |
| **Account Management** | Add, manage, and delete bank accounts with PIN security |
| **Money Transfers** | UPI, Bank-to-Bank, and Self transfers with transaction PIN verification |
| **Balance Inquiry** | Check account balances with PIN authentication |
| **Transaction History** | View, filter, search transactions with CSV import support |
| **Budget Management** | Create monthly budgets by category, track spending |
| **Bill Payments** | Pay utility bills, mobile recharge, track upcoming/overdue bills |
| **Rewards Program** | Earn and track reward points across programs |
| **Financial Insights** | Cash flow analysis, category breakdown, spending trends |
| **Alerts & Notifications** | Real-time push notifications via Firebase, in-app alerts |
| **Profile Management** | Update profile, change PIN, security settings |
| **KYC Status** | Track verification status |
| **Export Reports** | Download transactions as CSV or PDF receipts |

### 🛠 Admin Features

| Feature | Description |
|---------|-------------|
| **Admin Dashboard** | Overview of system statistics and metrics |
| **User Management** | View, search, and manage all registered users |
| **KYC Approval** | Review and approve/reject KYC applications |
| **Transaction Monitoring** | View all transactions across the platform |
| **Rewards Management** | Create and manage reward programs |
| **Analytics Dashboard** | Platform-wide analytics and insights |
| **Alert Management** | System-wide alert monitoring |
| **Admin Settings** | Profile and password management |

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 19** | UI library |
| **Vite 7** | Build tool & dev server |
| **React Router 6** | Client-side routing |
| **Tailwind CSS 3** | Utility-first CSS framework |
| **Axios** | HTTP client |
| **Recharts 3** | Charts and data visualization |
| **Lucide React** | Icon library |
| **Firebase** | Push notifications (FCM) |

### Backend

| Technology | Purpose |
|------------|---------|
| **FastAPI** | Python web framework |
| **PostgreSQL** | Primary database (Neon cloud) |
| **SQLAlchemy 2** | ORM for database operations |
| **Alembic** | Database migrations |
| **Pydantic 2** | Data validation |
| **JWT (python-jose)** | Authentication tokens |
| **Passlib + bcrypt** | Password hashing |
| **Firebase Admin** | Push notification service |
| **ReportLab** | PDF generation |
| **SMTP** | Email service (OTP delivery) |

---

## 🗄️ Database Schema

The application uses PostgreSQL with the following main tables:

| Table | Description |
|-------|-------------|
| `users` | User accounts, authentication, KYC status |
| `accounts` | Bank accounts with PIN hashes |
| `transactions` | Transaction history |
| `budgets` | Monthly budget categories |
| `bills` | Bill reminders and payments |
| `rewards` | User reward programs |
| `alerts` | System-generated alerts |
| `audit_logs` | Admin action audit trail |
| `user_devices` | Device management |
| `user_settings` | User preferences |

See [`docs/database-schema.md`](docs/database-schema.md) for detailed schema documentation.

---

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` – Register new user
- `POST /login` – Authenticate user
- `GET /me` – Get current user profile
- `POST /forgot-password` – Request password reset
- `POST /verify-otp` – Verify OTP
- `POST /reset-password` – Reset password

### Accounts (`/accounts`)
- `GET /` – List user accounts
- `POST /` – Create new account
- `PUT /{id}` – Update account
- `DELETE /{id}` – Delete account

### Transactions (`/transactions`)
- `GET /` – List transactions (filterable)
- `POST /` – Create transaction
- `POST /import/csv` – Import from CSV

### Transfers (`/transfers`)
- `POST /` – Process money transfer

### Budgets (`/budgets`)
- `GET /` – List budgets by month/year
- `POST /` – Create budget
- `PATCH /{id}` – Update budget
- `DELETE /{id}` – Delete budget

### Bills (`/bills`)
- `GET /` – List bills
- `POST /` – Create bill reminder
- `POST /pay` – Pay a bill
- `PUT /{id}` – Update bill
- `DELETE /{id}` – Delete bill

### Rewards (`/rewards`)
- `GET /` – List user rewards
- `GET /available` – List available reward programs

### Insights (`/insights`)
- `GET /summary` – Financial summary
- `GET /monthly` – Monthly spending
- `GET /categories` – Category breakdown

### Alerts (`/alerts`)
- `GET /` – List user alerts
- `POST /mark-read` – Mark alerts as read

### Exports (`/exports`)
- `GET /transactions/csv` – Export transactions as CSV
- `GET /transactions/{id}/pdf` – Generate transaction receipt PDF

### Admin APIs (`/admin`)
- `GET /users` – List all users
- `GET /dashboard/summary` – Admin dashboard stats
- `PUT /users/{id}/kyc` – Update KYC status
- `GET /transactions` – Monitor all transactions
- `GET /analytics/summary` – Platform analytics

See [`docs/api-spec.md`](docs/api-spec.md) for complete API documentation.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL (or use Neon cloud)

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

### Run Backend

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload
```

Backend runs at: **http://127.0.0.1:8000**

Swagger API Docs: **http://127.0.0.1:8000/docs**

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# JWT
JWT_SECRET_KEY=your-secret-key
JWT_REFRESH_SECRET_KEY=your-refresh-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
refresh_token_expire_days=7

# Email (OTP)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Firebase (Push Notifications)
FIREBASE_CREDENTIALS_JSON={"type":"service_account",...}

# Admin Seeding (optional - creates default admin on first run)
SEED_ADMIN_EMAIL=your-admin@example.com
SEED_ADMIN_PASSWORD=YourSecurePassword123
SEED_ADMIN_NAME=Admin Name
SEED_ADMIN_PHONE=1234567890
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## 🚢 Deployment

### Frontend (Vercel)

The frontend is configured for Vercel deployment with SPA routing support:

```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

### Backend (Render)

The backend is deployed on Render with PostgreSQL on Neon cloud.

---

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **xs**: 320px
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

---

## 🔐 Security Features

- **JWT Authentication** with access & refresh tokens
- **Password Hashing** using bcrypt
- **Transaction PIN** verification for payments
- **OTP Verification** for password reset
- **KYC Workflow** for identity verification
- **Admin Role-Based Access Control**

---

## 📄 License

This project is developed as part of the **Infosys Springboard Internship Program**.

---

## 👨‍💻 Author

Developed during the Infosys Springboard Internship.
