import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/** Digits slot-machine into place when the row scrolls in. */
export function SlotNumber({ value, index = 0 }) {
  const root = useRef(null);

  useEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      el.querySelectorAll("[data-col]").forEach((col, i) => {
        const target = Number(col.dataset["col"]);
        gsap.fromTo(
          col.firstElementChild,
          { yPercent: 0 },
          {
            yPercent: -(100 * (20 + target)) / 30,
            duration: 1.6 + i * 0.12,
            delay: index * 0.12 + i * 0.06,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      });
    }, el);
    return () => ctx.revert();
  }, [index]);

  return (
    <span ref={root} className="flex items-end">
      {value.split("").map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i} data-col={ch} className="block h-[0.82em] overflow-hidden">
            <span className="block">
              {Array.from({ length: 3 }).flatMap(() => DIGITS).map((d, j) => (
                <span key={j} className="block h-[0.82em] leading-[0.82]">
                  {d}
                </span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i} className="block leading-[0.82]">
            {ch}
          </span>
        ),
      )}
    </span>
  );
}
