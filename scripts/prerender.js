import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");
const templatePath = path.resolve(distDir, "index.html");

if (!fs.existsSync(templatePath)) {
  console.error("dist/index.html does not exist. Run vite build first.");
  process.exit(1);
}

const baseTemplate = fs.readFileSync(templatePath, "utf-8");

const PERSON_SCHEMA = JSON.stringify({
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
});

const routes = [
  {
    path: "/",
    outFile: path.resolve(distDir, "index.html"),
    title: "Abhishek Tiwari | Full Stack & AI Backend Engineer",
    description:
      "Full-Stack & Backend Engineer specializing in Node.js, TypeScript, Laravel, and Gemini Multimodal AI systems.",
    canonical: "https://abhishektiwari.online",
    ogType: "website",
    body: `
      <main class="min-h-screen bg-background text-foreground">
        <header class="px-6 pt-24 max-w-7xl mx-auto">
          <h1 class="text-5xl font-bold">Abhishek Tiwari</h1>
          <p class="text-xl text-muted-foreground mt-2">Full Stack &amp; AI Backend Engineer</p>
          <p class="mt-4 max-w-2xl text-base leading-relaxed">Specializing in Node.js, TypeScript, Laravel, and Gemini Multimodal AI systems. Building scalable booking platforms, fintech dashboards, identity workflows and LLM pipelines.</p>
        </header>
        <section class="px-6 py-12 max-w-7xl mx-auto">
          <h2 class="text-3xl font-semibold mb-6">Selected Work &amp; Projects</h2>
          <ul class="space-y-2">
            <li>TennisKhelo — Real-time booking platform</li>
            <li>RichestLife — Fintech dashboard &amp; wealth platform</li>
            <li>IDMitra — Identity verification system</li>
            <li>SafeGent — Safety monitoring &amp; realtime console</li>
          </ul>
        </section>
      </main>
    `,
  },
  {
    path: "/about",
    outFile: path.resolve(distDir, "about/index.html"),
    title: "About | Abhishek Tiwari - Full Stack & AI Backend Engineer",
    description:
      "Full-Stack & Backend Engineer specializing in Node.js, TypeScript, Laravel, and Gemini Multimodal AI systems. Learn about Abhishek Tiwari's experience in building booking platforms, fintech dashboards, and identity systems.",
    canonical: "https://abhishektiwari.online/about",
    ogType: "profile",
    body: `
      <main class="min-h-screen bg-background text-foreground px-6 pt-24 max-w-7xl mx-auto">
        <h1 class="text-5xl font-bold">About Abhishek Tiwari</h1>
        <p class="text-lg mt-4 max-w-3xl leading-relaxed">Architect the data, build the interface, automate the rest. Three years of full-stack engineering across booking platforms, fintech consoles, identity verification workflows, and generative AI backend architectures.</p>
        <h2 class="text-2xl font-semibold mt-8">Technical Stack</h2>
        <p class="mt-2 text-muted-foreground">Node.js, TypeScript, React, Laravel, PostgreSQL, Redis, Gemini AI Multimodal APIs, Docker, Vercel, GSAP.</p>
      </main>
    `,
  },
  {
    path: "/work",
    outFile: path.resolve(distDir, "work/index.html"),
    title: "Work | Abhishek Tiwari - Full Stack & AI Backend Engineer",
    description:
      "Full-Stack & Backend Engineer specializing in Node.js, TypeScript, Laravel, and Gemini Multimodal AI systems. Selected projects: TennisKhelo, RichestLife, IDMitra, SafeGent, and GHP Jaipur.",
    canonical: "https://abhishektiwari.online/work",
    ogType: "website",
    body: `
      <main class="min-h-screen bg-background text-foreground px-6 pt-24 max-w-7xl mx-auto">
        <h1 class="text-5xl font-bold">Selected Work &amp; Case Studies</h1>
        <p class="text-lg mt-4 max-w-3xl leading-relaxed">Booking platforms, finance dashboards, identity workflows, and real-time AI consoles built for high performance and scale.</p>
      </main>
    `,
  },
  {
    path: "/services",
    outFile: path.resolve(distDir, "services/index.html"),
    title: "Services | Abhishek Tiwari - Full Stack & AI Backend Engineer",
    description:
      "Full-Stack & Backend Engineer specializing in Node.js, TypeScript, Laravel, and Gemini Multimodal AI systems. Services include web application development, LLM integration, database architecture, and performance engineering.",
    canonical: "https://abhishektiwari.online/services",
    ogType: "website",
    body: `
      <main class="min-h-screen bg-background text-foreground px-6 pt-24 max-w-7xl mx-auto">
        <h1 class="text-5xl font-bold">Engineering Services</h1>
        <p class="text-lg mt-4 max-w-3xl leading-relaxed">From database schema design and frontend applications to LLM agent pipelines and high-throughput backend APIs.</p>
      </main>
    `,
  },
  {
    path: "/contact",
    outFile: path.resolve(distDir, "contact/index.html"),
    title: "Contact | Abhishek Tiwari - Full Stack & AI Backend Engineer",
    description:
      "Full-Stack & Backend Engineer specializing in Node.js, TypeScript, Laravel, and Gemini Multimodal AI systems. Get in touch with Abhishek Tiwari for engineering roles and technical consulting.",
    canonical: "https://abhishektiwari.online/contact",
    ogType: "website",
    body: `
      <main class="min-h-screen bg-background text-foreground px-6 pt-24 max-w-7xl mx-auto">
        <h1 class="text-5xl font-bold">Let's build something.</h1>
        <p class="text-lg mt-4">Email: <a href="mailto:abhishektiwari1540@gmail.com" class="underline">abhishektiwari1540@gmail.com</a></p>
        <p class="mt-2 text-muted-foreground">Available for full stack engineering roles, AI backend builds, and technical consulting.</p>
      </main>
    `,
  },
  {
    path: "/blog",
    outFile: path.resolve(distDir, "blog/index.html"),
    title: "Blog | Abhishek Tiwari — Full Stack & AI Backend Engineer",
    description:
      "Articles and technical insights on full-stack development, Gemini AI backends, TypeScript, Node.js, and cloud database architecture.",
    canonical: "https://abhishektiwari.online/blog",
    ogType: "website",
    body: `
      <main class="min-h-screen bg-background text-foreground px-6 pt-24 max-w-7xl mx-auto">
        <h1 class="text-5xl font-bold">Articles &amp; System Insights</h1>
        <p class="text-lg mt-4 max-w-3xl leading-relaxed">Explorations into high-performance web systems, multimodal AI agent workflows, backend database architecture, and full-stack engineering.</p>
      </main>
    `,
  },
  {
    path: "/404",
    outFile: path.resolve(distDir, "404.html"),
    title: "404 Page Not Found | Abhishek Tiwari",
    description: "The page you are looking for does not exist or has been moved.",
    canonical: "https://abhishektiwari.online/404",
    ogType: "website",
    body: `
      <main class="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6 text-center">
        <h1 class="text-7xl font-bold">404</h1>
        <h2 class="text-2xl font-semibold mt-4">Page Not Found</h2>
        <p class="mt-2 text-muted-foreground">The requested URL was not found on this server.</p>
        <a href="/" class="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-xs uppercase tracking-widest text-accent-foreground font-semibold">Return Home</a>
      </main>
    `,
  },
];

