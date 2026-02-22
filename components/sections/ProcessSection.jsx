import { getSiteContent } from "@/lib/getSiteContent";
import ProcessSectionClient from "./ProcessSectionClient";

export default async function ProcessSection() {
  const c = await getSiteContent("process");
  return <ProcessSectionClient c={c} />;
}
