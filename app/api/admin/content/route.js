import { connectDB } from "@/lib/db";
import SiteContent from "@/models/SiteContent";
import ContentChangelog from "@/models/ContentChangelog";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("adminToken")?.value;
  if (!token) return false;
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    await connectDB();
    const content = await SiteContent.find({})
      .sort({ section: 1, key: 1 })
      .lean();
    return NextResponse.json(content);
  } catch (err) {
    console.error("GET /api/admin/content error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  if (!(await verifyAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const { section, key, value, changedBy } = await req.json();

    if (!section || !key || value === undefined)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const existing = await SiteContent.findOne({ section, key });
    if (!existing)
      return NextResponse.json({ error: "Content not found" }, { status: 404 });

    // Log the change
    await ContentChangelog.create({
      section,
      key,
      oldValue: existing.value,
      newValue: value,
      changedBy: changedBy || "admin",
    });

    existing.value = value;
    await existing.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/admin/content error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
