import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { STACK } from "./data";
import portrait from "@/assets/portrait.jpg";
import avatarVideo from "@/assets/Required_changes_Remove_the_na.mp4";

const LEFT = STACK.slice(0, 9);
const RIGHT = STACK.slice(9, 19);

function SkillRow({ item, side = "left" }) {
  const root = useRef(null);
  const pctRef = useRef(null);
  return (
    <div
      ref={root}
      data-skill
      data-side={side}
      data-level={item.level}
      className={`skill-row group relative flex items-center justify-between gap-3 border-b border-border/45 px-1 py-2.5 transition-colors duration-300 will-change-transform hover:border-accent/60 ${
        side === "left" ? "" : "flex-row-reverse"
      }`}
      data-cursor="link"
    >
      <div className={`flex items-center gap-2 ${side === "right" ? "flex-row-reverse text-right" : ""}`}>
        <span className="font-mono-alt text-[10px] uppercase tracking-[0.25em] text-accent/90">/</span>
        <span className="display text-[clamp(1.05rem,1.6vw,1.55rem)] uppercase leading-none tracking-tight text-foreground/92">
          {item.name}
        </span>
      </div>

      <div className={`flex items-center gap-2 ${side === "right" ? "flex-row-reverse" : ""}`}>
        <div className="relative h-1 w-24 overflow-hidden rounded-full bg-foreground/10 md:w-36">
          <div
            data-bar
            className="absolute inset-y-0 left-0 rounded-full bg-accent/90"
            style={{ width: `${item.level}%` }}
          />
          <div
            data-bar-glow
            className="pointer-events-none absolute inset-y-0 left-0 rounded-full opacity-0 blur-[6px] transition-opacity duration-300 group-hover:opacity-100"
            style={{ width: `${item.level}%`, background: "hsl(var(--accent) / 0.9)" }}
          />
        </div>
        <span ref={pctRef} data-pct className="font-mono-alt w-10 text-right text-[12px] uppercase tracking-[0.12em] text-foreground/80 tabular-nums">
          0%
        </span>
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-accent/80 via-accent/40 to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100"
        style={{ transformOrigin: side === "right" ? "100% 0" : "0 0" }}
      />
    </div>
  );
}

