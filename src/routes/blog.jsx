import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Home } from "@/components/pages/Home";

function BlogRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/", replace: true, hash: "blog" });
  }, [navigate]);
  return <Home />;
}

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Daily AI Digest & Blog — Abhishek Tiwari" },
      {
        name: "description",
        content:
          "Daily AI Career Digest & Candidate Blogs generated automatically with Gemini AI and self-judgment SEO ranking.",
      },
      { property: "og:title", content: "Daily AI Digest & Blog — Abhishek Tiwari" },
      {
        property: "og:description",
        content: "Automated daily tech blogs and candidate ranking engine by Abhishek Tiwari.",
      },
    ],
  }),
  component: BlogRedirect,
});
