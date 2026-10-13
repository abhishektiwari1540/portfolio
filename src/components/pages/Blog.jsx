import { useEffect, useState, useMemo } from "react";
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

const FALLBACK_WINNERS = [
  {
    title: "TypeScript Clean Architecture: Enterprise-Grade Domain Modeling & Microservices",
    slug: "typescript-clean-architecture-enterprise-microservices",
    targetKeyword: "TypeScript Clean Architecture Microservices",
    metaDescription: "Master enterprise clean architecture in TypeScript. Implement domain-driven design, repositories, dependency injection, and microservices.",
    tldrSummary: "Implement Clean Architecture with TypeScript using decoupled Domain Entities, Use Cases, Interfaces, and Dependency Injection to scale microservices effortlessly.",
    seoScore: 96,
    publishedAt: "Today",
    coverUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200",
    hashtags: ["#TypeScript", "#CleanArchitecture", "#Microservices", "#NodeJS"],
    contentMarkdown: "## Core Architectural Principles\n\nClean Architecture separates concerns by keeping business domain logic independent of external frameworks, databases, and UI components.\n\n```typescript\nexport interface IUserRepository {\n  findById(id: string): Promise<User | null>;\n  save(user: User): Promise<void>;\n}\n\nexport class RegisterUserUseCase {\n  constructor(private userRepo: IUserRepository) {}\n  async execute(dto: RegisterUserDto): Promise<User> {\n    const user = new User(dto.email, dto.name);\n    await this.userRepo.save(user);\n    return user;\n  }\n}\n```\n\n## Frequently Asked Questions\n\n### How does Clean Architecture scale?\nBy keeping use-cases pure and isolated, testing is deterministic and teams can deploy microservices without cascading dependencies."
  },
  {
    title: "Building High-Concurrency Node.js Microservices: Patterns & Pitfalls",
    slug: "building-high-concurrency-nodejs-microservices",
    targetKeyword: "Node.js microservices concurrency",
    metaDescription: "Learn how we built and scaled high-concurrency Node.js microservices handling 50k+ requests with clustering, event loops, and worker threads.",
    tldrSummary: "Discover battle-tested concurrency patterns in Node.js microservices: cluster module, worker thread pools, backpressure streaming, and memory leak prevention.",
    seoScore: 95,
    publishedAt: "Yesterday",
    coverUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200",
    hashtags: ["#NodeJS", "#Microservices", "#Backend", "#Scalability"],
    contentMarkdown: "## Event Loop & Clustering\n\nTo maximize multiple CPU cores, leverage the native Node.js cluster module and worker threads for CPU-bound computations.\n\n```typescript\nimport cluster from \"node:cluster\";\nimport os from \"node:os\";\n\nif (cluster.isPrimary) {\n  const numCPUs = os.cpus().length;\n  for (let i = 0; i < numCPUs; i++) cluster.fork();\n}\n```"
  },
  {
    title: "Architecting Real-Time Vector Search with Supabase pgvector and Gemini 3.6",
    slug: "architecting-realtime-vector-search-supabase-pgvector-gemini",
    targetKeyword: "Supabase pgvector Gemini vector search",
    metaDescription: "Step-by-step production architecture for hybrid vector search using Supabase pgvector HNSW indexing and Google Gemini 3.6 embeddings in Node.js.",
    tldrSummary: "Implement low-latency semantic search using Gemini 3.6 embedding models and Supabase pgvector HNSW cosine similarity queries in Node.js.",
    seoScore: 94,
    publishedAt: "2 days ago",
    coverUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200",
    hashtags: ["#Supabase", "#pgvector", "#Gemini", "#AI"],
    contentMarkdown: "## Vector Search with HNSW Indexing\n\nVector databases allow instant semantic retrieval. By applying HNSW indexing over pgvector columns, queries run in under 12 milliseconds."
  }
];

