"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gLoading, setGLoading] = useState(false);

  async function handleGoogle() {
    setGLoading(true);
    setError("");
    try {
      // Let NextAuth handle callbackUrl automatically
      await signIn("google");
    } catch (err) {
      setError("Google login failed");
    } finally {
      setGLoading(false);
    }
  }

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
        setError(data.error || "Login failed");
        return;
      }

      // Success — hard navigate so middleware re-evaluates cookie
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="#0077be" strokeWidth="2" />
            <path
              d="M 20 10 L 20 20 L 15 25 M 20 20 L 25 25"
              stroke="#0077be"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path d="M 12 28 Q 20 25 28 28" fill="#0077be" />
          </svg>
        </div>
        <h2 style={s.title}>Admin Login</h2>
        <p style={s.subtitle}>M.M.S Water Diviners</p>

        {/* 🆕 GOOGLE BUTTON */}
        <div style={s.googleDivider}>or</div>
        <button onClick={handleGoogle} disabled={gLoading} style={s.googleBtn}>
          {gLoading ? "🔄 Redirecting..." : "🔐 Sign in with Google"}
        </button>
        {/* Divider before email form */}
        <div style={s.divider}>
          <div style={s.dividerLine}></div>
          <span style={s.dividerText}>or use email/password</span>
          <div style={s.dividerLine}></div>
        </div>
        <form onSubmit={handleSubmit} style={s.form}>
          {error && <div style={s.error}>⚠️ {error}</div>}

          <div style={s.field}>
            <label style={s.label}>Email</label>
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

          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={s.input}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <Link
              href="/admin/forgot-password"
              style={{ fontSize: 13, color: "#6b7280", textDecoration: "none" }}
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...s.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? (
              <span style={s.loadingRow}>
                <span style={s.spinner} /> Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>
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
    background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
    padding: "16px",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "40px 32px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 8px 40px rgba(0,119,190,0.12)",
    border: "1px solid #e0f2fe",
  },
  logo: { display: "flex", justifyContent: "center", marginBottom: "16px" },
  title: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: 800,
    color: "#0077be",
    margin: "0 0 4px",
  },
  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: "13px",
    marginBottom: "28px",
  },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: 600, color: "#374151" },
  input: {
    padding: "11px 14px",
    borderRadius: "8px",
    border: "1.5px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
    boxSizing: "border-box",
  },
  button: {
    padding: "13px",
    background: "#0077be",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: 700,
    fontSize: "15px",
    marginTop: "4px",
    transition: "opacity 0.2s",
    width: "100%",
  },
  error: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 500,
  },
  loadingRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  spinner: {
    width: "14px",
    height: "14px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.8s linear infinite",
  },
  googleBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "12px",
    background: "#fff",
    border: "2px solid #e0e0e0",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#333",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "24px 0",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#e5e7eb",
  },
  dividerText: {
    fontSize: "12px",
    color: "#9ca3af",
    padding: "0 12px",
    whiteSpace: "nowrap",
  },
  googleDivider: {
    textAlign: "center",
    margin: "20px 0 16px 0",
    fontSize: "13px",
    color: "#6b7280",
    fontWeight: 500,
  },
};
