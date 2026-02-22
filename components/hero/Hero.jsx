import { getSiteContent } from "@/lib/getSiteContent";
import HeroClient from "./HeroClient";
import StatsBlockClient from "./StatsBlockClient";
import SoilVisualization from "./SoilVisualization";

export default async function Hero() {
  const [heroContent, statsContent] = await Promise.all([
    getSiteContent("hero"),
    getSiteContent("stats"),
  ]);

  return (
    <HeroClient c={heroContent}>
      <SoilVisualization />
      <StatsBlockClient c={statsContent} />
    </HeroClient>
  );
}
