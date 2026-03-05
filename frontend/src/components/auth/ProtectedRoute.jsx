/**
 * Component: ProtectedRoute
 *
 * Purpose:
 * - Restricts access to authenticated users only
 * - Prevents unauthenticated users from accessing dashboard pages
 *
 * Key Behavior:
 * - Checks login/auth state (token/session)
 * - Redirects to Login page if user is not authenticated
 *
 * Connected Files:
 * - Wraps all dashboard routes in App.jsx
 *
 * Security Role:
 * - Acts as the first layer of frontend route protection
 */

import { Navigate } from "react-router-dom";

import { ROUTES } from "@/constants";
import { getAccessToken, getUser } from "@/utils/storage";

const hasUserToken = () => Boolean(getAccessToken());
const isAdminUser = () => Boolean(getUser()?.is_admin);

const ProtectedRoute = ({ children }) => {
  if (!hasUserToken()) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (isAdminUser()) {
    return <Navigate to={ROUTES.ADMIN} replace />;
  }

  return children;
};

export default ProtectedRoute;