export function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [champion, setChampion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    registerGsap();
    window.scrollTo({ top: 0, behavior: "smooth" });

    const params = new URLSearchParams(window.location.search);
    const slugParam = params.get("slug");

    async function loadBlogsArchive() {
      setLoading(true);
      try {
        const res = await fetch("https://career-digest.vercel.app/api/blogs");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            const list = data.blogs && data.blogs.length > 0 ? data.blogs : FALLBACK_WINNERS;
            setBlogs(list);
            const champ = data.champion || list[0];
            setChampion(champ);

            if (slugParam) {
              const matched = list.find((b) => b.slug === slugParam) || champ;
              setSelectedArticle(matched);
            }
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Using fallback blogs archive:", err);
      }
      setBlogs(FALLBACK_WINNERS);
      setChampion(FALLBACK_WINNERS[0]);
      if (slugParam) {
        const matched = FALLBACK_WINNERS.find((b) => b.slug === slugParam) || FALLBACK_WINNERS[0];
        setSelectedArticle(matched);
      }
      setLoading(false);
    }

    loadBlogsArchive();
  }, []);

  useEffect(() => {
    if (selectedArticle) {
      const url = new URL(window.location.href);
      url.searchParams.set("slug", selectedArticle.slug);
      window.history.pushState({}, "", url.toString());

      let schemaScript = document.getElementById("blog-article-jsonld");
      if (!schemaScript) {
        schemaScript = document.createElement("script");
        schemaScript.id = "blog-article-jsonld";
        schemaScript.type = "application/ld+json";
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: selectedArticle.title,
        description: selectedArticle.metaDescription || selectedArticle.tldrSummary,
        url: window.location.href,
        datePublished: selectedArticle.publishedAt,
        author: {
          "@type": "Person",
          name: "Abhishek Tiwari",
          url: "https://www.abhishektiwari.online/"
        }
      });
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete("slug");
      window.history.pushState({}, "", url.pathname);
    }
  }, [selectedArticle]);

  const allTags = useMemo(() => {
    const set = new Set(["All"]);
    blogs.forEach((b) => {
      (b.hashtags || []).forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchesSearch =
        !searchQuery ||
        b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.targetKeyword?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tldrSummary?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag =
        selectedTag === "All" ||
        (b.hashtags && b.hashtags.includes(selectedTag));

      return matchesSearch && matchesTag;
    });
  }, [blogs, searchQuery, selectedTag]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-28 pb-32 px-6 md:px-12 selection:bg-accent/30 selection:text-accent">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/40">
          <Link
            to="/"
            data-cursor="link"
            className="font-mono-alt text-xs uppercase tracking-widest text-muted-foreground hover:text-accent flex items-center gap-2 transition-colors"
          >
            ← Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="font-mono-alt text-[11px] uppercase tracking-widest text-accent font-semibold">
              Daily Auto-Sync Engine Active
            </span>
          </div>
        </div>

        <div className="max-w-4xl mb-12">
          <span className="font-mono-alt inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1 text-[11px] uppercase tracking-[0.2em] text-accent">
            🏆 Daily AI Champion Blog Archive
          </span>
          <h1 className="display mt-4 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08]">
            Architectural Deep Dives &amp; Technical Articles
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed font-sans max-w-3xl">
            Each day, an automated 12-blog competition runs across distributed systems, Node.js, and AI.
            Only the highest-scoring winner is selected and stored in this permanent archive.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-border/40">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search articles, topics, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border/60 bg-card/60 px-4 py-2.5 pl-10 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
            />
            <span className="absolute left-3.5 top-2.5 text-muted-foreground text-xs">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {allTags.slice(0, 6).map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                data-cursor="link"
                className={`font-mono-alt px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-wider transition-all ${
                  selectedTag === tag
                    ? "bg-accent text-accent-foreground font-bold shadow-md shadow-accent/20"
                    : "border border-border/60 bg-background/50 text-muted-foreground hover:text-foreground hover:border-accent/50"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {!searchQuery && selectedTag === "All" && champion && (
          <div className="mb-14">
            <div className="group relative overflow-hidden rounded-2xl border border-accent/40 bg-gradient-to-br from-card via-background to-card/60 p-6 md:p-10 shadow-2xl transition-all hover:border-accent">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 relative aspect-[16/10] overflow-hidden rounded-xl border border-border/40 bg-black/60">
                  <img
                    src={champion.coverUrl || champion.cover_url || FALLBACK_WINNERS[0].coverUrl}
                    alt={champion.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 rounded-lg bg-black/80 backdrop-blur-md px-3 py-1 text-[11px] font-mono font-bold text-accent border border-accent/40">
                    🏆 TODAY'S #1 CHAMPION (SEO: {champion.seoScore || champion.seo_score || 96}/100)
                  </div>
                </div>

                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted-foreground mb-3">
                      <span>📅 {champion.publishedAt || champion.published_at || "Today"}</span>
                      <span>•</span>
                      <span className="text-accent">Focus: {champion.targetKeyword || champion.target_keyword}</span>
                    </div>

                    <h2 className="display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight group-hover:text-accent transition-colors">
                      {champion.title}
                    </h2>

                    <div className="mt-4 p-4 rounded-xl bg-accent/10 border-l-4 border-accent text-xs sm:text-sm text-foreground/90 leading-relaxed font-sans">
                      <strong className="text-accent uppercase tracking-wider font-mono block text-[11px] mb-1">
                        ⚡ Direct Answer &amp; Key Takeaway:
                      </strong>
                      {champion.tldrSummary || champion.tldr_summary || champion.metaDescription}
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => setSelectedArticle(champion)}
                      data-cursor="link"
                      className="font-mono-alt inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-xs uppercase tracking-widest text-accent-foreground font-bold hover:opacity-90 transition-opacity shadow-lg shadow-accent/25"
                    >
                      Read Full Article Details →
                    </button>
                    <span className="font-mono text-xs text-muted-foreground">
                      Full Markdown • Production Code • FAQ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="display text-2xl sm:text-3xl font-bold">
              {searchQuery ? `Search Results for "${searchQuery}"` : "All Saved Winner Articles"}
            </h2>
            <p className="font-mono text-xs text-muted-foreground mt-1">
              Showing {filteredBlogs.length} archived winner {filteredBlogs.length === 1 ? "article" : "articles"}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl border border-border/40 bg-card/30 animate-pulse" />
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-20 border border-border/40 rounded-2xl bg-card/20">
            <span className="text-3xl">🔍</span>
            <h3 className="display text-xl font-bold mt-4">No matching articles found</h3>
            <p className="text-xs font-mono text-muted-foreground mt-2">
              Try adjusting your search query or selecting a different topic tag.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedTag("All"); }}
              className="mt-4 font-mono-alt text-xs uppercase tracking-widest text-accent hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((post, idx) => (
              <article
                key={post.slug || idx}
                onClick={() => setSelectedArticle(post)}
                data-cursor="link"
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-6 transition-all duration-300 hover:border-accent/60 hover:bg-card/80 cursor-pointer shadow-lg hover:shadow-2xl"
              >
                <div>
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border/30 mb-4 bg-black/50">
                    <img
                      src={post.coverUrl || post.cover_url || FALLBACK_WINNERS[idx % FALLBACK_WINNERS.length].coverUrl}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                      <span className="rounded-md bg-black/85 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-mono font-bold text-accent border border-accent/40">
                        🏆 Winner
                      </span>
                      <span className="rounded-md bg-black/85 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-mono text-foreground/80 border border-white/10">
                        SEO: {post.seoScore || post.seo_score || 95}/100
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground mb-2">
                    <span>📅 {post.publishedAt || post.published_at || "Recent"}</span>
                    <span>•</span>
                    <span className="text-accent/90">{post.targetKeyword || "Technical Deep Dive"}</span>
                  </div>

                  <h3 className="display text-lg font-bold leading-snug group-hover:text-accent transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                    {post.tldrSummary || post.tldr_summary || post.metaDescription || (post.contentMarkdown || "").slice(0, 160).replace(/[#*`]/g, "") + "..."}
                  </p>
                </div>

                <div className="mt-6 border-t border-border/30 pt-4 flex items-center justify-between">
                  <div className="flex gap-1.5 flex-wrap">
                    {(post.hashtags || []).slice(0, 2).map((t) => (
                      <span key={t} className="text-[10px] font-mono text-muted-foreground bg-accent/5 px-2 py-0.5 rounded border border-accent/20">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="font-mono-alt text-[11px] uppercase tracking-wider text-accent font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Details →
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {selectedArticle && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedArticle(null);
          }}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-8 overflow-y-auto animate-in fade-in duration-300"
        >
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-3xl border border-border/80 bg-background shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-border/50 px-6 py-4 bg-background/90 sticky top-0 z-50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="font-mono-alt text-xs uppercase tracking-widest text-muted-foreground hover:text-accent flex items-center gap-1 transition-colors"
                >
                  ← Back to Articles
                </button>
                <span className="hidden sm:inline text-border">|</span>
                <span className="hidden sm:inline-flex rounded-full bg-accent/15 border border-accent/40 px-3 py-0.5 font-mono text-[10px] uppercase text-accent font-bold">
                  🏆 Winner Blog (Score: {selectedArticle.seoScore || selectedArticle.seo_score || 96}/100)
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  data-cursor="link"
                  className="font-mono-alt text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-lg border border-border/60 hover:border-accent text-muted-foreground hover:text-foreground transition-all"
                >
                  {copyFeedback ? "✓ Link Copied!" : "🔗 Share"}
                </button>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="rounded-full p-2 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 md:p-10 overflow-y-auto space-y-8">
              {selectedArticle.coverUrl && (
                <div className="relative w-full max-h-96 overflow-hidden rounded-2xl border border-border/50 bg-black/40">
                  <img
                    src={selectedArticle.coverUrl || selectedArticle.cover_url}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover max-h-96"
                  />
                </div>
              )}

              <div>
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted-foreground mb-3">
                  <span>📅 Published: {selectedArticle.publishedAt || selectedArticle.published_at || "Today"}</span>
                  <span>•</span>
                  <span>✍️ Abhishek Tiwari</span>
                  <span>•</span>
                  <span className="text-accent font-semibold">SEO Evaluated: {selectedArticle.seoScore || selectedArticle.seo_score || 96}/100</span>
                </div>

                <h1 className="display text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
                  {selectedArticle.title}
                </h1>

                <div className="mt-3 flex flex-wrap gap-2">
                  {(selectedArticle.hashtags || []).map((t) => (
                    <span key={t} className="text-xs font-mono text-accent bg-accent/10 px-2.5 py-1 rounded-md border border-accent/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border-l-4 border-accent bg-accent/10 p-5 md:p-6">
                <strong className="text-accent font-mono text-xs uppercase tracking-widest block mb-2">
                  ⚡ Key Takeaways / Direct Answer (TL;DR):
                </strong>
                <p className="text-sm md:text-base text-foreground/90 leading-relaxed font-sans">
                  {selectedArticle.tldrSummary || selectedArticle.tldr_summary || selectedArticle.metaDescription}
                </p>
              </div>

              <div
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

              <div className="border-t border-border/50 pt-8 mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-accent/20 border border-accent/50 flex items-center justify-center font-bold text-accent font-mono text-lg">
                    AT
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Abhishek Tiwari</h4>
                    <p className="text-xs font-mono text-muted-foreground">Full Stack Developer &amp; Systems Engineer</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href="https://www.linkedin.com/in/abhishektiwarii-dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono-alt text-xs uppercase text-muted-foreground hover:text-accent transition-colors"
                  >
                    LinkedIn ↗
                  </a>
                  <span className="text-border">•</span>
                  <a
                    href="https://github.com/abhishektiwari1540"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono-alt text-xs uppercase text-muted-foreground hover:text-accent transition-colors"
                  >
                    GitHub ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
