"use client";
import { useEffect, useState, useRef } from "react";
import styles from "@/styles/stats-block.module.css";

export default function StatsBlockClient({ c }) {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    experience: 0,
    projects: 0,
    success: 0,
    clients: 0,
  });
  const statsRef = useRef(null);

  const targets = {
    experience: parseInt(c.experienceTarget || "10"),
    projects: parseInt(c.projectsTarget || "500"),
    success: parseInt(c.successTarget || "95"),
    clients: parseInt(c.clientsTarget || "300"),
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 },
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => {
      if (statsRef.current) observer.unobserve(statsRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    const increments = {
      experience: targets.experience / steps,
      projects: targets.projects / steps,
      success: targets.success / steps,
      clients: targets.clients / steps,
    };
    let currentStep = 0;
    const timer = setInterval(() => {
      if (currentStep >= steps) {
        setCounts(targets);
        clearInterval(timer);
        return;
      }
      setCounts({
        experience: Math.min(
          Math.floor(increments.experience * currentStep),
          targets.experience,
        ),
        projects: Math.min(
          Math.floor(increments.projects * currentStep),
          targets.projects,
        ),
        success: Math.min(
          Math.floor(increments.success * currentStep),
          targets.success,
        ),
        clients: Math.min(
          Math.floor(increments.clients * currentStep),
          targets.clients,
        ),
      });
      currentStep++;
    }, interval);
    return () => clearInterval(timer);
  }, [isVisible]);

  const stats = [
    {
      key: "experience",
      count: counts.experience,
      suffix: "+",
      label: c.experienceLabel || "Years Experience",
      icon: "M12 2v20M2 12h20",
    },
    {
      key: "projects",
      count: counts.projects,
      suffix: "+",
      label: c.projectsLabel || "Successful Projects",
      icon: "M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3",
    },
    {
      key: "success",
      count: counts.success,
      suffix: "%",
      label: c.successLabel || "Success Rate",
      icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    },
    {
      key: "clients",
      count: counts.clients,
      suffix: "+",
      label: c.clientsLabel || "Happy Clients",
      icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
    },
  ];

  return (
    <div
      className={`${styles.statsBlock} ${isVisible ? styles.visible : ""}`}
      ref={statsRef}
    >
      <div className="container">
        <div className={styles.statsGrid}>
          {stats.map(({ key, count, suffix, label, icon }) => (
            <div key={key} className={styles.statItem}>
              <div className={styles.statIcon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d={icon} />
                </svg>
              </div>
              <div className={styles.statContent}>
                <div className={styles.statNumber}>
                  {count}
                  {suffix}
                </div>
                <div className={styles.statLabel}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
