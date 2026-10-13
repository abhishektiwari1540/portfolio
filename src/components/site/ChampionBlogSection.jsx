import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { registerGsap } from "@/lib/gsap";

function renderMarkdown(md) {
  if (!md) return "";

  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/```([a-z]*)\n([\s\S]*?)```/g, '<div class="my-6 rounded-xl overflow-hidden border border-border/80 bg-black/90"><div class="px-4 py-2 border-b border-border/50 text-[11px] font-mono text-muted-foreground flex justify-between items-center"><span>$1</span><span class="text-accent">Code Snippet</span></div><pre class="p-4 overflow-x-auto font-mono text-xs text-accent/90"><code>$2</code></pre></div>')
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-black/90 border border-border/80 p-4 rounded-xl my-6 overflow-x-auto font-mono text-xs text-accent/90"><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-accent/15 text-accent px-1.5 py-0.5 rounded font-mono text-xs">$1</code>')
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-foreground mt-8 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-foreground mt-10 mb-4 border-b border-border/40 pb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-foreground mt-12 mb-6">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-foreground/80">$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent underline underline-offset-4 hover:opacity-80 transition-opacity">$1</a>')
    .replace(/^\s*[-*]\s+(.*$)/gim, '<li class="ml-4 list-disc text-muted-foreground my-1.5">$1</li>')
    .replace(/\n\n+/g, '</p><p class="my-4 leading-relaxed text-muted-foreground">');

  return '<p class="my-4 leading-relaxed text-muted-foreground">' + html + '</p>';
}

const SAMPLE_CHAMPION = {
  rank: 1,
  id: "champion-1",
  title: "TypeScript Clean Architecture: Enterprise-Grade Domain Modeling & Microservices",
  seo_score: 96,
  published_at: "Today",
  targetKeyword: "TypeScript Clean Architecture Microservices",
  cover_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200",
  summary: "Master enterprise clean architecture in TypeScript. Implement domain-driven design, repositories, dependency injection, and microservices.",
  tldrSummary: "Implement Clean Architecture with TypeScript using decoupled Domain Entities, Use Cases, Interfaces, and Dependency Injection to scale microservices effortlessly.",
  contentMarkdown: `## Core Architectural Principles\n\nClean Architecture separates concerns by keeping business domain logic independent of external frameworks, databases, and UI components.\n\n\`\`\`typescript\nexport interface IUserRepository {\n  findById(id: string): Promise<User | null>;\n  save(user: User): Promise<void>;\n}\n\nexport class RegisterUserUseCase {\n  constructor(private userRepo: IUserRepository) {}\n  async execute(dto: RegisterUserDto): Promise<User> {\n    const user = new User(dto.email, dto.name);\n    await this.userRepo.save(user);\n    return user;\n  }\n}\n\`\`\`\n\n## Frequently Asked Questions\n\n### How does Clean Architecture scale?\nBy keeping use-cases pure and isolated, testing is deterministic and teams can deploy microservices without cascading dependencies.`,
  hashtags: ["#TypeScript", "#CleanArchitecture", "#Microservices", "#NodeJS"]
};

