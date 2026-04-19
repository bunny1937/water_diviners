import { connectDB } from "@/lib/db";
import GalleryImage from "@/models/GalleryImage";
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
  await connectDB();
  const images = await GalleryImage.find()
    .sort({ order: 1, createdAt: 1 })
    .lean();
  return NextResponse.json(images);
}

export async function POST(req) {
  if (!(await verifyAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { url, type, caption, order } = await req.json();
  if (!url)
    return NextResponse.json({ error: "URL required" }, { status: 400 });
  const img = await GalleryImage.create({
    url,
    type: type || "image",
    caption: caption || "",
    order: order || 0,
  });
  return NextResponse.json(img, { status: 201 });
}

export async function PATCH(req) {
  if (!(await verifyAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { id, caption, order } = await req.json();
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  const img = await GalleryImage.findByIdAndUpdate(
    id,
    { caption, order },
    { new: true },
  );
  return NextResponse.json(img);
}

export async function DELETE(req) {
  if (!(await verifyAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  await GalleryImage.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
