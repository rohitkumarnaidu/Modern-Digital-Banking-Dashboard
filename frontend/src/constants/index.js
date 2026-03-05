/**
 * Application Constants
 * Centralized constants for the frontend application
 */

// ==================== ROUTES ====================
export const ROUTES = {
  // Public
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_OTP: "/verify-otp",

  // Dashboard
  DASHBOARD: "/dashboard",
  DASHBOARD_HOME: "/dashboard",
  PROFILE: "/dashboard/profile",
  NOTIFICATIONS: "/dashboard/notifications",
  
  // Accounts
  ACCOUNTS: "/dashboard/accounts",
  VERIFY_IDENTITY: "/dashboard/accounts/verify-identity",
  VERIFY_OTP_ACCOUNT: "/dashboard/accounts/verify-otp",
  CHANGE_PIN: "/dashboard/accounts/change-pin",
  CHECK_BALANCE: "/dashboard/balance",
  
  // Transfers
  TRANSFERS: "/dashboard/transfers",
  TRANSFER_UPI: "/dashboard/transfers/upi",
  TRANSFER_SELF: "/dashboard/transfers/self",
  TRANSFER_BANK: "/dashboard/transfers/bank",
  PAYMENT_SUCCESS: "/dashboard/payment-success",
  PAYMENT_FAILED: "/dashboard/payment-failed",
  
  // Financial
  BUDGETS: "/dashboard/budgets",
  BUDGET_SUMMARY: "/dashboard/budgets/summary",
  TRANSACTIONS: "/dashboard/transactions",
  BILLS: "/dashboard/bills",
  BILL_PROCESSING: "/dashboard/bill-processing",
  
  // Rewards & Insights
  REWARDS: "/dashboard/rewards",
  TOTAL_EARNED: "/dashboard/rewards/total-earned",
  INSIGHTS: "/dashboard/insights",
  
  // Settings
  ALERTS: "/dashboard/alerts",
  SETTINGS: "/dashboard/settings",
  
  // Admin
  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_KYC: "/admin/kyc",
  ADMIN_TRANSACTIONS: "/admin/transactions",
  ADMIN_REWARDS: "/admin/rewards",
  ADMIN_ANALYTICS: "/admin/analytics",
  ADMIN_ALERTS: "/admin/alerts",
  ADMIN_SETTINGS: "/admin/settings",
};

// ==================== API ENDPOINTS ====================
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login/cookie",
  SIGNUP: "/auth/signup",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh/cookie",
  ME: "/auth/me",
  FORGOT_PASSWORD: "/auth/forgot-password",
  VERIFY_OTP: "/auth/verify-otp",
  RESET_PASSWORD: "/auth/reset-password",
  RESEND_LOGIN_OTP: "/auth/resend-login-otp",
  RESEND_PIN_OTP: "/auth/resend-pin-otp",
  
  // Accounts
  ACCOUNTS: "/accounts",
  CHANGE_PIN: "/accounts/change-pin",
  
  // Transactions
  TRANSACTIONS: "/transactions",
  TRANSACTIONS_EXPORT: "/transactions/export",
  TRANSACTIONS_IMPORT: "/transactions/import",
  
  // Transfers
  TRANSFERS: "/transfers",
  
  // Budgets
  BUDGETS: "/budgets",
  
  // Bills
  BILLS: "/bills",
  PAY_BILL: "/bills/pay",
  
  // Rewards
  REWARDS: "/rewards",
  REWARDS_AVAILABLE: "/rewards/available",
  
  // Insights
  INSIGHTS_SUMMARY: "/insights/summary",
  MONTHLY_SPENDING: "/insights/monthly",
  CATEGORY_BREAKDOWN: "/insights/categories",
  INSIGHTS_DASHBOARD_DAILY: "/insights/dashboard/daily",
  TRANSACTIONS_RECENT: "/transactions/recent",
  
  // Alerts
  ALERTS: "/alerts",
  ALERTS_MARK_READ: "/alerts/mark-read",
  
  // Settings
  SETTINGS: "/settings",

  // User
  USER_ME: "/user/me",

  // Admin
  ADMIN_DASHBOARD_SUMMARY: "/admin/dashboard/summary",
  ADMIN_USERS: "/admin/users",
  ADMIN_PROFILE: "/admin/profile",
  ADMIN_CHANGE_PASSWORD: "/admin/change-password",
  ADMIN_TRANSACTIONS: "/admin/transactions",
  ADMIN_TRANSACTIONS_EXPORT: "/admin/transactions/export",
  ADMIN_TRANSACTIONS_IMPORT: "/admin/transactions/import",
  ADMIN_ANALYTICS_SUMMARY: "/admin/analytics/summary",
  ADMIN_ANALYTICS_TOP_USERS: "/admin/analytics/top-users",
  ADMIN_ALERTS: "/admin/alerts",
  ADMIN_LOGS: "/admin/logs",
  ADMIN_REWARDS: "/admin/rewards",
};

// ==================== STORAGE KEYS ====================
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
  IS_LOGGED_IN: "isLoggedIn",
  RESET_OTP: "resetOtp",
  OTP_EXPIRY: "otpExpiry",
  RESET_EMAIL: "resetEmail",
  MOST_USED_BILLS: "mostUsedBills",
};

// ==================== USER ROLES ====================
export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
};

// ==================== KYC STATUS ====================
export const KYC_STATUS = {
  UNVERIFIED: "unverified",
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
};

// ==================== TRANSACTION TYPES ====================
export const TRANSACTION_TYPES = {
  DEBIT: "debit",
  CREDIT: "credit",
};

// ==================== TRANSACTION CATEGORIES ====================
export const TRANSACTION_CATEGORIES = [
  "Food",
  "Travel",
  "Bills",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Education",
  "Others",
];

// ==================== TRANSFER TYPES ====================
export const TRANSFER_TYPES = {
  UPI: "upi",
  BANK: "bank",
  SELF: "self",
};

// ==================== ACCOUNT TYPES ====================
export const ACCOUNT_TYPES = {
  SAVINGS: "savings",
  CURRENT: "current",
};

// ==================== VALIDATION RULES ====================
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_PIN_LENGTH: 4,
  MAX_PIN_LENGTH: 6,
  PHONE_LENGTH: 10,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\d{10}$/,
  MIN_AMOUNT: 1,
  MAX_AMOUNT: 100000,
};

// ==================== UI CONSTANTS ====================
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
};

export const COLORS = {
  PRIMARY: "#2E5A88",
  SECONDARY: "#3b82f6",
  SUCCESS: "#10b981",
  ERROR: "#ef4444",
  WARNING: "#f59e0b",
  INFO: "#3b82f6",
};

// ==================== MESSAGES ====================
export const MESSAGES = {
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logged out successfully",
  SIGNUP_SUCCESS: "Account created successfully",
  INVALID_CREDENTIALS: "Invalid email or password",
  NETWORK_ERROR: "Network error. Please try again.",
  GENERIC_ERROR: "Something went wrong. Please try again.",
};
