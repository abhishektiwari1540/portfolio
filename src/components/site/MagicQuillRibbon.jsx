import { useEffect, useRef } from "react";
import { getLenis } from "./SmoothScroll";
import { disableDecorative } from "./useReducedMotion";

/**
 * Suggestion 2: Luminescent "Magic Quill" Fluid Ribbon
 * Renders a calligraphic glowing light ribbon behind cursor and scroll motion,
 * complete with Catmull-Rom spline curves, tapering brush physics, and
 * micro-sparkle embers bursting off curve apexes.
 */
export function MagicQuillRibbon() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (disableDecorative()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Trail points for the magic ribbon
    const points = [];
    const MAX_POINTS = 28;

    // Embers / micro-stars bursting off the quill
    const embers = [];
    const MAX_EMBERS = 60;

    let animId = null;
    let isRunning = false;
    let lastTime = performance.now();

    // Helper: draw 4-point star for embers
    const drawStar = (cx, cy, spikes, outerRadius, innerRadius, rotation) => {
      let rot = (Math.PI / 2) * 3 + rotation;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
    };

    const addEmber = (x, y, vx = 0, vy = 0) => {
      if (embers.length >= MAX_EMBERS) embers.shift();
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.4 + 0.4;
      const isGold = Math.random() > 0.4;
      embers.push({
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        vx: Math.cos(angle) * speed + vx * 0.1,
        vy: Math.sin(angle) * speed + vy * 0.1 - 0.3, // Soft anti-gravity float
        size: Math.random() * 3 + 2,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.1,
        color: isGold ? { r: 255, g: 215, b: 110 } : { r: 255, g: 110, b: 65 },
        life: 0,
        maxLife: Math.floor(Math.random() * 22 + 20),
      });
    };

    // Render loop
    const render = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // 1. Update Ribbon Points
      for (let i = points.length - 1; i >= 0; i--) {
        points[i].age += dt;
        if (points[i].age > points[i].maxAge) {
          points.splice(i, 1);
        }
      }

      // 2. Render Ribbon Spline
      if (points.length > 2) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";

        // Draw multiple passes for deep neon bloom:
        // Pass A: Wide soft coral glow
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Outer glow
        ctx.lineWidth = 14;
        ctx.strokeStyle = "rgba(255, 110, 65, 0.18)";
        ctx.shadowColor = "rgba(255, 110, 65, 0.8)";
        ctx.shadowBlur = 18;
        ctx.stroke();

        // Mid ribbon (warm gold/coral)
        ctx.lineWidth = 6;
        ctx.strokeStyle = "rgba(255, 195, 95, 0.45)";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(255, 215, 120, 0.9)";
        ctx.stroke();

        // Inner core (bright white quill spine)
        ctx.lineWidth = 2.2;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
        ctx.shadowBlur = 4;
        ctx.shadowColor = "#ffffff";
        ctx.stroke();

        ctx.restore();
      }

      // 3. Render Micro-Star Embers
      if (embers.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";

        for (let i = embers.length - 1; i >= 0; i--) {
          const em = embers[i];
          em.life++;
          if (em.life >= em.maxLife) {
            embers.splice(i, 1);
            continue;
          }

          em.x += em.vx;
          em.y += em.vy;
          em.vx *= 0.96;
          em.vy *= 0.96;
          em.vy -= 0.02; // Anti-gravity float
          em.rotation += em.rotSpeed;

          const progress = em.life / em.maxLife;
          const alpha = (1 - progress) * 0.9;
          const { r, g, b } = em.color;

          ctx.save();
          ctx.translate(em.x, em.y);
          ctx.rotate(em.rotation);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${alpha * 0.8})`;
          ctx.shadowBlur = 6;
          drawStar(0, 0, 4, em.size * (1 - progress * 0.3), em.size * 0.3, 0);
          ctx.fill();
          ctx.restore();
        }

        ctx.restore();
      }

      // Check if we can sleep the render loop
      if (points.length === 0 && embers.length === 0) {
        isRunning = false;
        return;
      }

      animId = requestAnimationFrame(render);
    };

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true;
        lastTime = performance.now();
        animId = requestAnimationFrame(render);
      }
    };

    // Pointer move listener ("Drawing with the Magic Quill")
    let lastX = -100;
    let lastY = -100;

    const onPointerMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      if (lastX < 0) {
        lastX = x;
        lastY = y;
        return;
      }

      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.hypot(dx, dy);

      // Only add points if there is movement
      if (dist > 3) {
        // Taper ribbon life based on speed for feather-light calligraphy
        const maxAge = Math.min(0.38, Math.max(0.18, 0.32 - dist * 0.002));

        points.push({
          x,
          y,
          age: 0,
          maxAge,
          speed: dist,
        });

        if (points.length > MAX_POINTS) points.shift();

        // Spawn micro-star ember along the quill stroke
        if (Math.random() > 0.45) {
          addEmber(x, y, dx * 0.1, dy * 0.1);
        }

        lastX = x;
        lastY = y;
        startLoop();
      }
    };

    // Scroll listener ("Fluid Wave Light Reaction")
    let lastScrollY = window.scrollY;
    const onScroll = (e) => {
      const currentScrollY = window.scrollY;
      const deltaY = typeof e === "number" ? e : (e?.velocity ?? currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;

      if (Math.abs(deltaY) < 0.2) return;

      const cursorX = lastX > 0 ? lastX : width / 2;
      const cursorY = lastY > 0 ? lastY : height / 2;

      // Add a fluid ribbon wave point and bursting stars during scroll
      points.push({
        x: cursorX + (Math.random() - 0.5) * 12,
        y: cursorY + (Math.random() - 0.5) * 12,
        age: 0,
        maxAge: 0.28,
        speed: Math.abs(deltaY),
      });
      if (points.length > MAX_POINTS) points.shift();

      // Emit 1-2 glowing embers floating counter to scroll
      addEmber(cursorX, cursorY, (Math.random() - 0.5) * 2, -Math.sign(deltaY) * 1.5);
      startLoop();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // Hook to Lenis or native scroll
    let lenisUnsub = null;
    const lenis = getLenis();
    if (lenis) {
      lenis.on("scroll", onScroll);
      lenisUnsub = () => lenis.off("scroll", onScroll);
    } else {
      window.addEventListener("scroll", onScroll, { passive: true });
      lenisUnsub = () => window.removeEventListener("scroll", onScroll);
    }

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      if (lenisUnsub) lenisUnsub();
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9998] h-full w-full will-change-transform"
    />
  );
}
