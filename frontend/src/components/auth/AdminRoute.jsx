import { Navigate } from "react-router-dom";

import { ROUTES } from "@/constants";
import { getAccessToken, getUser } from "@/utils/storage";

const isAdminSession = () => {
  const token = getAccessToken();
  const user = getUser();
  return Boolean(token && user && user.is_admin === true);
};

const AdminRoute = ({ children }) => {
  if (!getAccessToken() || !getUser()) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (isAdminSession()) {
    return children;
  }

  return <Navigate to={ROUTES.DASHBOARD} replace />;
};

export default AdminRoute;
