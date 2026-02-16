'use client';

import { useEffect, useState, useRef } from 'react';
import styles from '@/styles/stats-block.module.css';

export default function StatsBlock() {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    experience: 0,
    projects: 0,
    success: 0,
    clients: 0
  });
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const targets = {
      experience: 10,
      projects: 500,
      success: 95,
      clients: 300
    };

    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    const increments = {
      experience: targets.experience / steps,
      projects: targets.projects / steps,
      success: targets.success / steps,
      clients: targets.clients / steps
    };

    let currentStep = 0;

    const timer = setInterval(() => {
      if (currentStep >= steps) {
        setCounts(targets);
        clearInterval(timer);
        return;
      }

      setCounts({
        experience: Math.min(Math.floor(increments.experience * currentStep), targets.experience),
        projects: Math.min(Math.floor(increments.projects * currentStep), targets.projects),
        success: Math.min(Math.floor(increments.success * currentStep), targets.success),
        clients: Math.min(Math.floor(increments.clients * currentStep), targets.clients)
      });

      currentStep++;
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible]);

  return (
    <div className={`${styles.statsBlock} ${isVisible ? styles.visible : ''}`} ref={statsRef}>
      <div className="container">
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M2 12h20"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{counts.experience}+</div>
              <div className={styles.statLabel}>Years Experience</div>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <path d="M22 4L12 14.01l-3-3"/>
              </svg>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{counts.projects}+</div>
              <div className={styles.statLabel}>Successful Projects</div>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{counts.success}%</div>
              <div className={styles.statLabel}>Success Rate</div>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
              </svg>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{counts.clients}+</div>
              <div className={styles.statLabel}>Happy Clients</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
