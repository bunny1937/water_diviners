import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import PasswordResetToken from "@/models/PasswordResetToken";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const { token, newPassword } = await req.json();

    if (!token || !newPassword || newPassword.length < 8)
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    const record = await PasswordResetToken.findOne({ token, used: false });

    if (!record)
      return NextResponse.json(
        { error: "Invalid or expired reset link" },
        { status: 400 },
      );

    if (record.expiresAt < new Date())
      return NextResponse.json(
        { error: "Reset link has expired. Request a new one." },
        { status: 400 },
      );

    const hashed = await bcrypt.hash(newPassword, 12);
    await Admin.findByIdAndUpdate(record.adminId, { password: hashed });

    record.used = true;
    await record.save();

    console.log("✅ Password reset for admin:", record.adminId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Reset password error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
