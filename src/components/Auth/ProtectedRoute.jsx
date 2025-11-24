// src/components/Auth/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user"); // or localStorage.getItem("user")
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children; // Logged in → render the page
};

export default ProtectedRoute;
