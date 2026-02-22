import "server-only";
import { connectDB } from "./db";
import SiteContent from "@/models/SiteContent";

export async function getSiteContent(section) {
  await connectDB();
  const items = await SiteContent.find({ section }).lean();
  return items.reduce((acc, i) => ({ ...acc, [i.key]: i.value }), {});
}
