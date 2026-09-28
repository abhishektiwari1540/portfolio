import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Home } from "@/components/pages/Home";

const CANONICAL_URL = "https://abhishektiwari.online/work";
const TITLE = "Work | Abhishek Tiwari - Full Stack & AI Backend Engineer";
const DESCRIPTION =
  "Full-Stack & Backend Engineer specializing in Node.js, TypeScript, Laravel, and Gemini Multimodal AI systems. Selected projects: TennisKhelo, RichestLife, IDMitra, SafeGent, and GHP Jaipur.";
const OG_IMAGE = "https://abhishektiwari.online/og-image.png";

function WorkRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/", replace: true, hash: "work" });
  }, [navigate]);
  return <Home />;
}

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: CANONICAL_URL },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:site_name", content: "Abhishek Tiwari Portfolio" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: CANONICAL_URL }],
  }),
  component: WorkRedirect,
});
