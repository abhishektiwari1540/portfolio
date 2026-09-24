import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useSplitReveal } from "@/components/site/useSplitReveal";
import { Footer } from "@/components/site/Footer";
import { PROJECTS } from "@/components/site/data";
import { useProjectModal } from "@/components/site/ProjectModalContext";

function Tag({ label }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "elastic.out(1, 0.5)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "elastic.out(1, 0.5)" });
    const move = (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.6);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.6);
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
    <span
      ref={ref}
      data-cursor="link"
      className="font-mono-alt inline-block rounded-full border border-border px-4 py-2 text-[10px] uppercase tracking-[0.2em]"
    >
      {label}
    </span>
  );
}

export function Work() {
  const header = useSplitReveal({ by: "words", scroll: false, stagger: 0.06 });
  const section = useRef(null);
  const track = useRef(null);
  const { openProjectModal } = useProjectModal();

  useEffect(() => {
    registerGsap();
    const ctx = gsap.context(() => {
      const el = track.current;

      const horizontal = gsap.to(el, {
        x: () => -(el.scrollWidth - window.innerWidth + 48),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${el.scrollWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.utils.toArray("[data-card] [data-reveal]").forEach((img) => {
        gsap.fromTo(
          img,
          { clipPath: "inset(0% 46% 0% 46%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "power2.out",
            scrollTrigger: {
              trigger: img,
              containerAnimation: horizontal,
              start: "left 82%",
              end: "center 55%",
              scrub: true,
            },
          },
        );
      });

      gsap.utils.toArray("[data-card]").forEach((card) => {
        const inner = card.querySelector("[data-parallax]");
        if (!inner) return;
        const xTo = gsap.quickTo(inner, "xPercent", { duration: 0.8, ease: "power3.out" });
        const yTo = gsap.quickTo(inner, "yPercent", { duration: 0.8, ease: "power3.out" });
        const rot = gsap.quickTo(inner, "rotate", { duration: 0.8, ease: "power3.out" });
        card.addEventListener("pointermove", (e) => {
          const r = card.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
          const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
          xTo(dx * -6);
          yTo(dy * -6);
          rot(dx * 1.5);
        });
        card.addEventListener("pointerleave", () => {
          xTo(0);
          yTo(0);
          rot(0);
        });
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <main className="grain">
      <section className="flex min-h-[70vh] items-end px-6 pb-16 pt-40 md:px-10">
        <div>
          <p className="font-mono-alt mb-6 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            [{PROJECTS.length}] projects — 2022 to now
          </p>
          <h1 ref={header} className="display text-[clamp(3rem,12vw,13rem)]">
            Selected work
          </h1>
        </div>
      </section>

      <section ref={section} className="relative h-screen overflow-hidden">
        <div ref={track} className="flex h-full w-max items-center gap-8 px-6 md:px-10">
          {PROJECTS.map((p, i) => (
            <article
              key={p.name}
              data-card
              onClick={() => openProjectModal(p)}
              className="w-[86vw] shrink-0 md:w-[62vw] group cursor-pointer"
            >
              <div
                data-cursor="view"
                className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-500 group-hover:border-accent/60 group-hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)]"
              >
                <div data-reveal className="absolute inset-0">
                  <img
                    data-parallax
                    src={p.image}
                    alt={`${p.name} — ${p.role}`}
                    loading="lazy"
                    width={1400}
                    height={1000}
                    className="h-full w-full scale-[1.18] object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.08]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/75 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-30" />
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
                <div>
                  <h2 className="display text-[clamp(1.8rem,4.4vw,3.4rem)] flex items-baseline">
                    <span className="font-mono-alt mr-4 text-[0.8rem] tracking-widest text-accent">
                      0{i + 1}
                    </span>
                    <span className="transition-colors duration-300 group-hover:text-accent">
                      {p.name}
                    </span>
                  </h2>
                  <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-muted-foreground">
                    {p.blurb}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <Tag key={t} label={t} />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
