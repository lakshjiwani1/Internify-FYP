// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserState } from "../store/user/user-slice";

const ProtectedRoute = ({ children, redirectTo }) => {
  const userState = useSelector(selectUserState);
  const userId = userState.details.user_id;
  const userType = userState.details.user_type;


  if (userType === 1) {
    return <Navigate to="/internships" />;
  } else if (userType === 2) {
    return <Navigate to="/employer" />;
  } else {
    return children;
  }
};

export default ProtectedRoute;
