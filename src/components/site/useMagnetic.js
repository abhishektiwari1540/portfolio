import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** Pulls an element toward the cursor with spring-ish release and 3D tilt. */
export function useMagnetic(strength = 0.4, tilt = true) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.35)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.35)" });
    const rotXTo = tilt ? gsap.quickTo(el, "rotateX", { duration: 0.5, ease: "power2.out" }) : null;
    const rotYTo = tilt ? gsap.quickTo(el, "rotateY", { duration: 0.5, ease: "power2.out" }) : null;

    const move = (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);

      xTo(dx * strength);
      yTo(dy * strength);

      if (tilt && rotXTo && rotYTo) {
        rotXTo((dy / (r.height / 2)) * -6);
        rotYTo((dx / (r.width / 2)) * 6);
      }
    };

    const reset = () => {
      xTo(0);
      yTo(0);
      if (tilt && rotXTo && rotYTo) {
        rotXTo(0);
        rotYTo(0);
      }
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", reset);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", reset);
    };
  }, [strength, tilt]);

  return ref;
}

