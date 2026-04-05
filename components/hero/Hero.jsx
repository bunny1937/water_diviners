"use client";

/**
 * HeroAnimation.jsx — Next.js Client Component
 *
 * Full port of hero-animation.html:
 *  - No *, html, body selectors — all scoped to component root
 *  - CSS custom properties scoped to .heroRoot
 *  - LCP-friendly: fonts preloaded via <link rel="preload"> in layout/Head (see notes)
 *  - SEO: meaningful h1/h2 text preserved, aria labels added
 *  - Loader → Story → Scroll-driven animation — 100% identical logic
 *  - Canvas debris (S2 + S3) and particle canvas (S3 stats phase) fully intact
 *
 * Usage in page.js:
 *   import HeroAnimation from "@/components/hero/HeroAnimation";
 *   <HeroAnimation />
 *
 * Font preload for LCP — add to your layout.js <Head>:
 *   <link rel="preconnect" href="https://fonts.googleapis.com" />
 *   <link
 *     rel="preload"
 *     as="style"
 *     href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&family=DM+Sans:wght@300;400;500&family=Bebas+Neue&display=swap"
 *   />
 *   <link
 *     rel="stylesheet"
 *     href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&family=DM+Sans:wght@300;400;500&family=Bebas+Neue&display=swap"
 *   />
 */

import { useEffect, useRef } from "react";
import styles from "../../styles/hero.module.css";

