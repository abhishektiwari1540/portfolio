import { createFileRoute } from "@tanstack/react-router";
import { Blog } from "@/components/pages/Blog";

const CANONICAL_URL = "https://abhishektiwari.online/blog";
const SITE_TITLE = "Blog | Abhishek Tiwari — Full Stack & AI Backend Engineer";
const SITE_DESC =
  "Articles and technical insights on full-stack development, Gemini AI backends, TypeScript, Node.js, and cloud database architecture.";
const OG_IMAGE = "https://abhishektiwari.online/og-image.png";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESC },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESC },
      { property: "og:url", content: CANONICAL_URL },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:site_name", content: "Abhishek Tiwari Portfolio" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESC },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "canonical", href: CANONICAL_URL },
    ],
  }),
  component: Blog,
});