function generateHtml(template, route) {
  let html = template;

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/gi, `<title>${route.title}</title>`);

  // Meta Head Injection
  const headElements = `
    <meta name="description" content="${route.description}">
    <link rel="canonical" href="${route.canonical}">
    <meta property="og:title" content="${route.title}">
    <meta property="og:description" content="${route.description}">
    <meta property="og:url" content="${route.canonical}">
    <meta property="og:type" content="${route.ogType}">
    <meta property="og:image" content="https://abhishektiwari.online/og-image.png">
    <meta property="og:site_name" content="Abhishek Tiwari Portfolio">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${route.title}">
    <meta name="twitter:description" content="${route.description}">
    <meta name="twitter:image" content="https://abhishektiwari.online/og-image.png">
    <script type="application/ld+json">${PERSON_SCHEMA}</script>
  `;

  html = html.replace("</head>", `${headElements}\n  </head>`);

  // Prerender Body inside #root
  if (route.body) {
    html = html.replace('<div id="root"></div>', `<div id="root">${route.body}</div>`);
  }

  return html;
}

routes.forEach((route) => {
  const dir = path.dirname(route.outFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const htmlContent = generateHtml(baseTemplate, route);
  fs.writeFileSync(route.outFile, htmlContent, "utf-8");
  console.log(`Prerendered route: ${route.path} -> ${route.outFile}`);
});
