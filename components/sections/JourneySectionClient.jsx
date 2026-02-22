"use client";
import { useEffect, useRef, useState } from "react";
import styles from "@/styles/journey.module.css";

export default function JourneySectionClient({ c }) {
  const [activeCard, setActiveCard] = useState(0);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  const journeySteps = [
    {
      id: 1,
      title: c.step1Title,
      subtitle: c.step1Subtitle,
      description: c.step1Desc,
      icon: "search",
      color: "#0077be",
    },
    {
      id: 2,
      title: c.step2Title,
      subtitle: c.step2Subtitle,
      description: c.step2Desc,
      icon: "radar",
      color: "#00b4d8",
    },
    {
      id: 3,
      title: c.step3Title,
      subtitle: c.step3Subtitle,
      description: c.step3Desc,
      icon: "chart",
      color: "#48cae4",
    },
    {
      id: 4,
      title: c.step4Title,
      subtitle: c.step4Subtitle,
      description: c.step4Desc,
      icon: "target",
      color: "#90e0ef",
    },
    {
      id: 5,
      title: c.step5Title,
      subtitle: c.step5Subtitle,
      description: c.step5Desc,
      icon: "water",
      color: "#00a8e8",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const section = sectionRef.current;
      const sectionTop = section.offsetTop;
      const scrollPosition = window.scrollY;

      // Calculate which card should be active based on scroll position
      // Each card needs approximately viewport height to fully appear
      const relativeScroll = scrollPosition - sectionTop;
      const cardIndex = Math.min(
        Math.floor(relativeScroll / (window.innerHeight * 0.6)),
        journeySteps.length - 1,
      );

      if (cardIndex >= 0 && cardIndex !== activeCard) {
        setActiveCard(cardIndex);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeCard, journeySteps.length]);

  const getIcon = (iconName) => {
    const icons = {
      search: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      ),
      radar: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
        </svg>
      ),
      chart: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 3v18h18M18 17V9M13 17V5M8 17v-3" />
        </svg>
      ),
      target: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
      water: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
        </svg>
      ),
    };
    return icons[iconName] || icons.search;
  };

  return (
    <section className={styles.journeySection} ref={sectionRef}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className="section-title">
            {c.sectionTitle || "Our Journey With You"}
          </h2>
          <p className="section-subtitle">
            {c.sectionSubtitle || "From first contact to water discovery"}
          </p>
        </div>
        <div className={styles.journeyContainer}>
          <div className={styles.cardsContainer}>
            {journeySteps.map((step, index) => (
              <div
                key={step.id}
                ref={(el) => (cardsRef.current[index] = el)}
                className={`${styles.journeyCard} ${index === activeCard ? styles.active : ""} ${index < activeCard ? styles.passed : ""}`}
                style={{ "--card-index": index, "--card-color": step.color }}
              >
                <div className={styles.cardIcon}>{getIcon(step.icon)}</div>
                <div className={styles.cardContent}>
                  <div className={styles.cardNumber}>Step {step.id}</div>
                  <h3 className={styles.cardTitle}>{step.title}</h3>
                  <h4 className={styles.cardSubtitle}>{step.subtitle}</h4>
                  <p className={styles.cardDescription}>{step.description}</p>
                </div>
                <div className={styles.cardDecoration} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
