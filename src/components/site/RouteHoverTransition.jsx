import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "@tanstack/react-router";
import { gsap, registerGsap } from "@/lib/gsap";
import { MOTION, willChangeOff, willChangeOn } from "./motion";
import { disableDecorative, isReducedMotion } from "./useReducedMotion";

const PANEL_COLORS = ["#030305", "#141416", "#ECECE4"];
const PANEL_COUNT = PANEL_COLORS.length + 1;

function debounce(fn, wait) {
  let t;
  return function debounced(...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

const RouteHoverCtx = createContext(null);

function useRouteHoverInternal() {
  const ctx = useContext(RouteHoverCtx);
  if (!ctx) throw new Error("useRouteHover must be used within <RouteHoverTransition>");
  return ctx;
}

function rectToInset(r, vpW, vpH, radiusPx = 0) {
  const top = Math.max(0, Math.round(r.top));
  const right = Math.max(0, Math.round(vpW - (r.left + r.width)));
  const bottom = Math.max(0, Math.round(vpH - (r.top + r.height)));
  const left = Math.max(0, Math.round(r.left));
  const radius = radiusPx > 0 ? ` round ${radiusPx}px` : "";
  return `inset(${top}px ${right}px ${bottom}px ${left}px${radius})`;
}

export function RouteHoverTransition({ children }) {
  registerGsap();
  const navigate = useNavigate();
  const wrap = useRef(null);
  const panelsRef = useRef(new Array(PANEL_COUNT).fill(null));
  const imgRef = useRef(null);
  const labelWrapRef = useRef(null);
  const labelRef = useRef(null);
  const sublabelRef = useRef(null);
  const viewBadgeRef = useRef(null);
  const activeTl = useRef(null);
  const currentEl = useRef(null);
  const hoverState = useRef({ isHovered: false, isActivating: false });
  const cursor = useRef({ x: 0, y: 0 });
  const blendRect = useRef(null);
  const blendTick = useRef(null);
  const vp = useRef({ w: 0, h: 0 });
  const tiers = useRef({ mobile: false, large: false });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const update = () => {
      vp.current.w = window.innerWidth;
      vp.current.h = window.innerHeight;
      tiers.current.mobile = vp.current.w < 768;
      tiers.current.large = vp.current.w >= 1600;
    };
    update();
    const updateDebounced = debounce(update, 120);
    window.addEventListener("resize", updateDebounced, { passive: true });

    const mm = gsap.matchMedia();
    mm.add("(max-width: 767px)", () => {
      tiers.current.mobile = true;
    });
    mm.add("(min-width: 1600px)", () => {
      tiers.current.large = true;
    });

    const moveCapture = (e) => {
      cursor.current.x = e.clientX;
      cursor.current.y = e.clientY;
    };
    window.addEventListener("pointermove", moveCapture, { passive: true });

    const keyCapture = (e) => {
      if (e.key === "Escape" && hoverState.current.isHovered) {
        onLeave();
      }
    };
    window.addEventListener("keydown", keyCapture);

    return () => {
      activeTl.current?.kill();
      if (blendTick.current) gsap.ticker.remove(blendTick.current);
      window.removeEventListener("resize", updateDebounced);
      window.removeEventListener("pointermove", moveCapture);
      window.removeEventListener("keydown", keyCapture);
      mm.revert();
    };
  }, []);

  const killActive = () => {
    if (activeTl.current) {
      activeTl.current.kill();
      activeTl.current = null;
    }
  };

  const getPanels = () => panelsRef.current.filter(Boolean);

  const computeTargetRect = useCallback((r) => {
    const { w, h } = vp.current;
    const reduced = isReducedMotion();
    const multW = tiers.current.large ? 2.2 : 1.6;
    const multH = tiers.current.large ? 4.0 : 3.2;
    const targetW = Math.min(Math.max(r.width * multW, r.width + 120), w * (tiers.current.large ? 0.62 : 0.55));
    const targetH = Math.min(Math.max(r.height * multH, r.height + 260), h * 0.5);

    const cxBase = r.left + r.width / 2;
    const cyBase = r.top + r.height / 2;
    let cx = cxBase;
    let cy = cyBase;
    if (!reduced) {
      const { x, y } = cursor.current;
      cx = gsap.utils.interpolate(cxBase, x, MOTION.offset.cursorBlend);
      cy = gsap.utils.interpolate(cyBase, y, MOTION.offset.cursorBlend * 0.7);
    }

    let left = cx - targetW / 2 - w * 0.04;
    let top = cy - targetH / 2 - h * 0.04;
    left = gsap.utils.clamp(24, w - targetW - 24, left);
    top = gsap.utils.clamp(24, h - targetH - 24, top);
    return { top, left, width: targetW, height: targetH, right: left + targetW, bottom: top + targetH };
  }, []);

  const ensureBlendTick = useCallback(() => {
    if (blendTick.current || !currentEl.current || isReducedMotion()) return;
    const panels = getPanels();
    if (!panels.length) return;
    const { w, h } = vp.current;
    blendTick.current = () => {
      if (!currentEl.current || !hoverState.current.isHovered) {
        gsap.ticker.remove(blendTick.current);
        blendTick.current = null;
        return;
      }
      const rect = currentEl.current.getBoundingClientRect();
      const t = computeTargetRect(rect);
      for (let i = 0; i < panels.length; i++) {
        const p = panels[i];
        const depth = i - 1;
        const offX = depth * 22;
        const offY = depth * -18;
        const radius = 6 + (i === panels.length - 1 ? Math.round(gsap.utils.clamp(0, 14, (cursor.current.x * 14) / (vp.current.w || 1))) : 0);
        const inset = rectToInset(
          {
            left: t.left - offX,
            top: t.top - offY,
            width: t.width,
            height: t.height,
          },
          w,
          h,
          radius,
        );
        gsap.set(p, { clipPath: inset });
      }
    };
    gsap.ticker.add(blendTick.current);
  }, [computeTargetRect]);

  const onEnter = useCallback(
    (el, meta = {}) => {
      if (!isMounted || !wrap.current || hoverState.current.isActivating) return;
      if (tiers.current.mobile) return;

      currentEl.current = el;
      hoverState.current.isHovered = true;
      const reduced = isReducedMotion();

      const r = el.getBoundingClientRect();
      const panels = getPanels();
      if (!panels.length) return;

      killActive();

      const { w, h } = vp.current;
      const targetRect = computeTargetRect(r);
      const wrapEl = wrap.current;
      const { to, image, label = "", sublabel = "" } = meta;

      wrapEl.dataset.to = to || "";

      if (imgRef.current && image) {
        imgRef.current.src = image;
        imgRef.current.alt = label;
      }
      if (labelRef.current) labelRef.current.textContent = label;
      if (sublabelRef.current) sublabelRef.current.textContent = sublabel;

      const tl = gsap.timeline();
      activeTl.current = tl;

      tl.set(wrapEl, { pointerEvents: "none" });

      willChangeOn(tl, [
        ...panels,
        imgRef.current,
        labelRef.current,
        sublabelRef.current,
        viewBadgeRef.current,
      ].filter(Boolean));

      for (let i = 0; i < panels.length; i++) {
        const p = panels[i];
        const isFront = i === panels.length - 1;
        const startInset = rectToInset(r, w, h, 0);
        tl.set(
          p,
          {
            clipPath: startInset,
            x: 0,
            y: 0,
            rotate: 0,
            opacity: 1,
            filter: "none",
            zIndex: 10 - i,
            immediateRender: true,
          },
          0,
        );
        if (isFront && imgRef.current) {
          tl.set(
            imgRef.current,
            {
              clipPath: "inset(0% 0% 100% 0%)",
              opacity: image ? 1 : 0,
              scale: reduced ? 1 : 1.06,
              filter: "none",
              immediateRender: true,
            },
            0,
          );
        }
      }

      tl.set(
        [labelRef.current, sublabelRef.current],
        { yPercent: 120, opacity: 0, immediateRender: true },
        0,
      );
      tl.set(
        viewBadgeRef.current,
        { scale: reduced ? 1 : 0, opacity: 0, rotate: 0, immediateRender: true },
        0,
      );

      tl.addLabel("panels:start", 0);

      for (let i = 0; i < panels.length; i++) {
        const p = panels[i];
        const depth = i - 1;
        const offsetX = reduced ? 0 : depth * 22;
        const offsetY = reduced ? 0 : depth * -18;
        const radius = reduced ? 4 : 8;
        const targetInset = rectToInset(
          {
            left: targetRect.left - offsetX,
            top: targetRect.top - offsetY,
            width: targetRect.width,
            height: targetRect.height,
          },
          w,
          h,
          radius,
        );
        const shadow =
          reduced
            ? "none"
            : i === panels.length - 1
              ? "drop-shadow(0 34px 40px rgba(0,0,0,0.55)) drop-shadow(0 0 0 1px rgba(255,255,255,0.04))"
              : i === panels.length - 2
                ? "drop-shadow(0 18px 22px rgba(0,0,0,0.35))"
                : "drop-shadow(0 10px 14px rgba(0,0,0,0.25))";

        const duration = reduced ? 0.14 : 0.74;
        const ease = reduced ? "none" : MOTION.ease.standard;
        const delay = reduced ? 0 : i * MOTION.stagger.panel;

        tl.to(p, { clipPath: targetInset, duration, ease, delay }, "panels:start");
        tl.to(
          p,
          {
            x: offsetX,
            y: offsetY,
            rotate: reduced ? 0 : depth * -0.7,
            filter: shadow,
            duration,
            ease,
            delay,
          },
          "panels:start",
        );
      }

      tl.addLabel("image:reveal", "panels:start+=0.12");
      if (imgRef.current) {
        tl.to(
          imgRef.current,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: reduced ? 0.1 : 0.6,
            ease: reduced ? "none" : MOTION.ease.standard,
          },
          "image:reveal",
        );
        tl.to(
          imgRef.current,
          {
            scale: 1,
            duration: reduced ? 0.1 : 0.95,
            ease: reduced ? "none" : MOTION.ease.content,
          },
          "image:reveal",
        );
      }

      tl.addLabel("copy:reveal", "panels:start+=0.2");
      tl.to(
        labelRef.current,
        {
          yPercent: 0,
          opacity: 1,
          duration: reduced ? 0.1 : 0.55,
          ease: reduced ? "none" : MOTION.ease.standard,
        },
        "copy:reveal",
      );
      tl.to(
        sublabelRef.current,
        {
          yPercent: 0,
          opacity: 1,
          duration: reduced ? 0.1 : 0.5,
          ease: reduced ? "none" : MOTION.ease.standard,
        },
        "copy:reveal+=0.05",
      );

      tl.addLabel("badge:reveal", "image:reveal+=0.1");
      if (viewBadgeRef.current) {
        tl.fromTo(
          viewBadgeRef.current,
          { scale: 0, rotate: -15, opacity: 0 },
          {
            scale: 1,
            rotate: 0,
            opacity: 1,
            duration: reduced ? 0.1 : 0.6,
            ease: reduced ? "none" : MOTION.ease.springLight,
          },
          "badge:reveal",
        );
      }

      willChangeOff(tl, [
        labelRef.current,
        sublabelRef.current,
        viewBadgeRef.current,
      ].filter(Boolean));

      if (!reduced) {
        tl.call(() => ensureBlendTick(), null, "copy:reveal+=0.05");
      }
    },
    [isMounted, computeTargetRect, ensureBlendTick],
  );

  const onLeave = useCallback(() => {
    if (!isMounted || hoverState.current.isActivating) return;
    hoverState.current.isHovered = false;
    const el = currentEl.current;
    if (!el) return;
    if (tiers.current.mobile) return;

    const r = el.getBoundingClientRect();
    const panels = getPanels();
    if (!panels.length) return;

    killActive();
    const { w, h } = vp.current;
    const reduced = isReducedMotion();

    const tl = gsap.timeline({
      onComplete: () => {
        if (!hoverState.current.isHovered) {
          gsap.set(wrap.current, { pointerEvents: "none" });
          currentEl.current = null;
        }
      },
    });
    activeTl.current = tl;

    tl.addLabel("hide:copy", 0);
    tl.to(
      [labelRef.current, sublabelRef.current],
      {
        yPercent: -110,
        opacity: 0,
        duration: reduced ? 0.1 : 0.3,
        ease: reduced ? "none" : MOTION.ease.in,
        stagger: reduced ? 0 : 0.025,
      },
      "hide:copy",
    );

    tl.addLabel("hide:badge", "hide:copy+=0.02");
    if (viewBadgeRef.current) {
      tl.to(
        viewBadgeRef.current,
        {
          scale: 0.5,
          opacity: 0,
          rotate: 12,
          duration: reduced ? 0.08 : 0.25,
          ease: reduced ? "none" : "back.in(1.2)",
        },
        "hide:badge",
      );
    }

    tl.addLabel("hide:image", "hide:copy+=0.02");
    if (imgRef.current) {
      tl.to(
        imgRef.current,
        {
          clipPath: "inset(100% 0% 0% 0%)",
          duration: reduced ? 0.08 : 0.36,
          ease: reduced ? "none" : MOTION.ease.in,
        },
        "hide:image",
      );
    }

    tl.addLabel("hide:panels", "hide:image+=0.01");
    for (let i = panels.length - 1; i >= 0; i--) {
      const p = panels[i];
      const startIdx = panels.length - 1 - i;
      tl.to(
        p,
        {
          clipPath: rectToInset(r, w, h, 0),
          x: 0,
          y: 0,
          rotate: 0,
          filter: "none",
          duration: reduced ? 0.14 : 0.62,
          ease: reduced ? "none" : MOTION.ease.inOut,
          delay: reduced ? 0 : startIdx * 0.025,
        },
        "hide:panels",
      );
    }

    tl.to(
      panels,
      {
        opacity: 0,
        duration: reduced ? 0.05 : 0.14,
        stagger: reduced ? 0 : 0,
      },
      "hide:panels",
    );

    willChangeOff(tl, [
      ...panels,
      imgRef.current,
      labelRef.current,
      sublabelRef.current,
      viewBadgeRef.current,
    ].filter(Boolean));
  }, [isMounted]);

  const onActivate = useCallback(
    (el, meta = {}) => {
      if (!isMounted) return false;
      if (tiers.current.mobile) return false;
      const panels = getPanels();
      if (!panels.length) return false;

      hoverState.current.isActivating = true;
      killActive();
      if (blendTick.current) {
        gsap.ticker.remove(blendTick.current);
        blendTick.current = null;
      }

      const reduced = isReducedMotion();
      const fullInset = `inset(0px 0px 0px 0px round 0px)`;

      const tl = gsap.timeline({
        onComplete: () => {
          if (typeof meta.onComplete === "function") {
            meta.onComplete();
          } else if (meta.to) {
            navigate({ to: meta.to });
          }
        },
      });
      activeTl.current = tl;

      tl.set(wrap.current, { pointerEvents: "auto" });

      tl.addLabel("sweep:cleanup", 0);
      tl.to(
        [labelRef.current, sublabelRef.current],
        {
          yPercent: -150,
          opacity: 0,
          duration: reduced ? 0.08 : 0.28,
          ease: reduced ? "none" : MOTION.ease.in,
          stagger: reduced ? 0 : 0.02,
        },
        "sweep:cleanup",
      );

      if (viewBadgeRef.current) {
        tl.to(
          viewBadgeRef.current,
          {
            scale: 0.2,
            opacity: 0,
            duration: reduced ? 0.05 : 0.2,
            ease: "back.in(1.5)",
          },
          "sweep:cleanup",
        );
      }

      if (imgRef.current && (imgRef.current.src || meta.image)) {
        tl.to(
          imgRef.current,
          {
            opacity: 0,
            scale: reduced ? 1 : 1.15,
            filter: reduced ? "none" : "blur(10px)",
            duration: reduced ? 0.1 : 0.42,
            ease: reduced ? "none" : "power2.in",
          },
          "sweep:cleanup",
        );
      }

      tl.addLabel("sweep:full", "sweep:cleanup+=0.04");
      for (let i = 0; i < panels.length; i++) {
        const p = panels[i];
        tl.to(
          p,
          {
            clipPath: fullInset,
            x: 0,
            y: 0,
            rotate: 0,
            filter: "none",
            duration: reduced ? 0.15 : 0.85,
            ease: reduced ? "none" : MOTION.ease.inOut,
            delay: reduced ? 0 : i * MOTION.stagger.panel,
          },
          "sweep:full",
        );
      }

      tl.add(() => {
        hoverState.current.isActivating = false;
        hoverState.current.isHovered = false;
        currentEl.current = null;
      });

      willChangeOff(tl, panels);

      return true;
    },
    [isMounted, navigate],
  );

  const value = { onEnter, onLeave, onActivate };

  return (
    <RouteHoverCtx.Provider value={value}>
      {children}

      <div
        ref={wrap}
        className="pointer-events-none fixed inset-0 z-[87]"
        aria-hidden="true"
      >
        {PANEL_COLORS.map((c, i) => (
          <div
            key={c}
            ref={(node) => {
              panelsRef.current[i] = node;
            }}
            data-route-panel
            className="fixed inset-0 opacity-0"
            style={{
              background: c,
              willChange: "clip-path, transform, opacity, filter",
            }}
          />
        ))}

        <div
          ref={(node) => {
            panelsRef.current[PANEL_COLORS.length] = node;
          }}
          data-route-panel
          className="fixed inset-0 overflow-hidden opacity-0"
          style={{
            background: PANEL_COLORS[PANEL_COLORS.length - 1],
            willChange: "clip-path, transform, opacity, filter",
          }}
        >
          <img
            ref={imgRef}
            alt=""
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ willChange: "transform, clip-path, opacity, filter" }}
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onLeave();
            }}
            data-cursor="link"
            aria-label="Close preview"
            className="pointer-events-auto absolute right-6 top-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-white hover:bg-black/90 focus:outline-none"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {viewBadgeRef !== null && (
            <div
              ref={viewBadgeRef}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ willChange: "transform, opacity" }}
            >
              <div
                className="relative flex h-[140px] w-[140px] md:h-[170px] md:w-[170px] items-center justify-center rounded-full"
                style={{
                  background: "#F5F1E8",
                  boxShadow:
                    "0 30px 60px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.4)",
                }}
              >
                <span className="display text-[22px] md:text-[26px] tracking-[0.18em] uppercase text-[#05050A]">
                  View
                </span>
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    stroke="rgba(5,5,10,0.08)"
                    strokeWidth="1"
                    strokeDasharray="1 3"
                  />
                </svg>
              </div>
            </div>
          )}

          <div
            ref={labelWrapRef}
            className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-5 md:p-7"
            style={{ willChange: "transform, opacity" }}
          >
            <div className="mask-line overflow-hidden">
              <span
                ref={labelRef}
                className="display block text-[clamp(1.6rem,3.4vw,2.8rem)] leading-none text-background will-change-transform"
              />
            </div>
            <div className="mask-line overflow-hidden">
              <span
                ref={sublabelRef}
                className="font-mono-alt block text-[11px] uppercase tracking-[0.22em] text-background/70 will-change-transform"
              />
            </div>
          </div>
        </div>
      </div>
    </RouteHoverCtx.Provider>
  );
}

export function useRouteHover() {
  return useRouteHoverInternal();
}
