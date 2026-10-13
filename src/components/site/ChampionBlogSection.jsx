import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { registerGsap } from "@/lib/gsap";

function renderMarkdown(md) {
  if (!md) return "";

  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Code blocks with syntax header and Copy button
    .replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const displayLang = lang || "code";
      return `<div class="code-block-container my-6 rounded-2xl overflow-hidden border border-white/10 bg-[#06080e] shadow-xl">
        <div class="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/[0.03]">
          <span class="text-[11px] font-mono text-accent uppercase tracking-wider font-semibold">${displayLang}</span>
          <button type="button" data-copy-code class="copy-code-btn inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/15 text-muted-foreground hover:text-foreground text-[10px] font-mono uppercase tracking-wider transition-all">
            <span>Copy</span>
          </button>
        </div>
        <pre class="p-4 overflow-x-auto font-mono text-xs text-foreground/90 leading-relaxed"><code>${code}</code></pre>
      </div>`;
    })
    .replace(/```([\s\S]*?)```/g, (match, code) => {
      return `<div class="code-block-container my-6 rounded-2xl overflow-hidden border border-white/10 bg-[#06080e] shadow-xl">
        <div class="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/[0.03]">
          <span class="text-[11px] font-mono text-accent uppercase tracking-wider font-semibold">Snippet</span>
          <button type="button" data-copy-code class="copy-code-btn inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/15 text-muted-foreground hover:text-foreground text-[10px] font-mono uppercase tracking-wider transition-all">
            <span>Copy</span>
          </button>
        </div>
        <pre class="p-4 overflow-x-auto font-mono text-xs text-foreground/90 leading-relaxed"><code>${code}</code></pre>
      </div>`;
    })
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-accent/15 text-accent px-1.5 py-0.5 rounded font-mono text-xs">$1</code>')
    // Headings
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-foreground mt-8 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-foreground mt-10 mb-4 border-b border-border/40 pb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-foreground mt-12 mb-6">$1</h1>')
    // Bold & Italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-foreground/80">$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent underline underline-offset-4 hover:opacity-80 transition-opacity">$1</a>')
    // Unordered lists
    .replace(/^\s*[-*]\s+(.*$)/gim, '<li class="ml-4 list-disc text-muted-foreground my-1.5">$1</li>')
    // Paragraphs
    .replace(/\n\n+/g, '</p><p class="my-4 leading-relaxed text-muted-foreground">');

  return '<p class="my-4 leading-relaxed text-muted-foreground">' + html + '</p>';
}

const SAMPLE_CHAMPION = {
  title: "TypeScript Clean Code Architecture for Enterprise Microservices",
  slug: "typescript-clean-code-architecture-enterprise",
  targetKeyword: "TypeScript Clean Architecture Microservices",
  seoScore: 96,
  publishedAt: "2026-10-13",
  coverUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
  tldrSummary: "Implement Clean Architecture with TypeScript using decoupled Domain Entities, Use Cases, Interfaces, and Dependency Injection to scale microservices effortlessly.",
  contentMarkdown: `## Core Architectural Principles

Clean Architecture separates business logic from external frameworks, databases, and network adapters.

\`\`\`typescript
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

export class RegisterUserUseCase {
  constructor(private userRepo: IUserRepository) {}
  async execute(dto: RegisterUserDto): Promise<User> {
    const user = new User(dto.email, dto.name);
    await this.userRepo.save(user);
    return user;
  }
}
\`\`\`

## Key Architectural Highlights
- **Strict Decoupling**: Use Cases interact solely via interfaces.
- **Testability**: Domain entities are testable in complete isolation without active databases.
- **Maintainability**: Infrastructure swaps (e.g., PostgreSQL to MongoDB) require zero domain edits.`,
  hashtags: ["#TypeScript", "#CleanCode", "#DesignPatterns", "#Enterprise"]
};

