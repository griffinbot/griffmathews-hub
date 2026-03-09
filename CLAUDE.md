# CLAUDE.md

This file provides guidance for AI assistants working in this repository.

## Project Overview

**griffmathews-hub** is a personal portfolio and brand site for Griff Mathews, built with [Astro](https://astro.build/) and deployed as a static site on Cloudflare Pages. The flagship interactive feature is a Mini Crossword puzzle game.

- **Framework:** Astro v5 (static output mode)
- **Node version:** 20 (see `.nvmrc`)
- **Hosting:** Cloudflare Pages
- **No TypeScript, no linting toolchain** — plain JavaScript and Astro components

---

## Repository Structure

```
griffmathews-hub/
├── public/              # Static assets served at root
│   ├── styles.css       # Global stylesheet (27.8KB, single source of truth for all styles)
│   ├── favicon.ico / .svg
│   └── logo.svg
├── src/
│   ├── components/      # Reusable Astro components
│   │   ├── TopNav.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── BaseLayout.astro   # Master page wrapper (fonts, meta, theme)
│   ├── lib/
│   │   └── miniCrossword.js   # Core crossword puzzle logic (pure functions)
│   └── pages/           # File-based routing — each file is a route
│       ├── index.astro          # /
│       ├── about.astro          # /about
│       ├── projects.astro       # /projects
│       ├── updates.astro        # /updates
│       ├── contact.astro        # /contact
│       ├── crossword.astro      # /crossword  (main interactive app)
│       ├── mini-crossword.astro # /mini-crossword → 301 redirect to /crossword
│       └── signin.astro         # /signin  (placeholder)
├── tests/
│   └── miniCrossword.test.js   # Unit tests using Node built-in test runner
├── astro.config.mjs     # Astro config (static output)
├── package.json
└── .nvmrc               # Node 20
```

---

## Development Commands

```bash
npm run dev       # Start local dev server (hot reload)
npm run build     # Build for production → dist/
npm run preview   # Preview production build locally
```

**Run tests:**
```bash
node --test tests/miniCrossword.test.js
```

There is no `npm test` script — always use the `node --test` command directly.

---

## Key Conventions

### Styling
- **All CSS lives in `public/styles.css`** — do not add `<style>` blocks in Astro components unless scoped to a very specific, one-off UI element.
- Use the established CSS custom properties (variables); do not introduce new color values or spacing values inline.

**Core CSS variables:**
```css
--bg, --bg-soft, --surface, --surface-muted  /* backgrounds */
--text, --muted                              /* typography */
--orange, --orange-deep, --blue, --blue-deep /* accent colors */
--shadow, --shadow-soft                      /* shadows */
--pad   /* base padding: 28px */
--max   /* max container width: 1120px */
```

**Fonts:** Manrope (body) · Space Grotesk (headings/display)
**Border radius:** 18px standard
**Layout:** CSS Grid + Flexbox; mobile-first responsive design

### Routing
- Astro uses **file-based routing** — adding a file to `src/pages/` creates a new route automatically.
- Keep backward-compatible redirects (e.g., `mini-crossword.astro` redirects to `crossword`) when renaming pages.

### Components
- Components go in `src/components/` and are imported directly in pages/layouts.
- Layouts (page wrappers) go in `src/layouts/`. Every page should use `BaseLayout.astro`.
- Pass page-specific `title` and `description` props to `BaseLayout`.

### JavaScript
- Plain ES modules (`"type": "module"` in package.json).
- No TypeScript, no bundler config beyond Astro.
- Logic shared between pages belongs in `src/lib/` as pure-function modules.
- Interactive client-side scripts live inside `<script>` tags within `.astro` page files (not in `src/lib/`).

### Crossword Game (`src/lib/miniCrossword.js`)
- This module exports **pure functions** with no DOM dependencies — all state is passed in and returned.
- The interactive wiring (DOM events, timers, rendering) is in the `<script>` block of `src/pages/crossword.astro`.
- Unit tests cover the pure logic; do not add DOM-dependent code to `miniCrossword.js`.

---

## Testing

- **Framework:** Node.js built-in `node:test` with `assert/strict`
- **Test file:** `tests/miniCrossword.test.js`
- Tests cover: cursor movement, tab navigation, direction toggling, check/reveal/clear operations, and timer formatting.
- When editing `src/lib/miniCrossword.js`, run tests to confirm no regressions.

---

## Deployment

The site deploys to **Cloudflare Pages** as a static build:
- Build command: `npm run build`
- Output directory: `dist`
- The crossword game can also be hosted on a sub-domain (e.g., `games.griffmathews.com`) pointing to the same build.

No server-side code, no database, no environment variables required for normal operation.

---

## Content & Pages Guide

| Page | Purpose | Notes |
|------|---------|-------|
| `index.astro` | Home / hero | Featured apps, updates preview, about teaser |
| `projects.astro` | App showcase | Cards for Weather, Mini Crossword, Automation |
| `about.astro` | Bio / philosophy | Keep brief and on-brand |
| `updates.astro` | Blog-style changelog | Timestamped entries (newest first) |
| `contact.astro` | Email + social links | |
| `crossword.astro` | Interactive game | Complex — keep interactive logic in `<script>` |
| `signin.astro` | Coming soon placeholder | |

---

## What to Avoid

- Do not add external npm dependencies without a strong reason — the project intentionally has only Astro as a dependency.
- Do not introduce TypeScript, ESLint, or Prettier unless explicitly requested.
- Do not add server-side rendering (`output: "server"`) — the site is intentionally static.
- Do not inline styles that duplicate or override values already in `public/styles.css`.
- Do not add DOM manipulation code to `src/lib/miniCrossword.js` — keep it pure.
