// RoleBasedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const RoleProtected = ({ allowedRoles, role, children }) => {
  if (!allowedRoles.includes(role)) {
    // You can either redirect or show a not-authorized message
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Unauthorized</h2>
        <p>You are not allowed to view this page.</p>
      </div>
    );
    // Alternatively, redirect:
    // return <Navigate to="/unauthorized" />;
  }
  return children;
};

export default RoleProtected;
