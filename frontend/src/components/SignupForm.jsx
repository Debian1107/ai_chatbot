// src/components/SignupForm.jsx
import React from "react";
// Assuming InputField is imported from the same location as before
import InputField from "./InputField";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const SignupForm = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    if (e.target.password.value !== e.target.confirmPassword.value) {
      setError("Passwords do not match.");
      return;
    }
    if (e.target.password.value.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}api/auth/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: e.target.fullName.value.split(" ")[0],
          last_name: e.target.fullName.value.split(" ")[1] || "",
          username: e.target.email.value.trim(),
          email: e.target.email.value.trim(),
          password: e.target.password.value,
          password2: e.target.confirmPassword.value,
          bio: "",
        }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        // 🔑 TOKEN SAVE LOGIC 🔑
        // Save tokens to localStorage
        alert("Registration successful! Please log in.");

        // Redirect to the protected chat page after successful login
        navigate("/login");
      } else {
        // Handle API errors (e.g., Invalid credentials)
        setError(
          JSON.stringify(data) || "Login failed. Please check your credentials."
        );
      }
    } catch (err) {
      setError("Network error. Could not connect to the server.", err);
    }
  };

  return (
    // Form Container
    <div className="flex flex-col justify-center items-center h-full p-8 md:p-12 lg:p-16">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          Create Your Account
        </h2>
        <p className="text-gray-500 mb-3">
          Join us and get started with a free trial.
        </p>
        {error && (
          <p className="text-red-500 bg-red-100 p-2 mb-3 rounded-2xl">
            {error}
          </p>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <InputField
            id="full-name"
            name="fullName"
            type="text"
            label="Full Name"
            placeholder="Jane Doe"
          />
          <InputField
            id="email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="you@example.com"
          />
          <InputField
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
          />
          <InputField
            id="confirm-password"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="••••••••"
          />

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-700">
                I agree to the
                <a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-500 ml-1"
                >
                  Terms and Conditions
                </a>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
          >
            Sign up
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
