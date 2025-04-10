
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const PrivateRoute = ({ children, adminOnly = false }: PrivateRouteProps) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  
  // If admin-only route and user is not admin
  if (adminOnly && !isAdmin) {
    return <Navigate to="/staff/login" state={{ from: location }} replace />;
  }
  
  // If not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/staff/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

export default PrivateRoute;
