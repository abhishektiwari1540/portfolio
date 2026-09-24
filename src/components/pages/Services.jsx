import { useEffect, useRef, useState } from "react";
import { gsap, Flip, registerGsap } from "@/lib/gsap";
import { useSplitReveal } from "@/components/site/useSplitReveal";
import { Footer } from "@/components/site/Footer";

export const SERVICES = [
  {
    title: "Full Stack Web & Mobile Apps",
    track: "Build",
    body: "Custom React 19 & Inertia.js web applications backed by Laravel or Node.js microservices. Built with clean architecture, responsive UI/UX, and cloud deployment pipelines.",
    span: "md:col-span-7",
    tech: ["React 19", "Laravel", "Node.js", "Inertia.js", "MySQL"]
  },
  {
    title: "RESTful APIs & Microservices",
    track: "Architect",
    body: "Scalable API design with Eloquent ORM, JWT/Sanctum authentication, role-based access control (RBAC), input validation, and strict versioning.",
    span: "md:col-span-5",
    tech: ["Laravel", "Node.js", "JWT", "Sanctum", "REST APIs"]
  },
  {
    title: "Real-Time & WebSocket Engines",
    track: "Build",
    body: "Live WebSocket messaging, real-time match/court updates, presence indicators, background task queues, and instant notification pipelines.",
    span: "md:col-span-5",
    tech: ["WebSockets", "Queue Workers", "Node.js", "Cron Jobs"]
  },
  {
    title: "Payment Gateway Integrations",
    track: "Automate",
    body: "Seamless integration of Razorpay and Stripe payment flows, automated invoice generation, webhooks, multi-currency transactions, and security audits.",
    span: "md:col-span-7",
    tech: ["Razorpay", "Stripe", "Webhooks", "Security Auth"]
  },
  {
    title: "Admin Dashboards & CMS Panels",
    track: "Build",
    body: "High-performance administrative panels with complex data tables, bulk processing tools, role management, and real-time analytics reporting.",
    span: "md:col-span-6",
    tech: ["React", "MySQL", "Tailwind CSS", "Data Grids"]
  },
  {
    title: "Database Architecture & Query Surgery",
    track: "Architect",
    body: "Schema design, indexing strategies, query surgery, Redis caching, and database performance tuning for high-throughput MySQL applications.",
    span: "md:col-span-6",
    tech: ["MySQL", "Redis Caching", "Database Surgery", "Indexing"]
  },
  {
    title: "DevOps, SSH & Cloud Deployment",
    track: "Automate",
    body: "SSH server configuration, Hostinger VPS & shared hosting deployment, Cloudflare CDN integration, Git version control, and 24/7 uptime monitoring.",
    span: "md:col-span-12",
    tech: ["Hostinger VPS", "SSH", "Cloudflare CDN", "Git", "Uptime Monitoring"]
  }
];

