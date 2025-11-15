"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import "./login.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Store user info in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      // Redirect based on role
      router.push(role === "customer" ? "/customer/dashboard" : "/provider/dashboard");
    } catch (err) {
      setError("An error occurred during login");
      setLoading(false);
    }
  };

  return (
    <div className="desktop">
      <div className="image-container">
        <Image className="image" src="/logo.png" alt="AyudaBesh Logo" width={200} height={200} />
      </div>

      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Log In to Your Account</h2>

          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="role-selector">
            <label>
              <input
                type="radio"
                name="role"
                value="customer"
                checked={role === "customer"}
                onChange={(e) => setRole(e.target.value)}
              />
              Customer
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="provider"
                checked={role === "provider"}
                onChange={(e) => setRole(e.target.value)}
              />
              Provider
            </label>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>

          <div className="links">
            <Link href="/signup">Create an account</Link>
            <a href="#">Forgot password?</a>
          </div>
        </form>
      </div>
    </div>
  );
}
