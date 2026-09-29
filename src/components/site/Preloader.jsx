import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { disableDecorative, motionTween } from "./useReducedMotion";
import introVideoSrc from "@/assets/Video_Generation_Prompt__imagi.mp4";

const LINES = [
  "› vite build --mode production",
  "resolving react@19.2.0 · react-dom · @tanstack/react-router",
  "transform src/routes/index.jsx ................ ok",
  "transform src/components/site/Cursor.jsx ...... ok",
  "node:worker spawn pool=8 heap=512mb",
  "prisma://pg · migrating 14 tables ............. ok",
  "laravel queue:work redis --tries=3 ............ listening",
  "openai · embeddings text-3-large · 1536 dims",
  "websocket handshake 101 switching protocols",
  "gsap · registering ScrollTrigger, Flip, Scramble",
  "lenis · raf bound to gsap.ticker",
  "bundling edge worker ......................... 41kb gz",
];

const STROKE_FALLBACK = "rgba(236, 236, 228, 0.9)";

function fg() {
  try {
    return getComputedStyle(document.documentElement)
      .getPropertyValue("--foreground")
      .trim() || STROKE_FALLBACK;
  } catch {
    return STROKE_FALLBACK;
  }
}

const MERN_SNIPPETS = [
  "const user = await User.find({ _id: id }).lean();",
  "useEffect(() => { api.subscribe(u => setU(u)); }, []);",
  "export default function App({ children }) { return <>{children}</>; }",
  "mongoose.connect(process.env.MONGO_URI, { serverApi: '1' });",
  "app.use(cors()); app.use(express.json()); app.use('/api', router);",
  "router.post('/auth/login', [auth, rateLimit], ctrl.login);",
  "npm install --save-dev vite @vitejs/plugin-react tailwindcss",
  "useState<Session>({ user: null, token: '', expires: 0 });",
  "res.status(201).json({ ok: true, data: doc });",
  "return { props: { dehydratedState: trpc.dehydrate() } };",
  "import { useQuery } from '@tanstack/react-query';",
  "bcrypt.hash(password, 12).then(h => User.create({ email, h }));",
  "socket.emit('presence', { id, online: Date.now() });",
  "export const api = createTRPCReact<AppRouter>();",
  "db.collection('sessions').createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 });",
  "const { data, isFetching, error } = useQuery({ queryKey: ['me'], queryFn });",
  "app.get('/', (_req, res) => res.sendFile(path.join(build, 'index.html')));",
  "z.object({ email: z.string().email(), password: z.string().min(8) }).parse(body);",
  "router.get('/users', pipe(authed, admin), async (req, res, next) => {",
  "const t = initTRPC.context<Context>().create();",
  "useEffect(() => { const t = setInterval(tick, 1000); return () => clearInterval(t); }, []);",
  "new QueryClient({ defaultOptions: { queries: { staleTime: 1000 * 30 } } });",
  "export const router = express.Router({ mergeParams: true });",
  "process.on('unhandledRejection', err => Sentry.captureException(err));",
];

const VIDEO_MAX_W = 800;
const VIDEO_AR_W = 16;
const VIDEO_AR_H = 9;
const FILL_TOTAL_MS = 8000;
const CORNER_TRIGGER_MS = 5000;
const CORNER_RADIUS_PX = 32;
const CORNER_TRANSITION_MS = 400;
const BORDER_CHASE_PER_EDGE_MS = 420;

function makeTextPanel(lines, repeat) {
  const pool = Array.from({ length: repeat }, () => lines).flat();
  return pool.join("   ");
}

function makeBorderText(lines, repeatHorizontal, repeatVertical) {
  const h = Array.from({ length: repeatHorizontal }, () => lines).flat().join("   ");
  const v = Array.from({ length: repeatVertical }, () => lines).flat().join("   ");
  return { h, v };
}

