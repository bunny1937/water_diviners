import { getSiteContent } from "@/lib/getSiteContent";
import StatsBlockClient from "./StatsBlockClient";

export default async function StatsBlock() {
  const c = await getSiteContent("stats");
  return <StatsBlockClient c={c} />;
}
