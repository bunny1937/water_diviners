import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";

export async function DELETE(req, { params }) {
  try {
    // Auth check — same dual-layer as the rest of admin routes
    const cookieStore = await cookies();
    const token = cookieStore.get("adminToken")?.value;
    let isAdmin = false;

    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET);
        isAdmin = true;
      } catch {}
    }

    if (!isAdmin) {
      const session = await getServerSession(authOptions);
      if (session?.user?.email === process.env.ADMIN_GOOGLE_EMAIL) {
        isAdmin = true;
      }
    }

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const deleted = await Review.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE review error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
