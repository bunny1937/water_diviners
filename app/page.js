import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/hero/Hero";
import SectionsClient from "@/components/sections/SectionsClient";
import { getSiteContent } from "@/lib/getSiteContent";
import styles from "./page.module.css";
import ReviewsSection from "@/components/sections/ReviewsSections";

export default async function Home() {
  const [journey, process, services] = await Promise.all([
    getSiteContent("journey"),
    getSiteContent("process"),
    getSiteContent("services"),
  ]);

  return (
    <main className={styles.main}>
      <Navbar />
      <Hero />
      <SectionsClient journey={journey} process={process} services={services} />
      <ReviewsSection />
      <div id="contact">
        <Footer />
      </div>
    </main>
  );
}
