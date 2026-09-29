import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Home } from "@/components/pages/Home";

function ContactRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate({ to: "/", replace: true, hash: "contact" });
  }, [navigate]);
  return <Home />;
}

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Abhishek Tiwari" },
      {
        name: "description",
        content:
          "Start a project with Abhishek Tiwari. Email abhishektiwari1540@gmail.com or reach out on LinkedIn and GitHub.",
      },
      { property: "og:title", content: "Contact — Abhishek Tiwari" },
      {
        property: "og:description",
        content: "Available for full stack roles and freelance builds. Reply within a day.",
      },
    ],
  }),
  component: ContactRedirect,
});
