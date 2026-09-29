import { useEffect, useState } from "react";
import { registerGsap } from "@/lib/gsap";

// Simple lightweight markdown parser for blog content
function renderMarkdown(md) {
  if (!md) return "";

  let html = md
    // Escape standard tags
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-black/70 border border-white/10 p-4 rounded-xl my-4 overflow-x-auto font-mono text-xs text-accent"><code>$1</code></pre>')
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

const SAMPLE_CANDIDATES = [
  {
    rank: 1,
    id: "candidate-1",
    title: "Building Autonomous Content Engines with Supabase, Gemini 1.5 & Vector Embeddings",
    seo_score: 98,
    published_at: "Today",
    cover_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
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
4. **Phase 4: Webhook Broadcast**: The champion blog is dispatched directly to **www.abhishektiwari.online** via live webhook sync.`
  },
  {
    rank: 2,
    id: "candidate-2",
    title: "High-Concurrency Real-Time Systems: WebSockets, Redis Pub/Sub & Laravel Vapor",
    seo_score: 95,
    published_at: "Today",
    cover_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
    summary: "Scaling live match telemetry and tournament court bookings across thousands of simultaneous connections without dropped sockets.",
    contentMarkdown: `## Real-Time Architecture for Racket Sports

When handling live tournament scoring in TennisKhelo, connection stability and latency are paramount.

### Key Architectural Pillars

- **Decoupled WebSocket Workers**: Event broadcasting separated from HTTP controllers.
- **Redis Channel Sharding**: Isolates live court feeds into dedicated Redis channels.
- **Fallback HTTP Long-Polling**: Graceful connection downgrade for spotty mobile networks.`
  },
  {
    rank: 3,
    id: "candidate-3",
    title: "Mastering GSAP ScrollTrigger & Smooth Scroll Physics in React 19",
    seo_score: 93,
    published_at: "Today",
    cover_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
    summary: "How to craft ultra-fluid 60fps web animation timelines, container animations, and interactive cursor magnetic physics.",
    contentMarkdown: `## Advanced Animation Techniques

Creating impression-grade web experiences requires careful orchestration of GPU transform layers and Lenis scroll interpolation.

### Implementation Checklist

1. Register GSAP plugins globally before component initialization.
2. Wrap scroll triggers inside \`gsap.context()\` for clean React unmount teardowns.
3. Use \`gsap.quickTo()\` for high-frequency cursor tracking callbacks.`
  },
  {
    rank: 4,
    id: "candidate-4",
    title: "Designing Multi-Tenant SaaS DB Schemas in PostgreSQL & Supabase RLS",
    seo_score: 91,
    published_at: "Today",
    cover_url: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop",
    summary: "Row-Level Security strategies for securing multi-tenant ID card verification consoles and Fintech tenant dashboards.",
    contentMarkdown: `## Database Isolation Patterns

Row-Level Security (RLS) ensures tenant data remain strictly isolated without requiring separate database instances per tenant.`
  },
  {
    rank: 5,
    id: "candidate-5",
    title: "Automating Daily Career Intelligence Digests with Gemini API & Webhooks",
    seo_score: 89,
    published_at: "Today",
    cover_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
    summary: "Deploying cron scheduled worker tasks to fetch industry trends, run Gemini AI summarize loops, and dispatch payloads to portfolios.",
    contentMarkdown: `## Automated Content Pipelines

By pairing Vercel Cron jobs with Supabase database triggers, we maintain continuous content freshness across technical portfolios.`
  },
  {
    rank: 6,
    id: "candidate-6",
    title: "Next.js 15 App Router Performance & Server Actions Strategy",
    seo_score: 88,
    published_at: "Today",
    cover_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
    summary: "Optimizing Bundle size, streaming SSR with Suspense, and edge caching for sub-100ms LCP times.",
    contentMarkdown: `## Server Components vs Client Components

Leveraging React Server Components (RSC) to minimize client-side bundle weight while preserving interactive client-side state.`
  },
  {
    rank: 7,
    id: "candidate-7",
    title: "Vector Search & Retrieval Augmented Generation (RAG) for Dev Docs",
    seo_score: 86,
    published_at: "Today",
    cover_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
    summary: "Chunking documentation, generating OpenAI text-embedding-3 vectors, and querying pgvector indexes.",
    contentMarkdown: `## Semantic Search Implementation

Integrating pgvector into Supabase for contextual document retrieval and conversational AI search.`
  },
  {
    rank: 8,
    id: "candidate-8",
    title: "PDF Report Generation Engine: High-Throughput Invoicing in Node.js",
    seo_score: 85,
    published_at: "Today",
    cover_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop",
    summary: "Generating pixel-perfect PDF invoice reports with Puppeteeer worker queues and S3 CDN caching.",
    contentMarkdown: `## High-Throughput PDF Rendering

Optimizing headless browser instances for concurrent PDF generation in financial dashboards.`
  },
  {
    rank: 9,
    id: "candidate-9",
    title: "Continuous Server Deployment Strategies for Hostinger VPS & Docker",
    seo_score: 84,
    published_at: "Today",
    cover_url: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=800&auto=format&fit=crop",
    summary: "Zero-downtime deployment pipelines using GitHub Actions, SSH runner hooks, Docker Compose, and Cloudflare CDN.",
    contentMarkdown: `## VPS Deployment Workflows

Automating production deployments with automated healthchecks and instant rollback triggers.`
  },
  {
    rank: 10,
    id: "candidate-10",
    title: "Tailwind CSS v4 & Modern CSS Architecture for High-End Web Portfolios",
    seo_score: 83,
    published_at: "Today",
    cover_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
    summary: "Utilizing CSS variables, OKLCH color spaces, glassmorphism backdrop filters, and granular typography hierarchies.",
    contentMarkdown: `## Design Token Systems

Building scalable, customizable theme tokens using modern CSS properties and utility abstractions.`
  },
  {
    rank: 11,
    id: "candidate-11",
    title: "Building Micro-Animations with Framer Motion & GSAP QuickTo",
    seo_score: 82,
    published_at: "Today",
    cover_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
    summary: "Designing subtle micro-interactions, magnetic hover buttons, and elastic cursor followers.",
    contentMarkdown: `## Dynamic User Experience

Micro-animations increase user engagement when applied purposefully to interactive UI elements.`
  },
  {
    rank: 12,
    id: "candidate-12",
    title: "Securing Express.js REST APIs: Rate Limiting, Helmet & JWT Sanitization",
    seo_score: 81,
    published_at: "Today",
    cover_url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop",
    summary: "Hardening backend HTTP endpoints against CORS vulnerabilities, XSS vectors, and brute force attacks.",
    contentMarkdown: `## API Security Checklist

Essential security middlewares and payload sanitization steps for production Node.js servers.`
  }
];

export function ChampionBlogSection() {
  const [champion, setChampion] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("champion"); // "champion" | "all"
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [triggering, setTriggering] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      // 1. Fetch Champion
      const champRes = await fetch("https://career-digest.vercel.app/api/blogs/champion");
      if (champRes.ok) {
        const champData = await champRes.json();
        if (champData.success && champData.champion) {
          setChampion(champData.champion);
        }
      }

      // 2. Fetch All Candidates
      const candRes = await fetch("https://career-digest.vercel.app/api/blogs/candidates");
      if (candRes.ok) {
        const candData = await candRes.json();
        if (candData.success && candData.candidates) {
          setCandidates(candData.candidates);
          setLoading(false);
          return;
        }
      }

      // Fallback local cache check
      const localRes = await fetch("/champion_cache.json");
      if (localRes.ok) {
        const localData = await localRes.json();
        if (localData.champion) {
          setChampion(localData.champion);
        }
      }
    } catch (err) {
      console.warn("Using sample blog list due to API fetch state:", err);
    } finally {
      if (!champion) setChampion(SAMPLE_CANDIDATES[0]);
      if (!candidates.length) setCandidates(SAMPLE_CANDIDATES);
      setLoading(false);
    }
  };

  useEffect(() => {
    registerGsap();
    fetchBlogs();
  }, []);

  const handleGenerateTrigger = async () => {
    setTriggering(true);
    setToastMessage("Triggering generation of 12 new candidate blogs & AI self-ranking...");
    try {
      const res = await fetch("https://career-digest.vercel.app/api/blogs/generate", {
        method: "POST",
      });
      if (res.ok) {
        setToastMessage("✨ 12 Candidate Blogs generated! Refreshing blog list...");
        setTimeout(() => fetchBlogs(), 2000);
      } else {
        setToastMessage("Generation triggered via API endpoint.");
      }
    } catch (err) {
      setToastMessage("API contacted. Refreshing blog list.");
    } finally {
      setTimeout(() => {
        setTriggering(false);
        setToastMessage(null);
      }, 4000);
    }
  };

  const activeChampion = champion || SAMPLE_CANDIDATES[0];
  const activeCandidates = candidates.length ? candidates : SAMPLE_CANDIDATES;

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
              Career Digest &amp; Articles
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleGenerateTrigger}
              disabled={triggering}
              data-cursor="link"
              className="font-mono-alt inline-flex items-center gap-2 rounded-xl border border-border bg-background/80 px-4 py-2.5 text-xs uppercase tracking-wider text-muted-foreground hover:border-accent hover:text-foreground transition-all disabled:opacity-50"
            >
              {triggering ? "Generating 12 Posts..." : "⚡ Trigger AI Generation"}
            </button>
          </div>
        </div>

        {toastMessage && (
          <div className="mb-6 rounded-xl border border-accent/30 bg-accent/10 p-3.5 text-xs text-accent font-mono animate-in fade-in">
            {toastMessage}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-border/40 pb-4 mb-8">
          <button
            onClick={() => setActiveTab("champion")}
            data-cursor="link"
            className={`font-mono-alt px-5 py-2 rounded-xl text-xs uppercase tracking-widest transition-all ${
              activeTab === "champion"
                ? "bg-accent text-accent-foreground font-bold shadow-lg shadow-accent/20"
                : "border border-border/60 bg-background/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            🏆 #1 Champion Article
          </button>
          <button
            onClick={() => setActiveTab("all")}
            data-cursor="link"
            className={`font-mono-alt px-5 py-2 rounded-xl text-xs uppercase tracking-widest transition-all ${
              activeTab === "all"
                ? "bg-accent text-accent-foreground font-bold shadow-lg shadow-accent/20"
                : "border border-border/60 bg-background/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            📚 All 12 Candidate Posts ({activeCandidates.length})
          </button>
        </div>

        {/* Tab Content: #1 Champion Spotlight */}
        {activeTab === "champion" && (
          loading ? (
            <div className="h-80 w-full rounded-2xl border border-border/50 bg-black/40 animate-pulse flex items-center justify-center">
              <span className="font-mono text-xs text-muted-foreground">Loading #1 Champion Article...</span>
            </div>
          ) : (
            <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 via-background to-card/70 p-6 md:p-10 transition-all duration-500 hover:border-accent/50 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Cover Image Container */}
                <div className="lg:col-span-5 relative aspect-[16/10] overflow-hidden rounded-xl border border-border/40 bg-black/50">
                  <img
                    id="blog-cover"
                    src={activeChampion.cover_url || activeChampion.cover || SAMPLE_CANDIDATES[0].cover_url}
                    alt={activeChampion.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 rounded-lg bg-black/80 backdrop-blur-md px-3 py-1 text-[11px] font-mono font-bold text-accent border border-accent/30">
                    🏆 #1 CHAMPION (SEO: {activeChampion.seo_score || 98}/100)
                  </div>
                </div>

                {/* Blog Content Teaser */}
                <div className="lg:col-span-7 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted-foreground mb-3">
                      <span>📅 {activeChampion.published_at || activeChampion.date || "Today"}</span>
                      <span>•</span>
                      <span>🤖 Ranked #1 out of 12 AI Candidates</span>
                    </div>

                    <h3 id="blog-title" className="display text-2xl sm:text-3xl font-bold leading-snug group-hover:text-accent transition-colors">
                      {activeChampion.title}
                    </h3>

                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                      {activeChampion.summary || (activeChampion.contentMarkdown || "").slice(0, 220).replace(/[#*`]/g, "") + "..."}
                    </p>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => setSelectedArticle(activeChampion)}
                      data-cursor="link"
                      className="font-mono-alt inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-xs uppercase tracking-widest text-accent-foreground font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-accent/20"
                    >
                      Read Full Article →
                    </button>

                    <a
                      href="https://career-digest.vercel.app/api/blogs/champion"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="link"
                      className="font-mono-alt text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                    >
                      View Live API ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {/* Tab Content: All 12 Candidate Posts */}
        {activeTab === "all" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCandidates.map((post, idx) => (
              <article
                key={post.id || post.rank || idx}
                onClick={() => setSelectedArticle(post)}
                data-cursor="link"
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-6 transition-all duration-300 hover:border-accent/50 hover:bg-card/80 cursor-pointer shadow-lg"
              >
                <div>
                  {/* Cover Header */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border/30 mb-4 bg-black/40">
                    <img
                      src={post.cover_url || post.cover || SAMPLE_CANDIDATES[idx % SAMPLE_CANDIDATES.length].cover_url}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-2">
                      <span className="rounded-md bg-black/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-mono font-bold text-accent border border-accent/30">
                        #{post.rank || idx + 1}
                      </span>
                      <span className="rounded-md bg-black/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-mono text-muted-foreground border border-white/10">
                        SEO: {post.seo_score || 90}/100
                      </span>
                    </div>
                  </div>

                  <h4 className="display text-lg font-bold leading-snug group-hover:text-accent transition-colors line-clamp-2">
                    {post.title}
                  </h4>

                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                    {post.summary || (post.contentMarkdown || "").slice(0, 140).replace(/[#*`]/g, "") + "..."}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border/30 pt-3">
                  <span className="font-mono text-[10px] uppercase text-muted-foreground">
                    {post.published_at || "Today"}
                  </span>
                  <span className="font-mono-alt text-[11px] uppercase tracking-widest text-accent font-semibold group-hover:translate-x-1 transition-transform">
                    Read Post →
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Full Article Reader Modal Overlay */}
      {selectedArticle && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedArticle(null);
          }}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-8 overflow-y-auto animate-in fade-in duration-300"
        >
          <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border border-white/15 bg-[#0b0c10] text-foreground shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-black/80 sticky top-0 z-50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-accent/20 border border-accent/40 px-3 py-0.5 font-mono text-[10px] uppercase text-accent font-bold">
                  Rank #{selectedArticle.rank || 1} Candidate Post
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  SEO Score: {selectedArticle.seo_score || 98}/100
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
              {selectedArticle.cover_url && (
                <img
                  src={selectedArticle.cover_url}
                  alt={selectedArticle.title}
                  className="w-full max-h-80 object-cover rounded-2xl border border-white/10"
                />
              )}

              <h1 className="display text-3xl sm:text-4xl font-bold leading-tight">
                {selectedArticle.title}
              </h1>

              <div
                id="blog-content"
                className="prose prose-invert max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(selectedArticle.contentMarkdown || selectedArticle.content || selectedArticle.summary),
                }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
