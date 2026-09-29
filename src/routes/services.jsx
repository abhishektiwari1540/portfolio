import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Home } from "@/components/pages/Home";

function ServicesRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/", replace: true, hash: "services" });
  }, [navigate]);
  return <Home />;
}

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Abhishek Tiwari" },
      {
        name: "description",
        content:
          "Full stack web apps, AI and LLM integration, database architecture, realtime systems, API design, workflow automation and performance rescue.",
      },
      { property: "og:title", content: "Services — Abhishek Tiwari" },
      {
        property: "og:description",
        content: "Seven ways to work together, from schema design to LLM pipelines.",
      },
    ],
  }),
  component: ServicesRedirect,
});
