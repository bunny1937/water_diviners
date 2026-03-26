import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import AdminReviewsClient from "./AdminReviewsClient";

export default async function AdminReviewsPage() {
  // Auth — dual-layer same as dashboard
  const cookieStore = await cookies();
  const token = cookieStore.get("adminToken")?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      isAuthenticated = true;
    } catch {}
  }
  if (!isAuthenticated) {
    const session = await getServerSession(authOptions);
    if (session?.user?.email === process.env.ADMIN_GOOGLE_EMAIL)
      isAuthenticated = true;
  }
  if (!isAuthenticated) redirect("/admin/login");

  await connectDB();
  const reviews = await Review.find({}).sort({ createdAt: -1 }).lean();
  const serialized = reviews.map((r) => ({
    _id: r._id.toString(),
    name: r.name,
    image: r.image || "",
    description: r.description,
    googleId: r.googleId,
    createdAt: r.createdAt.toISOString(),
  }));

  return <AdminReviewsClient reviews={serialized} />;
}