export default function Hero() {
  const rootRef = useRef(null);

  useEffect(() => {
    /* ─────────────────────────────────────────────
       All DOM work scoped inside rootRef.current
       so it never touches document.body globals
    ───────────────────────────────────────────── */
    const root = rootRef.current;
    if (!root) return;

    const $ = (sel) => root.querySelector(sel);
    const $$ = (sel) => Array.from(root.querySelectorAll(sel));

    /* ── CURSOR ── */
    const cur = $("#cursor");
    const curRing = $("#cursor-ring");
    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;
    let cursorRAF;

    const onMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      cur.style.left = mx + "px";
      cur.style.top = my + "px";
    };
    document.addEventListener("mousemove", onMouseMove);

    function updateRing() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      curRing.style.left = rx + "px";
      curRing.style.top = ry + "px";
      cursorRAF = requestAnimationFrame(updateRing);
    }
    updateRing();

    /* ── LOADER ── */
    const loaderFill = $("#loaderFill");
    const loaderPct = $("#loaderPct");
    const loaderEl = $("#loader");
    const storyEl = $("#story");
    const dots = $$(".dot");

    let pct = 0;
    const loaderTimer = setInterval(() => {
      pct += Math.random() * 3 + 1.2;
      if (pct >= 100) {
        pct = 100;
        clearInterval(loaderTimer);
      }
      loaderFill.style.transform = `scaleX(${pct / 100})`;
      loaderPct.textContent = Math.round(pct) + "%";
    }, 60);

    const loaderTimeout = setTimeout(() => {
      loaderEl.classList.add("ha-exit");
      storyEl.classList.add("ha-visible");
      $("#dots").classList.add("ha-visible");
      setTimeout(() => {
        $("#s1title").classList.add("ha-show");
        animateCracks();
        $("#s2headline").classList.add("ha-show");
      }, 400);
    }, 5000);

    /* ── CRACK ANIMATION ── */
    function animateCracks() {
      ["crack1", "crack2", "crack3", "crack4"].forEach((id, i) => {
        const el = $("#" + id);
        if (!el) return;
        setTimeout(() => {
          el.style.transition = "stroke-dashoffset 1.5s ease-out";
          el.style.strokeDashoffset = "0";
        }, i * 280);
      });
    }

    /* ── LAYER LABELS ── */
    const layerTriggers = {
      ll1: 0,
      ll2: 0.1,
      ll3: 0.22,
      ll4: 0.38,
      ll5: 0.56, // S9 — Deep Rock: pipe tip here at p2 ~0.75, label fires slightly early
      ll6: 0.72, // S10 — Pre-Aquifer: label fires as water starts rising
    };
    function showLayerLabel(id) {
      const el = $("#" + id);
      if (el) el.classList.add("ha-show");
    }

    /* ── BUBBLES ── */
    function createBubbles(container, count) {
      for (let i = 0; i < count; i++) {
        const b = document.createElement("div");
        b.className = styles.s3Bubble;
        const size = 3 + Math.random() * 9;
        b.style.cssText = `
          width:${size}px; height:${size}px;
          left:${Math.random() * 100}%;
          bottom:${Math.random() * 60}%;
          animation-duration:${2 + Math.random() * 3}s;
          animation-delay:${Math.random() * 3}s;
          --bx:${(Math.random() - 0.5) * 22}px;
        `;
        container.appendChild(b);
      }
    }
    createBubbles($("#s2bubbles"), 22);

    /* ── S2 DEBRIS CANVAS ── */
    const s2dCanvas = $("#s2-debris-canvas");
    const s2dCtx = s2dCanvas.getContext("2d");
    s2dCanvas.width = document.documentElement.clientWidth;
    s2dCanvas.height = document.documentElement.clientHeight;

    let debrisParticles2 = [];
    function spawnDebris2(tipX, tipY, active) {
      if (!active) return;
      const colors = [
        "#8B6035",
        "#A07848",
        "#C49A4A",
        "#6A4520",
        "#4A2E12",
        "#2A1808",
      ];
      for (let i = 0; i < 3; i++) {
        debrisParticles2.push({
          x: tipX + (Math.random() - 0.5) * 14,
          y: tipY,
          vx: (Math.random() - 0.5) * 3.5,
          vy: -(Math.random() * 2.5 + 0.5),
          size: 2 + Math.random() * 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 1.0,
          decay: 0.03 + Math.random() * 0.04,
          gravity: 0.12,
        });
      }
    }
    function drawDebris2() {
      s2dCtx.clearRect(0, 0, s2dCanvas.width, s2dCanvas.height);
      debrisParticles2 = debrisParticles2.filter((p) => p.life > 0);
      debrisParticles2.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.life -= p.decay;
        s2dCtx.globalAlpha = Math.max(0, p.life * 0.8);
        s2dCtx.beginPath();
        s2dCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        s2dCtx.fillStyle = p.color;
        s2dCtx.fill();
      });
      s2dCtx.globalAlpha = 1;
      requestAnimationFrame(drawDebris2);
    }
    drawDebris2();

    const onResize = () => {
      s2dCanvas.width = document.documentElement.clientWidth;
      s2dCanvas.height = document.documentElement.clientHeight;
      pcW = s3pCanvas.width = document.documentElement.clientWidth;
      pcH = s3pCanvas.height = document.documentElement.clientHeight;
    };
    window.addEventListener("resize", onResize);

    /* ── S3 PARTICLE CANVAS (stats phase) ── */
    const s3pCanvas = $("#s3-particle-canvas");
    const s3pCtx = s3pCanvas.getContext("2d");
    let pcW = (s3pCanvas.width = document.documentElement.clientWidth);
    let pcH = (s3pCanvas.height = document.documentElement.clientHeight);

    const waterParts = Array.from({ length: 70 }, () => ({
      x: Math.random() * document.documentElement.clientWidth,
      y: Math.random() * document.documentElement.clientHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(0.08 + Math.random() * 0.5),
      r: 0.5 + Math.random() * 1.6,
      a: 0.1 + Math.random() * 0.5,
    }));
    function drawWaterParticles() {
      s3pCtx.clearRect(0, 0, pcW, pcH);
      waterParts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -5) {
          p.y = pcH;
          p.x = Math.random() * pcW;
        }
        if (p.x < 0) p.x = pcW;
        if (p.x > pcW) p.x = 0;
        s3pCtx.beginPath();
        s3pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        s3pCtx.fillStyle = `rgba(144,224,239,${p.a})`;
        s3pCtx.fill();
      });
      requestAnimationFrame(drawWaterParticles);
    }
    drawWaterParticles();

    /* ── SCROLL ENGINE ── */
    const progressBar = $("#progress");
    const scrollHint = $("#scroll-hint");
    const sec1 = $("#sec1");
    const sec2 = $("#sec2");
    const sec3 = $("#sec3");
    const s2pipe = $("#s2pipe");
    const s2pipeBody = $("#s2pipeBody");
    const s2headline = $("#s2headline");
    // Water/success/ripple elements now live inside sec2
    const s2water = $("#s2water");
    const s2success = $("#s2success");
    const s2ripple1 = $("#s2ripple1");
    const s2ripple2 = $("#s2ripple2");
    const s2ripple3 = $("#s2ripple3");
    const s2blueTint = $("#s2blueTint");
    const s2pipeTip = $("#s2pipeTip");
    // Gradient/stats remain in sec3
    const s3gradientOverlay = $("#s3gradientOverlay");
    const s3blurOrb1 = $("#s3blurOrb1");
    const s3blurOrb2 = $("#s3blurOrb2");
    const s3blurOrb3 = $("#s3blurOrb3");
    const s3pCanvasEl = $("#s3-particle-canvas");
    const s3owner = $("#s3owner");
    const s3stat1 = $("#s3stat1");
    const s3stat2 = $("#s3stat2");
    const s3stat3 = $("#s3stat3");
    const s3stat4 = $("#s3stat4");
    const s3cta = $("#s3cta");

    let successShown = false,
      waterFoundRising = false;
    let pulseFired = false;
    let gradientShown = false,
      ctaShown = false;
    let lastDebrisSpawn2 = 0;

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }
    function clamp(v, a, b) {
      return Math.max(a, Math.min(b, v));
    }
    let vh = window.innerHeight;
    window.addEventListener(
      "resize",
      () => {
        vh = window.innerHeight;
      },
      { passive: true },
    );

    function sectionProgress(section) {
      const r = section.getBoundingClientRect();
      const totalScroll = section.offsetHeight - vh;
      const scrolled = -r.top;
      return clamp(scrolled / totalScroll, 0, 1);
    }

    function easeOut(t) {
      return 1 - Math.pow(1 - t, 3);
    }
    function easeInOut(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    let scrollRAF = null;
    function onScroll() {
      if (scrollRAF) return;
      scrollRAF = requestAnimationFrame(() => {
        scrollRAF = null;
        const scrollY = window.scrollY;
        const docH = document.body.scrollHeight - vh;
        progressBar.style.width = (scrollY / docH) * 100 + "%";
        scrollHint.classList.toggle("ha-hidden", scrollY > 80);
        const vhH = document.documentElement.clientHeight;

        const now = performance.now();
        const centerX = document.documentElement.clientWidth / 2;

        /* ── SECTION 2 SCROLL ── */
        const p2 = sectionProgress(sec2);
        if (p2 > 0.02) s2headline.classList.add("ha-show");
        for (const [id, threshold] of Object.entries(layerTriggers)) {
          if (p2 >= threshold) showLayerLabel(id);
        }

        // PHASE A: Pipe drills down — tip reaches S9 at p2=0.75, stops at p2=0.85
        if (p2 <= 0) {
          s2pipe.style.opacity = "0";
          s2pipe.style.top = "-400px";
        } else {
          const fadeIn = clamp(p2 / 0.05, 0, 1);
          if (p2 <= 0.92) {
            s2pipe.style.opacity = fadeIn.toString();
          }

          // Pipe tip travels top→85%vh over p2 0→0.85, then stays put
          const tipY = lerp(vhH * 0.05, vhH * 0.85, clamp(p2 / 0.85, 0, 1));
          const pipeExtend = tipY + 400;
          s2pipeBody.style.height = pipeExtend + "px";
          const containerTop = tipY - pipeExtend - 30 - 44;
          s2pipe.style.top = containerTop + "px";

          // Debris while drilling — only before S9 (p2 < 0.73)
          if (p2 > 0.05 && p2 < 0.73 && now - lastDebrisSpawn2 > 80) {
            spawnDebris2(centerX, tipY, true);
            lastDebrisSpawn2 = now;
          }

          // PHASE B: Blue tint starts as pipe reaches S10 (~p2 0.70)
          if (p2 > 0.7) {
            const tintR = clamp((p2 - 0.7) / 0.1, 0, 1);
            s2blueTint.style.opacity = easeOut(tintR) * 0.85;
          } else {
            s2blueTint.style.opacity = 0;
          }

          // PHASE C: Pulse fires when pipe tip touches S10 level (p2 0.83)
          if (p2 >= 0.83 && !pulseFired) {
            pulseFired = true;
            s2pipeTip.classList.add("ha-pulse");
          }
          if (p2 < 0.8 && pulseFired) {
            pulseFired = false;
            s2pipeTip.classList.remove("ha-pulse");
          }

          // PHASE D: Water rises in sec2 — starts ONLY when pipe reaches S10 (p2: 0.74 → 0.92)
          const waterStart2 = 0.74,
            waterEnd2 = 0.92;
          if (p2 > waterStart2) {
            const wRatio = clamp(
              (p2 - waterStart2) / (waterEnd2 - waterStart2),
              0,
              1,
            );
            // Water starts from S10 position (~85% down viewport) and rises to fill screen
            const waterStartHeight = vhH * 0.15; // S10 is at ~85% viewport = 15% from bottom
            const wHeight =
              waterStartHeight +
              easeOut(wRatio) * (vhH * 0.95 - waterStartHeight);
            s2water.style.height = wHeight + "px";
            const waterSurfaceY = vhH - wHeight;
            [s2ripple1, s2ripple2, s2ripple3].forEach((r) => {
              r.style.top = waterSurfaceY + "px";
            });

            // Headline scrolls up and fades in sync with water rise (wRatio 0 → 0.5)
            const headlineExit = clamp(wRatio / 0.5, 0, 1);
            s2headline.style.setProperty(
              "transform",
              `translateY(${-headlineExit * 140}px)`,
              "important",
            );
            s2headline.style.setProperty(
              "opacity",
              (1 - headlineExit).toString(),
              "important",
            );
            s2headline.style.visibility =
              headlineExit >= 1 ? "hidden" : "visible";
            s2headline.style.visibility =
              headlineExit >= 1 ? "hidden" : "visible";

            // Water Found text appears after headline is fully gone (wRatio > 0.6)
            if (wRatio > 0.6 && !successShown) {
              successShown = true;
              s2success.classList.add("ha-show");
            }
            if (wRatio < 0.55 && successShown) {
              successShown = false;
              waterFoundRising = false;
              s2success.classList.remove("ha-show");
              s2success.classList.remove("ha-rising");
            }
          } else {
            // Restore headline when water not yet risen
            s2headline.style.setProperty(
              "transform",
              "translateY(0px)",
              "important",
            );
            s2headline.style.setProperty("opacity", "1", "important");
            s2headline.style.visibility = "visible";
            s2water.style.height = "0px";
            if (successShown) {
              successShown = false;
              waterFoundRising = false;
              s2success.classList.remove("ha-show");
              s2success.classList.remove("ha-rising");
            }
          }

          // PHASE E: Pipe fades after water fully rises (~p2 0.90 → 0.96)
          if (p2 > 0.9) {
            const pipeFade = clamp(1 - (p2 - 0.9) / 0.06, 0, 1);
            s2pipe.style.opacity = pipeFade.toString();
          }

          // Water found text holds then rises up and disappears (~p2 0.95)
          if (p2 > 0.95 && !waterFoundRising) {
            waterFoundRising = true;
            s2success.classList.add("ha-rising");
          }
          if (p2 < 0.92 && waterFoundRising) {
            waterFoundRising = false;
            s2success.classList.remove("ha-rising");
          }
        }

        /* ── SECTION 3 SCROLL — gradient overlay + stats only ── */
        const p3 = sectionProgress(sec3);

        // PHASE A: Gradient overlay — fires as soon as sec3 enters bottom of viewport
        const sec3Rect = sec3.getBoundingClientRect();
        const sec3Entering = sec3Rect.top < vh; // true the moment top edge crosses bottom of screen

        if (sec3Entering && !gradientShown) {
          gradientShown = true;
          s3gradientOverlay.classList.add("ha-show");
          s3blurOrb1.classList.add("ha-show");
          s3blurOrb2.classList.add("ha-show");
          s3blurOrb3.classList.add("ha-show");
          s3pCanvasEl.classList.add("ha-show");
        }
        if (!sec3Entering && gradientShown) {
          gradientShown = false;
          s3gradientOverlay.classList.remove("ha-show");
          s3blurOrb1.classList.remove("ha-show");
          s3blurOrb2.classList.remove("ha-show");
          s3blurOrb3.classList.remove("ha-show");
          s3pCanvasEl.classList.remove("ha-show");
        }

        // PHASE B: Stats stagger in — p3entry = 0 when sec3 top hits bottom of screen, 1 when fully covering viewport
        const p3entry = clamp((vh - sec3Rect.top) / vh, 0, 1);

        const statsItems = [
          { el: s3owner, trigger: 0.15 },
          { el: s3stat1, trigger: 0.35 },
          { el: s3stat2, trigger: 0.5 },
          { el: s3stat3, trigger: 0.65 },
          { el: s3stat4, trigger: 0.8 },
        ];
        statsItems.forEach(({ el, trigger }) => {
          if (p3entry > trigger) el.classList.add("ha-show");
          else el.classList.remove("ha-show");
        });

        // CTA visible as soon as sec3 fully covers the viewport (p3entry = 1)
        if (p3entry >= 1 && !ctaShown) {
          ctaShown = true;
          s3cta.classList.add("ha-show");
        }
        if (p3entry < 0.95 && ctaShown) {
          ctaShown = false;
          s3cta.classList.remove("ha-show");
        }

        /* Dot nav */
        const sects = [sec1, sec2, sec3];
        const progs = sects.map((s) => sectionProgress(s));
        let activeIdx = progs.reduce(
          (best, p, i) => (p > 0.05 && p < 1 ? i : best),
          0,
        );
        dots.forEach((d, i) =>
          d.classList.toggle("ha-active", i === activeIdx),
        );
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    requestAnimationFrame(() => onScroll());
    /* DOT NAV CLICK */
    const sectionTargets = [sec1, sec2, sec3];
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        sectionTargets[i].scrollIntoView({ behavior: "smooth" });
      });
    });

    /* CLEANUP */
    return () => {
      clearInterval(loaderTimer);
      clearTimeout(loaderTimeout);
      cancelAnimationFrame(cursorRAF);
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  /* ─────────────────────────────────────────────
     JSX — exact same structure as the HTML body
  ───────────────────────────────────────────── */
  return (
    <div
      ref={rootRef}
      className={styles.heroRoot}
      aria-label="MMS Water Diviners Story"
    >
      {/* CURSOR */}
      <div id="cursor" className={styles.cursor} aria-hidden="true" />
      <div id="cursor-ring" className={styles.cursorRing} aria-hidden="true" />

      {/* LOADER */}
      <div
        id="loader"
        className={styles.loader}
        role="status"
        aria-label="Loading"
      >
        <div className={styles.sonarRings} aria-hidden="true">
          <div className={styles.sonarRing} />
          <div className={styles.sonarRing} />
          <div className={styles.sonarRing} />
          <div className={styles.sonarRing} />
        </div>
        <div className={styles.loaderInner}>
          <div className={styles.loaderCrosssection}>
            <div className={styles.scanLine} />
            <svg
              viewBox="0 0 340 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect
                x="0"
                y="0"
                width="340"
                height="40"
                fill="rgba(135,206,235,.08)"
              />
              <rect
                x="0"
                y="40"
                width="340"
                height="28"
                fill="rgba(139,94,20,.35)"
              />
              <rect
                x="0"
                y="68"
                width="340"
                height="24"
                fill="rgba(100,60,15,.3)"
              />
              <rect
                x="0"
                y="92"
                width="340"
                height="24"
                fill="rgba(70,45,15,.28)"
              />
              <rect
                x="0"
                y="116"
                width="340"
                height="30"
                fill="rgba(45,35,22,.25)"
              />
              <rect
                x="0"
                y="146"
                width="340"
                height="28"
                fill="rgba(20,28,45,.3)"
              />
              <rect
                x="0"
                y="174"
                width="340"
                height="26"
                fill="rgba(0,50,120,.35)"
              />
              <line
                x1="0"
                y1="40"
                x2="340"
                y2="40"
                stroke="rgba(255,255,255,.12)"
                strokeDasharray="8,14"
              />
              <line
                x1="0"
                y1="68"
                x2="340"
                y2="68"
                stroke="rgba(201,168,76,.2)"
                strokeDasharray="6,12"
              />
              <line
                x1="0"
                y1="92"
                x2="340"
                y2="92"
                stroke="rgba(201,168,76,.15)"
                strokeDasharray="6,12"
              />
              <line
                x1="0"
                y1="116"
                x2="340"
                y2="116"
                stroke="rgba(201,168,76,.12)"
                strokeDasharray="5,10"
              />
              <line
                x1="0"
                y1="146"
                x2="340"
                y2="146"
                stroke="rgba(0,120,200,.2)"
                strokeDasharray="5,10"
              />
              <line
                x1="0"
                y1="174"
                x2="340"
                y2="174"
                stroke="rgba(0,180,216,.35)"
                strokeDasharray="4,8"
              />
              <line
                x1="0"
                y1="54"
                x2="340"
                y2="54"
                stroke="rgba(0,180,216,.0)"
                strokeWidth="1"
              >
                <animate
                  attributeName="stroke-opacity"
                  values="0;0.6;0"
                  dur="2s"
                  repeatCount="indefinite"
                  begin="0.2s"
                />
              </line>
              <line
                x1="0"
                y1="80"
                x2="340"
                y2="80"
                stroke="rgba(0,180,216,.0)"
                strokeWidth="1"
              >
                <animate
                  attributeName="stroke-opacity"
                  values="0;0.5;0"
                  dur="2s"
                  repeatCount="indefinite"
                  begin="0.6s"
                />
              </line>
              <line
                x1="0"
                y1="104"
                x2="340"
                y2="104"
                stroke="rgba(0,180,216,.0)"
                strokeWidth="1"
              >
                <animate
                  attributeName="stroke-opacity"
                  values="0;0.4;0"
                  dur="2s"
                  repeatCount="indefinite"
                  begin="1s"
                />
              </line>
              <line
                x1="0"
                y1="131"
                x2="340"
                y2="131"
                stroke="rgba(0,180,216,.0)"
                strokeWidth="1"
              >
                <animate
                  attributeName="stroke-opacity"
                  values="0;0.5;0"
                  dur="2s"
                  repeatCount="indefinite"
                  begin="1.4s"
                />
              </line>
              <line
                x1="0"
                y1="160"
                x2="340"
                y2="160"
                stroke="rgba(0,180,216,.0)"
                strokeWidth="1.5"
              >
                <animate
                  attributeName="stroke-opacity"
                  values="0;0.7;0"
                  dur="2s"
                  repeatCount="indefinite"
                  begin="1.8s"
                />
              </line>
              <line
                x1="0"
                y1="187"
                x2="340"
                y2="187"
                stroke="rgba(0,180,216,.0)"
                strokeWidth="2"
              >
                <animate
                  attributeName="stroke-opacity"
                  values="0;1;0"
                  dur="2s"
                  repeatCount="indefinite"
                  begin="2.2s"
                />
              </line>
              <rect
                x="165"
                y="0"
                width="10"
                height="200"
                fill="rgba(200,200,200,.15)"
              />
              <rect
                x="165"
                y="0"
                width="10"
                height="200"
                fill="none"
                stroke="rgba(201,168,76,.3)"
                strokeWidth=".5"
              />
              <text
                x="6"
                y="56"
                fontFamily="monospace"
                fontSize="7"
                fill="rgba(255,255,255,.25)"
              >
                10m
              </text>
              <text
                x="6"
                y="82"
                fontFamily="monospace"
                fontSize="7"
                fill="rgba(255,255,255,.22)"
              >
                25m
              </text>
              <text
                x="6"
                y="106"
                fontFamily="monospace"
                fontSize="7"
                fill="rgba(255,255,255,.2)"
              >
                40m
              </text>
              <text
                x="6"
                y="133"
                fontFamily="monospace"
                fontSize="7"
                fill="rgba(255,255,255,.2)"
              >
                55m
              </text>
              <text
                x="6"
                y="162"
                fontFamily="monospace"
                fontSize="7"
                fill="rgba(0,180,216,.5)"
              >
                70m
              </text>
              <text
                x="6"
                y="189"
                fontFamily="monospace"
                fontSize="7"
                fill="rgba(0,180,216,.7)"
              >
                85m ✦
              </text>
              <ellipse
                cx="170"
                cy="190"
                rx="6"
                ry="7"
                fill="rgba(0,180,216,.4)"
              >
                <animate
                  attributeName="opacity"
                  values="0;1;0"
                  dur="1.5s"
                  repeatCount="indefinite"
                  begin="2s"
                />
              </ellipse>
            </svg>
          </div>
          <div className={styles.loaderBrand}>
            <div className={styles.logoMms}>M.M.S</div>
            <div className={styles.logoTagline}>
              Water Diviners · Kankavli · Est. 2012
            </div>
            <div className={styles.loaderCaption}>
              Scanning Earth Layers · Locating Aquifer
            </div>
            <div className={styles.loaderProbeWrap}>
              <div className={styles.loaderDepthBar}>
                <div className={styles.loaderDepthFill} id="loaderDepthFill" />
              </div>
              <div className={styles.loaderHzBar}>
                <div className={styles.loaderHzFill} id="loaderFill" />
              </div>
              <div className={styles.loaderPct} id="loaderPct">
                0%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STORY */}
      <div id="story" className={styles.story}>
        <div id="progress" className={styles.progress} aria-hidden="true" />
        <nav id="dots" className={styles.dots} aria-label="Section navigation">
          <div
            className={styles.dot + " ha-active"}
            role="button"
            tabIndex={0}
            aria-label="Go to section 1"
          />
          <div
            className={styles.dot}
            role="button"
            tabIndex={0}
            aria-label="Go to section 2"
          />
          <div
            className={styles.dot}
            role="button"
            tabIndex={0}
            aria-label="Go to section 3"
          />
        </nav>
        <div id="scroll-hint" className={styles.scrollHint} aria-hidden="true">
          <div className={styles.scrollMouse}>
            <div className={styles.scrollDot} />
          </div>
          <div className={styles.scrollHintText}>Scroll</div>
        </div>

        {/* SECTION 1 — THE SURFACE */}
        <section id="sec1" className={styles.sec1} aria-label="The Surface">
          <div className={styles.sec1Stage} id="sec1stage">
            <div className={styles.s1Bg} aria-hidden="true" />
            <div className={styles.s1Sun} aria-hidden="true" />
            <svg
              className={styles.s1Clouds}
              viewBox="0 0 1440 200"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <ellipse
                cx="220"
                cy="70"
                rx="120"
                ry="40"
                fill="rgba(255,255,255,.5)"
              />
              <ellipse
                cx="265"
                cy="50"
                rx="80"
                ry="46"
                fill="rgba(255,255,255,.6)"
              />
              <ellipse
                cx="170"
                cy="62"
                rx="70"
                ry="34"
                fill="rgba(255,255,255,.42)"
              />
              <ellipse
                cx="1100"
                cy="80"
                rx="100"
                ry="34"
                fill="rgba(255,255,255,.42)"
              />
              <ellipse
                cx="1145"
                cy="60"
                rx="70"
                ry="40"
                fill="rgba(255,255,255,.5)"
              />
              <ellipse
                cx="1060"
                cy="74"
                rx="58"
                ry="30"
                fill="rgba(255,255,255,.38)"
              />
              <ellipse
                cx="660"
                cy="55"
                rx="85"
                ry="30"
                fill="rgba(255,255,255,.32)"
              />
              <ellipse
                cx="700"
                cy="40"
                rx="55"
                ry="32"
                fill="rgba(255,255,255,.38)"
              />
            </svg>
            <div className={styles.s1GroundWrap} aria-hidden="true">
              <svg
                className={styles.s1CrackSvg}
                viewBox="0 0 1440 400"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C49A4A" />
                    <stop offset="20%" stopColor="#A07848" />
                    <stop offset="45%" stopColor="#7A5530" />
                    <stop offset="70%" stopColor="#4A2E12" />
                    <stop offset="90%" stopColor="#2A1808" />
                    <stop offset="100%" stopColor="#1A0E06" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="1440" height="400" fill="url(#g1)" />
                <rect
                  x="0"
                  y="0"
                  width="1440"
                  height="14"
                  fill="rgba(0,0,0,.15)"
                />
                <rect
                  x="0"
                  y="90"
                  width="1440"
                  height="3"
                  fill="rgba(0,0,0,.1)"
                />
                <rect
                  x="0"
                  y="180"
                  width="1440"
                  height="3"
                  fill="rgba(0,0,0,.09)"
                />
                <rect
                  x="0"
                  y="280"
                  width="1440"
                  height="3"
                  fill="rgba(0,0,0,.08)"
                />
                <ellipse
                  cx="180"
                  cy="22"
                  rx="38"
                  ry="15"
                  fill="rgba(0,0,0,.13)"
                />
                <ellipse
                  cx="520"
                  cy="18"
                  rx="24"
                  ry="10"
                  fill="rgba(0,0,0,.11)"
                />
                <ellipse
                  cx="900"
                  cy="22"
                  rx="30"
                  ry="12"
                  fill="rgba(0,0,0,.12)"
                />
                <ellipse
                  cx="1260"
                  cy="26"
                  rx="22"
                  ry="9"
                  fill="rgba(0,0,0,.1)"
                />
                <path
                  id="crack1"
                  className={styles.s1Crack}
                  d="M350,0 L330,45 L358,95 L340,165 L362,205"
                  stroke="rgba(60,30,8,.8)"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  id="crack2"
                  className={styles.s1Crack}
                  d="M700,0 L678,55 L712,105 L692,185 L722,245"
                  stroke="rgba(80,40,12,.65)"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  id="crack3"
                  className={styles.s1Crack}
                  d="M1100,5 L1122,65 L1098,125 L1118,205"
                  stroke="rgba(201,168,76,.55)"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  id="crack4"
                  className={styles.s1Crack}
                  d="M200,10 L217,58 L198,105 L213,165"
                  stroke="rgba(60,30,8,.5)"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>
            </div>
            <div className={styles.s1Title} id="s1title">
              <h2>
                Beneath Every Land
                <br />
                Lies a <em>Secret</em>
              </h2>
              <p>Groundwater · Hidden · Waiting to be Found</p>
            </div>
          </div>
        </section>

        {/* SECTION 2 — DRILLING DOWN */}
        <section id="sec2" className={styles.sec2} aria-label="Drilling Down">
          <div className={styles.sec2Stage} id="sec2stage">
            <div className={styles.s2EarthBg} aria-hidden="true" />
            <svg
              className={styles.s2LayersVisual}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
              viewBox="0 0 1440 900"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="grain"
                  x="0"
                  y="0"
                  width="4"
                  height="4"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="1" cy="1" r=".5" fill="rgba(255,255,255,.03)" />
                  <circle cx="3" cy="3" r=".4" fill="rgba(255,255,255,.02)" />
                </pattern>
              </defs>
              <rect width="1440" height="900" fill="url(#grain)" />
              <rect
                x="0"
                y="0"
                width="1440"
                height="90"
                fill="rgba(60,35,10,.12)"
              />
              <line
                x1="0"
                y1="90"
                x2="1440"
                y2="90"
                stroke="rgba(150,100,40,.14)"
                strokeDasharray="10,18"
              />
              <rect
                x="0"
                y="90"
                width="1440"
                height="135"
                fill="rgba(50,30,8,.10)"
              />
              <line
                x1="0"
                y1="225"
                x2="1440"
                y2="225"
                stroke="rgba(130,90,35,.13)"
                strokeDasharray="10,18"
              />
              <rect
                x="0"
                y="225"
                width="1440"
                height="135"
                fill="rgba(35,22,6,.09)"
              />
              <circle cx="310" cy="285" r="6" fill="rgba(55,38,18,.2)" />
              <circle cx="620" cy="315" r="5" fill="rgba(55,38,18,.18)" />
              <circle cx="930" cy="265" r="7" fill="rgba(55,38,18,.16)" />
              <circle cx="1240" cy="300" r="5" fill="rgba(55,38,18,.2)" />
              <line
                x1="0"
                y1="360"
                x2="1440"
                y2="360"
                stroke="rgba(100,70,25,.15)"
                strokeDasharray="8,14"
              />
              <rect
                x="0"
                y="360"
                width="1440"
                height="180"
                fill="rgba(25,18,8,.10)"
              />
              <rect
                x="0"
                y="360"
                width="1440"
                height="4"
                fill="rgba(0,0,0,.22)"
              />
              <line
                x1="0"
                y1="540"
                x2="1440"
                y2="540"
                stroke="rgba(80,60,20,.18)"
                strokeDasharray="8,14"
              />
              <rect
                x="0"
                y="540"
                width="1440"
                height="180"
                fill="rgba(18,14,6,.09)"
              />
              <line
                x1="0"
                y1="720"
                x2="1440"
                y2="720"
                stroke="rgba(60,50,15,.2)"
                strokeDasharray="6,10"
              />
              <rect
                x="0"
                y="720"
                width="1440"
                height="180"
                fill="rgba(12,10,4,.08)"
              />
            </svg>

            <div className={styles.s2DepthMeter}>
              <div className={styles.s2DepthTick} style={{ top: "10%" }} />
              <div className={styles.s2DepthNum} style={{ top: "10%" }}>
                10m
              </div>
              <div className={styles.s2DepthTick} style={{ top: "25%" }} />
              <div className={styles.s2DepthNum} style={{ top: "25%" }}>
                25m
              </div>
              <div className={styles.s2DepthTick} style={{ top: "40%" }} />
              <div className={styles.s2DepthNum} style={{ top: "40%" }}>
                40m
              </div>
              <div className={styles.s2DepthTick} style={{ top: "55%" }} />
              <div className={styles.s2DepthNum} style={{ top: "55%" }}>
                55m
              </div>
              <div className={styles.s2DepthTick} style={{ top: "70%" }} />
              <div className={styles.s2DepthNum} style={{ top: "70%" }}>
                70m
              </div>
              <div className={styles.s2DepthTick} style={{ top: "85%" }} />
              <div className={styles.s2DepthNum} style={{ top: "85%" }}>
                85m
              </div>
            </div>

            <div className={styles.s2LayerLabel} id="ll1" style={{ top: "4%" }}>
              <div className={styles.s2LayerLabelDot} />
              <span>S5 — Dense Clay · 20m</span>
            </div>
            <div
              className={styles.s2LayerLabel}
              id="ll2"
              style={{ top: "18%" }}
            >
              <div className={styles.s2LayerLabelDot} />
              <span>S6 — Gravel Pack · 35m</span>
            </div>
            <div
              className={styles.s2LayerLabel}
              id="ll3"
              style={{ top: "33%" }}
            >
              <div className={styles.s2LayerLabelDot} />
              <span>S7 — Compressed Soil · 50m</span>
            </div>
            <div
              className={styles.s2LayerLabel}
              id="ll4"
              style={{ top: "48%" }}
            >
              <div className={styles.s2LayerLabelDot} />
              <span>S8 — Fractured Rock · 65m</span>
            </div>
            <div
              className={styles.s2LayerLabel}
              id="ll5"
              style={{ top: "64%" }}
            >
              <div className={styles.s2LayerLabelDot} />
              <span>S9 — Deep Rock · 80m</span>
            </div>
            <div
              className={styles.s2LayerLabel}
              id="ll6"
              style={{ top: "80%" }}
            >
              <div className={styles.s2LayerLabelDot} />
              <span>S10 — Pre-Aquifer · 95m</span>
            </div>

            <div className={styles.s2Headline} id="s2headline">
              <h2>We Read the Earth</h2>
              <p>Geophysical Electromagnetic Survey</p>
            </div>

            <div
              className={styles.s2PipeContainer}
              id="s2pipe"
              style={{ top: "-400px", opacity: 0 }}
              aria-hidden="true"
            >
              <div className={styles.s2MachineHead} id="s2machineHead" />
              <div
                className={styles.s2PipeBody}
                id="s2pipeBody"
                style={{ height: "120px" }}
              />
              <div className={styles.s2PipeTip} id="s2pipeTip" />
            </div>

            <canvas
              id="s2-debris-canvas"
              className={styles.debrisCanvas}
              aria-hidden="true"
            />

            {/* Blue tint overlay — appears as pipe reaches S9 */}
            <div
              className={styles.s3BlueTint}
              id="s2blueTint"
              aria-hidden="true"
            />

            {/* Water level rising inside sec2 */}
            <div
              className={styles.s3WaterLevel}
              id="s2water"
              style={{ height: 0 }}
              aria-hidden="true"
            >
              <div className={styles.s3WaterSurface}>
                <svg viewBox="0 0 1600 44" preserveAspectRatio="none">
                  <path fill="rgba(0,150,210,.4)">
                    <animate
                      attributeName="d"
                      dur="3s"
                      repeatCount="indefinite"
                      values="M0,22 C200,6 400,38 600,22 C800,6 1000,38 1200,22 C1400,6 1600,38 1600,22 L1600,44 L0,44 Z;
                              M0,22 C200,38 400,6 600,22 C800,38 1000,6 1200,22 C1400,38 1600,6 1600,22 L1600,44 L0,44 Z;
                              M0,22 C200,6 400,38 600,22 C800,6 1000,38 1200,22 C1400,6 1600,38 1600,22 L1600,44 L0,44 Z"
                    />
                  </path>
                </svg>
              </div>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "80px",
                  background:
                    "linear-gradient(180deg,rgba(0,180,216,0.25) 0%,transparent 100%)",
                }}
              />
              <div className={styles.s3Bubbles} id="s2bubbles" />
            </div>

            {/* Ripples at water surface */}
            <div
              className={styles.s3Ripple}
              id="s2ripple1"
              aria-hidden="true"
            />
            <div
              className={styles.s3Ripple}
              id="s2ripple2"
              style={{ animationDelay: "0.9s" }}
              aria-hidden="true"
            />
            <div
              className={styles.s3Ripple}
              id="s2ripple3"
              style={{ animationDelay: "1.8s" }}
              aria-hidden="true"
            />

            {/* Water Found text */}
            <div className={styles.s3Success} id="s2success">
              <h2>Water Found.</h2>
              <p>Aquifer Reached · 87 Metres Below</p>
            </div>
          </div>
        </section>

        {/* SECTION 3 — GRADIENT OVERLAY + STATS */}
        <section
          id="sec3"
          className={styles.sec3}
          aria-label="Water Discovery and Results"
        >
          <div className={styles.sec3Stage} id="sec3stage">
            <div className={styles.s3Bg} aria-hidden="true" />

            <div
              className={styles.s3GradientOverlay}
              id="s3gradientOverlay"
              aria-hidden="true"
            />
            <div
              className={`${styles.s3BlurOrb} ${styles.s3BlurOrb1}`}
              id="s3blurOrb1"
              aria-hidden="true"
            />
            <div
              className={`${styles.s3BlurOrb} ${styles.s3BlurOrb2}`}
              id="s3blurOrb2"
              aria-hidden="true"
            />
            <div
              className={`${styles.s3BlurOrb} ${styles.s3BlurOrb3}`}
              id="s3blurOrb3"
              aria-hidden="true"
            />

            <canvas
              id="s3-particle-canvas"
              className={styles.s3ParticleCanvas}
              aria-hidden="true"
            />

            <div
              className={`${styles.s3StatsLayer} ${styles.theme3}`}
              id="s3statsLayer"
            >
              <div className={styles.s3StatsContainer}>
                {/* Profile Block */}
                <div className={styles.s3ProfileCard} id="s3owner">
                  <div className={styles.s3ProfileAvatar}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className={styles.avatarIcon}
                      aria-hidden="true"
                    >
                      <path
                        d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className={styles.s3ProfileContent}>
                    <div className={styles.s3OwnerName}>
                      Dhananjay Manohar Sawant
                    </div>
                    <div className={styles.s3OwnerRole}>
                      Geophysical Water Survey Expert
                    </div>
                    <div className={styles.s3OwnerLocation}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      Kankavli, Maharashtra
                    </div>
                    <div className={styles.s3ExpertiseBadges}>
                      <span className={styles.badge}>
                        Advanced Groundwater Scanning
                      </span>
                      <span className={styles.badge}>
                        Accurate Depth Estimation
                      </span>
                      <span className={styles.badge}>High Success Rate</span>
                      <span className={styles.badge}>
                        Affordable &amp; Reliable
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className={styles.s3StatsGrid}>
                  <div className={styles.s3StatItem} id="s3stat1">
                    <div className={styles.statIcon}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div className={styles.s3StatNum}>10+</div>
                    <div className={styles.s3StatLabel}>
                      Years of Excellence
                    </div>
                  </div>
                  <div className={styles.s3StatItem} id="s3stat2">
                    <div className={styles.statIcon}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                        <path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" />
                      </svg>
                    </div>
                    <div className={styles.s3StatNum}>20+</div>
                    <div className={styles.s3StatLabel}>
                      Successful Projects
                    </div>
                  </div>
                  <div className={styles.s3StatItem} id="s3stat3">
                    <div className={styles.statIcon}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div className={styles.s3StatNum}>95%</div>
                    <div className={styles.s3StatLabel}>Success Rate</div>
                  </div>
                  <div className={styles.s3StatItem} id="s3stat4">
                    <div className={styles.statIcon}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <div className={styles.s3StatNum}>350+</div>
                    <div className={styles.s3StatLabel}>Happy Clients</div>
                  </div>
                </div>

                {/* CTA */}
                <div className={styles.s3CtaGroup} id="s3cta">
                  <a
                    className={styles.ctaPrimary}
                    href="tel:9370427023"
                    aria-label="Call MMS Water Diviners"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    Call Now
                  </a>
                  <a
                    className={styles.ctaSecondary}
                    href="https://wa.me/9370427023"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp MMS Water Diviners"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* /story */}
    </div> /* /heroRoot */
  );
}
