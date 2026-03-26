"use client";

import { useState } from "react";
import styles from "@/styles/footer.module.css";

export default function FooterClient() {
  const [form, setForm] = useState({ name: "", email: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setSuccess(true);
      setForm({ name: "", email: "", note: "" });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className={styles.formSuccess}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <path d="M22 4L12 14.01l-3-3" />
        </svg>
        <p>Message sent! We&apos;ll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form className={styles.contactForm} onSubmit={handleSubmit} noValidate>
      {error && <p className={styles.formError}>{error}</p>}
      <div className={styles.formRow}>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your Name"
          maxLength={80}
          required
          disabled={submitting}
          className={styles.formInput}
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email Address"
          required
          disabled={submitting}
          className={styles.formInput}
        />
      </div>
      <textarea
        name="note"
        value={form.note}
        onChange={handleChange}
        placeholder="Your message or enquiry..."
        rows={3}
        maxLength={1000}
        required
        disabled={submitting}
        className={styles.formTextarea}
      />
      <button type="submit" className={styles.formBtn} disabled={submitting}>
        {submitting ? (
          <>
            <span className={styles.formSpinner} />
            Sending...
          </>
        ) : (
          <>
            Send Message
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
