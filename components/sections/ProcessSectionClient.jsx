"use client";
import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import styles from "@/styles/process.module.css";

export default function ProcessSectionClient({ c }) {
  const [activeStep, setActiveStep] = useState(0);
  const swiperRef = useRef(null);
  const holdRef = useRef(false);
  const releaseTimerRef = useRef(null);

  const processes = [
    {
      title: c.step1Title || "Site Survey",
      description:
        c.step1Desc ||
        "We visit your location and conduct preliminary geological assessment",
      details: [c.step1Detail1, c.step1Detail2, c.step1Detail3].filter(Boolean),
    },
    {
      title: c.step2Title || "Geophysical Scanning",
      description:
        c.step2Desc ||
        "Advanced equipment detects underground water formations",
      details: [c.step2Detail1, c.step2Detail2, c.step2Detail3].filter(Boolean),
    },
    {
      title: c.step3Title || "Data Interpretation",
      description:
        c.step3Desc || "Expert analysis reveals optimal drilling locations",
      details: [c.step3Detail1, c.step3Detail2, c.step3Detail3].filter(Boolean),
    },
    {
      title: c.step4Title || "Recommendation Report",
      description:
        c.step4Desc || "Comprehensive report with drilling specifications",
      details: [c.step4Detail1, c.step4Detail2, c.step4Detail3].filter(Boolean),
    },
  ];

  const NUM = processes.length;

  // Desktop auto-cycle
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth <= 768) return;
    const interval = setInterval(
      () => setActiveStep((p) => (p + 1) % NUM),
      4000,
    );
    return () => clearInterval(interval);
  }, [NUM]);

  return (
    <section className={styles.processSection}>
      {/* ══ DESKTOP ══════════════════════════════════════════════ */}
      <div className={styles.desktopOnly}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="section-title">{c.sectionTitle || "How We Work"}</h2>
            <p className="section-subtitle">
              A systematic approach combining modern technology with decades of
              expertise
            </p>
          </div>
          <div className={styles.processContainer}>
            <div className={styles.processDetails}>
              <div className={styles.processSteps}>
                {processes.map((process, index) => (
                  <div
                    key={index}
                    className={`${styles.stepCard} ${index === activeStep ? styles.active : ""}`}
                    onClick={() => setActiveStep(index)}
                  >
                    <div className={styles.stepHeader}>
                      <div className={styles.stepNumber}>{index + 1}</div>
                      <h3 className={styles.stepTitle}>{process.title}</h3>
                    </div>
                    <p className={styles.stepDescription}>
                      {process.description}
                    </p>
                    {index === activeStep && (
                      <ul className={styles.stepDetails}>
                        {process.details.map((detail, i) => (
                          <li
                            key={i}
                            className={styles.detailItem}
                            style={{ "--item-index": i }}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M9 11l3 3L22 4" />
                            </svg>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ MOBILE: Swiper ═══════════════════════════════════════ */}
      <div className={styles.mobileOnly}>
        <div className={styles.sectionHeader}>
          <h2 className="section-title">{c.sectionTitle || "How We Work"}</h2>
          <p className="section-subtitle">
            A systematic approach combining modern technology with decades of
            expertise
          </p>
        </div>
        <Swiper
          modules={[Mousewheel, Pagination]}
          mousewheel={{ releaseOnEdges: false, thresholdDelta: 10 }}
          pagination={{ clickable: true }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setActiveStep(swiper.activeIndex);
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
          {processes.map((process, index) => (
            <SwiperSlide key={index} className={styles.swiperSlide}>
              <div
                className={`${styles.stepCard} ${index === activeStep ? styles.active : ""}`}
              >
                <div className={styles.stepHeader}>
                  <div className={styles.stepNumber}>{index + 1}</div>
                  <h3 className={styles.stepTitle}>{process.title}</h3>
                </div>
                <p className={styles.stepDescription}>{process.description}</p>
                <ul className={styles.stepDetails}>
                  {process.details.map((detail, i) => (
                    <li
                      key={i}
                      className={styles.detailItem}
                      style={{ "--item-index": i }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 11l3 3L22 4" />
                      </svg>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
