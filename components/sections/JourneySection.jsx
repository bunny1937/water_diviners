"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/styles/journey.module.css";

export default function JourneySection() {
  const [activeCard, setActiveCard] = useState(0);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  const journeySteps = [
    {
      id: 1,
      title: "The Quest Begins",
      subtitle: "Understanding Your Need",
      description:
        "Every drop of water tells a story. When you reach out to us, we begin by understanding your land, your requirements, and your dreams. Whether you're a farmer seeking to irrigate fields or a builder planning a new project, we listen first.",
      icon: "search",
      color: "#0077be",
    },
    {
      id: 2,
      title: "Scientific Scanning",
      subtitle: "Advanced Geophysical Technology",
      description:
        "Using cutting-edge geophysical instruments, we scan beneath the earth's surface. Our technology penetrates deep into soil layers, detecting water-bearing formations that are invisible to the naked eye. Science meets expertise.",
      icon: "radar",
      color: "#00b4d8",
    },
    {
      id: 3,
      title: "Data Analysis",
      subtitle: "Precision Mapping",
      description:
        "The earth speaks in signals. Our expert, Dhananjay Sawant, analyzes geological data with 10 years of field experience. We map underground aquifers, calculate depth, predict yield, and identify the optimal drilling point.",
      icon: "chart",
      color: "#48cae4",
    },
    {
      id: 4,
      title: "Mark The Spot",
      subtitle: "X Marks Success",
      description:
        "With confidence built on data and experience, we mark the exact location for your borewell. No guesswork. No wasted resources. Just scientific precision that maximizes your chances of finding abundant water.",
      icon: "target",
      color: "#90e0ef",
    },
    {
      id: 5,
      title: "Water Discovered",
      subtitle: "Life Flows",
      description:
        "The drill penetrates the earth at our marked spot. Water surges up, transforming dry land into fertile ground. Your investment protected. Your future secured. Another successful project in our decade-long journey.",
      icon: "water",
      color: "#00a8e8",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      // Calculate which card should be active
      const progress = (scrollPosition - sectionTop) / sectionHeight;
      const cardIndex = Math.min(
        Math.floor(progress * journeySteps.length),
        journeySteps.length - 1,
      );

      if (cardIndex >= 0 && cardIndex !== activeCard) {
        setActiveCard(cardIndex);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

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
          <path d="M3 3v18h18" />
          <path d="M18 17V9M13 17V5M8 17v-3" />
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
          <h2 className="section-title">Our Journey With You</h2>
          <p className="section-subtitle">
            From first contact to water discovery, experience the precision and
            care we bring to every project
          </p>
        </div>

        <div className={styles.journeyContainer}>
          <div className={styles.timeline}>
            {journeySteps.map((step, index) => (
              <div
                key={step.id}
                className={`${styles.timelineNode} ${index <= activeCard ? styles.active : ""}`}
                style={{ "--node-color": step.color }}
              >
                <div className={styles.nodeCircle}>{index + 1}</div>
                {index < journeySteps.length - 1 && (
                  <div className={styles.nodeLine}></div>
                )}
              </div>
            ))}
          </div>

          <div className={styles.cardsContainer}>
            {journeySteps.map((step, index) => (
              <div
                key={step.id}
                ref={(el) => (cardsRef.current[index] = el)}
                className={`${styles.journeyCard} ${index === activeCard ? styles.active : ""} ${
                  index < activeCard ? styles.passed : ""
                }`}
                style={{
                  "--card-index": index,
                  "--card-color": step.color,
                }}
              >
                <div className={styles.cardIcon}>{getIcon(step.icon)}</div>
                <div className={styles.cardContent}>
                  <div className={styles.cardNumber}>Step {step.id}</div>
                  <h3 className={styles.cardTitle}>{step.title}</h3>
                  <h4 className={styles.cardSubtitle}>{step.subtitle}</h4>
                  <p className={styles.cardDescription}>{step.description}</p>
                </div>
                <div className={styles.cardDecoration}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
