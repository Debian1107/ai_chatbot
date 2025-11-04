// src/pages/SignupPage.jsx
import React from "react";
import SignupForm from "../components/SignupForm";

const SignupPage = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side: Illustration / Image - Consistent Aesthetic */}
      <div className="hidden lg:block relative w-0 lg:w-1/2 bg-gray-900">
        {/* Placeholder for an image or illustration, potentially different from login to distinguish pages */}

        {/* Transparent overlay */}
        <div className="absolute inset-0 bg-green-600 mix-blend-multiply opacity-50"></div>
        <div className="absolute inset-0 flex flex-col justify-center p-12 text-white">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">
            Start Your Journey
          </h1>
          <p className="text-xl font-light">
            Unlock full access in seconds. No credit card required.
          </p>
        </div>
      </div>

      {/* Right Side: Sign-up Form */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white lg:w-1/2">
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;
