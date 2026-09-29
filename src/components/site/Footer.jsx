import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";

const WORD = "LET'S BUILD.";

export function Footer({ invert = false }) {
  const root = useRef(null);

  useEffect(() => {
    registerGsap();
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (invert) {
        gsap.to(el, {
          backgroundColor: "#ECECE4",
          color: "#030305",
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 70%", toggleActions: "play none none reverse" },
        });
      }

      gsap.from(el.querySelectorAll("[data-fchar]"), {
        yPercent: 130,
        duration: 1,
        ease: "expo.out",
        stagger: 0.03,
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [invert]);

  const scramble = () => {
    root.current?.querySelectorAll("[data-fchar]").forEach((c, i) => {
      gsap.to(c, {
        duration: 0.7,
        delay: i * 0.015,
        scrambleText: { text: c.dataset["fchar"] ?? "", chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%" },
      });
      gsap.fromTo(
        c,
        { yPercent: 0 },
        { yPercent: -14, duration: 0.35, delay: i * 0.015, yoyo: true, repeat: 1, ease: "power2.out" },
      );
    });
  };

  return (
    <footer ref={root} className="relative overflow-hidden px-6 pb-10 pt-32 md:px-10">
      <div
        onPointerEnter={scramble}
        data-cursor="link"
        className="display flex flex-wrap text-[clamp(3.5rem,17vw,16rem)] leading-[0.8]"
      >
        {WORD.split("").map((ch, i) => (
          <span key={i} className="mask-line">
            <span data-fchar={ch} className="inline-block">
              {ch === " " ? "\u00A0" : ch}
            </span>
          </span>
        ))}
      </div>

      <div className="font-mono-alt mt-16 flex flex-col gap-6 border-t border-current/20 pt-6 text-[11px] uppercase tracking-[0.22em] md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <a data-cursor="link" href="mailto:abhishektiwari1540@gmail.com" className="text-base normal-case tracking-normal">
            abhishektiwari1540@gmail.com
          </a>
          <span className="opacity-60">Open to full stack roles &amp; freelance builds</span>
        </div>
        <div className="flex gap-6">
          <a data-cursor="link" href="https://www.linkedin.com/in/abhishektiwarii-dev/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a data-cursor="link" href="https://github.com/abhishektiwari1540" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <Link data-cursor="link" to="/" hash="contact">
            Contact
          </Link>
        </div>
        <span className="opacity-60">© {new Date().getFullYear()} Abhishek Tiwari</span>
      </div>
    </footer>
  );
}
