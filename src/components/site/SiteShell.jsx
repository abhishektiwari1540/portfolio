import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Cursor } from "./Cursor";
import { SmoothScroll } from "./SmoothScroll";
import { Chrome } from "./Chrome";
import { PageTransition } from "./PageTransition";
import { Preloader } from "./Preloader";
import { RouteHoverTransition } from "./RouteHoverTransition";
import { ProjectModalProvider } from "./ProjectModalContext";

export function SiteShell({ children }) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem("at-intro") === "done") setLoading(false);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mounted && loading ? "hidden" : "";
  }, [mounted, loading]);

  const done = useCallback(() => {
    sessionStorage.setItem("at-intro", "done");
    setLoading(false);
    navigate({ to: "/" });
  }, [navigate]);

  return (
    <RouteHoverTransition>
      <ProjectModalProvider>
        <div className="grain relative min-h-screen bg-background text-foreground">
          {mounted && <SmoothScroll />}
          {mounted && <Cursor />}
          <Chrome />
          <PageTransition />
          {children}
          {mounted && loading && <Preloader onDone={done} />}
        </div>
      </ProjectModalProvider>
    </RouteHoverTransition>
  );
}
