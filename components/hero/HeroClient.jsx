"use client";
import { useEffect, useRef, useState } from "react";
import styles from "@/styles/hero.module.css";

export default function HeroClient({ c, children }) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  // 🆕 DEBUG: Log what we got vs expected
  useEffect(() => {
    console.log("🧪 HERO DEBUG - Received content:", c);

    const expected = [
      "brandName",
      "tagline",
      "subtitle",
      "expertName",
      "expertTitle",
      "yearsExperience",
      "yearsLabel",
      "feature1",
      "feature2",
      "feature3",
      "feature4",
      "ctaCallLabel",
      "ctaCallPhone",
      "ctaWhatsappLabel",
      "ctaWhatsappHref",
      "scrollLabel",
    ];

    const found = Object.keys(c);
    const missing = expected.filter((key) => !c[key] || c[key] === "");
    const present = expected.filter((key) => c[key] && c[key] !== "");

    console.log("✅ PRESENT:", present);
    console.log("❌ MISSING:", missing);
    console.log("📊 ALL KEYS FOUND:", found);

    // Also log the actual values for missing ones
    missing.forEach((key) => {
      console.log(`   "${key}": "${c[key] || "NULL/EMPTY"}"`);
    });
  }, [c]);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parallaxOffset = scrollY * 0.5;
  const [soilViz, statsBlock] = Array.isArray(children) ? children : [children];

  return (
    <section className={styles.hero} ref={heroRef}>
      <div className={styles.backgroundAnimation}>
        <div
          className={styles.waterRipple}
          style={{ transform: `translateY(${parallaxOffset}px)` }}
        />
        <div
          className={styles.waterRipple}
          style={{ transform: `translateY(${parallaxOffset * 0.8}px)` }}
        />
        <div
          className={styles.waterRipple}
          style={{ transform: `translateY(${parallaxOffset * 0.6}px)` }}
        />
      </div>

      <div className={`container ${styles.heroContainer}`}>
        <div className={styles.heroContent}>
          {/* Heading */}
          <div
            className={`${styles.headingWrapper} ${isVisible ? styles.visible : ""}`}
          >
            <h1 className={styles.mainHeading}>
              <span className={styles.brandName}>
                {c.brandName || "M.M.S WATER DIVINERS"}
              </span>
              <span className={styles.tagline}>
                {c.tagline || "Discovering Water, Sustaining Life"}
              </span>
            </h1>
            <p className={styles.subtitle}>
              {c.subtitle || "Professional Geophysical Water Survey Experts"}
            </p>
          </div>

          {/* Expert */}
          <div
            className={`${styles.expertIntro} ${isVisible ? styles.visible : ""}`}
          >
            <div className={styles.expertIcon}>
              <svg viewBox="0 0 100 100" className={styles.expertSvg}>
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="var(--color-primary)"
                  opacity="0.1"
                />
                <circle cx="50" cy="35" r="15" fill="var(--color-primary)" />
                <path
                  d="M 25 70 Q 50 60 75 70 L 75 85 L 25 85 Z"
                  fill="var(--color-primary)"
                />
              </svg>
            </div>
            <div className={styles.expertInfo}>
              <h2 className={styles.expertName}>
                {c.expertName || "Dhananjay Manohar Sawant"}
              </h2>
              <p className={styles.expertTitle}>
                {c.expertTitle || "Geophysical Water Survey Expert"}
              </p>
              <p className={styles.expertExperience}>
                <span className={styles.experienceNumber}>
                  {c.yearsExperience || "10"}
                </span>{" "}
                {c.yearsLabel || "Years of Excellence"}
              </p>
            </div>
          </div>

          {/* Features */}
          <div
            className={`${styles.features} ${isVisible ? styles.visible : ""}`}
          >
            {[
              {
                key: "feature1",
                d: "M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
              },
              {
                key: "feature2",
                d: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
              },
              {
                key: "feature3",
                d: "M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3",
              },
              { key: "feature4", d: "M12 2v20M2 12h20" },
            ].map(({ key, d }) => (
              <div key={key} className={styles.feature}>
                <div className={styles.featureIcon}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d={d} />
                  </svg>
                </div>
                <span>{c[key] || `[MISSING: ${key}]`}</span>{" "}
                {/* 🆕 Shows missing inline */}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            className={`${styles.ctaGroup} ${isVisible ? styles.visible : ""}`}
          >
            <a
              href={c.ctaCallPhone || "tel:9370427023"}
              className={styles.ctaPrimary}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              {c.ctaCallLabel || "Call Now"}
            </a>
            <a
              href={c.ctaWhatsappHref || "https://wa.me/9370427023"}
              className={styles.ctaSecondary}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {c.ctaWhatsappLabel || "WhatsApp"}
            </a>
          </div>
        </div>

        {/* Right — SoilVisualization passed as child */}
        <div className={styles.heroVisual}>{soilViz}</div>
      </div>

      {/* Stats passed as child */}
      {statsBlock}

      <div className={styles.scrollIndicator}>
        <div className={styles.mouse}>
          <div className={styles.wheel} />
        </div>
        <p>{c.scrollLabel || "Scroll to explore"}</p>
      </div>
    </section>
  );
}
