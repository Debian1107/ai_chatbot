// src/pages/LoginPage.jsx
import React from "react";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {
  const history = useNavigate();

  useEffect(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("userToken");

    // Optionally save user data
    localStorage.removeItem("user_data");
    history("/login");
  }, [history]);

  return null;
};

export default LogoutPage;
