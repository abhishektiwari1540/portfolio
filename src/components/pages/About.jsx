import { useEffect, useMemo, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useSplitReveal } from "@/components/site/useSplitReveal";
import { Footer } from "@/components/site/Footer";
import aboutPortraitSrc from "@/assets/about-portrait.jpg";
import fallbackPortraitSrc from "@/assets/portrait.jpg";
import cinematicVideoSrc from "@/assets/Cinematic_Portrait_Video_Generation.mp4";
import fallbackVideoSrc from "@/assets/Required_changes_Remove_the_na.mp4";
import approachArchitectSrc from "@/assets/approach_architect.png";
import approachBuildSrc from "@/assets/approach_build.png";
import approachAutomateSrc from "@/assets/approach_automate.png";

const APPROACH = [
  {
    no: "01",
    title: "Architect",
    body: "Model the data first. Tables, boundaries and failure states get decided before a single screen exists, so the product can grow without a rewrite.",
    image: approachArchitectSrc,
  },
  {
    no: "02",
    title: "Build",
    body: "React and Laravel/Node, typed end to end. Interfaces that stay responsive under real load, not just on a seeded demo database.",
    image: approachBuildSrc,
  },
  {
    no: "03",
    title: "Automate",
    body: "Queues, cron, LLM pipelines and deploy scripts. If a human repeats it twice a week, it becomes a job that runs at 3am instead.",
    image: approachAutomateSrc,
  },
];

const WORK_EXPERIENCE = [
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
      "Managed deployment on cloud hosting environments with SSH, environment configuration, and uptime monitoring.",
    ],
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
      "Delivered admin dashboards and CMS-style panel functionality for client web platforms across multiple industries.",
    ],
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
      "Optimized database queries, improved page load speeds, and ensured smooth backend–frontend communication.",
    ],
  },
];

const TECH_CATEGORIES = [
  {
    title: "Frontend Development",
    skills: ["React.js", "Inertia.js", "Next.js (basics)", "JavaScript (ES6+)", "HTML5 & CSS3", "Tailwind CSS", "Responsive UI/UX"],
  },
  {
    title: "Backend & Microservices",
    skills: ["Laravel (PHP)", "Node.js & Express", "REST API Design", "Eloquent ORM", "MVC Architecture", "Service-Repository Pattern"],
  },
  {
    title: "Database & Performance",
    skills: ["MySQL", "Database Design", "Query Optimization", "Redis Caching", "Schema Indexing"],
  },
  {
    title: "Auth, Security & Payments",
    skills: ["JWT & Sanctum Auth", "Role-Based Access (RBAC)", "Razorpay Integration", "Stripe Integration", "Input Validation"],
  },
  {
    title: "Real-Time & Background",
    skills: ["WebSockets", "Queue Workers", "Scheduled Cron Jobs", "Background Processing Pipelines"],
  },
  {
    title: "DevOps & Deployment",
    skills: ["Cloudflare", "Hostinger VPS / Shared", "SSH Deployment", "Git Version Control", "Uptime Monitoring"],
  },
];

const KEY_DELIVERABLES = [
  "Corporate Websites & Landing Pages",
  "Payment Gateway Integrations (Razorpay/Stripe)",
  "Admin Dashboards & CMS Panels",
  "Mobile-Responsive Web Apps (PWA-Ready)",
  "RESTful APIs & Node.js Microservices",
  "Campaign Microsites & SEO Pages",
  "Real-Time / OTT-Style Media Platforms",
  "Deployment, Maintenance & Support Docs",
];

