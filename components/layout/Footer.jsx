"use client";

import Link from "next/link";
import styles from "@/styles/footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ];

  const services = [
    "Groundwater Scanning",
    "Borewell Point Marking",
    "Depth Estimation",
    "Yield Prediction",
    "Pump Depth Guidance",
  ];

  return (
    <footer className={styles.footer}>
      {/* Wave Decoration */}
      <div className={styles.waveDecoration}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="container">
        <div className={styles.footerContent}>
          {/* Company Info */}
          <div className={styles.footerSection}>
            <div className={styles.footerLogo}>
              <div className={styles.logoIcon}>
                <svg viewBox="0 0 40 40" fill="none">
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M 20 10 L 20 20 L 15 25 M 20 20 L 25 25"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path d="M 12 28 Q 20 25 28 28" fill="currentColor" />
                </svg>
              </div>
              <div>
                <h3 className={styles.footerBrand}>M.M.S Water Diviners</h3>
                <p className={styles.footerTagline}>
                  Discovering Water, Sustaining Life
                </p>
              </div>
            </div>
            <p className={styles.footerDescription}>
              Professional geophysical water survey experts with 10+ years of
              experience in groundwater detection. Trusted by farmers, builders,
              and landowners across Kankavli.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a
                href="https://wa.me/XXXXXXXXXX"
                className={styles.socialLink}
                aria-label="WhatsApp"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href="mailto:dhananjays637@gmail.com"
                className={styles.socialLink}
                aria-label="Email"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Quick Links</h4>
            <ul className={styles.footerLinks}>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.footerLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Our Services</h4>
            <ul className={styles.footerLinks}>
              {services.map((service, index) => (
                <li key={index}>
                  <span className={styles.footerLink}>{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>Contact Us</h4>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Kankavli, Maharashtra</span>
              </div>
              <div className={styles.contactItem}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                <a href="tel:9370427023">9370427023</a>
              </div>
              <div className={styles.contactItem}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
                <a href="mailto:dhananjays737@gmail.com">
                  dhananjays637@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {currentYear} M.M.S Water Diviners. All rights reserved.
          </p>
          <p className={styles.credit}>
            Owned & Operated by <strong>Dhananjay Manohar Sawant</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}