export const WORK_EXPERIENCE = [
  {
    company: "GoScopify",
    location: "Murlipura Scheme, Jaipur",
    period: "May 2025 – Present",
    role: "Full Stack Developer",
    stack: "Laravel · React · Node.js · WebSockets",
    bullets: [
      "Developed file upload systems, media handling modules, and real-time notification features for a digital media platform.",
      "Built Node.js microservices for real-time features using WebSockets, background task queues, and API processing pipelines.",
      "Designed interactive, mobile-responsive UIs using React.js and Inertia.js with seamless Laravel backend integration.",
      "Implemented service–repository design patterns, robust validation, centralized error handling, and MVC best practices.",
      "Managed deployment on cloud hosting environments with SSH, environment configuration, and uptime monitoring."
    ]
  },
  {
    company: "Owebest Technology",
    location: "Malviya Nagar, Jaipur",
    period: "Apr 2024 – May 2025",
    role: "Backend Developer",
    stack: "Laravel · REST APIs · Razorpay/Stripe · Redis",
    bullets: [
      "Architected and built RESTful APIs, CRUD modules, and role-based authentication systems (RBAC) using Laravel, Eloquent ORM, and MySQL.",
      "Integrated payment gateways (Razorpay, Stripe) and multiple third-party APIs; implemented secure JWT/Sanctum authentication flows.",
      "Improved application performance via query optimization, caching strategies (Redis), queue workers, and scheduled cron jobs.",
      "Established robust exception handling, logging, and clean code practices; managed API versioning and staging/production deployments.",
      "Delivered admin dashboards and CMS-style panel functionality for client web platforms across multiple industries."
    ]
  },
  {
    company: "Web Genesis",
    location: "Vivek Vihar Mansarovar, Jaipur",
    period: "Mar 2023 – Apr 2024",
    role: "Junior Web Developer",
    stack: "PHP · Laravel · MySQL · Frontend UI",
    bullets: [
      "Built dynamic web modules using PHP, Laravel, and MySQL; integrated REST APIs for data exchange with external services.",
      "Developed responsive, mobile-friendly UIs with HTML5, CSS3, JavaScript (ES6+), and reusable component architecture.",
      "Implemented CRUD operations, form validations, basic authentication flows, and SEO-friendly page structures.",
      "Optimized database queries, improved page load speeds, and ensured smooth backend–frontend communication."
    ]
  }
];

export const TECHNICAL_SKILLS = [
  { category: "Frontend", items: ["React.js", "Inertia.js", "Next.js (basics)", "JavaScript (ES6+)", "HTML5 & CSS3", "Responsive UI/UX"] },
  { category: "Backend", items: ["Laravel (PHP)", "Node.js & Express", "REST API Development", "Eloquent ORM", "MVC Architecture"] },
  { category: "Database", items: ["MySQL", "Database Design", "Query Optimization", "Redis Caching"] },
  { category: "Mobile & Web", items: ["React Native (basics)", "PWA", "Mobile-responsive Web Apps"] },
  { category: "Auth & Security", items: ["JWT & Sanctum Auth", "Role-Based Access (RBAC)", "Input Validation", "Exception Handling"] },
  { category: "Payments & APIs", items: ["Razorpay Integration", "Stripe Integration", "Third-Party APIs", "API Versioning"] },
  { category: "Real-Time", items: ["WebSockets", "Queue Workers", "Scheduled Cron Jobs", "Background Processing"] },
  { category: "DevOps & Cloud", items: ["Cloudflare", "Hostinger VPS / Shared", "SSH Deployment", "Git Control"] }
];

const FILTERS = ["All", "Architect", "Build", "Automate"];

