import { createFileRoute } from "@tanstack/react-router";
import { BlogPost } from "@/components/pages/BlogPost";

export const Route = createFileRoute("/blog_/$slug")({
  head: ({ params }) => {
    const slug = params?.slug || "";
    const canonical = `https://abhishektiwari.online/blog/${slug}`;
    const title = `${slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} | Abhishek Tiwari`;
    const description = `Read "${title}" by Abhishek Tiwari — Full-Stack & AI Backend Engineer.`;
    const ogImage = "https://abhishektiwari.online/og-image.png";

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "article" },
        { property: "og:image", content: ogImage },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: ogImage },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  component: BlogPost,
});
