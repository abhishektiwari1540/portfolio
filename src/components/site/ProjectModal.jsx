import { useEffect, useState, useRef } from "react";
import { PROJECTS } from "./data";

export function ProjectModal({ project, onClose, onSelectProject }) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const backdropRef = useRef(null);

  useEffect(() => {
    setActiveImgIdx(0);
  }, [project]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        if (project?.images?.length) {
          setActiveImgIdx((prev) => (prev + 1) % project.images.length);
        }
      } else if (e.key === "ArrowLeft") {
        if (project?.images?.length) {
          setActiveImgIdx((prev) =>
            prev === 0 ? project.images.length - 1 : prev - 1,
          );
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const images = project.images && project.images.length > 0 ? project.images : [project.image];

  const nextImg = (e) => {
    if (e) e.stopPropagation();
    setActiveImgIdx((prev) => (prev + 1) % images.length);
  };

  const prevImg = (e) => {
    if (e) e.stopPropagation();
    setActiveImgIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div
      ref={backdropRef}
      onClick={(e) => {
        if (e.target === backdropRef.current) {
          onClose();
        }
      }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-2 sm:p-4 md:p-8 overflow-y-auto animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-5xl max-h-[94vh] flex flex-col rounded-2xl md:rounded-3xl border border-white/15 bg-[#0a0b10] text-foreground shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden transition-all duration-300">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4 bg-black/60 sticky top-0 z-50 backdrop-blur-md">
          <div className="min-w-0 flex-1 pr-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="display text-lg sm:text-2xl md:text-3xl tracking-wide text-white truncate max-w-[70vw] sm:max-w-none">
                {project.name}
              </h2>
              <span className="font-mono-alt text-[9px] sm:text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-accent/20 border border-accent/40 text-accent font-bold shrink-0">
                {project.year}
              </span>
            </div>
            <p className="font-mono-alt text-[10px] sm:text-xs text-muted-foreground mt-0.5 truncate">
              {project.company} · <span className="text-white/80">{project.location}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            data-cursor="link"
            aria-label="Close project modal"
            className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-110 active:scale-95 cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 custom-scrollbar">
          {/* Gallery Carousel Window */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-black group">
            {/* Main Preview Image */}
            <img
              src={images[activeImgIdx]}
              alt={`${project.name} preview slide ${activeImgIdx + 1}`}
              className="h-full w-full object-cover transition-all duration-500"
            />

            {/* Upper Badge & Upper Control Pill Overlay */}
            <div className="absolute top-3 inset-x-3 sm:top-4 sm:inset-x-4 z-30 flex items-center justify-between pointer-events-none">
              {/* Slide Index Badge */}
              <div className="pointer-events-auto font-mono-alt text-[9px] sm:text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white shadow-lg flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-accent animate-pulse" />
                IMAGE {activeImgIdx + 1} / {images.length}
              </div>

              {/* Upper Arrow Navigation Controls (Desktop) */}
              {images.length > 1 && (
                <div className="pointer-events-auto hidden md:flex items-center gap-1.5 bg-black/85 backdrop-blur-md p-1.5 rounded-full border border-white/20 shadow-xl">
                  <button
                    type="button"
                    onClick={prevImg}
                    data-cursor="link"
                    aria-label="Previous image upper"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-all hover:bg-accent hover:text-black hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <span className="font-mono-alt text-[11px] font-semibold text-white/80 px-2 select-none">
                    {activeImgIdx + 1} / {images.length}
                  </span>

                  <button
                    type="button"
                    onClick={nextImg}
                    data-cursor="link"
                    aria-label="Next image upper"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-all hover:bg-accent hover:text-black hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Middle Side Floating Arrow Buttons (Desktop) */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImg}
                  data-cursor="link"
                  aria-label="Previous image middle"
                  className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 h-12 w-12 items-center justify-center rounded-full bg-black/75 backdrop-blur-md border border-white/25 text-white transition-all hover:bg-accent hover:text-black hover:scale-110 active:scale-95 shadow-2xl cursor-pointer"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={nextImg}
                  data-cursor="link"
                  aria-label="Next image middle"
                  className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 h-12 w-12 items-center justify-center rounded-full bg-black/75 backdrop-blur-md border border-white/25 text-white transition-all hover:bg-accent hover:text-black hover:scale-110 active:scale-95 shadow-2xl cursor-pointer"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Bottom Thumbnail Strip */}
            {images.length > 1 && (
              <div className="absolute bottom-2 inset-x-2 sm:bottom-3 sm:inset-x-3 z-30 flex items-center justify-start md:justify-center gap-1.5 sm:gap-2 overflow-x-auto p-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 custom-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    data-cursor="link"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImgIdx(idx);
                    }}
                    className={`relative h-9 w-14 sm:h-11 sm:w-18 md:h-12 md:w-20 shrink-0 overflow-hidden rounded-md sm:rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                      activeImgIdx === idx
                        ? "border-accent scale-105 shadow-[0_0_12px_rgba(0,220,255,0.6)] ring-2 ring-accent/40"
                        : "border-white/20 opacity-60 hover:opacity-100 hover:border-white/80"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Project Overview */}
          <div className="space-y-3">
            <h3 className="font-mono-alt text-[10px] sm:text-xs uppercase tracking-widest text-accent font-semibold">
              // PROJECT OVERVIEW
            </h3>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed text-white/90">
              {project.blurb}
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
              {project.tags?.map((t) => (
                <span
                  key={t}
                  className="font-mono-alt rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] sm:text-xs text-white/90"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Background Information & Architecture Grid */}
          {project.details && project.details.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-white/10">
              <h3 className="font-mono-alt text-[10px] sm:text-xs uppercase tracking-widest text-accent font-semibold">
                // ENTERPRISE &amp; ARCHITECTURE DETAILS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {project.details.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm space-y-1.5 hover:border-accent/40 transition-colors"
                  >
                    <h4 className="font-mono-alt text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-2">
                      <span className="text-accent font-bold">0{idx + 1}.</span> {item.title}
                    </h4>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explore Other Projects Bar */}
          <div className="pt-4 border-t border-white/10">
            <h4 className="font-mono-alt text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground mb-2.5 font-semibold">
              EXPLORE OTHER PROJECTS:
            </h4>
            <div className="flex flex-wrap gap-2">
              {PROJECTS.map((other) => (
                <button
                  key={other.id || other.name}
                  type="button"
                  data-cursor="link"
                  onClick={() => onSelectProject(other)}
                  className={`font-mono-alt text-[11px] sm:text-xs px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                    other.name === project.name
                      ? "border-accent bg-accent/20 text-accent font-bold shadow-[0_0_12px_rgba(0,220,255,0.3)]"
                      : "border-white/15 bg-white/5 text-white/70 hover:border-white hover:text-white"
                  }`}
                >
                  {other.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer (Sticky Responsive) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 px-4 py-3 sm:px-6 sm:py-4 bg-black/80 backdrop-blur-md sticky bottom-0 z-40">
          <button
            type="button"
            onClick={onClose}
            data-cursor="link"
            className="font-mono-alt text-xs uppercase tracking-wider text-muted-foreground hover:text-white transition-colors cursor-pointer w-full sm:w-auto text-center py-1"
          >
            ← Close Preview
          </button>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              data-cursor="link"
              className="inline-flex items-center justify-center gap-2 font-mono-alt text-xs uppercase tracking-wider px-5 py-2.5 rounded-full bg-accent text-black font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,220,255,0.4)] w-full sm:w-auto text-center"
            >
              <span>Visit Platform / Get Quote</span>
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
