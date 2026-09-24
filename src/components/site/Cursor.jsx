import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** Difference-blended custom cursor with elastic GSAP quickTo tracking & badge reveal. */
export function Cursor() {
  const root = useRef(null);
  const label = useRef(null);
  const glow = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = root.current;
    const lab = label.current;
    const gl = glow.current;
    document.documentElement.classList.add("no-cursor");

    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });
    const x = gsap.quickTo(el, "x", { duration: 0.28, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.28, ease: "power3.out" });

    let mode = "dot";
    const sizes = {
      dot: { w: 12, borderRadius: "50%" },
      link: { w: 48, borderRadius: "50%" },
      view: { w: 90, borderRadius: "50%" },
    };

    const apply = (next) => {
      if (next === mode) return;
      mode = next;
      gsap.to(el, {
        width: sizes[next].w,
        height: sizes[next].w,
        borderRadius: sizes[next].borderRadius,
        duration: 0.42,
        ease: "expo.out",
        overwrite: "auto",
      });
      gsap.to(lab, { opacity: next === "view" ? 1 : 0, duration: 0.2, overwrite: "auto" });
      if (gl) {
        gsap.to(gl, { opacity: next === "view" || next === "link" ? 0.6 : 0, duration: 0.3, overwrite: "auto" });
      }
    };

    const move = (e) => {
      x(e.clientX);
      y(e.clientY);
      gsap.to(el, { opacity: 1, duration: 0.2, overwrite: "auto" });
      const target = (e.target)?.closest("[data-cursor]");
      apply((target?.dataset["cursor"]) ?? "dot");
    };

    const leave = () => gsap.to(el, { opacity: 0, duration: 0.2 });

    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("no-cursor");
    };
  }, []);

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-3 w-3 items-center justify-center rounded-full bg-white text-black md:flex will-change-transform shadow-[0_0_15px_rgba(255,255,255,0.8)]"
      style={{ mixBlendMode: "difference" }}
    >
      <div
        ref={glow}
        className="absolute -inset-4 rounded-full bg-accent/40 blur-md opacity-0 transition-opacity duration-300"
      />
      <span
        ref={label}
        className="font-mono-alt relative z-10 text-[11px] uppercase tracking-[0.2em] text-black opacity-0 font-bold"
      >
        View
      </span>
    </div>
  );
}
