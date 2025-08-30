// src/pages/MergedAuth.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../modules/auth/AuthContext.jsx";
import { Card, Input, Button } from "../components/UI.jsx";

export default function MergedAuth() {
  const { user, login, register } = useAuth(); // ✅ get current user from context
  const nav = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  // ✅ If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      nav("/dashboard", { replace: true });
    }
  }, [user, nav]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSignup = async () => {
    setError("");

    if (!form.firstName || !form.lastName || !form.email || !form.password || !form.confirmPassword) {
      return setError("All fields are required.");
    }
    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      await register(form.email, form.password);
      nav("/dashboard"); // ✅ go directly to dashboard after signup
    } catch (e) {
      setError(e.message);
    }
  };

  const handleLogin = async () => {
    setError("");
    if (!form.email || !form.password) return setError("Email and password are required.");

    try {
      await login(form.email, form.password);
      nav("/dashboard"); // ✅ go directly to dashboard after login
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">{isLogin ? "Login" : "Sign Up"}</h2>

        {!isLogin && (
          <>
            <Input
              label="First Name"
              value={form.firstName}
              onChange={(v) => handleChange("firstName", v)}
            />
            <Input
              label="Last Name"
              value={form.lastName}
              onChange={(v) => handleChange("lastName", v)}
            />
          </>
        )}

        <Input
          label="Email"
          value={form.email}
          onChange={(v) => handleChange("email", v)}
        />
        <Input
          type="password"
          label="Password"
          value={form.password}
          onChange={(v) => handleChange("password", v)}
        />
        {!isLogin && (
          <Input
            type="password"
            label="Confirm Password"
            value={form.confirmPassword}
            onChange={(v) => handleChange("confirmPassword", v)}
          />
        )}

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <Button
          kind="primary"
          className="mt-4 w-full"
          onClick={isLogin ? handleLogin : handleSignup}
        >
          {isLogin ? "Login" : "Sign Up"}
        </Button>

        <p className="text-sm text-gray-500 mt-4 text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button className="text-blue-600 underline" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </Card>
    </div>
  );
}
