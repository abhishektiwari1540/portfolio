import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { useMagnetic } from "./useMagnetic";
import { getLenis } from "./SmoothScroll";
import { okDecorative } from "./motion";

const NAV = [
  { to: "/", label: "Home", hash: null },
  { to: "/", label: "Work", hash: "work" },
  { to: "/about", label: "About", hash: null },
  { to: "/", label: "Contact", hash: "contact" },
];

function ThemeToggle() {
  const btn = useMagnetic(0.35);
  const [light, setLight] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("portfolio_theme");
    if (saved === "light") {
      setLight(true);
      document.documentElement.classList.add("light");
    } else if (saved === "dark") {
      setLight(false);
      document.documentElement.classList.remove("light");
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      setLight(true);
      document.documentElement.classList.add("light");
    }
  }, []);

  const toggle = () => {
    const el = btn.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const radius = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy),
    );
    const next = !light;

    const veil = document.createElement("div");
    const targetBg = next ? "oklch(0.95 0.008 106)" : "oklch(0.072 0.006 285)";
    veil.style.cssText = `position:fixed;inset:0;z-index:80;pointer-events:none;background:${targetBg}`;
    document.body.appendChild(veil);

    gsap.fromTo(
      veil,
      { clipPath: `circle(0px at ${cx}px ${cy}px)` },
      {
        clipPath: `circle(${radius}px at ${cx}px ${cy}px)`,
        duration: 0.9,
        ease: "power3.inOut",
        onComplete: () => {
          document.documentElement.classList.toggle("light", next);
          setLight(next);
          localStorage.setItem("portfolio_theme", next ? "light" : "dark");
          gsap.to(veil, {
            opacity: 0,
            duration: 0.35,
            delay: 0.05,
            onComplete: () => veil.remove(),
          });
        },
      },
    );
  };

  return (
    <button
      ref={btn}
      onClick={toggle}
      data-cursor="link"
      aria-label={light ? "Switch to dark" : "Switch to light"}
      className="font-mono-alt flex h-11 w-11 items-center justify-center rounded-full border border-border text-[10px] uppercase tracking-[0.15em] transition-colors hover:border-accent hover:text-accent"
    >
      {light ? "Drk" : "Lgt"}
    </button>
  );
}

