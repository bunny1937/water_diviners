"use client";
import { useEffect, useRef, useState } from "react";
import styles from "@/styles/process.module.css";

export default function ProcessSectionClient({ c }) {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef(null);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % processes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [processes.length]);

  return (
    <section className={styles.processSection} ref={sectionRef}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className="section-title">{c.sectionTitle || "How We Work"}</h2>
          <p className="section-subtitle">
            A systematic approach combining modern technology with decades of
            expertise
          </p>
        </div>

        <div className={styles.processFooter}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${((activeStep + 1) / processes.length) * 100}%`,
              }}
            />
          </div>
          <p className={styles.progressText}>
            Step {activeStep + 1} of {processes.length}
          </p>
        </div>

        <div className={styles.processContainer}>
          <div className={styles.visualization}>
            <svg viewBox="0 0 400 400" className={styles.processSvg}>
              <defs>
                <linearGradient
                  id="centerGradient"
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#0077be" />
                  <stop offset="100%" stopColor="#00b4d8" />
                </linearGradient>
                <linearGradient
                  id="nodeGradient"
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#48cae4" />
                  <stop offset="100%" stopColor="#0077be" />
                </linearGradient>
                <linearGradient
                  id="lineGradient"
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#0077be" />
                  <stop offset="100%" stopColor="#48cae4" />
                </linearGradient>
              </defs>
              <circle
                cx="200"
                cy="200"
                r="80"
                fill="url(#centerGradient)"
                className={styles.centerCircle}
              />
              {processes.map((_, index) => {
                const angle =
                  ((index / processes.length) * 360 - 90) * (Math.PI / 180);
                const x = 200 + Math.cos(angle) * 140;
                const y = 200 + Math.sin(angle) * 140;
                return (
                  <g key={index}>
                    <line
                      x1="200"
                      y1="200"
                      x2={x}
                      y2={y}
                      stroke={
                        index === activeStep ? "url(#lineGradient)" : "#e0e0e0"
                      }
                      strokeWidth={index === activeStep ? 3 : 2}
                      className={styles.connectionLine}
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r={index === activeStep ? 35 : 30}
                      fill={
                        index === activeStep ? "url(#nodeGradient)" : "#f0f0f0"
                      }
                      stroke={index === activeStep ? "#0077be" : "#ccc"}
                      strokeWidth="3"
                      className={`${styles.processNode} ${index === activeStep ? styles.active : ""}`}
                      onClick={() => setActiveStep(index)}
                      style={{ cursor: "pointer" }}
                    />
                    <text
                      x={x}
                      y={y + 5}
                      textAnchor="middle"
                      fill={index === activeStep ? "#fff" : "#666"}
                      fontSize="20"
                      fontWeight="bold"
                    >
                      {index + 1}
                    </text>
                  </g>
                );
              })}
              <g className={styles.centerIcon}>
                <path
                  d="M 200 170 L 200 190 M 200 210 L 200 230 M 170 200 L 190 200 M 210 200 L 230 200"
                  stroke="#fff"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </g>
            </svg>
          </div>

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
    </section>
  );
}
