import { gsap } from "@/lib/gsap";
import { disableDecorative, isReducedMotion } from "./useReducedMotion";

export const MOTION = {
  ease: {
    standard: "expo.out",
    in: "expo.in",
    inOut: "expo.inOut",
    springLight: "elastic.out(1, 0.45)",
    springSnappy: "elastic.out(1, 0.3)",
    content: "power2.out",
  },
  stagger: {
    row: 0.1,
    word: 0.028,
    char: 0.018,
    panel: 0.045,
  },
  duration: {
    fast: 0.25,
    medium: 0.55,
    slow: 0.9,
    sweep: 1.05,
  },
  offset: {
    cursorBlend: 0.3,
    siblingPush: 8,
    rowParallax: 40,
  },
};

export function withSectionDefaults(scope) {
  return gsap.context(() => {
    gsap.defaults({
      ease: isReducedMotion() ? "none" : MOTION.ease.standard,
      overwrite: "auto",
      force3D: true,
      backfaceVisibility: "hidden",
      transformPerspective: 1000,
    });
  }, scope);
}

export function willChangeOn(tl, targets, props = "transform, opacity, clip-path") {
  tl.set(targets, { willChange: props });
}

export function willChangeOff(tl, targets) {
  tl.set(targets, { clearProps: "willChange" }, ">");
}

export function okDecorative() {
  return !disableDecorative();
}
