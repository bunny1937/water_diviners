"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={container}>
      <form onSubmit={handleSubmit} style={form}>
        <h2>Admin Login</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        <button type="submit" disabled={loading} style={button}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

const container = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
};

const form = {
  display: "flex",
  flexDirection: "column",
  width: "300px",
  gap: "10px",
};

const input = {
  padding: "10px",
  fontSize: "14px",
};

const button = {
  padding: "10px",
  background: "black",
  color: "white",
  border: "none",
  cursor: "pointer",
};
