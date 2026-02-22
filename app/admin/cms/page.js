import { getSiteContent } from "@/lib/getSiteContent";
import CMSEditor from "./CMSEditor";

export default async function CMSPage() {
  const [hero, stats, journey, process, services, footer, navbar] =
    await Promise.all([
      getSiteContent("hero"),
      getSiteContent("stats"),
      getSiteContent("journey"),
      getSiteContent("process"),
      getSiteContent("services"),
      getSiteContent("footer"),
      getSiteContent("navbar"),
    ]);

  const allContent = {
    hero,
    stats,
    journey,
    process,
    services,
    footer,
    navbar,
  };
  return <CMSEditor initialContent={allContent} />;
}
