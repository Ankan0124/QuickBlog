import React from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const ProtectedAdminRoute = ({ children }) => {
  const { token, user } = useAppContext();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!["author", "admin"].includes(user.role)) {
    return <Navigate to="/account" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
