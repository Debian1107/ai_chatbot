// src/components/LoginForm.jsx
import React from "react";
import InputField from "./InputField"; // Assume you create a reusable InputField component
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const LoginForm = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      const response = await fetch(`${API_URL}/api/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: e.target.email.value,
          password: e.target.password.value,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 🔑 TOKEN SAVE LOGIC 🔑
        // Save tokens to localStorage
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("userToken", data.refresh);

        // Optionally save user data
        localStorage.setItem("user_data", JSON.stringify(data.user));

        // Redirect to the protected chat page after successful login
        navigate("/chat");
      } else {
        // Handle API errors (e.g., Invalid credentials)
        setError(data.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.log(err);
      setError("Network error. Could not connect to the server.", err);
    }
  };

  return (
    // Form Container
    <div className="flex flex-col justify-center items-center h-full p-8 md:p-12 lg:p-16">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-500 mb-3">
          Sign in to continue to your dashboard.
        </p>
        {error && (
          <p className="text-red-500 bg-red-100 p-2 mb-3 rounded-2xl">
            {error}
          </p>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <InputField
            id="email"
            name="email"
            type="email"
            label="Username / Email Address"
            placeholder="you@example.com"
          />
          <InputField
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Sign in
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
