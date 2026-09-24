import { useEffect, useRef } from "react";
import SplitType from "split-type";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { disableDecorative, isReducedMotion } from "./useReducedMotion";
import { MOTION } from "./motion";

export function useSplitReveal({
  by = "chars",
  delay = 0,
  stagger = 0.024,
  scroll = true,
  duration = 1.1,
} = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    registerGsap();

    const reduced = isReducedMotion();
    const actualDuration = reduced ? Math.min(duration, 0.15) : duration;
    const actualStagger = reduced ? 0 : stagger;
    const actualDelay = reduced ? 0 : delay;
    const ease = reduced ? "none" : MOTION.ease.standard;
    const initialRot = reduced ? 0 : 3;

    const types = by === "chars" ? "lines,words,chars" : by === "words" ? "lines,words" : "lines";
    const split = new SplitType(el, { types: types });
    const targets = (by === "chars" ? split.chars : by === "words" ? split.words : split.lines) ?? [];

    split.lines?.forEach((line) => {
      line.style.overflow = "hidden";
      line.style.paddingBottom = "0.08em";
    });

    const scrollOpts =
      !reduced && scroll
        ? { scrollTrigger: { trigger: el, start: "top 88%", once: true } }
        : {};

    const cleanups = [];
    const ctx = gsap.context(() => {
      gsap.from(targets, {
        yPercent: reduced ? 0 : 118,
        rotate: initialRot,
        opacity: reduced ? 1 : 0.01,
        duration: actualDuration,
        delay: actualDelay,
        stagger: actualStagger,
        ease,
        ...scrollOpts,
      });
      cleanups.push(() => {
        split.revert();
      });
    }, el);
    cleanups.forEach((fn) => ctx.add(fn));

    return () => {
      ctx.revert();
    };
  }, [by, delay, stagger, scroll, duration]);

  return ref;
}