function Bio() {
  const ref = useSplitReveal({ by: "words", stagger: 0.015 });
  const sectionRef = useRef(null);
  const figureLeftRef = useRef(null);
  const captionLeftRef = useRef(null);
  const figureRightRef = useRef(null);
  const captionRightRef = useRef(null);
  const mobileFigureRef = useRef(null);

  const leftPortrait = useMemo(() => fallbackPortraitSrc, []);
  const rightPortrait = useMemo(() => fallbackPortraitSrc, []);

  useEffect(() => {
    registerGsap();
    const root = sectionRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const figures = [
        { el: figureLeftRef.current, cap: captionLeftRef.current, delay: 0 },
        { el: figureRightRef.current, cap: captionRightRef.current, delay: 0.12 },
      ].filter((f) => f.el);
      figures.forEach(({ el, cap, delay }) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
        });
        tl.fromTo(
          el,
          { opacity: 0, yPercent: 10, scale: 1.03 },
          { opacity: 1, yPercent: 0, scale: 1, duration: 1.1, ease: "expo.out" },
          delay,
        );
        if (cap) {
          tl.fromTo(
            cap,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
            delay + 0.45,
          );
        }
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="grid gap-10 px-6 py-24 md:grid-cols-12 md:px-10 items-start">
      <div className="md:col-span-3">
        <div className="flex items-center gap-2 mb-4">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="font-mono-alt text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Bio & Background
          </p>
        </div>
        <figure ref={figureLeftRef} className="mt-6 hidden w-full md:block group">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border/70 bg-card shadow-lg transition-all duration-500 group-hover:border-accent/60 group-hover:shadow-2xl">
            <img
              src={leftPortrait}
              alt="Abhishek Tiwari — Studio Portrait"
              width={1200}
              height={1500}
              className="absolute inset-0 h-full w-full object-cover grayscale transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"
            />
            <div className="absolute bottom-4 left-4 right-4 font-mono-alt text-[10px] uppercase tracking-wider text-white/90">
              Jaipur Studio · 01
            </div>
          </div>
          <figcaption
            ref={captionLeftRef}
            className="mt-3 font-mono-alt text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
          >
            Jaipur · 2025
          </figcaption>
        </figure>
      </div>

      <div className="md:col-span-5 space-y-8">
        <figure ref={mobileFigureRef} className="w-full aspect-[4/3] overflow-hidden rounded-xl border border-border md:hidden">
          <img
            src={leftPortrait}
            alt="Abhishek Tiwari — Jaipur"
            width={1200}
            height={900}
            className="h-full w-full object-cover grayscale"
          />
        </figure>

        <div>
          <span className="font-mono-alt text-[10px] uppercase tracking-[0.28em] text-accent">
            Professional Summary
          </span>
          <h2 className="display mt-2 text-[clamp(2rem,4vw,3.2rem)] leading-[0.95]">
            Engineering Systems That Outlast Launch Day
          </h2>
        </div>

        <p ref={ref} data-skew className="text-[clamp(1.1rem,2vw,1.6rem)] leading-[1.4] text-foreground/90 font-sans">
          Results-driven Full Stack Web & App Developer with 2.3+ years of hands-on experience building scalable web platforms, RESTful APIs, admin dashboards, and real-time applications. Proficient in <strong className="text-foreground font-semibold">Laravel, React.js, Node.js, and MySQL</strong>, with deep expertise in payment gateway integrations (Razorpay/Stripe), JWT/Sanctum authentication, WebSockets, and SSH cloud deployments.
        </p>

        {/* Skill Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {["Laravel", "React.js", "Node.js", "WebSockets", "Razorpay / Stripe", "Redis Caching", "JWT / Sanctum", "SSH Deployment"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border/70 bg-secondary/50 px-3 py-1 font-mono-alt text-[11px] uppercase tracking-wider text-foreground/80"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <div className="p-4 rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm">
            <div className="display text-3xl md:text-4xl text-foreground">2.3+</div>
            <div className="font-mono-alt mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Years Engineering Code
            </div>
          </div>
          <div className="p-4 rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm">
            <div className="display text-3xl md:text-4xl text-foreground">3</div>
            <div className="font-mono-alt mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Production Agencies & Roles
            </div>
          </div>
          <div className="p-4 rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm">
            <div className="display text-3xl md:text-4xl text-accent">100%</div>
            <div className="font-mono-alt mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              End-To-End Architecture
            </div>
          </div>
          <div className="p-4 rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm">
            <div className="display text-3xl md:text-4xl text-foreground">99.9%</div>
            <div className="font-mono-alt mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Reliability & Uptime Focus
            </div>
          </div>
        </div>
      </div>

      <div className="md:col-span-4">
        <figure ref={figureRightRef} className="sticky top-28 hidden w-full md:block group">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xl transition-all duration-500 group-hover:border-accent/60 group-hover:shadow-2xl">
            <img
              src={rightPortrait}
              alt="Abhishek Tiwari — Creative Portrait"
              width={1200}
              height={1500}
              className="absolute inset-0 h-full w-full object-cover grayscale contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
            />
            <div className="absolute bottom-5 left-5 right-5 space-y-1">
              <span className="font-mono-alt text-[10px] uppercase tracking-[0.25em] text-accent">
                Full Stack & App Specialist
              </span>
              <p className="font-mono-alt text-xs uppercase tracking-wider text-white/90">
                Laravel · React · Node · MySQL · REST APIs
              </p>
            </div>
          </div>
          <figcaption
            ref={captionRightRef}
            className="mt-3 font-mono-alt text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
          >
            Jaipur, Rajasthan · India (Remote/Hybrid)
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function ExperienceTimeline() {
  const sectionRef = useRef(null);

  useEffect(() => {
    registerGsap();
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray("[data-exp-card]");
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              once: true,
            },
          },
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="px-6 py-20 md:px-12 border-t border-border/40 bg-card/10">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-6">
          <div>
            <span className="font-mono-alt text-[11px] uppercase tracking-[0.3em] text-accent">
              Work Experience & Track Record
            </span>
            <h2 className="display mt-2 text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.92]">
              Professional History
            </h2>
          </div>
          <p className="font-mono-alt text-xs uppercase tracking-[0.2em] text-muted-foreground max-w-xs">
            2.3+ years building production applications across startups & agencies
          </p>
        </div>

        <div className="space-y-10">
          {WORK_EXPERIENCE.map((exp, idx) => (
            <div
              key={exp.company}
              data-exp-card
              className="group relative rounded-2xl border border-border/60 bg-card p-6 md:p-10 transition-all duration-500 hover:border-accent/60 hover:shadow-2xl"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono-alt text-xs tracking-widest text-accent">0{idx + 1}</span>
                    <h3 className="display text-2xl md:text-4xl text-foreground font-semibold">
                      {exp.company}
                    </h3>
                  </div>
                  <p className="font-mono-alt mt-1 text-sm uppercase tracking-wider text-muted-foreground">
                    {exp.role} <span className="text-accent/80">({exp.location})</span>
                  </p>
                </div>
                <div className="flex flex-col md:items-end gap-1">
                  <span className="font-mono-alt text-xs font-semibold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                    {exp.period}
                  </span>
                  <span className="font-mono-alt text-[11px] text-muted-foreground">
                    {exp.stack}
                  </span>
                </div>
              </div>

              <ul className="mt-6 space-y-3">
                {exp.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-3 text-sm md:text-base leading-relaxed text-foreground/85">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Approach() {
  const section = useRef(null);
  const track = useRef(null);

  useEffect(() => {
    registerGsap();
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      const el = track.current;
      if (!el || !section.current) return;
      gsap.to(el, {
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
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} className="relative py-16 md:py-0 md:h-screen md:overflow-hidden border-y border-border/40 bg-card/20">
      <div ref={track} className="flex flex-col md:flex-row md:h-full md:w-max items-start md:items-center gap-8 px-6 md:px-10">
        <div className="display text-3xl sm:text-4xl md:text-[clamp(3rem,10vw,9rem)] md:w-[45vw] font-bold">
          My
          <span className="inline md:block"> approach</span>
        </div>
        {APPROACH.map((a) => (
          <article
            key={a.no}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-card/80 backdrop-blur-md p-6 sm:p-7 w-full md:w-[40vw] md:h-[68vh] transition-all duration-500 hover:border-accent hover:shadow-[0_25px_60px_-15px_rgba(0,220,255,0.3)]"
          >
            {/* Background Graphic Preview */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-black group-hover:border-accent/40 transition-colors">
              <img
                src={a.image}
                alt={`${a.title} approach graphic`}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              <div className="absolute top-3 left-3 font-mono-alt text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/80 border border-white/20 text-accent">
                {a.no} // {a.title.toUpperCase()}
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="display text-xl sm:text-2xl md:text-4xl text-foreground group-hover:text-accent transition-colors duration-300">
                  {a.title}
                </h3>
                <span className="h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
              </div>

              <p className="text-xs sm:text-sm md:text-base leading-relaxed text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300">
                {a.body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function TechnicalSkillsMatrix() {
  return (
    <section className="px-6 py-20 md:px-12 bg-background border-t border-border/40">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-6">
          <div>
            <span className="font-mono-alt text-[11px] uppercase tracking-[0.3em] text-accent">
              Core Competencies & Stack
            </span>
            <h2 className="display mt-2 text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.92]">
              Technical Skills Matrix
            </h2>
          </div>
          <p className="font-mono-alt text-xs uppercase tracking-[0.2em] text-muted-foreground max-w-xs">
            End-to-end full stack capabilities with production proof
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TECH_CATEGORIES.map((cat) => (
            <div
              key={cat.title}
              className="rounded-xl border border-border/60 bg-card/60 p-6 space-y-4 hover:border-accent/50 transition-colors duration-300"
            >
              <h3 className="font-mono-alt text-sm uppercase tracking-wider text-accent border-b border-border/40 pb-2">
                {cat.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-secondary/80 px-2.5 py-1 font-mono-alt text-[12px] text-foreground/90"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EducationAndDeliverables() {
  return (
    <section className="px-6 py-20 md:px-12 bg-card/30 border-t border-border/40 space-y-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Education & Degree */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="font-mono-alt text-[11px] uppercase tracking-[0.3em] text-accent">
              Academic Foundation
            </span>
            <h2 className="display mt-2 text-3xl md:text-5xl leading-tight">
              Education & Thesis
            </h2>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-6 md:p-8 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-border/40 pb-4">
              <div>
                <h3 className="display text-xl md:text-2xl text-foreground font-semibold">
                  Compacom Institute of Technology
                </h3>
                <p className="font-mono-alt text-xs uppercase tracking-wider text-accent mt-0.5">
                  Specialization in Software Engineering & Web Development
                </p>
              </div>
              <span className="font-mono-alt text-xs uppercase tracking-widest text-muted-foreground bg-secondary/60 px-3 py-1 rounded-full w-max">
                Jun 2022 – Jul 2025
              </span>
            </div>

            <ul className="space-y-3 text-sm md:text-base leading-relaxed text-foreground/85">
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>Completed extensive practical projects built with PHP, Laravel, React.js, MySQL, and Java.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span><strong className="text-foreground">Thesis Project:</strong> Real-Time Collaborative Media Platform using Laravel & WebSockets — designed and architected to match modern OTT/streaming platform specifications.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Deliverables Matrix */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="font-mono-alt text-[11px] uppercase tracking-[0.3em] text-accent">
              Product Offerings
            </span>
            <h2 className="display mt-2 text-3xl md:text-5xl leading-tight">
              Key Deliverables
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {KEY_DELIVERABLES.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/80 p-4 transition-colors hover:border-accent/50"
              >
                <span className="h-2 w-2 rounded-full bg-accent shrink-0" />
                <span className="font-mono-alt text-xs uppercase tracking-wider text-foreground/90">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Availability Banner */}
      <div className="max-w-7xl mx-auto rounded-2xl border border-accent/40 bg-gradient-to-r from-accent/10 via-card to-card p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="font-mono-alt text-[10px] uppercase tracking-[0.3em] text-accent">
            Availability & Engagement
          </span>
          <h3 className="display text-2xl md:text-3xl text-foreground mt-1">
            Available for Freelance & Contract Projects
          </h3>
          <p className="mt-2 text-sm text-muted-foreground font-mono-alt">
            Open to milestone-based or monthly retainer contracts. India-based (Remote/Hybrid) with flexible availability for international meeting overlaps.
          </p>
        </div>
        <a
          href="/contact"
          className="shrink-0 rounded-full bg-accent px-6 py-3 font-mono-alt text-xs uppercase tracking-widest text-accent-foreground transition-transform hover:scale-105"
        >
          Hire Abhishek →
        </a>
      </div>
    </section>
  );
}

function CinematicPortrait() {
  const section = useRef(null);
  const videoRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    vid.muted = true;
    vid.defaultMuted = true;
    vid.playsInline = true;
    vid.loop = true;
    vid.autoplay = true;

    const forcePlay = () => {
      if (vid && vid.paused) {
        vid.play().catch(() => {});
      }
    };

    forcePlay();
    vid.addEventListener("canplay", forcePlay);
    vid.addEventListener("loadeddata", forcePlay);
    window.addEventListener("pointerdown", forcePlay, { passive: true });
    window.addEventListener("touchstart", forcePlay, { passive: true });
    window.addEventListener("scroll", forcePlay, { passive: true });

    return () => {
      vid.removeEventListener("canplay", forcePlay);
      vid.removeEventListener("loadeddata", forcePlay);
      window.removeEventListener("pointerdown", forcePlay);
      window.removeEventListener("touchstart", forcePlay);
      window.removeEventListener("scroll", forcePlay);
    };
  }, []);

  useEffect(() => {
    registerGsap();
    const root = section.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const videoSrc = useMemo(
    () =>
      cinematicVideoSrc && typeof cinematicVideoSrc === "string"
        ? cinematicVideoSrc
        : fallbackVideoSrc,
    [],
  );

  const onVideoError = (e) => {
    const node = e.currentTarget;
    if (node.getAttribute("data-fb") === "1") return;
    node.setAttribute("data-fb", "1");
    node.src = fallbackVideoSrc;
    node.play().catch(() => {});
  };

  return (
    <section
      ref={section}
      id="cinematic-portrait-video-section"
      className="relative h-screen w-full overflow-hidden flex flex-col justify-between px-6 py-10 md:px-12 md:py-14 bg-black text-white"
      aria-label="Cinematic portrait video hero banner — behind the code"
    >
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        controls={false}
        onError={onVideoError}
        className="absolute inset-0 h-full w-full object-cover object-[50%_35%] scale-[1.03] will-change-transform pointer-events-none"
        style={{
          filter: "contrast(1.08) saturate(1.02) brightness(0.92)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,8,12,0.65) 0%, rgba(8,8,12,0.15) 45%, rgba(8,8,12,0.85) 100%)",
        }}
      />

      <div className="relative z-20 flex items-center justify-between font-mono-alt text-[11px] uppercase tracking-[0.25em] text-white/80 pt-16 md:pt-12 pointer-events-none">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Portrait · 01 — Behind The Code</span>
        </div>
        <span className="hidden md:inline-block text-white/60">System Architecture & Engineering</span>
      </div>

      <div
        ref={overlayRef}
        className="relative z-20 flex flex-col items-start justify-end pb-8 md:pb-12 pointer-events-none"
      >
        <p className="font-mono-alt mb-3 text-[11px] uppercase tracking-[0.3em] text-emerald-400">
          Cinematic Experience
        </p>
        <h1
          className="display text-left text-[clamp(3rem,11.5vw,12rem)] leading-[0.85] font-black text-white tracking-tight"
          style={{
            textShadow:
              "0 4px 50px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.7)",
            WebkitTextStroke: "0.5px rgba(255,255,255,0.2)",
          }}
        >
          BEHIND
          <br />
          THE CODE
        </h1>
        <p className="mt-4 max-w-xl text-sm md:text-base leading-relaxed text-white/80 font-mono-alt">
          A one-take walk through systems, schemas, and interface engineering.
        </p>
      </div>

      <div className="relative z-20 flex items-center justify-between font-mono-alt text-[10px] uppercase tracking-[0.22em] text-white/60 pointer-events-none">
        <span>Abhishek Tiwari · Jaipur, India</span>
        <span>Scroll to explore ↓</span>
      </div>
    </section>
  );
}

export function About() {
  return (
    <main>
      <CinematicPortrait />
      <Bio />
      <ExperienceTimeline />
      <Approach />
      <TechnicalSkillsMatrix />
      <EducationAndDeliverables />
      <Footer invert />
    </main>
  );
}
