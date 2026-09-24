import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";

/** Infinite marquee that flips direction and skews with scroll velocity. */
export function Marquee({ items }) {
  const track = useRef(null);

  useEffect(() => {
    registerGsap();
    const el = track.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const tween = gsap.to(el, {
        xPercent: -50,
        duration: 22,
        ease: "none",
        repeat: -1,
      });

      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          const v = self.getVelocity();
          tween.timeScale(self.direction === -1 ? -1 : 1);
          gsap.to(el, {
            skewX: gsap.utils.clamp(-14, 14, v * -0.006),
            duration: 0.5,
            ease: "elastic.out(1, 0.4)",
            overwrite: true,
          });
          gsap.to(tween, {
            timeScale: (self.direction === -1 ? -1 : 1) * (1 + Math.min(Math.abs(v) / 900, 4)),
            duration: 0.3,
            overwrite: true,
          });
          gsap.to(tween, { timeScale: self.direction === -1 ? -1 : 1, duration: 1.4, delay: 0.35 });
        },
      });

      return () => st.kill();
    }, el);

    return () => ctx.revert();
  }, []);

  const row = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-border py-6">
      <div ref={track} className="flex w-max whitespace-nowrap will-change-transform">
        {row.concat(row).map((item, i) => (
          <span
            key={i}
            className="display flex items-center gap-8 pr-8 text-[clamp(2rem,6vw,5.5rem)] text-foreground"
          >
            {item}
            <span className="text-accent">—</span>
          </span>
        ))}
      </div>
    </div>
  );
}
