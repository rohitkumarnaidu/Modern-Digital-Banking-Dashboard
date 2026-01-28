Aureus (Modern Digital Banking Dashboard)

🔹 ENUM TYPES (PostgreSQL)
#--------------------------------------------------------
#
#--------------------------------------------------------
-- User KYC status
CREATE TYPE kyc_status_enum AS ENUM (
    'unverified',
    'verified',
    'rejected'
);

-- Transaction type
CREATE TYPE transaction_type_enum AS ENUM (
    'debit',
    'credit'
);

-- Admin reward status
CREATE TYPE reward_status_enum AS ENUM (
    'Pending',
    'Active'
);



👤 USER-SIDE TABLES
#--------------------------------------------------------
#
#--------------------------------------------------------
👤 users

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    phone VARCHAR NOT NULL,

    is_admin BOOLEAN DEFAULT FALSE NOT NULL,

    dob DATE,
    address VARCHAR,
    pin_code VARCHAR,

    kyc_status kyc_status_enum NOT NULL DEFAULT 'unverified',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMPTZ,

    reset_token VARCHAR,
    reset_token_expiry TIMESTAMPTZ
);


🏦 accounts

CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    bank_name VARCHAR(100) NOT NULL,
    account_type VARCHAR(50) NOT NULL,
    masked_account VARCHAR(20) NOT NULL,

    currency CHAR(3) DEFAULT 'INR',
    balance NUMERIC(12,2) DEFAULT 0,

    pin_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


💸 transactions

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL REFERENCES users(id),
    account_id INTEGER NOT NULL REFERENCES accounts(id),

    description VARCHAR NOT NULL,
    category VARCHAR DEFAULT 'Uncategorized',
    merchant VARCHAR,

    amount NUMERIC(12,2) NOT NULL,
    currency CHAR(3) DEFAULT 'INR',

    txn_type transaction_type_enum NOT NULL,
    txn_date DATE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


📊 budgets

CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),

    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    category VARCHAR NOT NULL,

    limit_amount NUMERIC(12,2) NOT NULL,
    spent_amount NUMERIC(12,2) DEFAULT 0,

    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);


🧾 bills

CREATE TABLE bills (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    account_id INTEGER NOT NULL REFERENCES accounts(id),

    biller_name VARCHAR NOT NULL,
    due_date DATE NOT NULL,
    amount_due NUMERIC(12,2) NOT NULL,

    status VARCHAR DEFAULT 'upcoming',
    auto_pay BOOLEAN DEFAULT FALSE
);


🎁 rewards (user rewards)

CREATE TABLE rewards (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),

    program_name VARCHAR NOT NULL,
    points_balance INTEGER DEFAULT 0,
    last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);


🚨 alerts

CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),

    type VARCHAR NOT NULL,
    message VARCHAR NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


🔐 otps

CREATE TABLE otps (
    id SERIAL PRIMARY KEY,
    identifier VARCHAR NOT NULL,
    otp VARCHAR,
    expires_at TIMESTAMP
);


📱 user_devices

CREATE TABLE user_devices (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),

    device_token VARCHAR UNIQUE NOT NULL,
    platform VARCHAR
);


⚙️ user_settings

CREATE TABLE user_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id),

    push_notifications BOOLEAN DEFAULT TRUE,
    email_alerts BOOLEAN DEFAULT TRUE,
    login_alerts BOOLEAN DEFAULT TRUE,
    two_factor_enabled BOOLEAN DEFAULT FALSE
);




🛠️ ADMIN-SIDE TABLES
#-------------------------------------------------------------
#
#-------------------------------------------------------------

🎯 admin_rewards

CREATE TABLE admin_rewards (
    id SERIAL PRIMARY KEY,

    name VARCHAR NOT NULL,
    description VARCHAR,

    reward_type VARCHAR NOT NULL,
    applies_to VARCHAR NOT NULL,
    value VARCHAR NOT NULL,

    status reward_status_enum NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


📜 audit_logs

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,

    admin_name VARCHAR NOT NULL,
    action VARCHAR NOT NULL,

    target_type VARCHAR,
    target_id INTEGER,
    details VARCHAR,

    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
