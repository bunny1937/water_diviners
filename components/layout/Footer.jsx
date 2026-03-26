import Link from "next/link";
import { getSiteContent } from "@/lib/getSiteContent";
import FooterClient from "./FooterClient";
import styles from "@/styles/footer.module.css";

export default async function Footer() {
  const c = await getSiteContent("footer");
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#journey", label: "Our Process" },
  ];

  const servicesList = [
    "Groundwater Scanning",
    "Borewell Point Marking",
    "Depth Estimation",
    "Yield Prediction",
    "Pump Depth Guidance",
    "Consultation Report",
  ];

  return (
    <footer className={styles.footer}>
      {/* Wave divider */}
      <div className={styles.wave}>
        <svg viewBox="0 0 1200 80" preserveAspectRatio="none">
          <path
            d="M0,40 C300,80 900,0 1200,40 L1200,0 L0,0 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className={styles.footerInner}>
        {/* Top grid */}
        <div className={styles.grid}>
          {/* Brand + contact */}
          <div className={styles.brandCol}>
            <div className={styles.brand}>
              <svg viewBox="0 0 40 40" fill="none" className={styles.brandIcon}>
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M20 10L20 20L15 25M20 20L25 25"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path d="M12 28Q20 25 28 28" fill="currentColor" />
              </svg>
              <div>
                <p className={styles.brandName}>
                  {c.brandName || "M.M.S Water Diviners"}
                </p>
                <p className={styles.brandTagline}>
                  {c.brandTagline || "Discovering Water, Sustaining Life"}
                </p>
              </div>
            </div>
            <p className={styles.brandDesc}>{c.description}</p>

            <div className={styles.contactList}>
              <a
                href={c.phone || "tel:9370427023"}
                className={styles.contactItem}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                {c.phoneDisplay || "9370427023"}
              </a>
              <a
                href={`mailto:${c.emailDisplay || "dhananjays637@gmail.com"}`}
                className={styles.contactItem}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                {c.emailDisplay || "dhananjays637@gmail.com"}
              </a>
              <span className={styles.contactItem}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {c.location || "Kankavli, Maharashtra"}
              </span>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={c.whatsappHref || "https://wa.me/9370427023"}
              className={styles.whatsappBtn}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* Quick links */}
          <div className={styles.linksCol}>
            <div className={styles.quicklinks}>
              <p className={styles.colTitle}>Quick Links</p>
              <ul className={styles.linkList}>
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={styles.footerLink}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.serviceslinks}>
              <p className={styles.colTitle}>Services</p>
              <ul className={styles.linkList}>
                {servicesList.map((s) => (
                  <li key={s}>
                    <span className={styles.footerLink}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact form */}
          <div className={styles.formCol}>
            <p className={styles.colTitle}>Get in Touch</p>
            <p className={styles.formSubtitle}>
              Have a project in mind? Drop us a message and we&apos;ll reach out
              promptly.
            </p>
            <FooterClient />
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {currentYear} M.M.S Water Diviners. All rights reserved.
          </p>
          <p className={styles.credit}>
            Owned &amp; operated by{" "}
            <strong>{c.copyrightOwner || "Dhananjay Manohar Sawant"}</strong> ·
            Kankavli, Maharashtra
          </p>
        </div>
      </div>
    </footer>
  );
}