function Menu() {
  const [open, setOpen] = useState(false);
  const panel = useRef(null);
  const btn = useMagnetic(0.4);
  const location = useLocation();
  const navigate = useNavigate();
  const scrollToHash = (hash) => {
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
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll("[data-menu-item]"));
    gsap.set(items, { yPercent: 120, opacity: 0 });
    gsap.set(el, { clipPath: "inset(0% 0% 100% 0%)", pointerEvents: "none" });

    const cbs = items.map((link) => {
      const over = () => {
        gsap.to(link, { x: 28, duration: 0.55, ease: "expo.out" });
        const underline = link.querySelector("[data-menu-underline]");
        if (underline) {
          gsap.to(underline, {
            scaleX: 1,
            transformOrigin: "left center",
            duration: 0.45,
            ease: "expo.out",
            overwrite: "auto",
          });
        }
      };
      const leave = () => {
        gsap.to(link, { x: 0, duration: 0.5, ease: "expo.out" });
        const underline = link.querySelector("[data-menu-underline]");
        if (underline) {
          gsap.to(underline, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.35,
            ease: "expo.inOut",
            overwrite: "auto",
          });
        }
      };
      link.addEventListener("pointerenter", over);
      link.addEventListener("pointerleave", leave);
      return { link, over, leave };
    });

    return () => {
      cbs.forEach(({ link, over, leave }) => {
        link.removeEventListener("pointerenter", over);
        link.removeEventListener("pointerleave", leave);
      });
    };
  }, []);

  const isFirstRender = useRef(true);

  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (!open) return;
    }
    const items = el.querySelectorAll("[data-menu-item]");
    if (open) {
      gsap
        .timeline()
        .set(el, { pointerEvents: "auto" })
        .to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.85, ease: "expo.inOut" })
        .to(
          items,
          { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: "expo.out" },
          "-=0.4",
        );
    } else {
      gsap
        .timeline()
        .to(items, { yPercent: -120, opacity: 0, duration: 0.45, stagger: 0.04, ease: "expo.in" })
        .to(
          el,
          {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 0.6,
            ease: "expo.inOut",
          },
          "-=0.3",
        )
        .add(() => gsap.set(el, { pointerEvents: "none" }));
    }
  }, [open]);

  const handleClick = (e, item) => {
    if (item.hash && item.to === "/" && location.pathname === "/") {
      e.preventDefault();
      setOpen(false);
      requestAnimationFrame(() => scrollToHash(item.hash));
      return;
    }
    setOpen(false);
    if (item.hash) {
      e.preventDefault();
      navigate({ to: item.to, hash: item.hash, replace: false });
    }
  };

  const pathname = location.pathname;
  const currentHash = location.hash.replace(/^#/, "");

  return (
    <>
      <button
        ref={btn}
        type="button"
        onClick={() => setOpen((o) => !o)}
        data-cursor="link"
        aria-expanded={open}
        aria-label="Menu"
        className="relative z-[90] flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur-md touch-manipulation"
      >
        <div className="relative h-3 w-4 flex flex-col justify-between items-center">
          <span
            className="block h-[1.5px] w-4 bg-foreground transition-all duration-300 origin-center"
            style={open ? { transform: "translateY(5.25px) rotate(45deg)" } : undefined}
          />
          <span
            className="block h-[1.5px] w-4 bg-foreground transition-all duration-300 origin-center"
            style={open ? { transform: "translateY(-5.25px) rotate(-45deg)" } : undefined}
          />
        </div>
      </button>

      <div
        ref={panel}
        className="pointer-events-none fixed inset-0 z-[85] flex flex-col justify-between overflow-y-auto bg-background/98 backdrop-blur-2xl px-6 py-24 md:px-12 md:py-28"
        style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      >
        <nav className="flex flex-col my-auto" aria-label="Primary">
          {NAV.map((item, i) => {
            const isActive =
              (item.to === "/" && pathname === "/" && !item.hash) ||
              (!item.hash && item.to !== "/" && item.to === pathname) ||
              (item.hash && item.hash === currentHash);
            return (
              <span key={`${item.to}${item.hash ?? ""}`} className="mask-line">
                <Link
                  data-menu-item
                  data-cursor="link"
                  to={item.to}
                  hash={item.hash || undefined}
                  onClick={(e) => handleClick(e, item)}
                  aria-current={isActive ? "page" : undefined}
                  className="display relative inline-block py-2 text-[clamp(2.5rem,7vw,7rem)] text-foreground transition-opacity hover:opacity-45"
                >
                  <span className="font-mono-alt mr-4 align-super text-[0.8rem] tracking-widest text-muted-foreground">
                    0{i + 1}
                  </span>
                  {item.label}
                  <span
                    data-menu-underline
                    aria-hidden
                    className="absolute left-0 bottom-[0.1em] block h-[2px] w-full origin-left bg-foreground will-change-transform"
                    style={{ transform: "scaleX(0)" }}
                  />
                </Link>
              </span>
            );
          })}
        </nav>

        <div className="font-mono-alt mt-8 flex flex-wrap items-center gap-6 border-t border-border/30 pt-6 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          <a data-cursor="link" href="mailto:abhishektiwari1540@gmail.com" className="text-foreground hover:text-accent transition-colors">
            abhishektiwari1540@gmail.com
          </a>
          <a data-cursor="link" href="https://linkedin.com/in/abhishektiwari1540" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            LinkedIn
          </a>
          <a data-cursor="link" href="https://github.com/abhishektiwari1540" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            GitHub
          </a>
        </div>
      </div>
    </>
  );
}

