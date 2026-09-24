import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Home } from "@/components/pages/Home";

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
      { title: "Work — Abhishek Tiwari" },
      {
        name: "description",
        content:
          "Selected projects by Abhishek Tiwari: TennisKhelo, RichestLife, IDMitra, SafeGent and GHP Jaipur.",
      },
      { property: "og:title", content: "Work — Abhishek Tiwari" },
      {
        property: "og:description",
        content: "Booking platforms, finance dashboards, identity workflows and realtime consoles.",
      },
    ],
  }),
  component: WorkRedirect,
});
