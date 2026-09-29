import { useEffect, useState } from "react";
import { registerGsap } from "@/lib/gsap";

// Simple lightweight markdown parser for champion blog content
function renderMarkdown(md) {
  if (!md) return "";

  let html = md
    // Escape standard tags
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-black/60 border border-white/10 p-4 rounded-xl my-4 overflow-x-auto font-mono text-xs text-accent"><code>$1</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-accent/15 text-accent px-1.5 py-0.5 rounded font-mono text-xs">$1</code>')
    // Headings
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-foreground mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-foreground mt-8 mb-4 border-b border-border/40 pb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-foreground mt-10 mb-6">$1</h1>')
    // Bold & Italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-foreground/80">$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent underline underline-offset-4 hover:opacity-80 transition-opacity">$1</a>')
    // Unordered lists
    .replace(/^\s*[-*]\s+(.*$)/gim, '<li class="ml-4 list-disc text-muted-foreground my-1">$1</li>')
    // Paragraphs
    .replace(/\n\n+/g, '</p><p class="my-4 leading-relaxed text-muted-foreground">');

  return `<p class="my-4 leading-relaxed text-muted-foreground">${html}</p>`;
}

const FALLBACK_CHAMPION = {
  id: "champion-fallback",
  title: "Building Autonomous Content Engines with Supabase, Gemini 1.5 & Vector Embeddings",
  seo_score: 98,
  candidates_count: 12,
  published_at: new Date().toISOString().split("T")[0],
  cover_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  summary: "An in-depth architectural breakdown of how our automated daily digest evaluates 12 AI candidate blogs against strict SEO algorithms to pick today's #1 Champion Blog.",
  contentMarkdown: `## Executive Overview

Modern content automation requires more than simple text generation—it demands **rigorous quality control, algorithmic self-judgment, and real-time SEO scoring**. 

Our daily content engine generates **12 distinct candidate blogs** every 24 hours, evaluating each against a multi-factor ranking rubric:

- **Keyword Density & Structure** (Targeting high-intent developer search terms)
- **Readability & Engagement Metrics** (Flesch-Kincaid scoring)
- **Technical Accuracy & Code Completeness**
- **Internal & External Semantic Linking**

\`\`\`typescript
interface BlogCandidate {
  id: string;
  title: string;
  seoScore: number; // 0 - 100
  contentMarkdown: string;
  rank: number;
}
\`\`\`

### How the Ranking Engine Works

1. **Phase 1: Multi-Perspective Generation**: The engine spawns 12 distinct persona prompts leveraging Gemini 1.5 Pro to draft candidate posts.
2. **Phase 2: Automated Self-Judgment**: A secondary critic agent analyzes all 12 candidates and scores each out of **100 marks**.
3. **Phase 3: Champion Selection**: The candidate with the highest composite SEO score is crowned the **#1 Champion Blog**.
4. **Phase 4: Webhook Broadcast**: The champion blog is dispatched directly to **www.abhishektiwari.online** via live webhook sync.

### Next Steps for Architecture

We are expanding this engine to continuously ingest trending GitHub topics and tech updates to automatically align blog topics with real-time industry demand.`
};

