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

  const userRoutes = ["/internships", "/articles", "/articleform", "/companies", "/resume", "/submittedresume", "/myapplications", "/myarticles"];
  const employerRoutes = ["/employer", "/internshipform", "/applicants", "/esignup"];

  if (!isAuthenticated && !publicRoutes.includes(location.pathname)) {
    return <Navigate to="/login" />;
  }

  if (isAuthenticated && publicRoutes.includes(location.pathname)) {
    if (userType === 1) {
      return <Navigate to="/internships" />;
    } else if (userType === 2) {
      return <Navigate to="/employer" />;
    }
  }

  if (userType === 1 && employerRoutes.includes(location.pathname)) {
    return <Navigate to="/internships" />;
  }

  if (userType === 2 && userRoutes.includes(location.pathname)) {
    return <Navigate to="/employer" />;
  }

  return children;
};

export default ProtectedRoute;
