"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSettings() {
  const router = useRouter();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setStatus({ type: "error", msg: "New passwords do not match." });
      return;
    }
    if (form.newPassword.length < 8) {
      setStatus({
        type: "error",
        msg: "Password must be at least 8 characters.",
      });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus({ type: "success", msg: "Password changed successfully." });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setStatus({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Admin Settings</h1>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>🔑 Change Password</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          {status && (
            <div
              style={{
                ...styles.alert,
                background: status.type === "error" ? "#fee2e2" : "#dcfce7",
                color: status.type === "error" ? "#dc2626" : "#16a34a",
              }}
            >
              {status.msg}
            </div>
          )}
          <label style={styles.label}>Current Password</label>
          <input
            type="password"
            required
            value={form.currentPassword}
            onChange={(e) =>
              setForm({ ...form, currentPassword: e.target.value })
            }
            style={styles.input}
            placeholder="Enter current password"
          />

          <label style={styles.label}>New Password</label>
          <input
            type="password"
            required
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            style={styles.input}
            placeholder="Min 8 characters"
          />

          <label style={styles.label}>Confirm New Password</label>
          <input
            type="password"
            required
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            style={styles.input}
            placeholder="Repeat new password"
          />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>🔒 Recovery Options</h2>
        <p style={{ color: "#666", marginBottom: 12 }}>
          If you lose access, use the CLI script to reset your password directly
          in the database:
        </p>
        <pre style={styles.code}>{`node scripts/resetAdminPassword.js`}</pre>
        <p style={{ color: "#999", fontSize: 13, marginTop: 8 }}>
          Set <code>ADMIN_RESET_PASSWORD</code> in <code>.env.local</code>{" "}
          before running.
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: "40px", maxWidth: "560px", margin: "0 auto" },
  title: { fontSize: 28, fontWeight: 800, marginBottom: 32, color: "#0077be" },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 28,
    marginBottom: 24,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 20,
    color: "#1f2937",
  },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  label: { fontSize: 13, fontWeight: 600, color: "#374151" },
  input: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14,
    outline: "none",
  },
  button: {
    marginTop: 8,
    padding: "12px 0",
    background: "#0077be",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
  },
  alert: {
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
  },
  code: {
    background: "#f3f4f6",
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 13,
    color: "#1f2937",
    overflowX: "auto",
  },
};