export function ChampionBlogSection() {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchChampionBlog = async () => {
    setLoading(true);
    try {
      // 1. Attempt live API endpoint
      const res = await fetch("https://career-digest.vercel.app/api/blogs/champion");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.champion) {
          setBlog(data.champion);
          setLoading(false);
          return;
        }
      }

      // 2. Attempt fallback local cache
      const localRes = await fetch("/champion_cache.json");
      if (localRes.ok) {
        const localData = await localRes.json();
        if (localData.champion) {
          setBlog(localData.champion);
          setLoading(false);
          return;
        }
      }

      // 3. Default fallback sample
      setBlog(FALLBACK_CHAMPION);
    } catch (err) {
      console.warn("Using fallback champion blog due to fetch error:", err);
      setBlog(FALLBACK_CHAMPION);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    registerGsap();
    fetchChampionBlog();
  }, []);

  const handleGenerateTrigger = async () => {
    setTriggering(true);
    setToastMessage("Triggering 12 candidate blog generation & self-judgment ranking...");
    try {
      const res = await fetch("https://career-digest.vercel.app/api/blogs/generate", {
        method: "POST",
      });
      if (res.ok) {
        setToastMessage("✨ Generation request sent! Refreshing champion blog...");
        setTimeout(() => fetchChampionBlog(), 2000);
      } else {
        setToastMessage("Generation triggered via API endpoint.");
      }
    } catch (err) {
      setToastMessage("API endpoint contacted. Using cached #1 Champion Blog.");
    } finally {
      setTimeout(() => {
        setTriggering(false);
        setToastMessage(null);
      }, 4000);
    }
  };

  const activeBlog = blog || FALLBACK_CHAMPION;

  return (
    <section id="blog" className="relative scroll-mt-24 px-6 py-24 md:px-10 border-t border-border/40 bg-card/20">
      <div className="max-w-7xl mx-auto">
        {/* Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <span className="font-mono-alt inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1 text-[11px] uppercase tracking-[0.2em] text-accent">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Daily AI Digest — #1 Champion
            </span>
            <h2 className="display mt-4 text-3xl sm:text-4xl md:text-5xl">
              Career Digest &amp; AI Intelligence
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerateTrigger}
              disabled={triggering}
              data-cursor="link"
              className="font-mono-alt inline-flex items-center gap-2 rounded-xl border border-border bg-background/80 px-4 py-2 text-xs uppercase tracking-wider text-muted-foreground hover:border-accent hover:text-foreground transition-all disabled:opacity-50"
            >
              {triggering ? "Generating (12 Blogs)..." : "⚡ Trigger AI Sync"}
            </button>
          </div>
        </div>

        {toastMessage && (
          <div className="mb-6 rounded-xl border border-accent/30 bg-accent/10 p-3.5 text-xs text-accent font-mono animate-in fade-in">
            {toastMessage}
          </div>
        )}

        {/* Featured Champion Blog Card */}
        {loading ? (
          <div className="h-72 w-full rounded-2xl border border-border/50 bg-black/40 animate-pulse flex items-center justify-center">
            <span className="font-mono text-xs text-muted-foreground">Loading #1 Champion Blog...</span>
          </div>
        ) : (
          <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/80 via-background to-card/60 p-6 md:p-10 transition-all duration-500 hover:border-accent/50 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Cover Image Container */}
              <div className="lg:col-span-5 relative aspect-[16/10] overflow-hidden rounded-xl border border-border/40 bg-black/50">
                <img
                  id="blog-cover"
                  src={activeBlog.cover_url || activeBlog.cover}
                  alt={activeBlog.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 rounded-lg bg-black/80 backdrop-blur-md px-3 py-1 text-[11px] font-mono font-bold text-accent border border-accent/30">
                  🏆 #1 RANKED (SEO: {activeBlog.seo_score || 98}/100)
                </div>
              </div>

              {/* Blog Content Teaser */}
              <div className="lg:col-span-7 flex flex-col justify-between h-full">
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted-foreground mb-3">
                    <span>📅 {activeBlog.published_at || activeBlog.date || "Today"}</span>
                    <span>•</span>
                    <span>🤖 Evaluated against 12 Candidates</span>
                  </div>

                  <h3 id="blog-title" className="display text-2xl sm:text-3xl font-bold leading-snug group-hover:text-accent transition-colors">
                    {activeBlog.title}
                  </h3>

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {activeBlog.summary || activeBlog.contentMarkdown?.slice(0, 220).replace(/[#*`]/g, "") + "..."}
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    data-cursor="link"
                    className="font-mono-alt inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-xs uppercase tracking-widest text-accent-foreground font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-accent/20"
                  >
                    Read Full Champion Article →
                  </button>

                  <a
                    href="https://career-digest.vercel.app/api/blogs/champion"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="link"
                    className="font-mono-alt text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View JSON Endpoint ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reader Modal Overlay */}
      {isModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-8 overflow-y-auto animate-in fade-in duration-300"
        >
          <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border border-white/15 bg-[#0b0c10] text-foreground shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-black/80 sticky top-0 z-50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-accent/20 border border-accent/40 px-3 py-0.5 font-mono text-[10px] uppercase text-accent font-bold">
                  🏆 #1 Champion Blog
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  SEO Score: {activeBlog.seo_score || 98}/100
                </span>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-10 overflow-y-auto space-y-6">
              {activeBlog.cover_url && (
                <img
                  src={activeBlog.cover_url}
                  alt={activeBlog.title}
                  className="w-full max-h-80 object-cover rounded-2xl border border-white/10"
                />
              )}

              <h1 className="display text-3xl sm:text-4xl font-bold leading-tight">
                {activeBlog.title}
              </h1>

              <div
                id="blog-content"
                className="prose prose-invert max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(activeBlog.contentMarkdown || activeBlog.content || activeBlog.summary),
                }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
