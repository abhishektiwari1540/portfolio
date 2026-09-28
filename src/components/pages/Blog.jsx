import { useEffect, useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { getPublishedPosts } from "@/lib/supabase";
import { Footer } from "@/components/site/Footer";
import { gsap, registerGsap } from "@/lib/gsap";

const SAMPLE_POSTS = [
  {
    id: "sample-1",
    title: "Building Real-Time Multi-Agent AI Systems with Gemini & Node.js",
    slug: "building-realtime-multi-agent-ai-systems",
    excerpt: "An architectural guide on orchestration patterns, streaming responses, and managing context limits across distributed AI agents.",
    published_at: "2026-09-15T00:00:00.000Z",
    reading_time: "6 min read",
    tags: ["AI", "Node.js", "Gemini", "Architecture"],
    status: "published",
    author: "Abhishek Tiwari",
  },
  {
    id: "sample-2",
    title: "Optimizing High-Throughput Database Schemas in Laravel & PostgreSQL",
    slug: "optimizing-high-throughput-database-schemas",
    excerpt: "Lessons learned from scaling fintech and booking platform databases: indexing strategies, JSONB optimization, and connection pooling.",
    published_at: "2026-09-02T00:00:00.000Z",
    reading_time: "8 min read",
    tags: ["PostgreSQL", "Laravel", "Performance", "Databases"],
    status: "published",
    author: "Abhishek Tiwari",
  },
  {
    id: "sample-3",
    title: "Type-Safe Routing and Server Prerendering with TanStack Router",
    slug: "type-safe-routing-and-server-prerendering",
    excerpt: "How to combine client-side speed with static prerendering and dynamic revalidation for optimal SEO and UX.",
    published_at: "2026-08-20T00:00:00.000Z",
    reading_time: "5 min read",
    tags: ["React", "TypeScript", "SEO", "TanStack"],
    status: "published",
    author: "Abhishek Tiwari",
  },
];

export function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    async function loadPosts() {
      setLoading(true);
      try {
        const fetchedPosts = await getPublishedPosts();
        if (isMounted) {
          if (fetchedPosts && fetchedPosts.length > 0) {
            setPosts(fetchedPosts);
          } else {
            // Fallback to sample posts if DB is empty or credentials pending
            setPosts(SAMPLE_POSTS);
          }
        }
      } catch (err) {
        console.error("Failed to load blog posts:", err);
        if (isMounted) setPosts(SAMPLE_POSTS);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!loading && posts.length > 0 && containerRef.current) {
      registerGsap();
      const ctx = gsap.context(() => {
        gsap.from("[data-blog-card]", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading, posts]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="relative px-6 pt-36 pb-16 md:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono-alt text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Technical Writing &amp; System Insights
            </span>
          </div>
          <h1 className="display text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.95] tracking-tight font-bold">
            Articles &amp; Architecture.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Explorations into high-performance web systems, multimodal AI agent workflows, backend database architecture, and full-stack engineering.
          </p>
        </div>
      </section>

      {/* Post Grid */}
      <section ref={containerRef} className="px-6 pb-28 md:px-10 max-w-7xl mx-auto">
        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-80 rounded-2xl border border-white/10 bg-white/5 p-8 animate-pulse flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="h-4 w-24 bg-white/10 rounded" />
                  <div className="h-8 w-full bg-white/10 rounded" />
                  <div className="h-16 w-full bg-white/10 rounded" />
                </div>
                <div className="h-4 w-32 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">No Published Posts</h3>
            <p className="text-muted-foreground">
              Check back soon for deep dives into Full-Stack &amp; AI Backend Engineering.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id || post.slug}
                data-blog-card
                className="group relative flex flex-col justify-between rounded-2xl border border-border/60 bg-secondary/20 p-8 transition-all duration-300 hover:border-accent/50 hover:bg-secondary/40 hover:-translate-y-1 shadow-lg"
              >
                <div>
                  {/* Meta Bar */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {post.tags && Array.isArray(post.tags) ? (
                      post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono-alt text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="font-mono-alt text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                        Article
                      </span>
                    )}
                    {post.reading_time && (
                      <span className="font-mono-alt text-[11px] text-muted-foreground ml-auto">
                        {post.reading_time}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-semibold leading-snug tracking-tight mb-3 group-hover:text-accent transition-colors">
                    <Link to="/blog/$slug" params={{ slug: post.slug }} className="before:absolute before:inset-0">
                      {post.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {post.excerpt || post.description || "Read full article..."}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="mt-8 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Published"}
                  </span>
                  <span className="font-mono-alt uppercase tracking-widest text-[10px] font-semibold text-accent group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read Post &rarr;
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
