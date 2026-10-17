import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { disableDecorative } from "./useReducedMotion";

function debounce(fn, wait) {
  let t;
  return function debounced(...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

let globalLenis = null;

export function getLenis() {
  return globalLenis || null;
}

export function SmoothScroll() {
  const lenisRef = useRef(null);

  useEffect(() => {
    registerGsap();

    const noMotion = disableDecorative();

    const lenis = new Lenis({
      duration: noMotion ? 0 : 0.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1.2,
      touchMultiplier: 1.5,
      smoothWheel: !noMotion,
      syncTouch: false,
    });
    lenisRef.current = lenis;
    globalLenis = lenis;

    const onScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", onScroll);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(500, 33);

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop: (value) => {
        if (typeof value === "number") lenis.scrollTo(value, { immediate: true });
        return lenis.scroll;
      },
    });

    const refresh = () => ScrollTrigger.refresh({ safe: true });
    const refreshDebounced = debounce(refresh, 120);
    window.addEventListener("resize", refreshDebounced, { passive: true });
    const routeRefresh = () => ScrollTrigger.refresh({ safe: true });
    window.addEventListener("load", routeRefresh, { once: true });

    return () => {
      window.removeEventListener("resize", refreshDebounced);
      window.removeEventListener("load", routeRefresh);
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf);
      lenis.destroy();
      if (globalLenis === lenis) globalLenis = null;
    };
  }, []);

  return null;
}
