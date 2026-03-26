"use client";
import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import styles from "@/styles/journey.module.css";

export default function JourneySectionClient({ c }) {
  const [activeCard, setActiveCard] = useState(0);
  const swiperRef = useRef(null);
  const holdRef = useRef(false);
  const releaseTimerRef = useRef(null);
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

  const getIcon = (name) => {
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
    return icons[name] || icons.search;
  };

  return (
    <section className={styles.journeySection}>
      {/* ══ DESKTOP ══════════════════════════════════════════════ */}
      <div className={styles.desktopOnly}>
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
                  className={`${styles.journeyCard} ${index === activeCard ? styles.active : ""}`}
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
      </div>

      {/* ══ MOBILE: Swiper ═══════════════════════════════════════ */}
      <div className={styles.mobileOnly}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="section-title">
              {c.sectionTitle || "Our Journey With You"}
            </h2>
            <p className="section-subtitle">
              {c.sectionSubtitle || "From first contact to water discovery"}
            </p>
          </div>
        </div>
        <Swiper
          modules={[Mousewheel, Pagination]}
          mousewheel={{ releaseOnEdges: false, thresholdDelta: 10 }}
          pagination={{ clickable: true }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setActiveCard(swiper.activeIndex);
            holdRef.current = false;
            clearTimeout(releaseTimerRef.current);
          }}
          onReachEnd={() => {
            holdRef.current = true;
            clearTimeout(releaseTimerRef.current);
            releaseTimerRef.current = setTimeout(() => {
              holdRef.current = false;
            }, 800);
          }}
          onReachBeginning={() => {
            holdRef.current = true;
            clearTimeout(releaseTimerRef.current);
            releaseTimerRef.current = setTimeout(() => {
              holdRef.current = false;
            }, 800);
          }}
          onTouchStart={() => {
            holdRef.current = false;
          }}
          spaceBetween={16}
          slidesPerView={1}
          className={styles.swiperContainer}
        >
          {journeySteps.map((step, index) => (
            <SwiperSlide key={step.id} className={styles.swiperSlide}>
              <div
                className={`${styles.journeyCard} ${index === activeCard ? styles.active : ""}`}
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
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
