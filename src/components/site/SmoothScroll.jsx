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
      duration: noMotion ? 0 : 1.15,
      lerp: noMotion ? 1 : 0.09,
      wheelMultiplier: 1,
      smoothWheel: !noMotion,
    });
    lenisRef.current = lenis;
    globalLenis = lenis;

    let setSkew = null;
    let setScale = null;
    let skewTargets = [];
    let offScroll = null;

    if (!noMotion) {
      skewTargets = gsap.utils.toArray("[data-skew]");
      setSkew = gsap.quickTo(skewTargets, "skewY", {
        duration: 0.5,
        ease: "elastic.out(1, 0.4)",
      });
      setScale = gsap.quickTo(skewTargets, "scaleY", {
        duration: 0.5,
        ease: "elastic.out(1, 0.5)",
      });
      offScroll = (e) => {
        ScrollTrigger.update();
        const v = gsap.utils.clamp(-7, 7, e.velocity * 0.28);
        setSkew(v);
        setScale(1 + Math.min(Math.abs(e.velocity) * 0.0025, 0.06));
      };
      lenis.on("scroll", offScroll);
    } else {
      lenis.on("scroll", () => ScrollTrigger.update());
    }

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

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
      if (offScroll) lenis.off("scroll", offScroll);
      gsap.ticker.remove(raf);
      lenis.destroy();
      if (globalLenis === lenis) globalLenis = null;
    };
  }, []);

  return null;
}
