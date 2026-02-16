import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const cookieStore = await cookies(); // ✅ MUST await

  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    redirect("/admin/login");
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Admin Dashboard</h1>
      <p>Authenticated successfully.</p>
    </div>
  );
}
