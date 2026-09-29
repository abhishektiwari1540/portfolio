import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/components/pages/About";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Abhishek Tiwari" },
      {
        name: "description",
        content:
          "How Abhishek Tiwari works: architect the data, build the interface, automate the rest. Three years across booking, fintech and identity platforms.",
      },
      { property: "og:title", content: "About — Abhishek Tiwari" },
      {
        property: "og:description",
        content: "Architect, build, automate — the working method behind the projects.",
      },
    ],
  }),
  component: About,
});
