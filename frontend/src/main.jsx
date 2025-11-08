// src/index.jsx (Final Router Configuration)
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

// Import all pages and the new guard components
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/Chat";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRouteGuard from "./components/PublicRouteGuard"; // <-- NEW IMPORT
import LogoutPage from "./pages/LogoutPage";

// Define the updated route configuration
const router = createBrowserRouter([
  // 🔓 Public Routes (Always Accessible)
  {
    path: "/",
    element: <HomePage />,
  },

  // 🛑 Unauthenticated Route Group (Blocked if Logged In)
  {
    // Uses PublicRouteGuard as the element/layout
    element: <PublicRouteGuard />,
    children: [
      {
        // If logged in, PublicRouteGuard redirects to /chat
        path: "/login",
        element: <LoginPage />,
      },
      {
        // If logged in, PublicRouteGuard redirects to /chat
        path: "/signup",
        element: <SignupPage />,
      },
    ],
  },

  // 🔒 Protected Route Group (Requires Login)
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/chat",
        element: <ChatPage />,
      },
    ],
  },
  {
    path: "/logout",
    element: <LogoutPage />,
  },

  // Fallback for 404
  {
    path: "*",
    element: <h1>404 Not Found</h1>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