export function ChampionBlogSection() {
  const [champion, setChampion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const champRes = await fetch("https://career-digest.vercel.app/api/blogs/champion");
      if (champRes.ok) {
        const champData = await champRes.json();
        if (champData.success && champData.champion) {
          setChampion(champData.champion);
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
    fetchBlogs();
  }, []);

  const activeChampion = champion || SAMPLE_CHAMPION;

  return (
    <section id="blog" className="relative scroll-mt-24 px-6 py-24 md:px-10 border-t border-border/40 bg-card/20">
      <div className="max-w-7xl mx-auto">
        {/* Header Badge & Title */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <span className="font-mono-alt inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1 text-[11px] uppercase tracking-[0.2em] text-accent">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Daily AI Digest &amp; Tech Blog
            </span>
            <h2 className="display mt-4 text-3xl sm:text-4xl md:text-5xl">
              Today&apos;s #1 Winner Tech Blog
            </h2>
            <p className="mt-2 text-xs sm:text-sm font-mono text-muted-foreground">
              Evaluated each day across 12 candidate architectures. Only the #1 Champion is featured.
            </p>
          </div>

          <Link
            to="/blog"
            data-cursor="link"
            className="font-mono-alt inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background/80 px-4 py-2.5 text-xs uppercase tracking-wider text-muted-foreground hover:border-accent hover:text-foreground transition-all shadow-sm"
          >
            Browse All Winner Blogs Archive →
          </Link>
        </div>

        {/* #1 Champion Spotlight */}
        {loading ? (
          <div className="h-80 w-full rounded-2xl border border-border/50 bg-black/40 animate-pulse flex items-center justify-center">
            <span className="font-mono text-xs text-muted-foreground">Loading Today&apos;s #1 Champion Article...</span>
          </div>
        ) : (
          <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 via-background to-card/70 p-6 md:p-10 transition-all duration-500 hover:border-accent/50 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Cover Image Container */}
              <div className="lg:col-span-5 relative aspect-[16/10] overflow-hidden rounded-xl border border-border/40 bg-black/50">
                <img
                  id="blog-cover"
                  src={activeChampion.cover_url || activeChampion.coverUrl || activeChampion.cover || SAMPLE_CHAMPION.cover_url}
                  alt={activeChampion.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 rounded-lg bg-black/80 backdrop-blur-md px-3 py-1 text-[11px] font-mono font-bold text-accent border border-accent/30">
                  🏆 #1 WINNER (SEO: {activeChampion.seo_score || activeChampion.seoScore || 96}/100)
                </div>
              </div>

              {/* Blog Content Teaser */}
              <div className="lg:col-span-7 flex flex-col justify-between h-full">
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted-foreground mb-3">
                    <span>📅 {activeChampion.published_at || activeChampion.publishedAt || activeChampion.date || "Today"}</span>
                    <span>•</span>
                    <span className="text-accent">Focus: {activeChampion.target_keyword || activeChampion.targetKeyword || "Architecture"}</span>
                  </div>

                  <h3 id="blog-title" className="display text-2xl sm:text-3xl font-bold leading-snug group-hover:text-accent transition-colors">
                    {activeChampion.title}
                  </h3>

                  <div className="mt-4 p-4 rounded-xl bg-accent/10 border-l-4 border-accent text-xs sm:text-sm text-foreground/90 leading-relaxed font-sans">
                    <strong className="text-accent uppercase tracking-wider font-mono block text-[11px] mb-1">
                      ⚡ Key Takeaways / Direct Answer (TL;DR):
                    </strong>
                    {activeChampion.tldr_summary || activeChampion.tldrSummary || activeChampion.summary || activeChampion.meta_description}
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => setSelectedArticle(activeChampion)}
                    data-cursor="link"
                    className="font-mono-alt inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-xs uppercase tracking-widest text-accent-foreground font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-accent/20"
                  >
                    Read Full Article →
                  </button>

                  <Link
                    to="/blog"
                    data-cursor="link"
                    className="font-mono-alt text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                  >
                    All Saved Winner Blogs ↗
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
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-white/10 bg-background shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-black/80 sticky top-0 z-50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-accent/20 border border-accent/40 px-3 py-0.5 font-mono text-[10px] uppercase text-accent font-bold">
                  🏆 #1 Champion Winner
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  SEO Score: {selectedArticle.seo_score || selectedArticle.seoScore || 96}/100
                </span>
              </div>

              <button
                onClick={() => setSelectedArticle(null)}
                className="rounded-full p-2 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-10 overflow-y-auto space-y-6">
              {(selectedArticle.cover_url || selectedArticle.coverUrl) && (
                <img
                  src={selectedArticle.cover_url || selectedArticle.coverUrl}
                  alt={selectedArticle.title}
                  className="w-full max-h-80 object-cover rounded-2xl border border-white/10"
                />
              )}

              <h1 className="display text-3xl sm:text-4xl font-bold leading-tight">
                {selectedArticle.title}
              </h1>

              <div className="p-4 rounded-xl bg-accent/10 border-l-4 border-accent text-xs sm:text-sm text-foreground/90 leading-relaxed font-sans">
                <strong className="text-accent uppercase tracking-wider font-mono block text-[11px] mb-1">
                  ⚡ Key Takeaways / Direct Answer (TL;DR):
                </strong>
                {selectedArticle.tldr_summary || selectedArticle.tldrSummary || selectedArticle.summary}
              </div>

              <div
                id="blog-content"
                className="prose prose-invert max-w-none text-muted-foreground font-sans leading-relaxed text-sm md:text-base"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(
                    selectedArticle.contentMarkdown ||
                    selectedArticle.content_markdown ||
                    selectedArticle.summary ||
                    selectedArticle.tldrSummary
                  ),
                }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
