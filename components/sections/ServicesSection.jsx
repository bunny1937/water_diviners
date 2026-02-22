import { getSiteContent } from "@/lib/getSiteContent";
import ServicesSectionClient from "./ServicesSectionClient";

export default async function ServicesSection() {
  const c = await getSiteContent("services");
  return <ServicesSectionClient c={c} />;
}
