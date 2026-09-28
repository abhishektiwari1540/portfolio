import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/components/pages/About";

const CANONICAL_URL = "https://abhishektiwari.online/about";
const TITLE = "About | Abhishek Tiwari - Full Stack & AI Backend Engineer";
const DESCRIPTION =
  "Full-Stack & Backend Engineer specializing in Node.js, TypeScript, Laravel, and Gemini Multimodal AI systems. Learn about Abhishek Tiwari's experience in building booking platforms, fintech dashboards, and identity systems.";
const OG_IMAGE = "https://abhishektiwari.online/og-image.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: CANONICAL_URL },
      { property: "og:type", content: "profile" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:site_name", content: "Abhishek Tiwari Portfolio" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: CANONICAL_URL }],
  }),
  component: About,
});
