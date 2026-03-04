/**
 * Axios API service
 *
 * Purpose:
 * Centralized API configuration
 * for backend communication.
 *
 * Features:
 * - Base URL configuration
 * - Automatic auth token attachment
 * - Used across all pages requiring backend data
 */

import axios from "axios";
import { API_ENDPOINTS } from "../constants";
import { getAccessToken } from "../utils/storage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* =====================
   AUTH APIs
   ===================== */

export const forgotPassword = (data) => {
  return api.post(API_ENDPOINTS.FORGOT_PASSWORD, data);
};

export const verifyOtp = (data) => {
  return api.post(API_ENDPOINTS.VERIFY_OTP, data);
};

export const resetPassword = (data) => {
  return api.post(API_ENDPOINTS.RESET_PASSWORD, data);
};

/* =====================
   ACCOUNT APIs
   ===================== */

export const changeAccountPin = (data) => {
  return api.post(API_ENDPOINTS.CHANGE_PIN, data);
};

/* =====================
   BUDGETS API
   ===================== */

export const getBudgets = (month, year) => {
  return api.get(`${API_ENDPOINTS.BUDGETS}?month=${month}&year=${year}`);
};

export const createBudget = (data) => {
  return api.post(API_ENDPOINTS.BUDGETS, data);
};

export const updateBudget = (id, data) => {
  return api.patch(`${API_ENDPOINTS.BUDGETS}/${id}`, data);
};

export const deleteBudget = (id) => {
  return api.delete(`${API_ENDPOINTS.BUDGETS}/${id}`);
};

/* =====================
   REWARDS APIs
   ===================== */

export const getRewards = () => {
  return api.get(API_ENDPOINTS.REWARDS);
};

/* =====================
   BILLS API
   ===================== */

export const payBill = (data) => {
  return api.post(API_ENDPOINTS.PAY_BILL, data);
};

/* =====================
   INSIGHTS APIs
   ===================== */

export const getInsightsSummary = () => {
  return api.get(API_ENDPOINTS.INSIGHTS_SUMMARY);
};

export const getMonthlySpending = (month, year) => {
  return api.get(`${API_ENDPOINTS.MONTHLY_SPENDING}?month=${month}&year=${year}`);
};

export const getCategoryBreakdown = (month, year) => {
  return api.get(`${API_ENDPOINTS.CATEGORY_BREAKDOWN}?month=${month}&year=${year}`);
};

export const getRecentTransactions = () =>
  api.get(`${API_ENDPOINTS.TRANSACTIONS}?limit=3`);

export default api;
