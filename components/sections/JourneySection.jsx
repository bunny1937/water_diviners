import { getSiteContent } from "@/lib/getSiteContent";
import JourneySectionClient from "./JourneySectionClient";

export default async function JourneySection() {
  const c = await getSiteContent("journey");
  return <JourneySectionClient c={c} />;
}
