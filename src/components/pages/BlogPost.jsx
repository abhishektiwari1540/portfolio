import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { getPostBySlug } from "@/lib/supabase";
import { Footer } from "@/components/site/Footer";

const SAMPLE_POSTS_MAP = {
  "building-realtime-multi-agent-ai-systems": {
    title: "Building Real-Time Multi-Agent AI Systems with Gemini & Node.js",
    slug: "building-realtime-multi-agent-ai-systems",
    excerpt: "An architectural guide on orchestration patterns, streaming responses, and managing context limits across distributed AI agents.",
    published_at: "2026-09-15T00:00:00.000Z",
    reading_time: "6 min read",
    tags: ["AI", "Node.js", "Gemini", "Architecture"],
    author: "Abhishek Tiwari",
    content: `
### Introduction

Building autonomous multi-agent AI systems requires moving beyond single-prompt completion endpoints to stateful, event-driven orchestration architectures.

In this deep dive, we explore how to design resilient Node.js backends using Google Gemini Multimodal APIs, WebSocket streaming, and distributed queue systems.

### Key Architectural Pillars

1. **State Isolation**: Each agent operates in its own isolated state machine while communicating via standardized JSON-schema message passing.
2. **Streaming Tokens & Events**: Server-sent events (SSE) or WebSockets allow low-latency streaming back to the frontend user interface.
3. **Context Management**: Token window pruning and summarization layers ensure system prompts retain long-term memory without exceeding rate limits.

\`\`\`javascript
// Example Agent Task Handler
async function dispatchAgentTask(agentId, promptContext) {
  const model = googleAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  const responseStream = await model.generateContentStream(promptContext);
  return responseStream;
}
\`\`\`

### Scalability Considerations

When scaling to thousands of concurrent agent loops, using Redis pub/sub alongside Node.js worker pools prevents event loop blockage and provides deterministic retry mechanisms.
    `,
  },
  "optimizing-high-throughput-database-schemas": {
    title: "Optimizing High-Throughput Database Schemas in Laravel & PostgreSQL",
    slug: "optimizing-high-throughput-database-schemas",
    excerpt: "Lessons learned from scaling fintech and booking platform databases: indexing strategies, JSONB optimization, and connection pooling.",
    published_at: "2026-09-02T00:00:00.000Z",
    reading_time: "8 min read",
    tags: ["PostgreSQL", "Laravel", "Performance", "Databases"],
    author: "Abhishek Tiwari",
    content: `
### Database Optimization at Scale

When handling thousands of concurrent writes in booking platforms and payment processing systems, database bottlenecks quickly emerge around indexes, locks, and connection saturation.

### Strategies Implemented

- **Composite Partial Indexes**: Indexing only active transactions drastically reduces index write overhead.
- **Connection Pooling with PgBouncer**: Managing thousands of stateless PHP-FPM / Node connections safely.
- **JSONB Query Tuning**: Using GIN indexes on frequent JSON payload attributes.
    `,
  },
  "type-safe-routing-and-server-prerendering": {
    title: "Type-Safe Routing and Server Prerendering with TanStack Router",
    slug: "type-safe-routing-and-server-prerendering",
    excerpt: "How to combine client-side speed with static prerendering and dynamic revalidation for optimal SEO and UX.",
    published_at: "2026-08-20T00:00:00.000Z",
    reading_time: "5 min read",
    tags: ["React", "TypeScript", "SEO", "TanStack"],
    author: "Abhishek Tiwari",
    content: `
### Modern SPA & Static Hybrid Architecture

By pre-building full HTML structures for crawlers while preserving client hydration, applications get the best of both worlds: zero-CLS static renders for SEO and instant dynamic navigation.
    `,
  },
};

export function BlogPost() {
  const { slug } = useParams({ strict: false });
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadPost() {
      setLoading(true);
      try {
        if (slug) {
          const dbPost = await getPostBySlug(slug);
          if (isMounted) {
            if (dbPost) {
              setPost(dbPost);
            } else if (SAMPLE_POSTS_MAP[slug]) {
              setPost(SAMPLE_POSTS_MAP[slug]);
            } else {
              setPost(null);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load post detail:", err);
        if (isMounted && slug && SAMPLE_POSTS_MAP[slug]) {
          setPost(SAMPLE_POSTS_MAP[slug]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadPost();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground px-6 pt-36 pb-20 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 bg-white/10 rounded" />
          <div className="h-12 w-full bg-white/10 rounded" />
          <div className="h-4 w-48 bg-white/10 rounded" />
          <div className="h-64 w-full bg-white/10 rounded mt-8" />
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-background text-foreground px-6 pt-36 pb-20 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
        <p className="text-muted-foreground mb-8">The requested article could not be located or has been removed.</p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-mono-alt text-xs uppercase tracking-widest text-accent-foreground transition-transform hover:scale-105"
        >
          &larr; Back to Blog
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <article className="px-6 pt-36 pb-20 max-w-4xl mx-auto">
        {/* Navigation Back */}
        <div className="mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 font-mono-alt text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
          >
            &larr; Back to all articles
          </Link>
        </div>

        {/* Header */}
        <header className="mb-12 pb-8 border-b border-border/60">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {post.tags && Array.isArray(post.tags) && post.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono-alt text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20"
              >
                {tag}
              </span>
            ))}
            {post.reading_time && (
              <span className="font-mono-alt text-xs text-muted-foreground ml-auto">
                {post.reading_time}
              </span>
            )}
          </div>

          <h1 className="display text-[clamp(2rem,5vw,4.2rem)] leading-[1.05] tracking-tight font-bold mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent text-xs">
                AT
              </span>
              <span className="font-medium text-foreground">{post.author || "Abhishek Tiwari"}</span>
            </div>
            <span>•</span>
            <time dateTime={post.published_at}>
              {post.published_at
                ? new Date(post.published_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Published"}
            </time>
          </div>
        </header>

        {/* Content Body */}
        <div className="prose prose-invert max-w-none space-y-6 text-lg leading-relaxed text-foreground/90 font-sans">
          {post.content ? (
            <div className="whitespace-pre-wrap leading-relaxed">{post.content}</div>
          ) : (
            <p>{post.excerpt}</p>
          )}
        </div>
      </article>

      <Footer />
    </main>
  );
}
