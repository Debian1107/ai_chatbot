// src/components/PublicRouteGuard.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

/**
 * A wrapper component for public routes (like Login/Signup).
 * If the user is authenticated, it redirects them to the main app page (/chat).
 * If not authenticated, it renders the child route.
 */
const PublicRouteGuard = () => {
  // 🔑 Use the same authentication check logic as ProtectedRoute
  const isAuthenticated = () => {
    // Checks for the presence of the access token
    return !!localStorage.getItem("access_token");
  };

  const userIsLoggedIn = isAuthenticated();

  // If the user is logged in, redirect them to the chat page
  if (userIsLoggedIn) {
    return <Navigate to="/chat" replace />;
  }

  // If the user is NOT logged in, render the child route (e.g., LoginPage)
  return <Outlet />;
};

export default PublicRouteGuard;
