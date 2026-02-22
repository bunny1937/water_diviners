"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
      setTimeout(() => router.push("/admin/login"), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!token)
    return (
      <div style={s.card}>
        <div style={s.error}>
          ⚠️ Invalid reset link. Please request a new one.
        </div>
        <Link href="/admin/forgot-password" style={s.backLink}>
          Request new link
        </Link>
      </div>
    );

  if (success)
    return (
      <div style={s.card}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
        <h2 style={{ color: "#16a34a", fontWeight: 800 }}>Password Reset!</h2>
        <p style={{ color: "#6b7280", fontSize: 14 }}>
          Redirecting to login in 3 seconds...
        </p>
        <Link
          href="/admin/login"
          style={{ ...s.backLink, color: "#0077be", fontWeight: 600 }}
        >
          Go to Login now →
        </Link>
      </div>
    );

  return (
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
      <h2 style={s.title}>Set New Password</h2>
      <p style={s.subtitle}>Choose a strong password for your admin account</p>

      <form onSubmit={handleSubmit} style={s.form}>
        {error && <div style={s.error}>⚠️ {error}</div>}

        <div style={s.field}>
          <label style={s.label}>New Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={s.input}
            placeholder="Min 8 characters"
            autoComplete="new-password"
          />
        </div>

        <div style={s.field}>
          <label style={s.label}>Confirm Password</label>
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            style={s.input}
            placeholder="Repeat new password"
            autoComplete="new-password"
          />
          {/* Live match indicator */}
          {confirm && (
            <span
              style={{
                fontSize: 12,
                color: password === confirm ? "#16a34a" : "#dc2626",
                marginTop: 4,
              }}
            >
              {password === confirm
                ? "✓ Passwords match"
                : "✕ Passwords don't match"}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ ...s.button, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Updating..." : "Set New Password"}
        </button>
      </form>

      <Link href="/admin/login" style={s.backLink}>
        ← Back to Login
      </Link>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div style={s.page}>
      <Suspense
        fallback={
          <div style={s.page}>
            <div style={s.card}>Loading...</div>
          </div>
        }
      >
        <ResetForm />
      </Suspense>
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
  backLink: {
    display: "block",
    marginTop: 20,
    color: "#6b7280",
    fontSize: 13,
    textDecoration: "none",
  },
};
