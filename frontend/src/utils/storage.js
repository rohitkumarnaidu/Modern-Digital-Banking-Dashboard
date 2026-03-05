/**
 * Storage Utilities
 * Centralized localStorage operations
 */

import { STORAGE_KEYS } from "../constants";

const safeStorageOperation = (operation, fallback, errorMessage) => {
  try {
    return operation();
  } catch (error) {
    console.error(errorMessage, error);
    return fallback;
  }
};

export const getStorageItem = (key) =>
  safeStorageOperation(
    () => localStorage.getItem(key),
    null,
    `Error getting ${key} from localStorage:`
  );

export const getStorageJSON = (key) =>
  safeStorageOperation(
    () => {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    },
    null,
    `Error parsing ${key} from localStorage:`
  );

export const setStorageItem = (key, value) =>
  safeStorageOperation(
    () => {
      localStorage.setItem(key, value);
      return true;
    },
    false,
    `Error setting ${key} in localStorage:`
  );

export const setStorageJSON = (key, value) =>
  safeStorageOperation(
    () => {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    },
    false,
    `Error setting ${key} in localStorage:`
  );

export const removeStorageItem = (key) =>
  safeStorageOperation(
    () => {
      localStorage.removeItem(key);
      return true;
    },
    false,
    `Error removing ${key} from localStorage:`
  );

export const clearStorage = () =>
  safeStorageOperation(
    () => {
      localStorage.clear();
      return true;
    },
    false,
    "Error clearing localStorage:"
  );

const AUTH_STORAGE_KEYS = {
  accessToken: STORAGE_KEYS.ACCESS_TOKEN,
  refreshToken: STORAGE_KEYS.REFRESH_TOKEN,
  user: STORAGE_KEYS.USER,
  isLoggedIn: STORAGE_KEYS.IS_LOGGED_IN,
};

export const getAccessToken = () => getStorageItem(AUTH_STORAGE_KEYS.accessToken);
export const setAccessToken = (token) => setStorageItem(AUTH_STORAGE_KEYS.accessToken, token);

export const getRefreshToken = () => getStorageItem(AUTH_STORAGE_KEYS.refreshToken);
export const setRefreshToken = (token) => setStorageItem(AUTH_STORAGE_KEYS.refreshToken, token);

export const getUser = () => getStorageJSON(AUTH_STORAGE_KEYS.user);
export const setUser = (user) => setStorageJSON(AUTH_STORAGE_KEYS.user, user);

export const isLoggedIn = () => getStorageItem(AUTH_STORAGE_KEYS.isLoggedIn) === "true";
export const setLoggedIn = (status) =>
  setStorageItem(AUTH_STORAGE_KEYS.isLoggedIn, status ? "true" : "false");

export const clearAuthData = () => {
  removeStorageItem(AUTH_STORAGE_KEYS.accessToken);
  removeStorageItem(AUTH_STORAGE_KEYS.refreshToken);
  removeStorageItem(AUTH_STORAGE_KEYS.user);
  removeStorageItem(AUTH_STORAGE_KEYS.isLoggedIn);
};
