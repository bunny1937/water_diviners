"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSent(true);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logoWrap}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="#0077be" strokeWidth="2" />
            <path
              d="M20 10L20 20L15 25M20 20L25 25"
              stroke="#0077be"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path d="M12 28Q20 25 28 28" fill="#0077be" />
          </svg>
        </div>
        <h2 style={s.title}>Forgot Password</h2>
        <p style={s.subtitle}>Enter your admin email to receive a reset link</p>

        {sent ? (
          <div style={s.successBox}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📧</div>
            <h3 style={{ color: "#16a34a", fontWeight: 700, marginBottom: 8 }}>
              Check your inbox
            </h3>
            <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6 }}>
              If <strong>{email}</strong> is registered, you'll receive a reset
              link shortly. Check spam if you don't see it.
            </p>
            <p style={{ color: "#9ca3af", fontSize: 12, marginTop: 12 }}>
              Link expires in 30 minutes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={s.form}>
            {error && <div style={s.error}>⚠️ {error}</div>}
            <div style={s.field}>
              <label style={s.label}>Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={s.input}
                placeholder="admin@example.com"
                autoComplete="email"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ ...s.button, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <Link href="/admin/login" style={s.backLink}>
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg,#f0f9ff,#e0f2fe)",
    padding: 16,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: "40px 32px",
    width: "100%",
    maxWidth: 400,
    boxShadow: "0 8px 40px rgba(0,119,190,0.12)",
    border: "1px solid #e0f2fe",
    textAlign: "center",
  },
  logoWrap: { display: "flex", justifyContent: "center", marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 800, color: "#0077be", margin: "0 0 4px" },
  subtitle: { color: "#6b7280", fontSize: 13, marginBottom: 28 },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    textAlign: "left",
  },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: "#374151" },
  input: {
    padding: "11px 14px",
    borderRadius: 8,
    border: "1.5px solid #d1d5db",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    width: "100%",
  },
  button: {
    padding: 13,
    background: "#0077be",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    width: "100%",
  },
  error: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 13,
  },
  successBox: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: 12,
    padding: "24px 20px",
    marginBottom: 16,
  },
  backLink: {
    display: "block",
    marginTop: 20,
    color: "#6b7280",
    fontSize: 13,
    textDecoration: "none",
  },
};