export function OrbitSkills() {
  const root = useRef(null);
  const videoEl = useRef(null);
  const avatarRing = useRef(null);
  const orbitA = useRef(null);
  const orbitB = useRef(null);

  useEffect(() => {
    registerGsap();
    const wrap = root.current;
    if (!wrap) return;

    const v = videoEl.current;
    if (v) {
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
      v.loop = true;
    }

    const t1 = gsap.to(avatarRing.current, { rotate: 360, duration: 40, ease: "none", repeat: -1 });
    const t2 = gsap.to(orbitA.current, { rotate: -360, duration: 70, ease: "none", repeat: -1 });
    const t3 = gsap.to(orbitB.current, { rotate: 360, duration: 110, ease: "none", repeat: -1 });

    const forcePlay = () => {
      if (!v) return;
      v.muted = true;
      if (v.paused) {
        const p = v.play();
        if (p && typeof p.catch === "function") {
          p.catch(() => {});
        }
      }
    };

    forcePlay();

    if (v) {
      v.addEventListener("canplay", forcePlay);
      v.addEventListener("loadeddata", forcePlay);
      v.addEventListener("playing", forcePlay);
    }

    const firstInteraction = () => {
      forcePlay();
    };
    window.addEventListener("pointerdown", firstInteraction, { passive: true });
    window.addEventListener("touchstart", firstInteraction, { passive: true });
    window.addEventListener("scroll", firstInteraction, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!v) return;
          if (e.intersectionRatio > 0.1) {
            forcePlay();
          } else {
            try {
              v.pause();
            } catch (_) {}
          }
        });
      },
      { threshold: [0, 0.1, 0.5, 1] }
    );
    io.observe(wrap);

    const rows = Array.from(wrap.querySelectorAll("[data-skill]"));
    const bars = Array.from(wrap.querySelectorAll("[data-bar]"));
    const pcts = Array.from(wrap.querySelectorAll("[data-pct]"));

    const resetRow = (el) => {
      gsap.set(el, { opacity: 0, yPercent: 55, clipPath: "inset(100% 0 0 0)" });
    };
    rows.forEach(resetRow);

    const revealSt = ScrollTrigger.create({
      trigger: wrap,
      start: "top 78%",
      once: true,
      onEnter: () => {
        rows.forEach((el) => {
          const side = el.getAttribute("data-side");
          gsap.to(el, {
            opacity: 1,
            yPercent: 0,
            clipPath: "inset(0% 0 0 0)",
            xPercent: 0,
            duration: 0.8,
            ease: "expo.out",
            delay: side === "left" ? 0.04 : 0.08,
            stagger: 0.055,
            overwrite: true,
          });
        });

        bars.forEach((bar, i) => {
          const w = bar.style.width;
          const target = parseFloat(w);
          const pctEl = pcts[i];
          gsap.fromTo(
            bar,
            { width: "0%" },
            {
              width: w,
              duration: 1.1,
              ease: "power3.out",
              delay: 0.35,
              stagger: 0.04,
              overwrite: true,
            }
          );
          if (pctEl) {
            const s = { v: 0 };
            gsap.to(s, {
              v: target,
              duration: 1.1,
              ease: "power3.out",
              delay: 0.35 + i * 0.04,
              overwrite: true,
              onUpdate: () => {
                pctEl.textContent = `${Math.round(s.v)}%`;
              },
            });
          }
        });
      },
    });

    rows.forEach((row) => {
      const hov = () => {
        gsap.to(row, { scale: 1.015, x: row.getAttribute("data-side") === "left" ? 4 : -4, duration: 0.28, ease: "elastic.out(1, 0.45)", overwrite: true });
        const bar = row.querySelector("[data-bar]");
        if (bar) gsap.to(bar, { width: "+=6", duration: 0.45, ease: "elastic.out(1, 0.42)", overwrite: true, yoyo: true, repeat: 1 });
      };
      const unhov = () => {
        gsap.to(row, { scale: 1, x: 0, duration: 0.35, ease: "expo.out", overwrite: true });
      };
      row.addEventListener("pointerenter", hov);
      row.addEventListener("pointerleave", unhov);
    });

    return () => {
      t1.kill();
      t2.kill();
      t3.kill();
      io.disconnect();
      revealSt.kill();
      if (v) {
        v.removeEventListener("canplay", forcePlay);
        v.removeEventListener("loadeddata", forcePlay);
        v.removeEventListener("playing", forcePlay);
      }
      window.removeEventListener("pointerdown", firstInteraction);
      window.removeEventListener("touchstart", firstInteraction);
      window.removeEventListener("scroll", firstInteraction);
      rows.forEach((r) => {
        const h = r._gsHov;
        const u = r._gsUn;
        if (h) r.removeEventListener("pointerenter", h);
        if (u) r.removeEventListener("pointerleave", u);
      });
    };
  }, []);

  return (
    <section
      ref={root}
      className="relative overflow-hidden border-y border-border py-14 md:py-20"
      data-cursor="link"
      data-orbit-section
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent" />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-12 md:px-10">
        {/* LEFT SKILLS */}
        <div className="relative flex flex-col justify-center md:pr-6" data-side="left">
          <div className="mb-4 flex items-center gap-2">
            <span className="font-mono-alt text-[10px] uppercase tracking-[0.35em] text-foreground/50">Stack 01</span>
            <span className="h-px flex-1 bg-foreground/10" />
          </div>
          {LEFT.map((item, i) => (
            <SkillRow key={`L-${item.name}-${i}`} item={item} side="left" />
          ))}
        </div>

        {/* CENTER — big video avatar */}
        <div className="relative flex h-[320px] w-full items-center justify-center self-center md:h-[420px] md:w-[320px]">
          <div ref={orbitB} className="pointer-events-none absolute h-[320px] w-[320px] md:h-[420px] md:w-[420px]">
            <svg viewBox="0 0 420 420" className="h-full w-full" fill="none">
              <circle cx="210" cy="210" r="202" stroke="hsl(var(--foreground) / 0.06)" strokeWidth="1" strokeDasharray="2 14" />
            </svg>
          </div>

          <div ref={orbitA} className="pointer-events-none absolute h-[270px] w-[270px] md:h-[360px] md:w-[360px]">
            <svg viewBox="0 0 400 400" className="h-full w-full" fill="none">
              <circle cx="200" cy="200" r="190" stroke="hsl(var(--accent) / 0.18)" strokeWidth="1" strokeDasharray="1 6" />
              <circle cx="200" cy="200" r="155" stroke="hsl(var(--foreground) / 0.08)" strokeWidth="1" strokeDasharray="3 14" />
            </svg>
          </div>

          <div ref={avatarRing} className="pointer-events-none absolute h-[240px] w-[240px] md:h-[300px] md:w-[300px]">
            <svg viewBox="0 0 300 300" className="h-full w-full" fill="none">
              <circle cx="150" cy="150" r="128" stroke="hsl(var(--accent) / 0.42)" strokeWidth="1" strokeDasharray="1 5" />
              <circle cx="150" cy="150" r="142" stroke="hsl(var(--foreground) / 0.09)" strokeWidth="1" strokeDasharray="2 10" />
            </svg>
          </div>

          <div className="relative z-20 flex h-[230px] w-[230px] items-center justify-center md:h-[280px] md:w-[280px]">
            <div
              className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-foreground/18"
              style={{
                background:
                  "radial-gradient(circle at 30% 25%, hsl(var(--accent) / 0.28), hsl(var(--foreground) / 0.04) 55%, transparent 72%)",
                boxShadow:
                  "0 0 90px -22px hsl(var(--accent) / 0.72), inset 0 0 55px hsl(var(--foreground) / 0.06)",
              }}
            >
              <img
                src={portrait}
                alt="Abhishek Tiwari — portrait fallback"
                className="pointer-events-none absolute h-[96%] w-[96%] rounded-full object-cover opacity-0"
                aria-hidden="true"
              />
              <video
                ref={(node) => {
                  videoEl.current = node;
                  if (node) {
                    node.muted = true;
                    node.defaultMuted = true;
                    node.playsInline = true;
                  }
                }}
                src={avatarVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                disablePictureInPicture
                controls={false}
                className="h-[96%] w-[96%] rounded-full object-cover"
                style={{
                  filter: "contrast(1.1) saturate(1.1) brightness(1.03) hue-rotate(-3deg)",
                  boxShadow: "inset 0 0 0 2px hsl(var(--background) / 0.45)",
                }}
              />

              <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-foreground/15">
                <div className="absolute -inset-6 rounded-full opacity-40 blur-xl" style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.35), transparent 62%)" }} />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SKILLS */}
        <div className="relative flex flex-col justify-center md:pl-6" data-side="right">
          <div className="mb-4 flex items-center gap-2 md:flex-row-reverse">
            <span className="font-mono-alt text-[10px] uppercase tracking-[0.35em] text-foreground/50">Stack 02</span>
            <span className="h-px flex-1 bg-foreground/10" />
          </div>
          {RIGHT.map((item, i) => (
            <SkillRow key={`R-${item.name}-${i}`} item={item} side="right" />
          ))}
        </div>
      </div>

      <style>{`
        [data-orbit-section] [data-skill] { clip-path: inset(100% 0 0 0); }
      `}</style>
    </section>
  );
}
