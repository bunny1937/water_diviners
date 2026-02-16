import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  const { email, password } = await req.json();

  const admin = await Admin.findOne({ email });

  if (!admin) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  const response = NextResponse.json({ success: true });

  response.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  return response;
}
