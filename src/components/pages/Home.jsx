import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { gsap, Flip, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { useSplitReveal } from "@/components/site/useSplitReveal";
import { OrbitSkills } from "@/components/site/OrbitSkills";
import { SlotNumber } from "@/components/site/SlotNumber";
import { Footer } from "@/components/site/Footer";
import { useRouteHover } from "@/components/site/RouteHoverTransition";
import { useMagnetic } from "@/components/site/useMagnetic";
import { getLenis } from "@/components/site/SmoothScroll";
import { MOTION, okDecorative } from "@/components/site/motion";
import { PROJECTS } from "@/components/site/data";
import { useProjectModal } from "@/components/site/ProjectModalContext";
import { ChampionBlogSection } from "@/components/site/ChampionBlogSection";

const FACTS = [
  { value: "3+", label: "Years shipping production code" },
  { value: "5", label: "Platforms designed and built" },
  { value: "4", label: "Companies, agency and in-house" },
  { value: "2", label: "Countries served" },
];

const SERVICES = [
  {
    title: "Full Stack Web & Mobile Apps",
    track: "Build",
    body: "Custom React 19 & Inertia.js web applications backed by Laravel or Node.js microservices. Built with clean architecture, responsive UI/UX, and cloud deployment pipelines.",
    span: "md:col-span-7",
    tech: ["React 19", "Laravel", "Node.js", "Inertia.js"]
  },
  {
    title: "RESTful APIs & Microservices",
    track: "Architect",
    body: "Scalable API design with Eloquent ORM, JWT/Sanctum authentication, role-based access control (RBAC), input validation, and strict versioning.",
    span: "md:col-span-5",
    tech: ["Laravel", "Node.js", "JWT", "Sanctum"]
  },
  {
    title: "Real-Time & WebSocket Engines",
    track: "Build",
    body: "Live WebSocket messaging, real-time match/court updates, presence indicators, background task queues, and instant notification pipelines.",
    span: "md:col-span-5",
    tech: ["WebSockets", "Queue Workers", "Node.js"]
  },
  {
    title: "Payment Gateway Integrations",
    track: "Automate",
    body: "Seamless integration of Razorpay and Stripe payment flows, automated invoice generation, webhooks, multi-currency transactions, and security audits.",
    span: "md:col-span-7",
    tech: ["Razorpay", "Stripe", "Webhooks"]
  },
  {
    title: "Admin Dashboards & CMS Panels",
    track: "Build",
    body: "High-performance administrative panels with complex data tables, bulk processing tools, role management, and real-time analytics reporting.",
    span: "md:col-span-6",
    tech: ["React", "MySQL", "Tailwind CSS"]
  },
  {
    title: "Database Architecture & Query Surgery",
    track: "Architect",
    body: "Schema design, indexing strategies, query surgery, Redis caching, and database performance tuning for high-throughput MySQL applications.",
    span: "md:col-span-6",
    tech: ["MySQL", "Redis", "Indexing"]
  },
  {
    title: "DevOps, SSH & Cloud Deployment",
    track: "Automate",
    body: "SSH server configuration, Hostinger VPS & shared hosting deployment, Cloudflare CDN integration, Git version control, and 24/7 uptime monitoring.",
    span: "md:col-span-12",
    tech: ["Hostinger VPS", "SSH", "Cloudflare", "Git"]
  }
];

const FILTERS = ["All", "Architect", "Build", "Automate"];
const CONTACT_HEADLINE = "Let's build something.";
const CONTACT_EMAIL = "abhishektiwari1540@gmail.com";

export function smoothScrollToHash(hash) {
  if (!hash) {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0, behavior: "auto" });
    return;
  }
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  const node = document.getElementById(id);
  if (!node) return;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(node, { offset: -96, duration: 1.1, immediate: false });
  } else {
    const y = node.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
  try {
    node.setAttribute("tabindex", "-1");
    node.focus({ preventScroll: true });
  } catch {
    /* noop */
  }
}