export function Services() {
  const title = useSplitReveal({ scroll: false, stagger: 0.03 });
  const [filter, setFilter] = useState("All");
  const grid = useRef(null);
  const counter = useRef(null);
  const state = useRef(null);

  useEffect(() => {
    registerGsap();
    const ctx = gsap.context(() => {
      const n = { v: 0 };
      gsap.to(n, {
        v: SERVICES.length,
        duration: 1.6,
        ease: "expo.out",
        onUpdate: () => {
          if (counter.current) counter.current.textContent = `[${Math.round(n.v)}]`;
        },
      });

      gsap.from("[data-service]", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.08,
      });
    }, grid);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!state.current || !grid.current) return;
    Flip.from(state.current, {
      duration: 0.7,
      ease: "expo.inOut",
      scale: true,
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.5 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.35 }),
    });
  }, [filter]);

  const pick = (f) => {
    if (!grid.current) return;
    state.current = Flip.getState(grid.current.querySelectorAll("[data-service]"));
    setFilter(f);
  };

  const visible = SERVICES.filter((s) => filter === "All" || s.track === filter);

  return (
    <main className="bg-background text-foreground">
      {/* Header Section */}
      <section className="flex flex-col justify-end gap-8 px-6 pb-12 pt-36 md:px-10">
        <div className="flex items-start gap-6">
          <h1 ref={title} className="display text-[clamp(3rem,10vw,10rem)] leading-[0.9]">
            Services
          </h1>
          <span ref={counter} className="font-mono-alt mt-4 text-sm tracking-[0.2em] text-accent font-bold">
            [0]
          </span>
        </div>

        <p className="max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
          Full stack web &amp; mobile app development services, RESTful API architecture, real-time WebSocket systems, and payment integrations built for scalability.
        </p>

        <div className="flex flex-wrap gap-3">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => pick(f)}
              data-cursor="link"
              className={`font-mono-alt rounded-full border px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] transition-colors cursor-pointer ${
                filter === f
                  ? "border-foreground bg-foreground text-background font-bold shadow-lg"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Services Grid (Clean, Fully Visible Body Text, Zero Blank Gap) */}
      <section ref={grid} className="grid gap-4 px-6 pb-24 md:grid-cols-12 md:px-10">
        {visible.map((s) => (
          <article
            key={s.title}
            data-service
            data-cursor="link"
            className={`group relative flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-6 md:p-8 transition-all duration-300 hover:border-accent hover:bg-card/90 hover:shadow-[0_15px_40px_-10px_rgba(0,220,255,0.25)] ${s.span}`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono-alt text-[10px] font-bold uppercase tracking-[0.25em] text-accent">
                  {s.track}
                </span>
                <span className="h-2 w-2 rounded-full bg-accent/60 group-hover:bg-accent transition-colors" />
              </div>

              <h2 className="display text-xl md:text-3xl text-foreground group-hover:text-accent transition-colors">
                {s.title}
              </h2>

              <p className="text-sm md:text-base leading-relaxed text-muted-foreground pt-1">
                {s.body}
              </p>
            </div>

            {/* Tech Tags */}
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

      {/* Dynamic Resume & Work Experience Section */}
      <section className="px-6 py-20 md:px-10 border-t border-border/40 bg-card/30">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="font-mono-alt text-xs uppercase tracking-widest text-accent font-bold">
                // PROFESSIONAL RESUME &amp; TRACK RECORD
              </span>
              <h2 className="display text-3xl md:text-5xl mt-2 text-foreground">
                Work Experience
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="mailto:abhishektiwari1540@gmail.com"
                data-cursor="link"
                className="font-mono-alt text-xs uppercase tracking-wider px-5 py-2.5 rounded-full bg-accent text-black font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,220,255,0.4)]"
              >
                Hire / Contact Me →
              </a>
            </div>
          </div>

          {/* Timeline Cards */}
          <div className="space-y-6">
            {WORK_EXPERIENCE.map((exp, idx) => (
              <div
                key={exp.company}
                className="p-6 md:p-8 rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md space-y-4 hover:border-accent/50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="display text-xl md:text-2xl text-foreground">
                      {exp.role} <span className="text-accent">@ {exp.company}</span>
                    </h3>
                    <p className="font-mono-alt text-xs text-muted-foreground mt-1">
                      📍 {exp.location}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="font-mono-alt text-xs font-bold px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent">
                      {exp.period}
                    </span>
                    <p className="font-mono-alt text-[11px] text-muted-foreground mt-2">
                      {exp.stack}
                    </p>
                  </div>
                </div>

                <ul className="space-y-2 pt-2">
                  {exp.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="text-sm leading-relaxed text-muted-foreground flex items-start gap-2.5">
                      <span className="text-accent font-bold mt-0.5">▸</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Technical Skills Matrix */}
          <div className="space-y-6 pt-8 border-t border-border/40">
            <h3 className="font-mono-alt text-xs uppercase tracking-widest text-accent font-bold">
              // TECHNICAL SKILLS MATRIX
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {TECHNICAL_SKILLS.map((sk) => (
                <div
                  key={sk.category}
                  className="p-5 rounded-xl border border-white/10 bg-white/[0.03] space-y-3 hover:border-accent/40 transition-colors"
                >
                  <h4 className="font-mono-alt text-xs font-bold uppercase tracking-wider text-accent">
                    {sk.category}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {sk.items.map((it) => (
                      <span
                        key={it}
                        className="font-mono-alt text-[11px] px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-foreground/90"
                      >
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
