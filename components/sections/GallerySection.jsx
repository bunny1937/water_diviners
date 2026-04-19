"use client";
import { useEffect, useState, useRef } from "react";

export default function GallerySection() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState(null);
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    fetch("/api/admin/gallery")
      .then((r) => r.json())
      .then((data) => setItems(data));
  }, []);

  const filtered =
    filter === "all"
      ? items
      : items.filter((i) => (i.type || "image") === filter);

  function checkScroll() {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener("scroll", checkScroll);
  }, [filtered]);

  function slide(dir) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.75), behavior: "smooth" });
  }

  if (!items.length) return null;

  return (
    <>
      <style>{`
        .gallery-track::-webkit-scrollbar { display: none; }

        .gallery-section {
          padding: 60px 0;
          background: #f0f9ff;
          overflow: hidden;
        }

        .gallery-header {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 32px 32px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .gallery-heading {
          font-size: clamp(22px, 4vw, 40px);
          font-weight: 800;
          color: #0077be;
          margin-bottom: 6px;
        }

        .gallery-sub {
          color: #6b7280;
          font-size: 15px;
          margin: 0;
        }

        .gallery-tabs {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .gallery-tab {
          padding: 8px 20px;
          border-radius: 30px;
          border: 1.5px solid #bae6fd;
          background: #fff;
          color: #0369a1;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .gallery-tab.active {
          background: #0077be;
          color: #fff;
          border-color: #0077be;
        }

        .gallery-slider-wrap {
          position: relative;
          width: 100%;
        }

        .gallery-track {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          overflow-y: hidden;
          padding: 0 32px 16px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .gallery-slide {
          position: relative;
          flex-shrink: 0;
          width: calc(80vh * (4 / 3));
          height: 80vh;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          scroll-snap-align: start;
          box-shadow: 0 8px 32px rgba(0, 119, 190, 0.15);
          background: #0c1a2e;
        }

        .gallery-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .gallery-video-wrap {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .gallery-play-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.25);
        }

        .gallery-play-btn {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          border: 2px solid rgba(255, 255, 255, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          color: #fff;
        }

        .gallery-caption-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.65));
          padding: 32px 18px 14px;
        }

        .gallery-caption-text {
          color: #fff;
          font-size: 14px;
          font-weight: 500;
        }

        .gallery-empty {
          flex-shrink: 0;
          width: 100%;
          height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          font-size: 16px;
        }

        .gallery-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-60%);
          z-index: 10;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(0, 119, 190, 0.2);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          font-size: 28px;
          color: #0077be;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-weight: 300;
          line-height: 1;
        }

        .gallery-arrow.prev { left: 8px; }
        .gallery-arrow.next { right: 8px; }

        /* Lightbox */
        .gallery-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.9);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .gallery-close-btn {
          position: absolute;
          top: 20px;
          right: 24px;
          background: rgba(255, 255, 255, 0.15);
          border: none;
          color: #fff;
          font-size: 20px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gallery-lightbox-media {
          max-width: 92vw;
          max-height: 85vh;
          border-radius: 12px;
          object-fit: contain;
        }

        .gallery-lightbox-caption {
          color: #e5e7eb;
          font-size: 14px;
          margin-top: 14px;
          text-align: center;
        }

        /* ── Tablet 960px ── */
        @media (max-width: 960px) {
          .gallery-section { padding: 50px 0; }
          .gallery-header { padding: 0 24px 28px; }
          .gallery-track { padding: 0 24px 16px; gap: 14px; }
          .gallery-slide {
            width: calc(70vh * (4 / 3));
            height: 70vh;
          }
          .gallery-arrow { width: 42px; height: 42px; font-size: 24px; }
        }

        /* ── 768px ── */
        @media (max-width: 768px) {
          .gallery-section { padding: 44px 0; }
          .gallery-header {
            padding: 0 20px 24px;
            align-items: flex-start;
            flex-direction: column;
            gap: 14px;
          }
          .gallery-tabs { gap: 8px; }
          .gallery-tab { padding: 7px 16px; font-size: 13px; }
          .gallery-track { padding: 0 20px 12px; gap: 12px; }
          .gallery-slide {
            width: calc(60vh * (4 / 3));
            height: 60vh;
          }
          .gallery-play-btn { width: 52px; height: 52px; font-size: 22px; }
          .gallery-arrow { width: 38px; height: 38px; font-size: 22px; }
          .gallery-arrow.prev { left: 4px; }
          .gallery-arrow.next { right: 4px; }
        }

        /* ── 560px ── */
        @media (max-width: 560px) {
          .gallery-section { padding: 36px 0; }
          .gallery-header { padding: 0 16px 20px; }
          .gallery-heading { margin-bottom: 4px; }
          .gallery-sub { font-size: 13px; }
          .gallery-tab { padding: 6px 14px; font-size: 12px; }
          .gallery-track { padding: 0 16px 12px; gap: 10px; }
          .gallery-slide {
            width: calc(55vw * (4 / 3));
            height: 55vw;
            border-radius: 14px;
          }
          .gallery-play-btn { width: 44px; height: 44px; font-size: 18px; }
          .gallery-caption-text { font-size: 12px; }
          .gallery-arrow { width: 34px; height: 34px; font-size: 20px; }
          .gallery-lightbox-media { max-width: 96vw; max-height: 80vh; }
        }

        /* ── 480px ── */
        @media (max-width: 480px) {
          .gallery-section { padding: 28px 0; }
          .gallery-header { padding: 0 12px 16px; gap: 12px; }
          .gallery-tabs { gap: 6px; }
          .gallery-tab { padding: 6px 12px; font-size: 12px; }
          .gallery-track { padding: 0 12px 10px; gap: 8px; }
          .gallery-slide {
            width: calc(72vw * (4 / 3));
            height: 130vw;
            border-radius: 12px;
          }
          .gallery-play-btn { width: 40px; height: 40px; font-size: 16px; }
          .gallery-arrow { width: 32px; height: 32px; font-size: 18px; }
          .gallery-arrow.prev { left: 2px; }
          .gallery-arrow.next { right: 2px; }
          .gallery-close-btn { top: 12px; right: 12px; width: 38px; height: 38px; }
        }

        /* ── 360px ── */
        @media (max-width: 360px) {
          .gallery-section { padding: 24px 0; }
          .gallery-header { padding: 0 10px 14px; }
          .gallery-tab { padding: 5px 10px; font-size: 11px; }
          .gallery-track { padding: 0 10px 8px; gap: 8px; }
          .gallery-slide {
            width: calc(80vw * (4 / 3));
            height: 80vw;
            border-radius: 10px;
          }
          .gallery-play-btn { width: 36px; height: 36px; font-size: 14px; }
          .gallery-arrow { width: 28px; height: 28px; font-size: 16px; }
          .gallery-caption-bar { padding: 20px 12px 10px; }
        }

        /* ── 280px and below ── */
        @media (max-width: 280px) {
          .gallery-header { padding: 0 8px 12px; flex-direction: column; }
          .gallery-tab { padding: 4px 8px; font-size: 10px; }
          .gallery-tabs { gap: 4px; }
          .gallery-track { padding: 0 8px 8px; gap: 6px; }
          .gallery-slide {
            width: calc(85vw * (4 / 3));
            height: 85vw;
            border-radius: 8px;
          }
          .gallery-arrow { display: none; }
          .gallery-lightbox-media { max-width: 98vw; max-height: 75vh; border-radius: 8px; }
          .gallery-close-btn { top: 8px; right: 8px; width: 34px; height: 34px; font-size: 16px; }
        }
      `}</style>

      <section id="gallery" className="gallery-section">
        {/* Header */}
        <div className="gallery-header">
          <div>
            <h2 className="gallery-heading">Our Work</h2>
            <p className="gallery-sub">
              A glimpse of projects, sites &amp; equipment in action
            </p>
          </div>
          <div className="gallery-tabs">
            {["all", "image", "video"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setFilter(tab);
                  setTimeout(checkScroll, 50);
                }}
                className={`gallery-tab${filter === tab ? " active" : ""}`}
              >
                {tab === "all"
                  ? "All"
                  : tab === "image"
                    ? "📷 Photos"
                    : "🎬 Videos"}
              </button>
            ))}
          </div>
        </div>

        {/* Slider */}
        <div className="gallery-slider-wrap">
          {canScrollLeft && (
            <button
              className="gallery-arrow prev"
              onClick={() => slide(-1)}
              aria-label="Previous"
            >
              ‹
            </button>
          )}

          <div ref={trackRef} className="gallery-track">
            {filtered.length === 0 && (
              <div className="gallery-empty">
                No {filter === "all" ? "items" : filter + "s"} yet.
              </div>
            )}
            {filtered.map((item) => (
              <div
                key={item._id}
                className="gallery-slide"
                onClick={() => setLightbox(item)}
              >
                {(item.type || "image") === "video" ? (
                  <div className="gallery-video-wrap">
                    <video
                      src={item.url}
                      className="gallery-media"
                      muted
                      playsInline
                    />
                    <div className="gallery-play-overlay">
                      <div className="gallery-play-btn">▶</div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.caption || "Gallery image"}
                    className="gallery-media"
                    loading="lazy"
                  />
                )}
                {item.caption && (
                  <div className="gallery-caption-bar">
                    <span className="gallery-caption-text">{item.caption}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {canScrollRight && (
            <button
              className="gallery-arrow next"
              onClick={() => slide(1)}
              aria-label="Next"
            >
              ›
            </button>
          )}
        </div>

        {/* Lightbox */}
        {lightbox && (
          <div className="gallery-overlay" onClick={() => setLightbox(null)}>
            <button className="gallery-close-btn" aria-label="Close">
              ✕
            </button>
            {(lightbox.type || "image") === "video" ? (
              <video
                src={lightbox.url}
                controls
                autoPlay
                className="gallery-lightbox-media"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img
                src={lightbox.url}
                alt={lightbox.caption || "Gallery image"}
                className="gallery-lightbox-media"
              />
            )}
            {lightbox.caption && (
              <p className="gallery-lightbox-caption">{lightbox.caption}</p>
            )}
          </div>
        )}
      </section>
    </>
  );
}
