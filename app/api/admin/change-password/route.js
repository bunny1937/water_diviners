import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get("adminToken")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  try {
    await connectDB();
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword || newPassword.length < 8)
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    const admin = await Admin.findById(decoded.id);
    if (!admin)
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch)
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 },
      );

    admin.password = await bcrypt.hash(newPassword, 12);
    await admin.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
