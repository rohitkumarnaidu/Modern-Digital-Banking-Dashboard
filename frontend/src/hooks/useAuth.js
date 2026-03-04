/**
 * useAuth Hook
 * Authentication state and operations
 */

import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants";
import {
  getUser,
  setUser,
  setAccessToken,
  setRefreshToken,
  setLoggedIn,
  clearAuthData,
  isLoggedIn as checkLoggedIn,
} from "../utils/storage";

export const useAuth = () => {
  const navigate = useNavigate();

  /**
   * Get current user
   */
  const getCurrentUser = () => {
    return getUser();
  };

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = () => {
    return checkLoggedIn();
  };

  /**
   * Check if user is admin
   */
  const isAdmin = () => {
    const user = getUser();
    return user?.is_admin === true;
  };

  /**
   * Login user
   */
  const login = (userData, tokens) => {
    setAccessToken(tokens.access_token);
    if (tokens.refresh_token) {
      setRefreshToken(tokens.refresh_token);
    }
    setUser(userData);
    setLoggedIn(true);
  };

  /**
   * Logout user
   */
  const logout = () => {
    clearAuthData();
    navigate(ROUTES.LOGIN);
  };

  /**
   * Update user data
   */
  const updateUser = (userData) => {
    const currentUser = getUser();
    const updatedUser = { ...currentUser, ...userData };
    setUser(updatedUser);
  };

  return {
    user: getCurrentUser(),
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
    login,
    logout,
    updateUser,
  };
};