function TalkBadge() {
  const ref = useMagnetic(0.3);
  const ring = useRef(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const el = ring.current;
    if (!el) return;
    const dur = hover ? 6 : 14;
    gsap.to(el, { rotate: "+=360", duration: dur, repeat: -1, ease: "none", overwrite: "auto" });
    return () => {
      if (el) gsap.killTweensOf(el);
    };
  }, [hover]);

  return (
    <Link
      ref={ref}
      to="/"
      hash="contact"
      data-cursor="link"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      className="fixed bottom-6 right-6 z-[84] hidden h-28 w-28 items-center justify-center rounded-full bg-foreground text-background md:flex"
    >
      <svg ref={ring} viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <defs>
          <path id="talk-ring" d="M50,50 m-34,0 a34,34 0 1,1 68,0 a34,34 0 1,1 -68,0" fill="none" />
        </defs>
        <text className="font-mono-alt" fontSize="8.5" letterSpacing="2.1" fill="currentColor">
          <textPath href="#talk-ring">LET&apos;S TALK · LET&apos;S TALK · </textPath>
        </text>
      </svg>
      <span className="text-2xl">↗</span>
    </Link>
  );
}

function NavLink({ item, pathname, currentHash }) {
  const homeActive = pathname === "/" && !currentHash;
  const aboutActive = pathname === "/about";
  const workActive = currentHash === "work";
  const contactActive = currentHash === "contact";
  const active =
    (item.to === "/" && homeActive && !item.hash) ||
    (item.to === "/about" && aboutActive) ||
    (item.hash === "work" && workActive) ||
    (item.hash === "contact" && contactActive);
  const ref = useMagnetic(0.28);
  const underline = useRef(null);
  const lenisRef = useRef(null);

  useEffect(() => {
    lenisRef.current = getLenis();
  }, []);

  useEffect(() => {
    const li = underline.current;
    if (!li) return;
    gsap.set(li, { scaleX: active ? 1 : 0, transformOrigin: "left center" });
  }, [active]);

  const enter = () => {
    if (underline.current) {
      gsap.to(underline.current, {
        scaleX: 1,
        duration: 0.45,
        ease: "expo.out",
        overwrite: "auto",
      });
    }
  };
  const leave = () => {
    if (underline.current && !active) {
      gsap.to(underline.current, {
        scaleX: 0,
        duration: 0.35,
        ease: "expo.inOut",
        overwrite: "auto",
      });
    }
  };

  const scrollOrNav = (e) => {
    if (item.hash) {
      if (pathname === "/") {
        e.preventDefault();
        requestAnimationFrame(() => {
          const id = item.hash;
          const node = document.getElementById(id);
          if (!node) return;
          const lenis = lenisRef.current || getLenis();
          if (lenis) lenis.scrollTo(node, { offset: -96, immediate: false, duration: 1.1 });
          else {
            const y = node.getBoundingClientRect().top + window.scrollY - 96;
            window.scrollTo({ top: y, behavior: "smooth" });
          }
          try {
            node.setAttribute("tabindex", "-1");
            node.focus({ preventScroll: true });
          } catch {
            /* noop */
          }
        });
      }
    }
  };

  return (
    <Link
      ref={ref.ref}
      to={item.to}
      hash={item.hash || undefined}
      aria-current={active ? "page" : undefined}
      onClick={scrollOrNav}
      onPointerEnter={enter}
      onPointerLeave={leave}
      data-cursor="link"
      className={`font-mono-alt relative hidden min-h-[44px] items-center px-3 text-[11px] uppercase tracking-[0.22em] md:inline-flex ${
        active ? "text-foreground" : "text-muted-foreground"
      }`}
    >
      {item.label}
      <span
        ref={underline}
        aria-hidden
        className="absolute left-3 right-3 bottom-[14px] block h-px bg-foreground will-change-transform"
        style={{ transform: `scaleX(${active ? 1 : 0})`, transformOrigin: "left center" }}
      />
    </Link>
  );
}

