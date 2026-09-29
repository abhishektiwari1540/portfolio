import { createFileRoute } from "@tanstack/react-router";
import { Home } from "@/components/pages/Home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Abhishek Tiwari — Full Stack Developer" },
      {
        name: "description",
        content:
          "Full stack developer building booking platforms, fintech dashboards and identity systems with React, Node, Laravel and AI.",
      },
      { property: "og:title", content: "Abhishek Tiwari — Full Stack Developer" },
      {
        property: "og:description",
        content: "Selected work, services and contact for full stack developer Abhishek Tiwari.",
      },
    ],
  }),
  component: Home,
});
