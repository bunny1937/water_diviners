"use client";

import { useEffect, useRef } from "react";
import styles from "@/styles/soil-visualization.module.css";

export default function SoilVisualization() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = (canvas.width = 400);
    const height = (canvas.height = 560);

    const GROUND_LEVEL = 80;

    const LAYER_HEIGHT = 90;
    const AQUFER_HEIGHT = 140;

    const aquiferTop = GROUND_LEVEL + 4 * LAYER_HEIGHT;
    const aquiferBottom = aquiferTop + AQUFER_HEIGHT;

    /* ---------------- STATIC STONES ---------------- */
    const stones = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: GROUND_LEVEL + Math.random() * 50,
      r: Math.random() * 3 + 2,
    }));

    /* ---------------- MACHINE STATE ---------------- */
    let machineX = Math.random() * (width - 140) + 70;
    let machineVelocity = 0;
    let direction = 1;
    let passes = 0;
    const MAX_PASSES = 3;
    let isDrilling = false;
    let drillDepth = 0;
    let drillAngle = 0;
    let splashTriggered = false;
    let pulseTime = 0;
    let cableSway = 0; // For rig cable sway

    const targetX = Math.random() * (width - 120) + 60;

    const mudParticles = [];
    const splashParticles = [];

    // Worker reaction states
    let worker1HeadAngle = 0;
    let worker2HeadAngle = 0;
    let managerHeadAngle = 0;

    /* ---------------- GROUND ---------------- */
    function drawGround() {
      ctx.fillStyle = "#4a3b2a";
      ctx.fillRect(0, GROUND_LEVEL - 12, width, 12);
    }

    /* ---------------- SOIL ---------------- */
    function drawSoilLayers() {
      const layers = [
        ["#8b7355", "#6b5444", "Top Soil"],
        ["#c9a876", "#a68a64", "Sandy Layer"],
        ["#8b6f47", "#6b5534", "Clay Layer"],
        ["#5c4a30", "#3c3020", "Rock Layer"],
      ];

      layers.forEach((layer, i) => {
        const y = GROUND_LEVEL + i * LAYER_HEIGHT;
        const g = ctx.createLinearGradient(0, y, 0, y + LAYER_HEIGHT);
        g.addColorStop(0, layer[0]);
        g.addColorStop(1, layer[1]);
        ctx.fillStyle = g;
        ctx.fillRect(0, y, width, LAYER_HEIGHT);

        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = "bold 14px Arial";
        ctx.fillText(layer[2], 10, y + 45);
      });

      /* AQUFER (larger now) */
      const waterGradient = ctx.createLinearGradient(
        0,
        aquiferTop,
        0,
        aquiferBottom,
      );
      waterGradient.addColorStop(0, "#48cae4");
      waterGradient.addColorStop(1, "#0077be");
      ctx.fillStyle = waterGradient;
      ctx.fillRect(0, aquiferTop, width, AQUFER_HEIGHT);

      ctx.fillStyle = "white";
      ctx.fillText("Aquifer (Water)", 10, aquiferTop + 60);

      /* Stones */
      ctx.fillStyle = "#5e4b3c";
      stones.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    /* ---------------- MACHINE ---------------- */
    function drawMachine() {
      const baseY = GROUND_LEVEL - 10;

      ctx.save();
      ctx.translate(machineX, 0);

      // Rig cable with subtle sway
      ctx.strokeStyle = "#444";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-cableSway * 2, baseY - 70);
      ctx.quadraticCurveTo(0, baseY - 35, cableSway * 2, baseY);
      ctx.stroke();

      ctx.fillStyle = "#555";
      ctx.fillRect(-25, baseY, 50, 12);

      if (isDrilling) {
        ctx.fillStyle = "silver";
        ctx.fillRect(-3, baseY, 6, drillDepth);

        // Real drill helix instead of triangle
        ctx.save();
        ctx.translate(0, baseY + drillDepth);
        ctx.rotate(drillAngle);
        ctx.strokeStyle = "#888";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const angle = (i * Math.PI * 2) / 3;
          const x = Math.cos(angle) * 8;
          const y = Math.sin(angle) * 8;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        // Add helix lines
        ctx.beginPath();
        ctx.moveTo(-8, 0);
        ctx.lineTo(8, 0);
        ctx.moveTo(0, -8);
        ctx.lineTo(0, 8);
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
    }

    /* ---------------- HUMANS ---------------- */
    function drawPerson(x, shirtColor, headAngle = 0, isManager = false) {
      const y = GROUND_LEVEL - 14;

      ctx.save();
      ctx.translate(x, y);

      // head with rotation
      ctx.save();
      ctx.translate(0, -16);
      ctx.rotate(headAngle);
      ctx.fillStyle = "#f1c27d";
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();

      // eyes
      ctx.fillStyle = "#222";
      ctx.beginPath();
      ctx.arc(-2, -1, 1, 0, Math.PI * 2);
      ctx.arc(2, -1, 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // body
      ctx.fillStyle = shirtColor;
      ctx.fillRect(-4, -10, 8, 16);

      // legs
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-3, 6);
      ctx.lineTo(-4, 16);
      ctx.moveTo(3, 6);
      ctx.lineTo(4, 16);
      ctx.stroke();

      // manager helmet
      if (isManager) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(-6, -22, 12, 4);
      }

      ctx.restore();
    }

    function drawHumans() {
      drawPerson(machineX - 60, "#2a9d8f", worker1HeadAngle);
      drawPerson(machineX - 80, "#1d3557", worker2HeadAngle);
      drawPerson(machineX + 70, "#6c757d", managerHeadAngle, true);
    }

    /* ---------------- PULSE EFFECT ---------------- */
    function drawPulse() {
      if (!splashTriggered) return;

      pulseTime += 0.03;

      for (let i = 0; i < 3; i++) {
        const radius = (pulseTime * 60 + i * 25) % 120;
        const opacity = 1 - radius / 120;

        ctx.strokeStyle = `rgba(255,255,255,${opacity * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(machineX, aquiferTop + 30, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    /* ---------------- PARTICLES ---------------- */
    function updateMud() {
      mudParticles.forEach((p, i) => {
        p.y += p.vy;
        p.x += p.vx;
        p.vy += 0.05;

        // Clamp to canvas bounds
        if (p.x < 0 || p.x > width || p.y > height) {
          mudParticles.splice(i, 1);
          return;
        }

        ctx.fillStyle = "#6b5444";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        if (p.y > GROUND_LEVEL + 50) mudParticles.splice(i, 1);
      });
    }

    function updateSplash() {
      splashParticles.forEach((p, i) => {
        p.y += p.vy;
        p.x += p.vx;
        p.vy += 0.06;

        // Clamp to canvas bounds
        if (p.x < 0 || p.x > width || p.y > height) {
          splashParticles.splice(i, 1);
          return;
        }

        ctx.fillStyle = "#90e0ef";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        if (p.y > height) splashParticles.splice(i, 1);
      });
    }

    /* ---------------- ANIMATION ---------------- */
    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Update cable sway
      cableSway = Math.sin(Date.now() * 0.005) * 0.5;

      if (!isDrilling) {
        // Machine inertia: accelerate/decelerate
        const targetVelocity = direction * 1.5;
        machineVelocity += (targetVelocity - machineVelocity) * 0.05;
        machineX += machineVelocity;

        // Smooth edge handling without bump
        if (machineX > width - 70) {
          machineX = width - 70;
          machineVelocity = 0;
          direction = -1;
          passes++;
        }
        if (machineX < 70) {
          machineX = 70;
          machineVelocity = 0;
          direction = 1;
          passes++;
        }

        if (passes >= MAX_PASSES) {
          machineX += (targetX - machineX) * 0.02;
          if (Math.abs(machineX - targetX) < 1) {
            isDrilling = true;
            machineVelocity = 0; // Stop inertia when drilling
          }
        }
      }

      const baseY = GROUND_LEVEL - 10;
      const maxDepth = aquiferTop - baseY;

      if (isDrilling && drillDepth < maxDepth - 2) {
        drillDepth += 0.8;
        drillAngle += 0.25;

        for (let i = 0; i < 2; i++) {
          mudParticles.push({
            x: machineX,
            y: GROUND_LEVEL,
            r: Math.random() * 3 + 2,
            vx: (Math.random() - 0.5) * 3,
            vy: -(Math.random() * 2),
          });
        }

        if (drillDepth >= maxDepth - 2 && !splashTriggered) {
          splashTriggered = true;
          // Trigger worker reactions
          const drillDirection = machineX < width / 2 ? 0.2 : -0.2; // Subtle angle toward drill
          worker1HeadAngle = drillDirection;
          worker2HeadAngle = drillDirection;
          managerHeadAngle = drillDirection;

          for (let i = 0; i < 40; i++) {
            splashParticles.push({
              x: machineX,
              y: aquiferTop,
              r: Math.random() * 4 + 2,
              vx: (Math.random() - 0.5) * 4,
              vy: -(Math.random() * 4 + 2),
            });
          }
        }
      }

      drawGround();
      drawSoilLayers();
      drawMachine();
      drawHumans();
      updateMud();
      updateSplash();
      drawPulse();

      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <div className={styles.visualizationContainer}>
      <canvas
        ref={canvasRef}
        width="400"
        height="560"
        className={styles.canvas}
      />
    </div>
  );
}
