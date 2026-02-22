import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("adminToken")?.value;

  let isAuthenticated = false;

  // ✅ Layer 1: Email/Password JWT
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      isAuthenticated = true;
    } catch {
      // invalid token, fall through to Google check
    }
  }

  // ✅ Layer 2: Google OAuth
  if (!isAuthenticated) {
    const session = await getServerSession(authOptions);
    if (session?.user?.email === process.env.ADMIN_GOOGLE_EMAIL) {
      isAuthenticated = true;
    }
  }

  if (!isAuthenticated) redirect("/admin/login");

  const adminLinks = [
    {
      href: "/admin/cms",
      label: "✏️ Edit Website Content",
      desc: "Update texts, headings, images",
    },
    {
      href: "/admin/settings",
      label: "🔑 Change Password",
      desc: "Update your admin password",
    },
  ];

  return (
    <div style={dash.page}>
      <div style={dash.header}>
        <h1 style={dash.title}>Admin Dashboard</h1>
        <p style={dash.sub}>M.M.S Water Diviners</p>
      </div>
      <div style={dash.grid}>
        {adminLinks.map((link) => (
          <Link key={link.href} href={link.href} style={dash.card}>
            <div style={dash.cardLabel}>{link.label}</div>
            <div style={dash.cardDesc}>{link.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const dash = {
  page: { minHeight: "100vh", background: "#f9fafb", padding: "24px 16px" },
  header: { maxWidth: 800, margin: "0 auto 32px", textAlign: "center" },
  title: {
    fontSize: "clamp(22px, 5vw, 32px)",
    fontWeight: 800,
    color: "#0077be",
  },
  sub: { color: "#6b7280", marginTop: 4 },
  grid: {
    maxWidth: 800,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
  },
  card: {
    display: "block",
    background: "#fff",
    borderRadius: 12,
    padding: "24px 20px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    border: "2px solid #e5e7eb",
    textDecoration: "none",
  },
  cardLabel: {
    fontSize: 17,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 8,
  },
  cardDesc: { fontSize: 13, color: "#6b7280" },
};
