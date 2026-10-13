import { createFileRoute } from "@tanstack/react-router";
import { Blog } from "@/components/pages/Blog";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Daily AI Champion Blog & Architectural Deep Dives — Abhishek Tiwari" },
      {
        name: "description",
        content:
          "Explore daily #1 AI-evaluated architectural deep dives, engineering benchmarks, and microservice designs by Abhishek Tiwari.",
      },
      { property: "og:title", content: "Daily AI Champion Blog — Abhishek Tiwari" },
      {
        property: "og:description",
        content:
          "Daily #1 winner technical blogs evaluated by multi-factor SEO and architecture quality gates.",
      },
    ],
  }),
  component: Blog,
});
