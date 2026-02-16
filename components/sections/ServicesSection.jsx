'use client';

import { useState } from 'react';
import styles from '@/styles/services.module.css';

export default function ServicesSection() {
  const [hoveredService, setHoveredService] = useState(null);

  const services = [
    {
      id: 1,
      icon: "scan",
      title: "Groundwater Scanning",
      description: "Advanced geophysical survey using state-of-the-art equipment to detect underground water sources with precision.",
      features: [
        "Electromagnetic scanning",
        "Resistivity mapping",
        "Geological analysis",
        "Real-time data processing"
      ],
      color: "#0077be"
    },
    {
      id: 2,
      icon: "marker",
      title: "Borewell Point Marking",
      description: "Scientifically determined exact drilling locations to maximize water yield and minimize drilling costs.",
      features: [
        "GPS coordinates",
        "Depth calculation",
        "Yield estimation",
        "Optimal positioning"
      ],
      color: "#00b4d8"
    },
    {
      id: 3,
      icon: "depth",
      title: "Depth Estimation",
      description: "Accurate prediction of water table depth to plan drilling operations effectively and efficiently.",
      features: [
        "Multi-layer analysis",
        "Aquifer identification",
        "Depth measurement",
        "Formation mapping"
      ],
      color: "#48cae4"
    },
    {
      id: 4,
      icon: "yield",
      title: "Yield Prediction",
      description: "Forecast expected water output to ensure your investment meets irrigation or consumption needs.",
      features: [
        "Flow rate estimation",
        "Quality assessment",
        "Seasonal variation analysis",
        "Long-term sustainability"
      ],
      color: "#90e0ef"
    },
    {
      id: 5,
      icon: "pump",
      title: "Pump Depth Guidance",
      description: "Expert recommendations on optimal pump installation depth for efficient water extraction.",
      features: [
        "Pump specifications",
        "Installation depth",
        "Power requirements",
        "Maintenance guidelines"
      ],
      color: "#00a8e8"
    },
    {
      id: 6,
      icon: "consultation",
      title: "Expert Consultation",
      description: "Personalized guidance throughout your borewell project from planning to successful completion.",
      features: [
        "Site assessment",
        "Cost estimation",
        "Technical support",
        "Post-drilling assistance"
      ],
      color: "#0096c7"
    }
  ];

  const getIcon = (iconName) => {
    const icons = {
      scan: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2v20M2 12h20"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      ),
      marker: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      depth: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M12 2L6 8M12 2l6 6M12 22l-6-6M12 22l6-6"/>
        </svg>
      ),
      yield: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/>
        </svg>
      ),
      pump: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M8 6h8M6 12h12M8 18h8"/>
        </svg>
      ),
      consultation: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
        </svg>
      )
    };
    return icons[iconName] || icons.scan;
  };

  return (
    <section className={styles.servicesSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Comprehensive groundwater survey solutions tailored to your needs
          </p>
        </div>

        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`${styles.serviceCard} ${hoveredService === service.id ? styles.hovered : ''}`}
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
              style={{
                '--service-color': service.color,
                '--animation-delay': `${index * 0.1}s`
              }}
            >
              <div className={styles.cardBackground}></div>
              
              <div className={styles.cardIcon}>
                {getIcon(service.icon)}
              </div>

              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardDescription}>{service.description}</p>

              <ul className={styles.featureList}>
                {service.features.map((feature, i) => (
                  <li key={i} className={styles.featureItem}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 11l3 3L22 4"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className={styles.cardFooter}>
                <button className={styles.learnMore}>
                  Learn More
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.callToAction}>
          <h3 className={styles.ctaTitle}>Need a Custom Solution?</h3>
          <p className={styles.ctaText}>
            Every project is unique. Contact us to discuss your specific requirements.
          </p>
          <a href="/contact" className={styles.ctaButton}>
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}
