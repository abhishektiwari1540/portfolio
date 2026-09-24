import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { getLenis } from "./SmoothScroll";
import { okDecorative } from "./motion";

function resetScroll() {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo(0, 0);
  }
}

/** Multi-layer curtain sweep played on every route change. */
export function PageTransition() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const wrap = useRef(null);
  const first = useRef(true);

  useEffect(() => {
    registerGsap();
    if (first.current) {
      first.current = false;
      return;
    }
    const layers = wrap.current?.querySelectorAll("[data-curtain]");
    if (!layers) return;

    const decorative = okDecorative();
    const enterDur = decorative ? 0.6 : 0.1;
    const exitDur = decorative ? 0.7 : 0.1;
    const stagger = decorative ? 0.07 : 0;

    const tl = gsap
      .timeline()
      .set(wrap.current, { pointerEvents: "auto" })
      .add(() => {
        ScrollTrigger.disable?.();
      }, 0)
      .fromTo(
        layers,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: enterDur,
          stagger,
          ease: decorative ? "expo.inOut" : "none",
          onComplete: () => {
            resetScroll();
            try {
              ScrollTrigger.refresh({ safe: true });
            } catch {
              /* noop */
            }
          },
        },
      )
      .to(layers, {
        yPercent: -100,
        duration: exitDur,
        stagger,
        ease: decorative ? "expo.inOut" : "none",
        delay: decorative ? 0.05 : 0,
      })
      .add(() => {
        ScrollTrigger.enable?.();
      })
      .set(wrap.current, { pointerEvents: "none" })
      .set(layers, { yPercent: 100 });

    return () => {
      tl.kill();
      try {
        ScrollTrigger.enable?.();
      } catch {
        /* noop */
      }
    };
  }, [pathname]);

  return (
    <div ref={wrap} className="pointer-events-none fixed inset-0 z-[88]">
      {["#030305", "#141416", "#ECECE4"].map((c, i) => (
        <div
          key={c}
          data-curtain
          className="absolute inset-0 translate-y-full will-change-transform"
          style={{ background: c, zIndex: 3 - i }}
        />
      ))}
    </div>
  );
}
