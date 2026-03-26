"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminReviewsClient({ reviews: initialReviews }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");

  const handleDelete = async (id) => {
    if (!confirm("Delete this review? This cannot be undone.")) return;
    setDeleting(id);
    setError("");
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to delete.");
        return;
      }
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch {
      setError("Network error.");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Customer Reviews</h1>
          <p style={s.sub}>
            {reviews.length} review{reviews.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link href="/admin/dashboard" style={s.backBtn}>
          ← Dashboard
        </Link>
      </div>

      {error && <div style={s.error}>{error}</div>}

      {reviews.length === 0 ? (
        <div style={s.empty}>No reviews posted yet.</div>
      ) : (
        <div style={s.grid}>
          {reviews.map((review) => (
            <div key={review._id} style={s.card}>
              <div style={s.cardTop}>
                <div style={s.userRow}>
                  {review.image ? (
                    <img
                      src={review.image}
                      alt={review.name}
                      style={s.avatar}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div style={{ ...s.avatar, ...s.avatarFallback }}>
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p style={s.name}>{review.name}</p>
                    <p style={s.date}>{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <button
                  style={{
                    ...s.deleteBtn,
                    opacity: deleting === review._id ? 0.5 : 1,
                  }}
                  onClick={() => handleDelete(review._id)}
                  disabled={deleting === review._id}
                >
                  {deleting === review._id ? "..." : "🗑 Delete"}
                </button>
              </div>
              <p style={s.desc}>{review.description}</p>
              <p style={s.googleId}>Google ID: {review.googleId}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#f9fafb", padding: "24px 16px" },
  header: {
    maxWidth: 900,
    margin: "0 auto 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 12,
  },
  title: { fontSize: 24, fontWeight: 800, color: "#0077be", margin: 0 },
  sub: { fontSize: 13, color: "#6b7280", margin: "4px 0 0" },
  backBtn: {
    padding: "8px 18px",
    background: "#fff",
    border: "1.5px solid #e0e0e0",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    color: "#374151",
    textDecoration: "none",
  },
  error: {
    maxWidth: 900,
    margin: "0 auto 16px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    padding: "10px 16px",
    borderRadius: 8,
    fontSize: 13,
  },
  empty: {
    maxWidth: 900,
    margin: "40px auto",
    textAlign: "center",
    color: "#6b7280",
    fontSize: 16,
  },
  grid: {
    maxWidth: 900,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: "20px 24px",
    boxShadow: "0 2px 12px rgba(0,119,190,0.08)",
    border: "1px solid #e0f2fe",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  userRow: { display: "flex", alignItems: "center", gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    objectFit: "cover",
    flexShrink: 0,
  },
  avatarFallback: {
    background: "linear-gradient(135deg, #0077be, #00b4d8)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    fontWeight: 700,
  },
  name: { fontSize: 15, fontWeight: 700, color: "#1f2937", margin: 0 },
  date: { fontSize: 12, color: "#9ca3af", margin: "2px 0 0" },
  deleteBtn: {
    padding: "7px 14px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 8,
    color: "#dc2626",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },
  desc: { fontSize: 15, color: "#374151", lineHeight: 1.7, margin: 0 },
  googleId: { fontSize: 11, color: "#d1d5db", marginTop: 8 },
};
