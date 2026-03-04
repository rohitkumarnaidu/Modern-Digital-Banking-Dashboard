/**
 * Storage Utilities
 * Centralized localStorage operations
 */

import { STORAGE_KEYS } from "../constants";

/**
 * Get item from localStorage
 */
export const getStorageItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return null;
  }
};

/**
 * Get JSON item from localStorage
 */
export const getStorageJSON = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    return null;
  }
};

/**
 * Set item in localStorage
 */
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
    return false;
  }
};

/**
 * Set JSON item in localStorage
 */
export const setStorageJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
    return false;
  }
};

/**
 * Remove item from localStorage
 */
export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
    return false;
  }
};

/**
 * Clear all localStorage
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error("Error clearing localStorage:", error);
    return false;
  }
};

// ==================== AUTH SPECIFIC ====================

/**
 * Get access token
 */
export const getAccessToken = () => {
  return getStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * Set access token
 */
export const setAccessToken = (token) => {
  return setStorageItem(STORAGE_KEYS.ACCESS_TOKEN, token);
};

/**
 * Get refresh token
 */
export const getRefreshToken = () => {
  return getStorageItem(STORAGE_KEYS.REFRESH_TOKEN);
};

/**
 * Set refresh token
 */
export const setRefreshToken = (token) => {
  return setStorageItem(STORAGE_KEYS.REFRESH_TOKEN, token);
};

/**
 * Get user data
 */
export const getUser = () => {
  return getStorageJSON(STORAGE_KEYS.USER);
};

/**
 * Set user data
 */
export const setUser = (user) => {
  return setStorageJSON(STORAGE_KEYS.USER, user);
};

/**
 * Check if user is logged in
 */
export const isLoggedIn = () => {
  return getStorageItem(STORAGE_KEYS.IS_LOGGED_IN) === "true";
};

/**
 * Set logged in status
 */
export const setLoggedIn = (status) => {
  return setStorageItem(STORAGE_KEYS.IS_LOGGED_IN, status ? "true" : "false");
};

/**
 * Clear auth data
 */
export const clearAuthData = () => {
  removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
  removeStorageItem(STORAGE_KEYS.REFRESH_TOKEN);
  removeStorageItem(STORAGE_KEYS.USER);
  removeStorageItem(STORAGE_KEYS.IS_LOGGED_IN);
};
