// src/pages/LoginPage.jsx
import React from "react";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side: Illustration / Image - Visually impactful */}
      <div className="hidden lg:block relative w-0 lg:w-1/2 bg-gray-900">
        {/* Placeholder for a beautiful image or illustration */}

        {/* Add a transparent overlay for better text contrast */}
        <div className="absolute inset-0 bg-indigo-600 mix-blend-multiply opacity-50"></div>
        <div className="absolute inset-0 flex flex-col justify-center p-12 text-white">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">
            AI Chatbot
          </h1>
          <p className="text-xl font-light">
            Our AI Chatbot remembers your preferences and past interactions,
            making your experience personalized and efficient.
          </p>
        </div>
      </div>

      {/* Right Side: Login Form - Centered and clean */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white lg:w-1/2">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
