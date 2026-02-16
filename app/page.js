import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/hero/Hero";
import JourneySection from "@/components/sections/JourneySection";
import ProcessSection from "@/components/sections/ProcessSection";
import ServicesSection from "@/components/sections/ServicesSection";
import styles from "./page.module.css";
import { ScrollSection } from "@/components/sections/ScrollSection";

export default function Home() {
  return (
    <main className={styles.main}>
      <Navbar />
      <Hero />
      <JourneySection />
      <ProcessSection />
      <ServicesSection />
      <Footer />
    </main>
  );
}
