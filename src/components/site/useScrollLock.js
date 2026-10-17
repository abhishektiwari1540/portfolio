import { useEffect } from "react";
import { getLenis } from "./SmoothScroll";

let lockCount = 0;
let prevBodyOverflow = "";
let prevHtmlOverflow = "";
let prevPaddingRight = "";

/**
 * useScrollLock
 * Blocks background scrolling when modals, overlays, or drawers are open.
 * Integrates with both Lenis smooth scroll and native document body scroll,
 * preventing scroll chaining and layout shifts.
 */
export function useScrollLock(lock = true) {
  useEffect(() => {
    if (!lock) return;

    lockCount++;
    const lenis = getLenis();

    if (lockCount === 1) {
      if (lenis) {
        lenis.stop();
      }
      prevBodyOverflow = document.body.style.overflow;
      prevHtmlOverflow = document.documentElement.style.overflow;
      prevPaddingRight = document.body.style.paddingRight;

      // Compensate for scrollbar width to avoid layout jumping
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
        document.body.style.paddingRight = prevPaddingRight;

        const currentLenis = getLenis();
        if (currentLenis) {
          currentLenis.start();
        }
      }
    };
  }, [lock]);
}
