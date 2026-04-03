import "server-only";
import { unstable_cache } from "next/cache";
import { connectDB } from "./db";
import SiteContent from "../models/SiteContent";

const fetchSection = async (section) => {
  await connectDB();
  const items = await SiteContent.find({ section }).lean();
  return items.reduce((acc, i) => ({ ...acc, [i.key]: i.value }), {});
};

export const getSiteContent = unstable_cache(fetchSection, ["site-content"], {
  revalidate: 3600,
});
