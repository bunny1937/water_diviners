import { connectDB } from "@/lib/db";
import SiteContent from "@/models/SiteContent";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const hero = await SiteContent.find({ section: "hero" }).lean();
  return NextResponse.json({ count: hero.length, data: hero.slice(0, 3) });
}