function Hero() {
  const section = useRef(null);
  const lockup = useRef(null);
  const l1 = useSplitReveal({ scroll: false, delay: 0.15, stagger: 0.03 });
  const l2 = useSplitReveal({ scroll: false, delay: 0.28, stagger: 0.03 });

  useEffect(() => {
    registerGsap();
    const ctx = gsap.context(() => {
      if (!okDecorative()) {
        gsap.set(lockup.current, { scale: 1, yPercent: 0, opacity: 1 });
        return;
      }
      gsap.to(lockup.current, {
        scale: 9,
        yPercent: 6,
        opacity: 0,
        ease: "power2.in",
        transformOrigin: "42% 62%",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "+=140%",
          pin: true,
          scrub: 1,
        },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={section}
      id="top"
      className="relative flex h-screen items-center overflow-hidden px-6 md:px-10"
    >
      <div ref={lockup} className="w-full will-change-transform grid grid-cols-1 md:grid-cols-12 items-center gap-8">
        <h1 className="md:col-span-8">
          <span className="mask-line">
            <span ref={l1} className="display block whitespace-nowrap text-[clamp(2.6rem,8.5vw,11rem)]">
              Full Stack
            </span>
          </span>
          <span className="mask-line">
            <span ref={l2} className="display block whitespace-nowrap text-[clamp(2.6rem,8.5vw,11rem)]">
              Developer
            </span>
          </span>
        </h1>

        <div className="md:col-span-4 flex flex-col items-start gap-4 border-l border-border/40 pl-6 md:pl-10">
          <div className="flex items-center gap-2.5 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono-alt text-[10px] uppercase tracking-[0.2em] text-foreground/80">Available for projects</span>
          </div>
          <p className="font-mono-alt text-xs leading-relaxed text-muted-foreground max-w-[32ch]">
            Architecting & building high-scale web platforms, responsive interfaces, real-time engines & automated pipelines.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="font-mono-alt text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-foreground/5 border border-border/40 text-foreground/75">React 19</span>
            <span className="font-mono-alt text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-foreground/5 border border-border/40 text-foreground/75">Laravel</span>
            <span className="font-mono-alt text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-foreground/5 border border-border/40 text-foreground/75">Node.js</span>
            <span className="font-mono-alt text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-foreground/5 border border-border/40 text-foreground/75">GSAP</span>
          </div>
        </div>
      </div>

      <div className="font-mono-alt pointer-events-none absolute bottom-8 left-6 right-6 flex justify-between text-[11px] uppercase tracking-[0.22em] text-muted-foreground md:left-10 md:right-10">
        <span>Jaipur, India — remote worldwide</span>
        <span className="hidden md:block">Scroll to explore</span>
      </div>
    </section>
  );
}

function Facts() {
  const wrap = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray("[data-fact]", wrap.current);
      if (!cards.length || !okDecorative()) return;
      gsap.from(cards, {
        opacity: 0,
        y: 24,
        duration: 0.9,
        stagger: 0.07,
        ease: "expo.out",
        scrollTrigger: {
          trigger: wrap.current,
          start: "top 90%",
          once: true,
        },
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrap} className="grid grid-cols-2 border-b border-border md:grid-cols-4">
      {FACTS.map((f, i) => (
        <div
          key={f.label}
          data-fact
          className="border-b border-r border-border p-6 last:border-r-0 md:border-b-0 md:p-10"
        >
          <div className="display text-[clamp(3rem,7vw,6rem)]">
            <SlotNumber value={f.value} index={i} />
          </div>
          <p className="font-mono-alt mt-4 max-w-[16ch] text-[11px] uppercase leading-relaxed tracking-[0.18em] text-muted-foreground">
            {f.label}
          </p>
        </div>
      ))}
    </section>
  );
}

function FeaturedWork() {
  const wrap = useRef(null);
  const headerRef = useRef(null);
  const rowsRef = useRef([]);
  const previewRef = useRef(null);
  const previewImgRef = useRef(null);
  const previewTitleRef = useRef(null);
  const previewRoleRef = useRef(null);
  const previewYearRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const featured = PROJECTS;
  const { openProjectModal } = useProjectModal();

  const handleRowClick = (e, p) => {
    const modifier = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
    if (modifier || e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    if (previewRef.current) {
      gsap.to(previewRef.current, { opacity: 0, scale: 0.8, duration: 0.2, overwrite: "auto" });
    }
    openProjectModal(p);
  };

  useEffect(() => {
    registerGsap();
    const container = wrap.current;
    if (!container) return;

    const preview = previewRef.current;
    let xTo = null;
    let yTo = null;
    let rotTo = null;

    if (preview) {
      gsap.set(preview, { opacity: 0, scale: 0.82 });
      xTo = gsap.quickTo(preview, "x", { duration: 0.35, ease: "power3.out" });
      yTo = gsap.quickTo(preview, "y", { duration: 0.35, ease: "power3.out" });
      rotTo = gsap.quickTo(preview, "rotation", { duration: 0.45, ease: "power2.out" });
    }

    let lastX = 0;
    const onPointerMove = (e) => {
      if (!xTo || !yTo) return;
      const deltaX = e.clientX - lastX;
      lastX = e.clientX;

      const previewW = 380;
      const previewH = 240;
      let targetX = e.clientX + 35;
      if (targetX + previewW > window.innerWidth - 20) {
        targetX = e.clientX - previewW - 35;
      }
      let targetY = e.clientY - previewH / 2;
      targetY = gsap.utils.clamp(20, window.innerHeight - previewH - 20, targetY);

      xTo(targetX);
      yTo(targetY);
      if (rotTo) rotTo(gsap.utils.clamp(-6, 6, deltaX * 0.3));
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const cleanups = [
      () => window.removeEventListener("pointermove", onPointerMove),
    ];

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray("[data-row]", container);

      rows.forEach((row, i) => {
        const meta = row.querySelector("[data-row-meta]");

        const enter = (e) => {
          setHoveredIndex(i);
          const p = featured[i];

          // Instantaneous Image & Info Update
          if (previewImgRef.current && p.image) {
            previewImgRef.current.src = p.image;
            gsap.fromTo(
              previewImgRef.current,
              { scale: 1.08, opacity: 0.85 },
              { scale: 1, opacity: 1, duration: 0.35, ease: "power2.out" }
            );
          }
          if (previewTitleRef.current) previewTitleRef.current.textContent = p.name;
          if (previewRoleRef.current) previewRoleRef.current.textContent = p.role;
          if (previewYearRef.current) previewYearRef.current.textContent = p.year;

          // Reveal Floating Image Card at exact pointer coordinates
          if (previewRef.current && e) {
            const previewW = 380;
            const previewH = 240;
            let targetX = e.clientX + 35;
            if (targetX + previewW > window.innerWidth - 20) {
              targetX = e.clientX - previewW - 35;
            }
            let targetY = e.clientY - previewH / 2;
            targetY = gsap.utils.clamp(20, window.innerHeight - previewH - 20, targetY);

            gsap.killTweensOf(previewRef.current);
            gsap.set(previewRef.current, { x: targetX, y: targetY });
            gsap.to(previewRef.current, {
              opacity: 1,
              scale: 1,
              duration: 0.35,
              ease: "power3.out",
            });
          }

          // Scramble Text on Meta Label
          if (meta && meta.dataset.scrambleReady && okDecorative()) {
            const originalText = meta.textContent || "";
            meta.dataset.original = originalText;
            gsap.killTweensOf(meta, { text: true });
            gsap.to(meta, {
              duration: 0.65,
              text: {
                value: originalText,
                delimiter: "",
                padSpace: true,
                newClass: "",
                scrambleClass: "",
                chars: "abcdefghijklmnopqrstuvwxyz0123456789",
              },
              ease: "none",
              overwrite: "auto",
            });
          }
        };

        const leave = () => {
          setHoveredIndex(null);
          if (previewRef.current) {
            gsap.to(previewRef.current, {
              opacity: 0,
              scale: 0.82,
              duration: 0.25,
              ease: "power2.inOut",
              overwrite: "auto",
            });
          }
        };

        row.addEventListener("pointerenter", enter);
        row.addEventListener("pointerleave", leave);
        row.addEventListener("focusin", enter);
        row.addEventListener("focusout", leave);

        cleanups.push(() => {
          row.removeEventListener("pointerenter", enter);
          row.removeEventListener("pointerleave", leave);
          row.removeEventListener("focusin", enter);
          row.removeEventListener("focusout", leave);
        });
      });

      if (okDecorative()) {
        const headerLeft = headerRef.current?.querySelector("[data-h-left]") || null;
        if (headerLeft) {
          gsap.from(headerLeft, {
            x: -18,
            opacity: 0,
            duration: MOTION.duration.medium,
            scrollTrigger: {
              trigger: container,
              start: "top 92%",
              once: true,
            },
          });
        }

        rows.forEach((row, i) => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: row,
                start: "top 93%",
                once: true,
                toggleActions: "play none none reverse",
              },
            })
            .fromTo(
              row,
              { clipPath: "inset(0% 100% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 0.85, ease: MOTION.ease.inOut },
              0,
            )
            .fromTo(
              row.querySelector("[data-row-inner]"),
              { x: -40, opacity: 0.4 },
              { x: 0, opacity: 1, duration: 0.9, ease: MOTION.ease.standard },
              0.08 + i * 0.12,
            );
        });

        gsap.to(rows.map((r) => r.querySelector("[data-row-meta]")).filter(Boolean), {
          x: 0,
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
            end: "bottom 25%",
            scrub: 1.4,
          },
          xPercent: -8,
          duration: 1,
        });
      }
    }, container);

    cleanups.forEach((fn) => ctx.add(fn));

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="work" ref={wrap} className="scroll-mt-24 px-6 py-28 md:px-10">
      <div
        ref={headerRef}
        className="font-mono-alt mb-10 flex items-baseline justify-between text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
      >
        <span data-h-left>Selected work</span>
        <span className="font-mono-alt text-muted-foreground">{PROJECTS.length} projects</span>
      </div>

      <div className="relative">
        {featured.map((p, idx) => {
          const isHovered = hoveredIndex === idx;
          const isSibling = hoveredIndex !== null && !isHovered;
          return (
            <Link
              key={p.name}
              ref={(node) => (rowsRef.current[idx] = node)}
              data-row
              data-cursor="view"
              to="/"
              hash="work"
              aria-label={`${p.name} — view project · ${p.role}, ${p.year}`}
              onClick={(e) => handleRowClick(e, p)}
              className={`group relative flex items-baseline justify-between border-t py-6 last:border-b focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground/70 transition-all duration-400 ease-out ${
                isHovered
                  ? "border-accent z-10"
                  : isSibling
                    ? "border-border/30 opacity-25 scale-[0.995]"
                    : "border-border opacity-100"
              }`}
            >
              <span
                data-row-inner
                className={`display will-change-transform text-[clamp(2.2rem,8vw,7rem)] transition-all duration-400 ease-out ${
                  isHovered
                    ? "text-accent translate-x-7 drop-shadow-[0_0_25px_rgba(255,115,68,0.35)]"
                    : "text-foreground translate-x-0"
                }`}
              >
                {p.name}
              </span>
              <span
                data-row-meta
                data-scramble-ready
                className={`font-mono-alt hidden text-[11px] uppercase tracking-[0.2em] md:block will-change-transform transition-all duration-400 ease-out ${
                  isHovered ? "text-accent -translate-x-3 font-bold" : "text-muted-foreground translate-x-0"
                }`}
              >
                {p.role} — {p.year}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Floating Project Image Preview on Hover */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9990] hidden md:block will-change-transform"
      >
        <div className="relative w-[340px] h-[215px] lg:w-[410px] lg:h-[255px] overflow-hidden rounded-2xl border border-white/25 dark:border-white/15 bg-card shadow-[0_30px_70px_rgba(0,0,0,0.75)] backdrop-blur-md">
          <img
            ref={previewImgRef}
            src={featured[0]?.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-white font-mono-alt text-[11px] uppercase tracking-[0.16em]">
            <div className="flex flex-col truncate max-w-[270px]">
              <span ref={previewTitleRef} className="font-semibold text-white/95 drop-shadow-md text-[13px] tracking-wider">
                {featured[0]?.name}
              </span>
              <span ref={previewRoleRef} className="text-[10px] text-white/70 truncate">
                {featured[0]?.role}
              </span>
            </div>
            <span ref={previewYearRef} className="text-accent font-bold drop-shadow-md text-[12px]">
              {featured[0]?.year}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Intro() {
  const ref = useSplitReveal({ by: "words", stagger: 0.02 });
  const wrap = useRef(null);
  useEffect(() => {
    if (!okDecorative()) return;
    const ctx = gsap.context(() => {
      gsap.from(wrap.current, {
        opacity: 0,
        y: 20,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: wrap.current, start: "top 90%", once: true },
      });
    }, wrap);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={wrap} className="px-6 py-28 md:px-10">
      <p
        ref={ref}
        data-skew
        className="max-w-4xl text-[clamp(1.4rem,3.2vw,2.6rem)] leading-[1.2] tracking-tight"
      >
        I build the whole thing — schema, API, interface — and I keep it fast once real users
        arrive. Three years across booking platforms, fintech dashboards and identity systems.
      </p>
    </section>
  );
}

function ServicesSection() {
  const title = useSplitReveal({ scroll: false, stagger: 0.03 });
  const [filter, setFilter] = useState("All");
  const grid = useRef(null);
  const counter = useRef(null);
  const state = useRef(null);
  const section = useRef(null);
  const pillAll = useMagnetic(0.22);
  const pillArchitect = useMagnetic(0.22);
  const pillBuild = useMagnetic(0.22);
  const pillAutomate = useMagnetic(0.22);
  const pillRefs = useMemo(
    () => [pillAll, pillArchitect, pillBuild, pillAutomate],
    [pillAll, pillArchitect, pillBuild, pillAutomate],
  );

  const visible = useMemo(
    () => SERVICES.filter((s) => filter === "All" || s.track === filter),
    [filter],
  );

  useEffect(() => {
    registerGsap();
    const ctx = gsap.context(() => {
      const n = { v: 0 };
      gsap.to(n, {
        v: SERVICES.length,
        duration: okDecorative() ? 1.2 : 0.2,
        ease: okDecorative() ? "expo.out" : "none",
        onUpdate: () => {
          if (counter.current) counter.current.textContent = `[${Math.round(n.v)}]`;
        },
      });
      gsap.fromTo(
        "[data-service]",
        { opacity: 0.4, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.05,
          scrollTrigger: { trigger: section.current, start: "top 92%", once: true },
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!state.current || !grid.current) return;
    Flip.from(state.current, {
      duration: okDecorative() ? 0.5 : 0.2,
      ease: okDecorative() ? "expo.inOut" : "none",
      scale: false,
      absolute: false,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.4 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.3 }),
    });
  }, [filter]);

  const pick = (f) => {
    if (!grid.current) return;
    state.current = Flip.getState(grid.current.querySelectorAll("[data-service]"));
    setFilter(f);
  };

  return (
    <section ref={section} id="services" className="scroll-mt-24 px-6 py-28 md:px-10">
      <div className="flex flex-col justify-end gap-8 pb-14 md:flex-row md:items-end md:justify-between">
        <div className="flex items-start gap-6">
          <h2 ref={title} className="display text-[clamp(2.4rem,10vw,11rem)] leading-[0.9]">
            Services
          </h2>
          <span ref={counter} className="font-mono-alt mt-3 text-sm tracking-[0.2em] text-accent font-bold">
            [{SERVICES.length}]
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {FILTERS.map((f, i) => {
            const pill = pillRefs[i];
            const active = filter === f;
            return (
              <button
                ref={pill.ref}
                key={f}
                onClick={() => pick(f)}
                data-cursor="link"
                aria-pressed={active}
                className={`font-mono-alt relative rounded-full border px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="inline-block will-change-transform">{f}</span>
              </button>
            );
          })}
        </div>
      </div>

      <section
        ref={grid}
        className="grid gap-4 md:grid-cols-12"
      >
        {visible.map((s) => (
          <article
            key={s.title}
            data-service
            data-cursor="link"
            className={`group relative flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-6 transition-all duration-300 hover:border-accent hover:bg-card/90 hover:shadow-[0_15px_40px_-10px_rgba(0,220,255,0.25)] md:p-8 ${s.span}`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono-alt text-[10px] font-bold uppercase tracking-[0.25em] text-accent">
                  {s.track}
                </span>
                <span className="h-2 w-2 rounded-full bg-accent/60 group-hover:bg-accent transition-colors" />
              </div>

              <h2 className="display text-xl md:text-3xl text-foreground group-hover:text-accent transition-colors">{s.title}</h2>
              <p className="text-sm md:text-base leading-relaxed text-muted-foreground pt-1">
                {s.body}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-6">
              {s.tech?.map((t) => (
                <span
                  key={t}
                  className="font-mono-alt text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md border border-white/10 bg-white/5 text-foreground/80"
                >
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </section>
  );
}

function ContactSocial({ label, href }) {
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
      className="flex h-28 w-28 md:h-56 md:w-56 items-center justify-center rounded-full border border-border will-change-transform transition-colors hover:border-accent hover:text-accent"
    >
      <span ref={icon} className="font-mono-alt text-xs md:text-sm uppercase tracking-[0.25em]">
        {label}
      </span>
    </a>
  );
}

function ContactSection() {
  const hero = useRef(null);
  const mail = useRef(null);
  const copyBtn = useMagnetic(0.35);
  const section = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    registerGsap();
    const el = hero.current;
    if (!el) return;
    const cleanups = [];
    const ctx = gsap.context(() => {
      const chars = gsap.utils.toArray("[data-hchar]", el);
      if (okDecorative()) {
        gsap.from(chars, {
          yPercent: 120,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.025,
          scrollTrigger: { trigger: section.current, start: "top 88%", once: true },
        });

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
        cleanups.push(() => window.removeEventListener("pointermove", move));
      } else {
        gsap.set(chars, { yPercent: 0 });
      }
    }, section);
    cleanups.forEach((fn) => ctx.add(fn));
    return () => ctx.revert();
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
      navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section ref={section} id="contact" className="scroll-mt-24 overflow-hidden px-6 py-28 md:px-10">
      <section ref={hero} className="flex min-h-[70vh] flex-col justify-center gap-16 pt-10">
        <h2 className="display flex flex-wrap text-[clamp(2.6rem,11.5vw,12rem)] leading-[0.9]">
          {CONTACT_HEADLINE.split("").map((ch, i) => (
            <span key={i} className="mask-line">
              <span data-hchar className="inline-block will-change-transform">
                {ch === " " ? "\u00A0" : ch}
              </span>
            </span>
          ))}
        </h2>

        <div className="flex flex-col items-center gap-6 py-10">
          <p className="font-mono-alt text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Reply within a day, usually sooner
          </p>
          <a
            ref={mail}
            href={`mailto:${CONTACT_EMAIL}`}
            onPointerEnter={wave}
            data-cursor="link"
            className="flex flex-wrap justify-center text-[clamp(1.1rem,4.4vw,3.4rem)] font-medium tracking-tight will-change-transform transition-colors hover:text-accent"
          >
            {CONTACT_EMAIL.split("").map((ch, i) => (
              <span key={i} data-echar className="inline-block">
                {ch}
              </span>
            ))}
          </a>
          <button
            ref={copyBtn.ref}
            data-cursor="link"
            onClick={handleCopy}
            className={`font-mono-alt rounded-full border px-6 py-3 text-[10px] uppercase tracking-[0.25em] will-change-transform transition-all duration-300 ${
              copied
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-foreground hover:border-accent"
            }`}
          >
            {copied ? "Copied to clipboard!" : "Copy address"}
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 pb-8">
          <ContactSocial label="LinkedIn" href="https://www.linkedin.com/in/abhishektiwarii-dev/" />
          <ContactSocial label="GitHub" href="https://github.com/abhishektiwari1540" />
        </div>
      </section>
    </section>
  );
}

export function Home() {
  return (
    <main>
      <Hero />
      <OrbitSkills />
      <Intro />
      <Facts />
      <FeaturedWork />
      <ChampionBlogSection />
      <ServicesSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
