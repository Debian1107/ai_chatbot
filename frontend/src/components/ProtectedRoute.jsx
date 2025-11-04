// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

/**
 * A wrapper component that checks for user authentication.
 * If authenticated, it renders the child route.
 * If not authenticated, it redirects to the login page.
 */
const ProtectedRoute = () => {
  // 🔑 Placeholder for your actual authentication check
  // This function/variable should come from a Context or state management system.
  // We'll simulate a check here:
  const isAuthenticated = () => {
    // In a real application, this would check localStorage for a token,
    // check a UserContext state, or check a Redux store.
    // For this example, we'll assume a mock function:
    const token = localStorage.getItem("userToken");
    return !!token; // Returns true if a token exists, false otherwise
  };

  const userIsLoggedIn = isAuthenticated();

  // If the user is logged in, Outlet renders the child route (e.g., ChatPage)
  // Otherwise, Navigate redirects them to the /login page
  return userIsLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
