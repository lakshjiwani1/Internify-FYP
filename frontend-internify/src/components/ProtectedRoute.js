// src/components/ProtectedRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserState } from "../store/user/user-slice";

const ProtectedRoute = ({ children }) => {
  const userState = useSelector(selectUserState);
  const isAuthenticated = userState.isAuthenticated;
  const userType = userState.details?.user_type;
  const location = useLocation();

  const publicRoutes = ["/", "/login", "/signup", "/esignup"];

  // If the user is not authenticated and tries to access a protected route
  if (!isAuthenticated && !publicRoutes.includes(location.pathname)) {
    return <Navigate to="/login" />;
  }

  // If the user is authenticated and tries to access a public route
  if (isAuthenticated && publicRoutes.includes(location.pathname)) {
    if (userType === 1) {
      return <Navigate to="/internships" />;
    } else if (userType === 2) {
      return <Navigate to="/employer" />;
    }
  }

  return children;
};

export default ProtectedRoute;