export function Chrome() {
  const header = useRef(null);
  const brand = useRef(null);
  const location = useLocation();
  const pathname = location.pathname;
  const currentHash = useMemo(() => location.hash.replace(/^#/, ""), [location.hash]);
  const ranScrollRef = useRef("");
  const brandMag = useMagnetic(0.3);

  useEffect(() => {
    registerGsap();
    const el = header.current;
    const b = brand.current;
    if (!el || !b) return;

    gsap.set(el, { y: 0 });
    gsap.set(b, { scale: 1 });

    if (!okDecorative()) {
      el.dataset.compact = "false";
      return;
    }

    ScrollTrigger.create({
      id: "nav-compact",
      start: "120 top",
      trigger: document.documentElement,
      onToggle: (self) => {
        const compact = self.isActive;
        const was = el.dataset.compact === "true";
        if (was === compact) return;
        el.dataset.compact = String(compact);
        gsap.killTweensOf(el);
        gsap.killTweensOf(b);
        gsap.to(el, {
          y: compact ? -6 : 0,
          duration: 0.45,
          ease: "expo.out",
          overwrite: "auto",
        });
        gsap.to(b, {
          scale: compact ? 0.93 : 1,
          duration: 0.45,
          ease: "expo.out",
          overwrite: "auto",
        });
      },
    });
    return () => {
      ScrollTrigger.getById("nav-compact")?.kill();
    };
  }, []);

  useEffect(() => {
    if (!currentHash) {
      ranScrollRef.current = `${pathname}::`;
      return;
    }
    const key = `${pathname}::${currentHash}`;
    if (ranScrollRef.current === key) return;
    ranScrollRef.current = key;
    const id = currentHash;
    let ticks = 0;
    const tryScroll = () => {
      const node = document.getElementById(id);
      if (node) {
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(node, { offset: -96, immediate: false, duration: 1.1 });
        else {
          const y = node.getBoundingClientRect().top + window.scrollY - 96;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
        try {
          node.setAttribute("tabindex", "-1");
          node.focus({ preventScroll: true });
        } catch {
          /* noop */
        }
        return true;
      }
      ticks += 1;
      if (ticks < 12) {
        requestAnimationFrame(tryScroll);
      }
      return false;
    };
    const timeout = setTimeout(tryScroll, 120);
    return () => clearTimeout(timeout);
  }, [pathname, currentHash]);

  const homeActive = pathname === "/" && !currentHash;

  return (
    <>
      <header
        ref={header}
        data-compact="false"
        id="siteNav"
        className="pointer-events-none group fixed inset-x-0 top-0 z-[86] flex items-start justify-between transition-[padding,color,background-color,backdrop-filter,box-shadow] duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] data-[compact=false]:[padding:24px_32px] data-[compact=true]:[padding:10px_24px] data-[compact=true]:bg-background/60 data-[compact=true]:backdrop-blur-xl data-[compact=true]:[box-shadow:0_10px_30px_-18px_rgba(0,0,0,0.55)]"
      >
        <div className="pointer-events-auto flex items-center gap-1">
          <Link
            ref={brandMag.ref}
            to="/"
            data-cursor="link"
            aria-label={homeActive ? "Home — current page" : "Home"}
            aria-current={homeActive ? "page" : undefined}
            className="font-mono-alt relative text-[11px] uppercase leading-[1.6] tracking-[0.22em] text-foreground will-change-transform"
          >
            <span ref={brand} className="block will-change-transform">
              Abhishek Tiwari
              <span className="block text-muted-foreground">Full Stack Developer</span>
            </span>
          </Link>
          <nav aria-label="In-page" className="ml-3 hidden items-center md:flex">
            {NAV.map((item) => (
              <NavLink key={`${item.to}-${item.hash ?? ""}`} item={item} pathname={pathname} currentHash={currentHash} />
            ))}
          </nav>
        </div>
        <div className="pointer-events-auto flex items-center gap-3">
          <ThemeToggle />
          <Menu />
        </div>
      </header>
      <TalkBadge />
    </>
  );
}