export function Preloader({ onDone }) {
  const root = useRef(null);
  const counter = useRef(null);
  const terminal = useRef(null);
  const flash = useRef(null);
  const video = useRef(null);
  const sideTop = useRef(null);
  const sideBottom = useRef(null);
  const sideLeft = useRef(null);
  const sideRight = useRef(null);
  const guardRef = useRef(false);
  const guardFallbackRef = useRef(false);
  const enterWrap = useRef(null);
  const frameWrap = useRef(null);
  const borderTop = useRef(null);
  const borderTopInner = useRef(null);
  const borderRight = useRef(null);
  const borderRightInner = useRef(null);
  const borderBottom = useRef(null);
  const borderBottomInner = useRef(null);
  const borderLeft = useRef(null);
  const borderLeftInner = useRef(null);
  const insetSpan = useRef(null);
  const [showEnter, setShowEnter] = useState(false);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  const triggerFinish = () => {
    if (guardRef.current) return;
    guardRef.current = true;
    if (root.current) {
      gsap.to(root.current, {
        opacity: 0,
        scale: 1.04,
        filter: "blur(12px)",
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          onDoneRef.current?.();
        },
      });
    } else {
      onDoneRef.current?.();
    }
  };

  const topBottomText = useMemo(
    () => makeTextPanel(MERN_SNIPPETS, 1),
    [],
  );
  const leftRightText = useMemo(
    () => makeTextPanel(MERN_SNIPPETS, 1),
    [],
  );
  const borderText = useMemo(
    () => makeBorderText(MERN_SNIPPETS.slice(0, 3), 1, 1),
    [],
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      const progress = { v: 0 };
      const tl = gsap.timeline();
      tl.to(terminal.current, { opacity: 1, duration: 0.3 })
        .to(
          progress,
          {
            v: 100,
            duration: 1.4,
            ease: "power2.inOut",
            onUpdate: () => {
              const n = Math.round(progress.v);
              if (counter.current)
                counter.current.textContent = String(n).padStart(2, "0");
            },
          },
          0,
        )
        .to(terminal.current, { opacity: 0, filter: "blur(14px)", duration: 0.25 })
        .to(counter.current, { scale: 26, duration: 0.6, ease: "expo.in" }, "<")
        .set(flash.current, { opacity: 1 })
        .set(counter.current, { opacity: 0 })
        .to(flash.current, { opacity: 0, duration: 0.3, ease: "power2.inOut" })
        .add(() => setShowEnter(true));
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!showEnter) return;
    const ok = !disableDecorative();
    const v = video.current;
    const fw = frameWrap.current;
    const bt = borderTop.current;
    const bti = borderTopInner.current;
    const br = borderRight.current;
    const bri = borderRightInner.current;
    const bb = borderBottom.current;
    const bbi = borderBottomInner.current;
    const bl = borderLeft.current;
    const bli = borderLeftInner.current;
    const isp = insetSpan.current;
    const cleanups = [];
    const radius = `${CORNER_RADIUS_PX}px`;
    const clipRound = `inset(0% 0% 0% 0% round ${radius})`;
    const clipSharp = "inset(0% 0% 0% 0% round 0px)";

    const clearTimer = (idRef) => {
      if (idRef.current) {
        clearTimeout(idRef.current);
        idRef.current = null;
      }
    };
    const fallbackId = { current: null };
    const cornerId = { current: null };
    const borderChaseMaster = { current: null };

    const runCornerAndBorderEffects = () => {
      if (borderChaseMaster.current) return;
      const cornerTween = motionTween(
        { duration: CORNER_TRANSITION_MS / 1000, ease: "power2.inOut" },
        { duration: Math.max(0.3, CORNER_TRANSITION_MS / 1000), ease: "none" },
      );
      if (fw) {
        gsap.to(fw, {
          borderRadius: radius,
          clipPath: clipRound,
          duration: cornerTween.duration,
          ease: cornerTween.ease,
        });
      }
      if (v) {
        gsap.to(v, {
          borderRadius: radius,
          clipPath: clipRound,
          duration: cornerTween.duration,
          ease: cornerTween.ease,
        });
      }
      if (isp) {
        gsap.to(isp, { borderRadius: radius, duration: cornerTween.duration, ease: cornerTween.ease });
      }

      const edgeTween = motionTween(
        { duration: BORDER_CHASE_PER_EDGE_MS / 1000, ease: "power2.inOut" },
        { duration: Math.max(0.3, BORDER_CHASE_PER_EDGE_MS / 1000), ease: "none" },
      );
      const chase = gsap.timeline();
      if (bt) {
        gsap.set(bt, { clipPath: "inset(0% 100% 0% 0%)" });
        gsap.set(bt, { opacity: 1 });
        chase.to(bt, { clipPath: "inset(0% 0% 0% 0%)", duration: edgeTween.duration, ease: edgeTween.ease }, 0);
        if (bti) chase.fromTo(bti, { x: "-20%" }, { x: "0%", duration: edgeTween.duration * 2.6, ease: "none" }, 0);
      }
      if (br) {
        gsap.set(br, { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(br, { opacity: 1 });
        chase.to(br, { clipPath: "inset(0% 0% 0% 0%)", duration: edgeTween.duration, ease: edgeTween.ease }, `>${edgeTween.duration * 0.82}`);
        if (bri) chase.fromTo(bri, { y: "-15%" }, { y: "0%", duration: edgeTween.duration * 2.6, ease: "none" }, `>-${edgeTween.duration * 0.1}`);
      }
      if (bb) {
        gsap.set(bb, { clipPath: "inset(0% 0% 0% 100%)" });
        gsap.set(bb, { opacity: 1 });
        chase.to(bb, { clipPath: "inset(0% 0% 0% 0%)", duration: edgeTween.duration, ease: edgeTween.ease }, `>${edgeTween.duration * 0.82}`);
        if (bbi) chase.fromTo(bbi, { x: "15%" }, { x: "0%", duration: edgeTween.duration * 2.6, ease: "none" }, `>-${edgeTween.duration * 0.1}`);
      }
      if (bl) {
        gsap.set(bl, { clipPath: "inset(0% 0% 100% 0%)" });
        gsap.set(bl, { opacity: 1 });
        chase.to(bl, { clipPath: "inset(0% 0% 0% 0%)", duration: edgeTween.duration, ease: edgeTween.ease }, `>${edgeTween.duration * 0.82}`);
        if (bli) chase.fromTo(bli, { y: "15%" }, { y: "0%", duration: edgeTween.duration * 2.6, ease: "none" }, `>-${edgeTween.duration * 0.1}`);
      }
      borderChaseMaster.current = chase;
    };

    const ctx = gsap.context(() => {
      const st = sideTop.current;
      const sb = sideBottom.current;
      const sl = sideLeft.current;
      const sr = sideRight.current;

      if (st) gsap.set(st, { clipPath: "inset(0% 0% 100% 0%)" });
      if (sb) gsap.set(sb, { clipPath: "inset(100% 0% 0% 0%)" });
      if (sl) gsap.set(sl, { clipPath: "inset(0% 100% 0% 0%)" });
      if (sr) gsap.set(sr, { clipPath: "inset(0% 0% 0% 100%)" });

      if (fw) gsap.set(fw, { borderRadius: "0px", clipPath: clipSharp });
      if (v) gsap.set(v, { borderRadius: "0px", clipPath: clipSharp });
      if (isp) gsap.set(isp, { borderRadius: "0px" });
      if (bt) gsap.set(bt, { clipPath: "inset(0% 100% 0% 0%)", opacity: 0 });
      if (br) gsap.set(br, { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 });
      if (bb) gsap.set(bb, { clipPath: "inset(0% 0% 0% 100%)", opacity: 0 });
      if (bl) gsap.set(bl, { clipPath: "inset(0% 0% 100% 0%)", opacity: 0 });

      gsap.fromTo(
        enterWrap.current,
        { opacity: 0, y: 14, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: ok ? 0.55 : 0.12,
          ease: ok ? "expo.out" : "none",
        },
      );

      const fillTween = motionTween(
        { duration: 2.2, ease: "power2.inOut" },
        { duration: 0.3, ease: "none" },
      );

      const tl = gsap.timeline();

      if (st) tl.to(st, { clipPath: "inset(0% 0% 0% 0%)", duration: fillTween.duration, ease: fillTween.ease }, 0);
      if (sb) tl.to(sb, { clipPath: "inset(0% 0% 0% 0%)", duration: fillTween.duration, ease: fillTween.ease }, 0);
      if (sl) tl.to(sl, { clipPath: "inset(0% 0% 0% 0%)", duration: fillTween.duration, ease: fillTween.ease }, 0);
      if (sr) tl.to(sr, { clipPath: "inset(0% 0% 0% 0%)", duration: fillTween.duration, ease: fillTween.ease }, 0);

      cornerId.current = setTimeout(() => {
        if (guardRef.current) return;
        runCornerAndBorderEffects();
      }, 1800);

      fallbackId.current = setTimeout(() => {
        triggerFinish();
      }, FILL_TOTAL_MS);

      if (ok && v) {
        v.muted = true;
        v.defaultMuted = true;
        v.playsInline = true;
        v.loop = true;
        v.autoplay = true;

        const forcePlay = () => {
          if (!v) return;
          v.muted = true;
          v.defaultMuted = true;
          v.playsInline = true;
          if (v.paused) {
            const p = v.play();
            if (p && typeof p.catch === "function") {
              p.catch(() => {});
            }
          }
        };

        forcePlay();
        requestAnimationFrame(forcePlay);
        const t1 = setTimeout(forcePlay, 100);
        const t2 = setTimeout(forcePlay, 500);

        let videoTimer = null;
        const handleVideoPlaying = () => {
          forcePlay();
          if (!videoTimer) {
            videoTimer = setTimeout(() => {
              triggerFinish();
            }, 8000);
          }
        };

        const handleTimeUpdate = () => {
          if (v && v.currentTime >= 8) {
            triggerFinish();
          }
        };

        const handleVideoEnded = () => {
          triggerFinish();
        };

        v.addEventListener("canplay", forcePlay);
        v.addEventListener("canplaythrough", forcePlay);
        v.addEventListener("loadeddata", forcePlay);
        v.addEventListener("playing", handleVideoPlaying);
        v.addEventListener("timeupdate", handleTimeUpdate);
        v.addEventListener("ended", handleVideoEnded);

        window.addEventListener("pointerdown", forcePlay, { passive: true });
        window.addEventListener("touchstart", forcePlay, { passive: true });
        window.addEventListener("click", forcePlay, { passive: true });

        cleanups.push(() => {
          clearTimeout(t1);
          clearTimeout(t2);
          if (videoTimer) clearTimeout(videoTimer);
          v.removeEventListener("canplay", forcePlay);
          v.removeEventListener("canplaythrough", forcePlay);
          v.removeEventListener("loadeddata", forcePlay);
          v.removeEventListener("playing", handleVideoPlaying);
          v.removeEventListener("timeupdate", handleTimeUpdate);
          v.removeEventListener("ended", handleVideoEnded);
          window.removeEventListener("pointerdown", forcePlay);
          window.removeEventListener("touchstart", forcePlay);
          window.removeEventListener("click", forcePlay);
        });
      }
    }, root);

    cleanups.forEach((fn) => ctx.add(fn));
    ctx.add(() => {
      clearTimer(fallbackId);
      clearTimer(cornerId);
    });
    ctx.add(() => {
      if (borderChaseMaster.current) {
        try {
          borderChaseMaster.current.kill();
        } catch {
          /* noop */
        }
        borderChaseMaster.current = null;
      }
    });
    if (ok && v) {
      ctx.add(() => {
        try {
          v.pause();
        } catch {
          /* noop */
        }
      });
    }

    return () => {
      ctx.revert();
    };
  }, [showEnter, borderText.h, borderText.v]);

  useEffect(() => {
    if (!showEnter) return;
    const handleKeyDown = (e) => {
      if (e.key === "Enter" || e.key === " " || e.code === "Enter" || e.code === "Space") {
        e.preventDefault();
        triggerFinish();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showEnter]);

  return (
    <div
      ref={root}
      onClick={() => {
        if (showEnter) {
          triggerFinish();
        }
      }}
      className="fixed inset-0 z-[100] bg-[#08080a] text-[var(--foreground,#ecece4)] overflow-hidden cursor-pointer"
      style={{ userSelect: "none" }}
    >
      <div
        ref={sideTop}
        className="absolute left-0 right-0 top-0 will-change-clip-path pointer-events-none"
        style={{
          bottom: `calc(50% + (min(800px, 88vw) * ${VIDEO_AR_H} / ${VIDEO_AR_W}) / 2)`,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          fontSize: "clamp(10px, 0.78vw, 13px)",
          lineHeight: 1.55,
          letterSpacing: "0.01em",
          color: "rgba(184, 230, 255, 0.58)",
          textShadow: "0 0 2px rgba(110, 200, 255, 0.25)",
          filter: "drop-shadow(0 0 6px rgba(110, 200, 255, 0.18))",
          padding: "14px 22px",
          overflow: "hidden",
          whiteSpace: "normal",
          wordBreak: "break-all",
          background:
            "linear-gradient(180deg, rgba(14,16,22,0.98) 0%, rgba(10,11,16,0.97) 100%)",
        }}
      >
        {topBottomText}
      </div>

      <div
        ref={sideBottom}
        className="absolute left-0 right-0 bottom-0 will-change-clip-path pointer-events-none"
        style={{
          top: `calc(50% + (min(800px, 88vw) * ${VIDEO_AR_H} / ${VIDEO_AR_W}) / 2)`,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          fontSize: "clamp(10px, 0.78vw, 13px)",
          lineHeight: 1.55,
          letterSpacing: "0.01em",
          color: "rgba(184, 230, 255, 0.58)",
          textShadow: "0 0 2px rgba(110, 200, 255, 0.25)",
          filter: "drop-shadow(0 0 6px rgba(110, 200, 255, 0.18))",
          padding: "14px 22px",
          overflow: "hidden",
          whiteSpace: "normal",
          wordBreak: "break-all",
          background:
            "linear-gradient(0deg, rgba(14,16,22,0.98) 0%, rgba(10,11,16,0.97) 100%)",
        }}
      >
        {topBottomText}
      </div>

      <div
        ref={sideLeft}
        className="absolute left-0 will-change-clip-path pointer-events-none"
        style={{
          top: `calc(50% - (min(800px, 88vw) * ${VIDEO_AR_H} / ${VIDEO_AR_W}) / 2)`,
          bottom: `calc(50% - (min(800px, 88vw) * ${VIDEO_AR_H} / ${VIDEO_AR_W}) / 2)`,
          right: `calc(50% - (min(800px, 88vw)) / 2)`,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          fontSize: "clamp(10px, 0.78vw, 13px)",
          lineHeight: 1.55,
          letterSpacing: "0.01em",
          color: "rgba(170, 220, 255, 0.55)",
          textShadow: "0 0 2px rgba(110, 200, 255, 0.25)",
          filter: "drop-shadow(0 0 6px rgba(110, 200, 255, 0.18))",
          padding: "14px 18px",
          overflow: "hidden",
          whiteSpace: "normal",
          wordBreak: "break-all",
          writingMode: "vertical-rl",
          background:
            "linear-gradient(90deg, rgba(14,16,22,0.98) 0%, rgba(10,11,16,0.97) 100%)",
        }}
      >
        {leftRightText}
      </div>

      <div
        ref={sideRight}
        className="absolute right-0 will-change-clip-path pointer-events-none"
        style={{
          top: `calc(50% - (min(800px, 88vw) * ${VIDEO_AR_H} / ${VIDEO_AR_W}) / 2)`,
          bottom: `calc(50% - (min(800px, 88vw) * ${VIDEO_AR_H} / ${VIDEO_AR_W}) / 2)`,
          left: `calc(50% + (min(800px, 88vw)) / 2)`,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          fontSize: "clamp(10px, 0.78vw, 13px)",
          lineHeight: 1.55,
          letterSpacing: "0.01em",
          color: "rgba(170, 220, 255, 0.55)",
          textShadow: "0 0 2px rgba(110, 200, 255, 0.25)",
          filter: "drop-shadow(0 0 6px rgba(110, 200, 255, 0.18))",
          padding: "14px 18px",
          overflow: "hidden",
          whiteSpace: "normal",
          wordBreak: "break-all",
          writingMode: "vertical-rl",
          background:
            "linear-gradient(270deg, rgba(14,16,22,0.98) 0%, rgba(10,11,16,0.97) 100%)",
        }}
      >
        {leftRightText}
      </div>

      {showEnter && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            triggerFinish();
          }}
          className="absolute top-6 left-1/2 -translate-x-1/2 z-[60] cursor-pointer group flex items-center gap-3 px-6 py-3 rounded-full bg-black/80 backdrop-blur-xl border border-cyan-400/40 text-cyan-100 shadow-[0_0_30px_rgba(0,200,255,0.3)] hover:border-cyan-300 hover:shadow-[0_0_40px_rgba(0,220,255,0.6)] transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            animation: "pre-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
          </span>
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan-100 group-hover:text-white transition-colors">
            Skip Video · Click to Enter
          </span>
          <svg
            className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      )}

      <div
        ref={enterWrap}
        onClick={() => {
          if (showEnter) {
            triggerFinish();
          }
        }}
        className="absolute inset-0 z-30 flex items-center justify-center cursor-pointer group transition-opacity duration-700"
        style={{
          opacity: showEnter ? 1 : 0,
          pointerEvents: showEnter ? "auto" : "none",
        }}
      >
        <div
          ref={frameWrap}
          className="relative will-change-transform"
          style={{
            width: `min(${VIDEO_MAX_W}px, 88vw)`,
            aspectRatio: `${VIDEO_AR_W} / ${VIDEO_AR_H}`,
            padding: "3px",
            contain: "layout paint size",
            isolation: "isolate",
            transform: "translateZ(0)",
            boxSizing: "border-box",
            boxShadow:
              "0 40px 90px -24px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.05)",
            background: "#000",
          }}
        >
          <div
            ref={borderTop}
            aria-hidden
            className="absolute left-0 right-0 top-0 overflow-hidden pointer-events-none will-change-clip-path"
            style={{
              height: "3px",
              top: "-3px",
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
              fontSize: "10px",
              lineHeight: "1",
              letterSpacing: "0.01em",
              color: "rgba(148, 222, 255, 0.88)",
              textShadow: "0 0 3px rgba(100, 200, 255, 0.5)",
              filter: "drop-shadow(0 0 3px rgba(90, 200, 255, 0.45))",
              background:
                "linear-gradient(90deg, rgba(20,28,42,0.96), rgba(14,18,28,0.96))",
              whiteSpace: "nowrap",
            }}
          >
            <span
              ref={borderTopInner}
              className="block absolute inset-0"
              style={{ width: "260%" }}
            >
              {borderText.h}
            </span>
          </div>

          <div
            ref={borderRight}
            aria-hidden
            className="absolute top-0 bottom-0 right-0 overflow-hidden pointer-events-none will-change-clip-path"
            style={{
              width: "3px",
              right: "-3px",
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
              fontSize: "10px",
              lineHeight: "1",
              letterSpacing: "0.01em",
              color: "rgba(148, 222, 255, 0.88)",
              textShadow: "0 0 3px rgba(100, 200, 255, 0.5)",
              filter: "drop-shadow(0 0 3px rgba(90, 200, 255, 0.45))",
              background:
                "linear-gradient(180deg, rgba(20,28,42,0.96), rgba(14,18,28,0.96))",
              whiteSpace: "normal",
              writingMode: "vertical-rl",
            }}
          >
            <span
              ref={borderRightInner}
              className="block absolute inset-0"
              style={{ height: "260%" }}
            >
              {borderText.v}
            </span>
          </div>

          <div
            ref={borderBottom}
            aria-hidden
            className="absolute left-0 right-0 bottom-0 overflow-hidden pointer-events-none will-change-clip-path"
            style={{
              height: "3px",
              bottom: "-3px",
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
              fontSize: "10px",
              lineHeight: "1",
              letterSpacing: "0.01em",
              color: "rgba(148, 222, 255, 0.88)",
              textShadow: "0 0 3px rgba(100, 200, 255, 0.5)",
              filter: "drop-shadow(0 0 3px rgba(90, 200, 255, 0.45))",
              background:
                "linear-gradient(270deg, rgba(20,28,42,0.96), rgba(14,18,28,0.96))",
              whiteSpace: "nowrap",
            }}
          >
            <span
              ref={borderBottomInner}
              className="block absolute inset-0"
              style={{ width: "260%", transformOrigin: "right center" }}
            >
              {borderText.h}
            </span>
          </div>

          <div
            ref={borderLeft}
            aria-hidden
            className="absolute top-0 bottom-0 left-0 overflow-hidden pointer-events-none will-change-clip-path"
            style={{
              width: "3px",
              left: "-3px",
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
              fontSize: "10px",
              lineHeight: "1",
              letterSpacing: "0.01em",
              color: "rgba(148, 222, 255, 0.88)",
              textShadow: "0 0 3px rgba(100, 200, 255, 0.5)",
              filter: "drop-shadow(0 0 3px rgba(90, 200, 255, 0.45))",
              background:
                "linear-gradient(0deg, rgba(20,28,42,0.96), rgba(14,18,28,0.96))",
              whiteSpace: "normal",
              writingMode: "vertical-rl",
            }}
          >
            <div
              ref={borderLeftInner}
              className="block absolute inset-0"
              style={{ height: "260%", transformOrigin: "center bottom" }}
            >
              {borderText.v}
            </div>
          </div>

          <video
            ref={(node) => {
              video.current = node;
              if (node) {
                node.muted = true;
                node.defaultMuted = true;
                node.playsInline = true;
                node.loop = true;
                const p = node.play();
                if (p && typeof p.catch === "function") {
                  p.catch(() => {});
                }
              }
            }}
            src={introVideoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            controls={false}
            x5-playsinline="true"
            x5-video-player-type="h5"
            className="pointer-events-none"
            style={{
              position: "absolute",
              inset: "clamp(16px, 3.5vw, 42px)",
              width: "calc(100% - clamp(32px, 7vw, 84px))",
              height: "calc(100% - clamp(32px, 7vw, 84px))",
              boxSizing: "border-box",
              display: "block",
              objectFit: "cover",
              objectPosition: "50% 50%",
              borderRadius: "28px",
              overflow: "hidden",
              transform: "translateZ(0)",
              WebkitMaskImage:
                "-webkit-linear-gradient(top, #000 0%, #000 100%)",
              maskImage: "linear-gradient(#000, #000)",
              background: "#000",
            }}
          />

          <span
            ref={insetSpan}
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              inset: "clamp(16px, 3.5vw, 42px)",
              borderRadius: "28px",
              boxShadow:
                "inset 0 0 0 2px rgba(255,255,255,0.12), 0 0 30px rgba(0,0,0,0.6)",
            }}
          />
        </div>
      </div>

      {!showEnter && (
        <div className="pointer-events-none absolute inset-0 z-[35] flex flex-col items-center justify-center">
          <div
            ref={terminal}
            data-nosnippet="true" aria-hidden="true" className="absolute inset-0 overflow-hidden font-mono-alt text-[11px] leading-[1.9] text-foreground/15 opacity-0"
          >
            {Array.from({ length: 6 }).map((_, col) => (
              <div
                key={col}
                className="absolute top-0 w-[34%] whitespace-nowrap"
                style={{
                  left: `${(col * 17) % 90}%`,
                  animation: `pre-fall ${1.1 + col * 0.22}s linear infinite`,
                }}
              >
                {LINES.concat(LINES).map((l, i) => (
                  <div key={i}>{l}</div>
                ))}
              </div>
            ))}
          </div>

          <span
            ref={counter}
            className="display relative text-[clamp(4rem,18vw,14rem)] leading-none text-foreground tracking-tight drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]"
            style={{ WebkitTextStroke: `1px ${fg()}` }}
          >
            00
          </span>
        </div>
      )}

      <div ref={flash} className="pointer-events-none absolute inset-0 z-[40] bg-foreground opacity-0" />

      <style>{`
        @keyframes pre-fall { from { transform: translateY(-50%); } to { transform: translateY(0%); } }
        @keyframes pre-pulse { 0%, 100% { opacity: 1; transform: translate(-50%, 0) scale(1); } 50% { opacity: 0.88; transform: translate(-50%, 0) scale(1.03); } }
      `}</style>
    </div>
  );
}
