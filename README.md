# Abhishek Tiwari — Portfolio

Full-stack developer portfolio built with React, TypeScript, TanStack Router, Tailwind CSS, and GSAP.

## Stack

- **React 19** + **TypeScript** — SPA with strict types
- **TanStack Router** — file-based routing (Vite plugin auto-generates `src/routeTree.gen.ts`)
- **Tailwind CSS v4** + custom theme via `@theme` inline in `src/styles.css`
- **GSAP** — ScrollTrigger, Flip, marquee, custom cursor, text reveals
- **Lenis** — smooth inertia scroll wired to GSAP ticker

## Commands

```bash
npm run dev       # start Vite dev server (auto-generates route tree)
npm run build     # production build → dist/
npm run preview   # preview built app
npm run lint      # ESLint
npm run format    # Prettier
```

## Routes

TanStack Router uses **file-based routing**. Every `.tsx` file in `src/routes/`
defines a route. The Vite plugin generates `src/routeTree.gen.ts` — do not edit
this file by hand, regenerate it by running the dev server or build.

| File | URL |
| --- | --- |
| `index.tsx` | `/` |
| `about.tsx` | `/about` |
| `work.tsx` | `/work` |
| `services.tsx` | `/services` |
| `contact.tsx` | `/contact` |
| `__root.tsx` | app shell — wraps every page; preserve `<Outlet />` |

## Folder Structure

```
src/
├── assets/           # Images (imported via @/assets/*)
├── components/
│   ├── pages/        # Home, About, Work, Services, Contact
│   ├── site/         # Shell, Chrome (nav), Cursor, Footer, Marquee, hooks, data
│   └── ui/           # shadcn/ui primitives (not used by core portfolio — kept for future)
├── hooks/            # Shared React hooks
├── lib/              # gsap.ts (plugin reg), utils.ts (cn)
├── routes/           # TanStack Router file-based route definitions
├── main.tsx          # SPA entry (renders RouterProvider + QueryClientProvider)
├── routeTree.gen.ts  # Auto-generated
└── styles.css        # Tailwind entry, @theme tokens, custom utilities
```
