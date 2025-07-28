import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRole }) => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");

  if (!token || userType !== allowedRole) {
    // Redirect to correct login page
    return <Navigate to={allowedRole === "admin" ? "/admin/login" : "/login"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
