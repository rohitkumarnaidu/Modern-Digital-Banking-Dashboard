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

const attachAuthHeader = (config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(attachAuthHeader);

const request = (method, endpoint, dataOrParams) => {
  if (method === "get") {
    return api.get(endpoint, dataOrParams ? { params: dataOrParams } : undefined);
  }
  if (method === "delete") {
    return api.delete(endpoint);
  }
  return api[method](endpoint, dataOrParams);
};

const getRequest = (endpoint, params) => request("get", endpoint, params);
const postRequest = (endpoint, data) => request("post", endpoint, data);
const patchRequest = (endpoint, data) => request("patch", endpoint, data);
const deleteRequest = (endpoint) => request("delete", endpoint);

export const forgotPassword = (data) => postRequest(API_ENDPOINTS.FORGOT_PASSWORD, data);
export const verifyOtp = (data) => postRequest(API_ENDPOINTS.VERIFY_OTP, data);
export const resetPassword = (data) => postRequest(API_ENDPOINTS.RESET_PASSWORD, data);

export const changeAccountPin = (data) => postRequest(API_ENDPOINTS.CHANGE_PIN, data);

export const getBudgets = (month, year) => getRequest(API_ENDPOINTS.BUDGETS, { month, year });
export const createBudget = (data) => postRequest(API_ENDPOINTS.BUDGETS, data);
export const updateBudget = (id, data) => patchRequest(`${API_ENDPOINTS.BUDGETS}/${id}`, data);
export const deleteBudget = (id) => deleteRequest(`${API_ENDPOINTS.BUDGETS}/${id}`);

export const getRewards = () => getRequest(API_ENDPOINTS.REWARDS);

export const payBill = (data) => postRequest(API_ENDPOINTS.PAY_BILL, data);

export const getInsightsSummary = () => getRequest(API_ENDPOINTS.INSIGHTS_SUMMARY);
export const getMonthlySpending = (month, year) =>
  getRequest(API_ENDPOINTS.MONTHLY_SPENDING, { month, year });
export const getCategoryBreakdown = (month, year) =>
  getRequest(API_ENDPOINTS.CATEGORY_BREAKDOWN, { month, year });

export const getRecentTransactions = () =>
  getRequest(API_ENDPOINTS.TRANSACTIONS, { limit: 3 });

export default api;
