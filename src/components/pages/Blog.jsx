import { useEffect, useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { registerGsap } from "@/lib/gsap";
import { useSplitReveal } from "@/components/site/useSplitReveal";
import { Footer } from "@/components/site/Footer";

function renderMarkdown(md) {
  if (!md) return "";

  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Code blocks with syntax header and Copy button
    .replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const displayLang = lang || "code";
      return `<div class="code-block-container my-6 rounded-2xl overflow-hidden border border-border/60 bg-secondary/40 shadow-xl">
        <div class="flex items-center justify-between px-4 py-2.5 border-b border-border/50 bg-card/60">
          <span class="text-[11px] font-mono text-accent uppercase tracking-wider font-semibold">${displayLang}</span>
          <button type="button" data-copy-code class="copy-code-btn inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground text-[10px] font-mono uppercase tracking-wider transition-all border border-border/40">
            <span>Copy</span>
          </button>
        </div>
        <pre class="p-4 overflow-x-auto font-mono text-xs text-foreground/90 leading-relaxed bg-card/50"><code>${code}</code></pre>
      </div>`;
    })
    .replace(/```([\s\S]*?)```/g, (match, code) => {
      return `<div class="code-block-container my-6 rounded-2xl overflow-hidden border border-border/60 bg-secondary/40 shadow-xl">
        <div class="flex items-center justify-between px-4 py-2.5 border-b border-border/50 bg-card/60">
          <span class="text-[11px] font-mono text-accent uppercase tracking-wider font-semibold">Snippet</span>
          <button type="button" data-copy-code class="copy-code-btn inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground text-[10px] font-mono uppercase tracking-wider transition-all border border-border/40">
            <span>Copy</span>
          </button>
        </div>
        <pre class="p-4 overflow-x-auto font-mono text-xs text-foreground/90 leading-relaxed bg-card/50"><code>${code}</code></pre>
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

const DEFAULT_FILTER_TAGS = ["All", "#TypeScript", "#NodeJS", "#Microservices", "#AI", "#Architecture"];

const FALLBACK_WINNERS = [
  {
    title: "TypeScript Clean Code Architecture for Enterprise Microservices",
    slug: "typescript-clean-code-architecture-enterprise",
    targetKeyword: "TypeScript Clean Architecture Microservices",
    metaDescription: "Master enterprise clean architecture in TypeScript. Implement domain-driven design, repositories, dependency injection, and microservices.",
    tldrSummary: "Implement Clean Architecture with TypeScript using decoupled Domain Entities, Use Cases, Interfaces, and Dependency Injection to scale microservices effortlessly.",
    seoScore: 96,
    publishedAt: "2026-10-13",
    coverUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
    hashtags: ["#TypeScript", "#CleanCode", "#DesignPatterns", "#Enterprise"],
    contentMarkdown: `## Core Architectural Principles\n\nClean Architecture separates concerns by keeping business domain logic independent of external frameworks, databases, and UI components.\n\n\`\`\`typescript\nexport interface IUserRepository {\n  findById(id: string): Promise<User | null>;\n  save(user: User): Promise<void>;\n}\n\nexport class RegisterUserUseCase {\n  constructor(private userRepo: IUserRepository) {}\n  async execute(dto: RegisterUserDto): Promise<User> {\n    const user = new User(dto.email, dto.name);\n    await this.userRepo.save(user);\n    return user;\n  }\n}\n\`\`\`\n\n## Frequently Asked Questions\n\n### How does Clean Architecture scale?\nBy keeping use-cases pure and isolated, testing is deterministic and teams can deploy microservices without cascading dependencies.`
  },
  {
    title: "Generative AI RAG Pipeline Design with Hybrid Keyword & Embedding Search",
    slug: "generative-ai-rag-pipeline-hybrid-search",
    targetKeyword: "Generative AI RAG Pipeline Hybrid Search",
    metaDescription: "Architect production Retrieval-Augmented Generation (RAG) pipelines combining BM25 keyword matching with dense pgvector embeddings.",
    tldrSummary: "Combine sparse lexical BM25 indexing with dense vector embeddings in Supabase pgvector to achieve sub-50ms hybrid retrieval for AI agents.",
    seoScore: 92,
    publishedAt: "2026-10-13",
    coverUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    hashtags: ["#AI", "#RAG", "#VectorSearch", "#Architecture"],
    contentMarkdown: `## Hybrid Search Architecture\n\nPure vector search frequently hallucinates on exact product codes and specific entity names. By blending dense embeddings with sparse BM25 indices, retrieval accuracy jumps significantly.\n\n\`\`\`sql\nCREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);\nCREATE INDEX ON documents USING gin (to_tsvector('english', content));\n\`\`\``
  },
  {
    title: "Securing REST APIs: OAuth2, JWT, and Rate Limiting",
    slug: "securing-rest-apis-oauth2-jwt-rate-limiting",
    targetKeyword: "Securing REST APIs OAuth2 JWT Rate Limiting",
    metaDescription: "Hardening production Node.js & Laravel REST APIs with token rotation, sliding rate limiters, and cryptographically verified claims.",
    tldrSummary: "Protect enterprise endpoints against brute force and token theft using Redis sliding-window rate limiters, asymmetric JWT signing, and secure cookie storage.",
    seoScore: 92,
    publishedAt: "2026-10-13",
    coverUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80",
    hashtags: ["#NodeJS", "#Security", "#REST", "#Architecture"],
    contentMarkdown: `## Token Security & Validation\n\nAlways verify audience and issuer claims while rotating secret keys on a zero-trust model.`
  },
  {
    title: "Automating CI/CD Pipelines with GitHub Actions, Docker & Kubernetes",
    slug: "automating-cicd-github-actions-docker-k8s",
    targetKeyword: "Automating CI CD GitHub Actions Docker Kubernetes",
    metaDescription: "Build zero-downtime automated deployment pipelines with multi-stage Docker builds, vulnerability scanning, and rolling Kubernetes deploys.",
    tldrSummary: "Streamline release engineering by pairing GitHub Actions matrix workflows with cached multi-stage Docker images and automated health checks.",
    seoScore: 92,
    publishedAt: "2026-10-13",
    coverUrl: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=1200&auto=format&fit=crop&q=80",
    hashtags: ["#DevOps", "#Docker", "#Kubernetes", "#Microservices"],
    contentMarkdown: `## Multi-Stage Docker Builds\n\nKeep production images tiny by separating build tools from minimal Alpine/distroless runtime containers.`
  },
  {
    title: "SEO Masterclass for Developers: Structured JSON-LD, Dynamic OpenGraph & SSR",
    slug: "seo-masterclass-developers-jsonld-opengraph",
    targetKeyword: "Technical SEO Structured JSON LD OpenGraph SSR",
    metaDescription: "A developer guide to technical SEO: Schema.org JSON-LD injection, server-side metadata generation, and Core Web Vitals optimization.",
    tldrSummary: "Maximize developer portfolio search rankings by serving validated Schema.org BlogPosting metadata, canonical links, and pre-rendered social cards.",
    seoScore: 92,
    publishedAt: "2026-10-13",
    coverUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80",
    hashtags: ["#SEO", "#TypeScript", "#WebDev", "#Architecture"],
    contentMarkdown: `## Structured Data Implementation\n\nSearch engines rely on Schema.org JSON-LD to understand author identity, publishing timestamps, and technical concepts.`
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

  const header = useSplitReveal({ by: "words", scroll: false, stagger: 0.05 });

  useEffect(() => {
    registerGsap();
    window.scrollTo({ top: 0, behavior: "smooth" });

    const params = new URLSearchParams(window.location.search);
    const slugParam = params.get("slug");

    async function loadBlogsArchive() {
      setLoading(true);
      try {
        // Fetch champion and all saved winner blogs
        const [champRes, allRes] = await Promise.all([
          fetch("https://career-digest.vercel.app/api/blogs/champion").catch(() => null),
          fetch("https://career-digest.vercel.app/api/blogs").catch(() => null)
        ]);

        let champData = null;
        let allData = null;

        if (champRes && champRes.ok) {
          champData = await champRes.json();
        }
        if (allRes && allRes.ok) {
          allData = await allRes.json();
        }

        const list = allData?.blogs && allData.blogs.length > 0
          ? allData.blogs
          : FALLBACK_WINNERS;

        setBlogs(list);

        const currentChamp = champData?.champion || allData?.champion || list[0];
        setChampion(currentChamp);

        // Deep linking handling for ?slug=<slug>
        if (slugParam) {
          let matched = list.find((b) => b.slug === slugParam);
          if (!matched && slugParam) {
            try {
              const singleRes = await fetch(`https://career-digest.vercel.app/api/blogs/${encodeURIComponent(slugParam)}`);
              if (singleRes.ok) {
                const singleData = await singleRes.json();
                if (singleData.success && singleData.blog) {
                  matched = singleData.blog;
                }
              }
            } catch (err) {
              console.warn("Single blog fetch failed:", err);
            }
          }
          if (matched) {
            setSelectedArticle(matched);
          }
        }
        setLoading(false);
      } catch (err) {
        console.warn("Error loading blog archive, using fallback:", err);
        setBlogs(FALLBACK_WINNERS);
        setChampion(FALLBACK_WINNERS[0]);
        if (slugParam) {
          const matched = FALLBACK_WINNERS.find((b) => b.slug === slugParam) || FALLBACK_WINNERS[0];
          setSelectedArticle(matched);
        }
        setLoading(false);
      }
    }

    loadBlogsArchive();
  }, []);

  // Sync URL query param & Inject SEO JSON-LD on active article change
  useEffect(() => {
    if (selectedArticle && selectedArticle.slug) {
      const url = new URL(window.location.href);
      url.searchParams.set("slug", selectedArticle.slug);
      window.history.pushState({}, "", url.toString());

      // Update Page Title
      document.title = `${selectedArticle.title} — Abhishek Tiwari`;

      // Inject BlogPosting JSON-LD Schema
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
        image: selectedArticle.coverUrl,
        url: window.location.href,
        datePublished: selectedArticle.publishedAt,
        author: {
          "@type": "Person",
          name: "Abhishek Tiwari",
          jobTitle: "Lead Full Stack Developer & Systems Engineer",
          url: "https://www.abhishektiwari.online/"
        },
        publisher: {
          "@type": "Person",
          name: "Abhishek Tiwari",
          url: "https://www.abhishektiwari.online/"
        }
      });
    } else {
      const url = new URL(window.location.href);
      if (url.searchParams.has("slug")) {
        url.searchParams.delete("slug");
        window.history.pushState({}, "", url.pathname);
      }
      document.title = "Daily AI Champion Blog Archive — Abhishek Tiwari";
    }
  }, [selectedArticle]);

  // Code Block Copy delegated click handler
  const handleArticleBodyClick = (e) => {
    const copyBtn = e.target.closest("[data-copy-code]");
    if (copyBtn) {
      e.preventDefault();
      e.stopPropagation();
      const codeBlock = copyBtn.closest(".code-block-container")?.querySelector("code");
      if (codeBlock) {
        navigator.clipboard.writeText(codeBlock.innerText || codeBlock.textContent || "");
        const span = copyBtn.querySelector("span") || copyBtn;
        const orig = span.textContent;
        span.textContent = "Copied! ✓";
        copyBtn.classList.add("text-accent");
        setTimeout(() => {
          span.textContent = orig;
          copyBtn.classList.remove("text-accent");
        }, 2000);
      }
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2500);
    }
  };

  // Build combined tag list starting with default requested tags
  const allTags = useMemo(() => {
    const tagSet = new Set(DEFAULT_FILTER_TAGS);
    blogs.forEach((b) => {
      (b.hashtags || []).forEach((t) => tagSet.add(t));
    });
    return Array.from(tagSet);
  }, [blogs]);

  // Filter blogs by search & tag
  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        b.title?.toLowerCase().includes(q) ||
        b.targetKeyword?.toLowerCase().includes(q) ||
        b.tldrSummary?.toLowerCase().includes(q) ||
        b.summary?.toLowerCase().includes(q);

      const normalizedTag = selectedTag.replace("#", "").toLowerCase();
      const matchesTag =
        selectedTag === "All" ||
        (b.hashtags &&
          b.hashtags.some(
            (t) =>
              t.toLowerCase() === selectedTag.toLowerCase() ||
              t.toLowerCase().replace("#", "") === normalizedTag
          ));

      return matchesSearch && matchesTag;
    });
  }, [blogs, searchQuery, selectedTag]);

  const activeChampion = champion || blogs[0] || FALLBACK_WINNERS[0];
  const champScore = activeChampion.seoScore || activeChampion.seo_score || 96;
  const champCover = activeChampion.coverUrl || activeChampion.cover_url || FALLBACK_WINNERS[0].coverUrl;

  return (
    <main className="grain min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-accent">
      {/* Hero Header Section */}
      <section className="px-6 pb-10 pt-28 md:px-10 md:pb-14 md:pt-36 max-w-7xl mx-auto">
        {/* Navigation Breadcrumb / Engine Status Bar */}
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

        {/* Hero Title & Subtitle */}
        <div className="max-w-4xl">
          <span className="font-mono-alt inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-accent mb-5">
            🏆 Daily AI Champion Blog Archive
          </span>
          <h1
            ref={header}
            className="display text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.92] text-foreground tracking-tight"
          >
            Architectural Deep Dives &amp; Technical Articles
          </h1>
          <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed font-sans max-w-3xl">
            Each day, an automated 12-blog competition executes across distributed systems, Node.js, and AI.
            Only the highest-scoring winner is selected and stored in this permanent technical archive.
          </p>
        </div>
      </section>

      {/* Main Archive Section */}
      <section className="px-6 pb-24 md:px-10 max-w-7xl mx-auto">
        {/* Search & Tag Filter Pills */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 mb-12 pb-6 border-b border-border/40">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by title, keywords, or TL;DR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-border/70 bg-card/60 px-4 py-3 pl-10 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all backdrop-blur-md shadow-sm"
            />
            <span className="absolute left-3.5 top-3.5 text-muted-foreground text-xs">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-3 text-xs text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {allTags.map((tag) => {
              const isActive = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  data-cursor="link"
                  className={`font-mono-alt px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.18em] transition-all cursor-pointer ${
                    isActive
                      ? "bg-accent text-accent-foreground font-bold shadow-md shadow-accent/20 border border-accent"
                      : "border border-border/70 bg-secondary/50 text-foreground/80 hover:border-accent/60 hover:text-foreground backdrop-blur-sm"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Today's Featured Champion Spotlight Banner */}
        {!searchQuery && selectedTag === "All" && activeChampion && (
          <div className="mb-16">
            <div className="group relative overflow-hidden rounded-3xl border border-accent/40 bg-gradient-to-br from-card/95 via-card to-card/75 p-6 md:p-10 shadow-2xl transition-all duration-500 hover:border-accent hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 relative aspect-[16/10] overflow-hidden rounded-2xl border border-border/50 bg-secondary/50 shadow-lg">
                  <img
                    src={champCover}
                    alt={activeChampion.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 rounded-lg bg-background/90 backdrop-blur-md px-3 py-1.5 text-[11px] font-mono font-bold text-accent border border-accent/40 shadow-md">
                    🏆 TODAY&apos;S #1 CHAMPION (SEO: {champScore}/100)
                  </div>
                </div>

                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted-foreground mb-3">
                      <span>📅 {activeChampion.publishedAt || activeChampion.published_at || "Today"}</span>
                      <span>•</span>
                      <span className="text-accent font-medium">Focus: {activeChampion.targetKeyword || activeChampion.target_keyword}</span>
                    </div>

                    <h2 className="display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-foreground group-hover:text-accent transition-colors">
                      {activeChampion.title}
                    </h2>

                    <div className="mt-5 p-5 rounded-2xl bg-accent/[0.08] border border-accent/40 border-l-4 border-l-accent text-xs sm:text-sm text-foreground/90 leading-relaxed font-sans shadow-sm">
                      <strong className="text-accent uppercase tracking-wider font-mono block text-[11px] mb-1.5 flex items-center gap-1.5">
                        <span>⚡</span> Direct Answer &amp; Key Takeaway (TL;DR):
                      </strong>
                      {activeChampion.tldrSummary || activeChampion.tldr_summary || activeChampion.metaDescription}
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => setSelectedArticle(activeChampion)}
                      data-cursor="link"
                      className="font-mono-alt inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-xs uppercase tracking-widest text-accent-foreground font-bold hover:opacity-90 transition-opacity shadow-lg shadow-accent/25"
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

        {/* Saved Winner Articles Section Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="display text-2xl sm:text-3xl font-bold text-foreground">
              {searchQuery ? `Search Results for "${searchQuery}"` : "All Saved Winner Articles"}
            </h2>
            <p className="font-mono text-xs text-muted-foreground mt-1">
              Showing {filteredBlogs.length} archived winner {filteredBlogs.length === 1 ? "article" : "articles"}
            </p>
          </div>
        </div>

        {/* Responsive Grid of All Past Saved Winner Articles */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl border border-border/40 bg-card/30 animate-pulse" />
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-20 border border-border/40 rounded-3xl bg-card/20 backdrop-blur-sm">
            <span className="text-3xl">🔍</span>
            <h3 className="display text-xl font-bold mt-4 text-foreground">No matching articles found</h3>
            <p className="text-xs font-mono text-muted-foreground mt-2">
              Try adjusting your search query or selecting a different topic tag.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedTag("All"); }}
              className="mt-5 font-mono-alt text-xs uppercase tracking-widest text-accent hover:underline cursor-pointer"
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
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/60 bg-card/50 p-6 transition-all duration-300 hover:border-accent/60 hover:bg-card/80 cursor-pointer shadow-md hover:shadow-2xl backdrop-blur-md"
              >
                <div>
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border/40 mb-4 bg-secondary/40 shadow-sm">
                    <img
                      src={post.coverUrl || post.cover_url || FALLBACK_WINNERS[idx % FALLBACK_WINNERS.length].coverUrl}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                      <span className="rounded-md bg-background/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-mono font-bold text-accent border border-accent/40 shadow-sm">
                        🏆 Winner
                      </span>
                      <span className="rounded-md bg-background/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-mono text-foreground/80 border border-border/50">
                        SEO: {post.seoScore || post.seo_score || 92}/100
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground mb-2">
                    <span>📅 {post.publishedAt || post.published_at || "Recent"}</span>
                    <span>•</span>
                    <span className="text-accent/90">{post.targetKeyword || "Technical Deep Dive"}</span>
                  </div>

                  <h3 className="display text-lg font-bold leading-snug text-foreground group-hover:text-accent transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3 font-sans">
                    {post.tldrSummary || post.tldr_summary || post.metaDescription || (post.contentMarkdown || "").slice(0, 160).replace(/[#*`]/g, "") + "..."}
                  </p>
                </div>

                <div className="mt-6 border-t border-border/40 pt-4 flex items-center justify-between">
                  <div className="flex gap-1.5 flex-wrap">
                    {(post.hashtags || []).slice(0, 2).map((t) => (
                      <span key={t} className="text-[10px] font-mono text-muted-foreground bg-accent/5 px-2 py-0.5 rounded border border-accent/20">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="font-mono-alt text-[11px] uppercase tracking-wider text-accent font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Details →
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Signature Interactive Scrambled Footer */}
      <Footer />

      {/* Full Article Details View & Deep Linking Modal */}
      {selectedArticle && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedArticle(null);
          }}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-background/85 backdrop-blur-2xl p-4 md:p-8 overflow-y-auto animate-in fade-in duration-300"
        >
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-3xl border border-border/80 bg-card text-foreground shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/50 px-6 py-4 bg-card/95 sticky top-0 z-50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="font-mono-alt text-xs uppercase tracking-widest text-muted-foreground hover:text-accent flex items-center gap-1 transition-colors cursor-pointer"
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
                  className="font-mono-alt text-[11px] uppercase tracking-wider px-3.5 py-1.5 rounded-lg border border-border/60 hover:border-accent text-muted-foreground hover:text-foreground transition-all shadow-sm cursor-pointer"
                >
                  {copyFeedback ? "✓ Link Copied!" : "🔗 Share"}
                </button>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div
              onClick={handleArticleBodyClick}
              className="p-6 md:p-10 overflow-y-auto space-y-8"
            >
              {selectedArticle.coverUrl && (
                <div className="relative w-full max-h-96 overflow-hidden rounded-2xl border border-border/50 bg-secondary/50 shadow-lg">
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
                  <span>✍️ Author: Abhishek Tiwari</span>
                  <span>•</span>
                  <span className="text-accent font-semibold">SEO Evaluated: {selectedArticle.seoScore || selectedArticle.seo_score || 96}/100</span>
                </div>

                <h1 className="display text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-foreground">
                  {selectedArticle.title}
                </h1>

                <div className="mt-4 flex flex-wrap gap-2">
                  {(selectedArticle.hashtags || []).map((t) => (
                    <span key={t} className="text-xs font-mono text-accent bg-accent/10 px-3 py-1 rounded-md border border-accent/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* ⚡ Key Takeaways / Direct Answer (TL;DR) Box */}
              <div className="rounded-2xl border border-accent/40 bg-accent/[0.08] p-5 md:p-6 border-l-4 border-l-accent shadow-sm">
                <strong className="text-accent font-mono text-xs uppercase tracking-widest block mb-2 flex items-center gap-1.5">
                  <span>⚡</span> Key Takeaways / Direct Answer (TL;DR):
                </strong>
                <p className="text-sm md:text-base text-foreground/90 leading-relaxed font-sans">
                  {selectedArticle.tldrSummary || selectedArticle.tldr_summary || selectedArticle.metaDescription}
                </p>
              </div>

              {/* Formatted Markdown Body with Styled Code Blocks & Copy Button */}
              <div
                className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground font-sans leading-relaxed text-sm md:text-base"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(
                    selectedArticle.contentMarkdown ||
                    selectedArticle.content_markdown ||
                    selectedArticle.summary ||
                    selectedArticle.tldrSummary
                  ),
                }}
              />

              {/* Author & Footer Social Links */}
              <div className="border-t border-border/50 pt-8 mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-accent/20 border border-accent/50 flex items-center justify-center font-bold text-accent font-mono text-lg shadow-sm">
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
    </main>
  );
}
