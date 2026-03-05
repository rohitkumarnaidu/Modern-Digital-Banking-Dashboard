/**
 * Authentication context
 *
 * Purpose:
 * Manages global authentication state
 * such as logged-in user and tokens.
 *
 * Used by:
 * - ProtectedRoute.jsx
 * - Login.jsx
 * - Dashboard.jsx
 */

import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

import { API_ENDPOINTS } from "@/constants";
import api from "@/services/api";

export const AuthContext = createContext();

const INITIAL_AUTH_STATE = { user: null, accessToken: null };

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(INITIAL_AUTH_STATE);

  const tryRefresh = useCallback(async () => {
    try {
      const res = await api.post(API_ENDPOINTS.REFRESH);
      if (res?.data?.access_token) {
        setAuth({
          user: res.data.user,
          accessToken: res.data.access_token,
        });
      }
    } catch {
      // no active session
    }
  }, []);

  useEffect(() => {
    tryRefresh();
  }, [tryRefresh]);

  const contextValue = useMemo(() => ({ auth, setAuth }), [auth]);
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
