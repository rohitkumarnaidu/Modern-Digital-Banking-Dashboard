/**
 * useAuth Hook
 * Authentication state and operations
 */

import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "../constants";
import {
  clearAuthData,
  getUser,
  isLoggedIn as checkLoggedIn,
  setAccessToken,
  setLoggedIn,
  setRefreshToken,
  setUser,
} from "../utils/storage";

const isAdminUser = (user) => user?.is_admin === true;

export const useAuth = () => {
  const navigate = useNavigate();

  const getCurrentUser = useCallback(() => getUser(), []);
  const isAuthenticated = useCallback(() => checkLoggedIn(), []);
  const isAdmin = useCallback(() => isAdminUser(getUser()), []);

  const login = useCallback((userData, tokens) => {
    setAccessToken(tokens.access_token);
    if (tokens.refresh_token) {
      setRefreshToken(tokens.refresh_token);
    }
    setUser(userData);
    setLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    clearAuthData();
    navigate(ROUTES.LOGIN);
  }, [navigate]);

  const updateUser = useCallback((userData) => {
    const currentUser = getUser();
    setUser({ ...currentUser, ...userData });
  }, []);

  const user = getCurrentUser();
  const authenticated = isAuthenticated();
  const admin = isAdmin();

  return useMemo(
    () => ({
      user,
      isAuthenticated: authenticated,
      isAdmin: admin,
      login,
      logout,
      updateUser,
    }),
    [user, authenticated, admin, login, logout, updateUser]
  );
};
