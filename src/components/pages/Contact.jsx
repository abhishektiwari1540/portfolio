import { useEffect, useRef, useState } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { Footer } from "@/components/site/Footer";
import { useMagnetic } from "@/components/site/useMagnetic";

const HEADLINE = "Let's build something.";
const EMAIL = "abhishektiwari1540@gmail.com";

function Social({ label, href }) {
  const box = useRef(null);
  const icon = useRef(null);

  useEffect(() => {
    const el = box.current;
    const ic = icon.current;
    if (!el || !ic) return;
    const xTo = gsap.quickTo(ic, "x", { duration: 0.75, ease: "elastic.out(1, 0.35)" });
    const yTo = gsap.quickTo(ic, "y", { duration: 0.75, ease: "elastic.out(1, 0.35)" });
    const move = (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.75);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.75);
    };
    const out = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", out);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", out);
    };
  }, []);

  return (
    <a
      ref={box}
      href={href}
      target="_blank"
      rel="noreferrer"
      data-cursor="link"
      className="flex h-44 w-44 items-center justify-center rounded-full border border-border md:h-56 md:w-56 transition-colors hover:border-accent hover:text-accent"
    >
      <span ref={icon} className="font-mono-alt text-sm uppercase tracking-[0.25em]">
        {label}
      </span>
    </a>
  );
}

export function Contact() {
  const hero = useRef(null);
  const mail = useRef(null);
  const copyBtn = useMagnetic(0.35);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    registerGsap();
    const el = hero.current;
    if (!el) return;

    const chars = gsap.utils.toArray("[data-hchar]", el);
    gsap.from(chars, { yPercent: 120, duration: 1.1, ease: "expo.out", stagger: 0.025 });

    const move = (e) => {
      chars.forEach((c) => {
        const r = c.getBoundingClientRect();
        const dx = r.left + r.width / 2 - e.clientX;
        const dy = r.top + r.height / 2 - e.clientY;
        const dist = Math.hypot(dx, dy) || 1;
        gsap.to(c, {
          rotate: gsap.utils.clamp(-9, 9, dx / 90),
          textShadow: `${gsap.utils.clamp(-26, 26, (dx / dist) * 18)}px ${gsap.utils.clamp(
            -26,
            26,
            (dy / dist) * 18,
          )}px 26px rgba(0,0,0,0.55)`,
          duration: 0.9,
          ease: "power3.out",
          overwrite: "auto",
        });
      });
    };

    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  const wave = () => {
    const chars = mail.current?.querySelectorAll("[data-echar]");
    if (!chars) return;
    gsap.to(chars, {
      keyframes: [
        { yPercent: -42, duration: 0.28, ease: "power2.out" },
        { yPercent: 0, duration: 0.45, ease: "elastic.out(1, 0.35)" },
      ],
      stagger: { each: 0.028 },
    });
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main>
      <section ref={hero} className="flex min-h-screen flex-col justify-center gap-16 px-6 pt-32 md:px-10">
        <h1 className="display flex flex-wrap text-[clamp(3rem,12.5vw,13rem)]">
          {HEADLINE.split("").map((ch, i) => (
            <span key={i} className="mask-line">
              <span data-hchar className="inline-block will-change-transform">
                {ch === " " ? "\u00A0" : ch}
              </span>
            </span>
          ))}
        </h1>

        <div className="flex flex-col items-center gap-6 py-10">
          <p className="font-mono-alt text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Reply within a day, usually sooner
          </p>
          <a
            ref={mail}
            href={`mailto:${EMAIL}`}
            onPointerEnter={wave}
            data-cursor="link"
            className="flex flex-wrap justify-center text-[clamp(1.1rem,4.4vw,3.4rem)] font-medium tracking-tight transition-colors hover:text-accent"
          >
            {EMAIL.split("").map((ch, i) => (
              <span key={i} data-echar className="inline-block">
                {ch}
              </span>
            ))}
          </a>
          <button
            ref={copyBtn.ref}
            data-cursor="link"
            onClick={handleCopy}
            className={`font-mono-alt rounded-full border px-6 py-3 text-[10px] uppercase tracking-[0.25em] transition-all duration-300 ${
              copied
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-foreground hover:border-accent"
            }`}
          >
            {copied ? "Copied to clipboard!" : "Copy address"}
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 pb-16">
          <Social label="LinkedIn" href="https://linkedin.com" />
          <Social label="GitHub" href="https://github.com" />
        </div>
      </section>

      <Footer />
    </main>
  );
}
