import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const QUERY = "(prefers-reduced-motion: reduce)";
let globalReduced = false;
let initGlobal = false;
const listeners = new Set();

function ensureGlobal() {
  if (initGlobal || typeof window === "undefined" || !window.matchMedia) return;
  initGlobal = true;
  const mql = window.matchMedia(QUERY);
  const apply = () => {
    globalReduced = mql.matches;
    listeners.forEach((fn) => fn(globalReduced));
    gsap.globalTimeline.timeScale(globalReduced ? 0.0001 : 1);
  };
  apply();
  const legacy = typeof mql.addEventListener !== "function";
  if (legacy) mql.addListener(apply);
  else mql.addEventListener("change", apply, { passive: true });
}

export function useReducedMotion() {
  const [val, setVal] = useState(() => {
    ensureGlobal();
    return globalReduced;
  });
  useEffect(() => {
    ensureGlobal();
    const fn = (v) => setVal(v);
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);
  return val;
}

export function isReducedMotion() {
  ensureGlobal();
  return globalReduced;
}

export function motionTween(defaults, reduced) {
  ensureGlobal();
  if (!globalReduced) return defaults;
  return { ...defaults, ...(reduced || { duration: Math.min(defaults.duration ?? 1, 0.18), stagger: 0 }) };
}

export function disableDecorative() {
  ensureGlobal();
  return globalReduced;
}