export function ChampionBlogSection() {
  const [champion, setChampion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const fetchChampion = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://career-digest.vercel.app/api/blogs/champion");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.champion) {
          setChampion(data.champion);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Using sample champion due to API fetch state:", err);
    } finally {
      if (!champion) setChampion(SAMPLE_CHAMPION);
      setLoading(false);
    }
  };

  useEffect(() => {
    registerGsap();
    fetchChampion();
  }, []);

  const handleModalCodeClick = (e) => {
    const copyBtn = e.target.closest("[data-copy-code]");
    if (copyBtn) {
      e.preventDefault();
      e.stopPropagation();
      const codeBlock = copyBtn.closest(".code-block-container")?.querySelector("code");
      if (codeBlock) {
        navigator.clipboard.writeText(codeBlock.innerText || codeBlock.textContent || "");
        const span = copyBtn.querySelector("span") || copyBtn;
        const originalText = span.textContent;
        span.textContent = "Copied! ✓";
        copyBtn.classList.add("text-accent");
        setTimeout(() => {
          span.textContent = originalText;
          copyBtn.classList.remove("text-accent");
        }, 2000);
      }
    }
  };

  const activeChampion = champion || SAMPLE_CHAMPION;
  const score = activeChampion.seoScore || activeChampion.seo_score || 96;
  const coverImage = activeChampion.coverUrl || activeChampion.cover_url || SAMPLE_CHAMPION.coverUrl;
  const publishedDate = activeChampion.publishedAt || activeChampion.published_at || "Today";
  const keyword = activeChampion.targetKeyword || activeChampion.target_keyword || "Enterprise Architecture";
  const tldr = activeChampion.tldrSummary || activeChampion.tldr_summary || activeChampion.metaDescription || activeChampion.summary;

  return (
    <section id="blog" className="relative scroll-mt-24 px-6 py-24 md:px-10 border-t border-border/40 bg-card/20">
      <div className="max-w-7xl mx-auto">
        {/* Header Badge & Title */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <span className="font-mono-alt inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1 text-[11px] uppercase tracking-[0.2em] text-accent">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Daily AI Digest &amp; Technical Blog
            </span>
            <h2 className="display mt-4 text-3xl sm:text-4xl md:text-5xl font-black">
              Today&apos;s #1 Winner Tech Blog
            </h2>
            <p className="mt-2 text-xs sm:text-sm font-mono text-muted-foreground">
              Evaluated each day across 12 candidate architectures. Only the #1 Champion is featured.
            </p>
          </div>

          <Link
            to="/blog"
            data-cursor="link"
            className="font-mono-alt inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background/80 px-5 py-2.5 text-xs uppercase tracking-wider text-muted-foreground hover:border-accent hover:text-foreground transition-all shadow-sm"
          >
            Browse All Winner Blogs Archive →
          </Link>
        </div>

        {/* Today's #1 Winner Spotlight Card */}
        {loading ? (
          <div className="h-80 w-full rounded-2xl border border-border/50 bg-black/40 animate-pulse flex items-center justify-center">
            <span className="font-mono text-xs text-muted-foreground">Loading Today&apos;s #1 Champion Article...</span>
          </div>
        ) : (
          <div className="group relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card/95 via-background to-card/75 p-6 md:p-10 transition-all duration-500 hover:border-accent/50 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* High-res cover image with hover scale */}
              <div className="lg:col-span-5 relative aspect-[16/10] overflow-hidden rounded-2xl border border-border/40 bg-black/60 shadow-lg">
                <img
                  id="blog-cover"
                  src={coverImage}
                  alt={activeChampion.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 rounded-lg bg-black/85 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-mono font-bold text-accent border border-accent/40 shadow-md">
                  🏆 Today&apos;s #1 Winner (SEO: {score}/100)
                </div>
              </div>

              {/* Winner Details & TL;DR */}
              <div className="lg:col-span-7 flex flex-col justify-between h-full">
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted-foreground mb-3">
                    <span>📅 {publishedDate}</span>
                    <span>•</span>
                    <span className="text-accent font-medium">Focus: {keyword}</span>
                  </div>

                  <h3 id="blog-title" className="display text-2xl sm:text-3xl md:text-4xl font-bold leading-snug group-hover:text-accent transition-colors">
                    {activeChampion.title}
                  </h3>

                  {/* "⚡ Direct Answer & Key Takeaway (TL;DR)" callout box in glowing accent border */}
                  <div className="mt-5 p-5 rounded-2xl bg-accent/[0.08] border border-accent/40 shadow-[0_0_25px_rgba(255,255,255,0.03)] border-l-4 border-l-accent">
                    <strong className="text-accent uppercase tracking-wider font-mono block text-[11px] mb-1.5 flex items-center gap-2">
                      <span>⚡</span> Direct Answer &amp; Key Takeaway (TL;DR):
                    </strong>
                    <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-sans">
                      {tldr}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => setSelectedArticle(activeChampion)}
                    data-cursor="link"
                    className="font-mono-alt inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-xs uppercase tracking-widest text-accent-foreground font-bold hover:opacity-90 transition-opacity shadow-lg shadow-accent/25"
                  >
                    Read Full Article →
                  </button>

                  <Link
                    to="/blog"
                    data-cursor="link"
                    className="font-mono-alt inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background/80 px-6 py-3.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-accent transition-all shadow-sm"
                  >
                    Browse All Winner Blogs Archive →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reader Modal Overlay */}
      {selectedArticle && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedArticle(null);
          }}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-8 overflow-y-auto animate-in fade-in duration-300"
        >
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-white/10 bg-[#080b12] text-foreground shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-black/80 sticky top-0 z-50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-accent/20 border border-accent/40 px-3 py-0.5 font-mono text-[10px] uppercase text-accent font-bold">
                  🏆 #1 Champion Winner
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  SEO Score: {score}/100
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/blog"
                  className="font-mono-alt text-[11px] uppercase tracking-wider text-accent hover:underline hidden sm:inline"
                >
                  View Archive →
                </Link>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="rounded-full p-2 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div
              onClick={handleModalCodeClick}
              className="p-6 md:p-10 overflow-y-auto space-y-6"
            >
              {coverImage && (
                <div className="relative w-full max-h-80 overflow-hidden rounded-2xl border border-white/10 bg-black/50">
                  <img
                    src={coverImage}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover max-h-80"
                  />
                </div>
              )}

              <div>
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted-foreground mb-3">
                  <span>📅 Published: {publishedDate}</span>
                  <span>•</span>
                  <span>✍️ Author: Abhishek Tiwari</span>
                  <span>•</span>
                  <span className="text-accent font-semibold">SEO Evaluated: {score}/100</span>
                </div>

                <h1 className="display text-3xl sm:text-4xl font-extrabold leading-tight">
                  {selectedArticle.title}
                </h1>
              </div>

              <div className="p-5 rounded-2xl bg-accent/[0.08] border border-accent/40 shadow-[0_0_25px_rgba(255,255,255,0.03)] border-l-4 border-l-accent">
                <strong className="text-accent uppercase tracking-wider font-mono block text-[11px] mb-1.5 flex items-center gap-2">
                  <span>⚡</span> Direct Answer &amp; Key Takeaway (TL;DR):
                </strong>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-sans">
                  {tldr}
                </p>
              </div>

              <div
                id="blog-content"
                className="prose prose-invert max-w-none text-muted-foreground font-sans leading-relaxed text-sm md:text-base"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(
                    selectedArticle.contentMarkdown ||
                    selectedArticle.content_markdown ||
                    selectedArticle.summary ||
                    tldr
                  ),
                }}
              />

              <div className="border-t border-white/10 pt-6 mt-8 flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">
                  Written by Abhishek Tiwari — Lead Full Stack Developer
                </span>
                <Link
                  to="/blog"
                  className="font-mono-alt text-xs uppercase tracking-wider text-accent hover:underline"
                >
                  Browse All Winner Articles →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
