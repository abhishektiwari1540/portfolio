import { QueryClient } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";

const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Abhishek Tiwari",
  "jobTitle": "Full Stack Developer",
  "url": "https://abhishektiwari.online",
  "image": "https://abhishektiwari.online/og-image.png",
  "description":
    "Full-Stack & Backend Engineer specializing in Node.js, TypeScript, Laravel, and Gemini Multimodal AI systems.",
  "sameAs": [
    "https://github.com/abhishektiwari1540",
    "https://linkedin.com/in/abhishektiwari1540",
    "https://dev.to/abhishektiwari",
    "https://bsky.app/profile/abhishektiwari.online",
    "https://mastodon.social/@abhishektiwari",
  ],
};

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center text-foreground">
      <div className="max-w-md">
        <span className="font-mono-alt text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          Error 404
        </span>
        <h1 className="display mt-2 text-7xl font-bold tracking-tight">Page Not Found</h1>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          The page you are looking for doesn&apos;t exist, has been renamed, or moved permanently.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 font-mono-alt text-xs uppercase tracking-widest text-accent-foreground transition-transform hover:scale-105"
          >
            &larr; Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Abhishek Tiwari" },
      { title: "Abhishek Tiwari | Full Stack & AI Backend Engineer" },
      {
        name: "description",
        content:
          "Full-Stack & Backend Engineer specializing in Node.js, TypeScript, Laravel, and Gemini Multimodal AI systems.",
      },
      { property: "og:title", content: "Abhishek Tiwari | Full Stack & AI Backend Engineer" },
      {
        property: "og:description",
        content:
          "Full-Stack & Backend Engineer specializing in Node.js, TypeScript, Laravel, and Gemini Multimodal AI systems.",
      },
      { property: "og:url", content: "https://abhishektiwari.online" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://abhishektiwari.online/og-image.png" },
      { property: "og:site_name", content: "Abhishek Tiwari Portfolio" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Abhishek Tiwari | Full Stack & AI Backend Engineer" },
      {
        name: "twitter:description",
        content:
          "Full-Stack & Backend Engineer specializing in Node.js, TypeScript, Laravel, and Gemini Multimodal AI systems.",
      },
      { name: "twitter:image", content: "https://abhishektiwari.online/og-image.png" },
    ],
    links: [{ rel: "canonical", href: "https://abhishektiwari.online" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(PERSON_SCHEMA),
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <SiteShell>
        <Outlet />
      </SiteShell>
      <Scripts />
    </>
  );
}
