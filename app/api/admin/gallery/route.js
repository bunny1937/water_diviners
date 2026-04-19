import { connectDB } from "@/lib/db"; // default import, NOT { connectDB }
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

// GET — public, no auth
export async function GET() {
  await connectDB();
  const images = await GalleryImage.find()
    .sort({ order: 1, createdAt: 1 })
    .lean();

  // Normalize old records that were saved without a type field
  const normalized = images.map((img) => ({
    ...img,
    type: img.type || "image",
  }));

  return NextResponse.json(normalized);
}

// POST — save URL + type to DB after Cloudinary upload
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

// PATCH — update caption/order
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

// DELETE — remove record
export async function DELETE(req) {
  if (!(await verifyAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  await GalleryImage.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
