import { useEffect, useRef } from "react";
import { getLenis } from "./SmoothScroll";
import { disableDecorative } from "./useReducedMotion";

/**
 * Celestial Stardust & Magic Wand Trail
 * Renders an ultra-lightweight, 60-120fps particle canvas overlay.
 * Emits glowing 4-point stars (✦), twinkling sparkles, and soft stardust
 * that drift with anti-gravity physics during cursor movement and scroll gestures.
 */
export function MagicStarTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Check if user prefers reduced motion or is on a pure touch device without fine pointer
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

    // Palette: glowing starlight, warm gold, brand accent coral, celestial ice
    const PALETTE = [
      { r: 255, g: 255, b: 255 },       // Pure diamond starlight
      { r: 255, g: 218, b: 130 },       // Golden sparkle
      { r: 255, g: 115, b: 68 },        // Brand accent coral
      { r: 255, g: 180, b: 90 },        // Warm amber
      { r: 180, g: 235, b: 255 },       // Soft celestial cyan
    ];

    const particles = [];
    const MAX_PARTICLES = 110;
    let animId = null;
    let isRunning = false;

    // Track mouse coordinates & velocity
    let mouse = { x: -100, y: -100, lastX: -100, lastY: -100, speed: 0 };
    let hasMouseMoved = false;

    // Helper: draw 4-point celestial star (✦)
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

    // Spawn a particle
    const createParticle = (x, y, options = {}) => {
      if (particles.length >= MAX_PARTICLES) {
        // Recycle oldest particle
        particles.shift();
      }

      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const type = options.type || (Math.random() > 0.45 ? "star" : Math.random() > 0.5 ? "sparkle" : "dust");

      const speedSpread = options.speedSpread ?? 1.4;
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 1.2 + 0.3) * speedSpread;

      particles.push({
        x: x + (Math.random() - 0.5) * (options.jitter ?? 8),
        y: y + (Math.random() - 0.5) * (options.jitter ?? 8),
        vx: Math.cos(angle) * speed + (options.extraVx ?? 0),
        vy: Math.sin(angle) * speed + (options.extraVy ?? 0),
        size: type === "star" ? Math.random() * 5 + 4 : type === "sparkle" ? Math.random() * 3 + 2.5 : Math.random() * 2 + 1,
        color,
        type,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.08,
        life: 0,
        maxLife: Math.floor(Math.random() * 28 + (type === "star" ? 38 : 28)),
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.15 + 0.08,
      });

      startLoop();
    };

    // Animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (particles.length === 0) {
        isRunning = false;
        return;
      }

      // Additive blending for rich luminous glow
      ctx.globalCompositeOperation = "screen";

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        // Natural physics: slight upward float (anti-gravity sensation) and drag
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.vy -= 0.025; // Gentle float upwards for weightless feel
        p.rotation += p.rotSpeed;
        p.twinklePhase += p.twinkleSpeed;

        // Smooth opacity curve: rapid fade-in, twinkle, gentle fade-out
        const progress = p.life / p.maxLife;
        const fadeIn = Math.min(1, p.life / 6);
        const fadeOut = 1 - progress;
        const twinkle = 0.8 + 0.2 * Math.sin(p.twinklePhase);
        const alpha = Math.max(0, fadeIn * fadeOut * twinkle);

        if (alpha <= 0.01) continue;

        const { r, g, b } = p.color;

        if (p.type === "star") {
          // 4-point star with radiant core
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);

          // Outer star glow
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.85})`;
          ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${alpha * 0.9})`;
          ctx.shadowBlur = 8;
          drawStar(0, 0, 4, p.size * (1 - progress * 0.2), p.size * 0.24, 0);
          ctx.fill();

          // Central bright core
          ctx.beginPath();
          ctx.arc(0, 0, Math.max(1, p.size * 0.2), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fill();

          ctx.restore();
        } else if (p.type === "sparkle") {
          // Diamond sparkle
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.9})`;
          ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${alpha * 0.6})`;
          ctx.shadowBlur = 5;
          drawStar(0, 0, 4, p.size, p.size * 0.35, 0);
          ctx.fill();
          ctx.restore();
        } else {
          // Soft stardust orb
          const rad = Math.max(1, p.size * (1 - progress * 0.3));
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad * 2.5);
          grad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.9})`);
          grad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${alpha * 0.7})`);
          grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

          ctx.beginPath();
          ctx.arc(p.x, p.y, rad * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }

      ctx.globalCompositeOperation = "source-over";
      animId = requestAnimationFrame(render);
    };

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true;
        animId = requestAnimationFrame(render);
      }
    };

    // Pointer move listener ("Magic Pen")
    const onPointerMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      if (!hasMouseMoved) {
        hasMouseMoved = true;
        mouse.x = x;
        mouse.y = y;
        mouse.lastX = x;
        mouse.lastY = y;
        return;
      }

      const dx = x - mouse.lastX;
      const dy = y - mouse.lastY;
      const dist = Math.hypot(dx, dy);

      mouse.speed = dist;
      mouse.lastX = mouse.x;
      mouse.lastY = mouse.y;
      mouse.x = x;
      mouse.y = y;

      // When moving, emit 1-3 particles depending on speed
      const count = Math.min(Math.floor(dist / 14) + 1, 3);
      for (let i = 0; i < count; i++) {
        // Interpolate along the path so fast mouse moves leave a smooth trail
        const lerpFactor = i / count;
        const spawnX = mouse.lastX + dx * lerpFactor;
        const spawnY = mouse.lastY + dy * lerpFactor;
        createParticle(spawnX, spawnY, {
          jitter: 6,
          speedSpread: 1.1,
          extraVx: dx * 0.05,
          extraVy: dy * 0.05,
        });
      }
    };

    // Scroll listener ("Soft Scroll Celestial Dust")
    // When scrolling with wheel/trackpad, spawn gentle stars along the path
    const onScroll = (e) => {
      const scrollSpeed = typeof e === "number" ? Math.abs(e) : Math.abs(e?.velocity ?? 1);
      if (scrollSpeed < 0.1) return;

      const currentX = hasMouseMoved ? mouse.x : width / 2;
      const currentY = hasMouseMoved ? mouse.y : height / 2;

      // Spawn soft drifting stars around cursor location
      const burstCount = Math.min(Math.max(1, Math.floor(scrollSpeed * 0.8)), 3);
      for (let i = 0; i < burstCount; i++) {
        createParticle(currentX, currentY, {
          jitter: 40,
          speedSpread: 1.6,
          extraVy: -Math.sign(e?.velocity || 1) * 0.8, // Counter-scroll float for effortless feel
        });
      }

      // Occasionally spawn a soft star along the side borders during vigorous scrolls
      if (scrollSpeed > 2 && Math.random() > 0.4) {
        const sideX = Math.random() > 0.5 ? Math.random() * 80 + 20 : width - (Math.random() * 80 + 20);
        const sideY = Math.random() * height;
        createParticle(sideX, sideY, {
          type: "star",
          jitter: 20,
          speedSpread: 0.8,
        });
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // Hook to Lenis if active, or fallback to window scroll
    let lenisUnsub = null;
    const lenis = getLenis();
    if (lenis) {
      lenis.on("scroll", onScroll);
      lenisUnsub = () => lenis.off("scroll", onScroll);
    } else {
      let lastScrollY = window.scrollY;
      const handleNativeScroll = () => {
        const delta = window.scrollY - lastScrollY;
        lastScrollY = window.scrollY;
        onScroll({ velocity: delta * 0.1 });
      };
      window.addEventListener("scroll", handleNativeScroll, { passive: true });
      lenisUnsub = () => window.removeEventListener("scroll", handleNativeScroll);
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
