# CLAUDE.md — griffmathews-hub

Guidance for AI assistants working on this codebase.

## What This Project Is

Personal portfolio and web-app site for Griffin Mathews, built with Astro and deployed as a static site on Cloudflare Pages. The live site is at `griffmathews.com`; a secondary Cloudflare Pages project serves `games.griffmathews.com/crossword`.

---

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start local dev server with hot reload
npm run build        # Build static output to dist/
npm run preview      # Preview the built site locally

# Run tests (not in npm scripts — run directly)
node tests/miniCrossword.test.js
```

Node.js v20 is required (see `.nvmrc`).

---

## Repository Layout

```
src/
  components/        # Reusable Astro components (TopNav, Footer)
  layouts/           # HTML shell wrappers (BaseLayout.astro)
  lib/               # Framework-independent JS logic (miniCrossword.js)
  pages/             # File-based routes (each file = one URL)
tests/               # Node test runner tests
public/              # Static assets served as-is (styles.css, favicon, logo)
astro.config.mjs     # Astro config (static output mode)
```

### Pages → Routes

| File | Route | Notes |
|------|-------|-------|
| `index.astro` | `/` | Landing page |
| `about.astro` | `/about` | About section |
| `projects.astro` | `/projects` | Apps showcase |
| `updates.astro` | `/updates` | Changelog timeline |
| `contact.astro` | `/contact` | Contact form + social links |
| `crossword.astro` | `/crossword` | Interactive Mini Crossword game |
| `mini-crossword.astro` | `/mini-crossword` | 301 redirect → `/crossword` |
| `signin.astro` | `/signin` | Placeholder ("Coming soon") |

---

## Key Source Files

### `src/lib/miniCrossword.js`
The entire crossword game engine — pure functions, no side effects, no DOM access.

**Main exports:**
- `MINI_PUZZLE` — hardcoded 5×5 puzzle grid with across/down clues
- `createInitialState()` — returns fresh game state object
- `enterLetter(state, key)` — handle a letter keypress; returns new state
- `eraseCurrent(state)` — backspace/delete; returns new state
- `moveCursor(state, direction)` — arrow-key navigation
- `stepForward/stepBackward(state)` — advance/retreat within a word
- `jumpToNextClue(state, reverse)` — Tab / Shift+Tab between clues
- `toggleDirection(state)` — switch across ↔ down
- `checkAll(state)` — mark incorrect cells
- `revealAll(state)` — fill in all answers
- `clearPuzzle(state)` — wipe all entries
- `isSolved(state)` — returns boolean
- `formatSeconds(n)` — formats timer as `MM:SS`

State shape (relevant fields):
```js
{
  grid,          // 2-D array of cell objects or null (blocked)
  entries,       // flat map: {row, col} → user-typed letter
  cursor,        // {row, col}
  direction,     // "across" | "down"
  pencilMode,    // boolean
  checked,       // set of cell keys with incorrect answers
  revealed,      // set of cell keys that have been revealed
}
```

All functions are pure — pass state in, get new state back. Do not mutate state directly.

### `src/pages/crossword.astro`
Wires the game engine to the DOM. Contains an inline `<script type="module">` that:
1. Imports from `../lib/miniCrossword.js`
2. Builds the board as HTML
3. Listens for keyboard events (arrows, Tab, Backspace, Space, letter keys)
4. Re-renders on every state change

### `src/layouts/BaseLayout.astro`
Global HTML shell. Loads Google Fonts (Manrope + Space Grotesk), links `/styles.css`, renders `<TopNav>` and `<Footer>` around the `<slot>`.

### `public/styles.css`
Global stylesheet. Uses CSS custom properties defined on `:root`:
```css
--orange, --blue          /* brand colors */
--text, --bg, --surface   /* semantic palette */
--container, --pad        /* layout */
--radius, --shadow, --shadow-soft
--font, --font-display    /* Manrope / Space Grotesk */
```
Prefer these variables over hardcoded values anywhere in the codebase.

---

## Conventions

### Code style
- **Pure functions** for all game logic in `src/lib/`. No DOM access inside `lib/`.
- **camelCase** for functions and variables; **SCREAMING_SNAKE_CASE** for module-level constants.
- ES modules throughout (`import`/`export`). No CommonJS.
- No TypeScript — plain `.js` and `.astro` files.
- No linter or formatter is configured — keep style consistent with existing files.

### CSS / HTML
- Use the CSS variables from `public/styles.css`; do not introduce new hardcoded colour or spacing values.
- Write semantic HTML (`<nav>`, `<section>`, `<article>`, etc.).
- Add `aria-label` / `aria-pressed` on interactive elements (buttons, game cells).

### Astro-specific
- `src/pages/` is file-based routing — filename = URL path. No manual router configuration needed.
- `src/components/` holds stateless UI fragments; `src/layouts/` holds full-page shells.
- Inline `<script type="module">` in page files is fine for page-specific JS.
- The project uses `output: "static"` — no server-side rendering or API routes.

### Testing
- Tests live in `tests/` and use Node's built-in `node:test` + `node:assert/strict` — no test framework to install.
- Run with `node tests/miniCrossword.test.js`.
- Test only the functions in `src/lib/`; DOM-related code in pages is not unit-tested.
- When adding or changing logic in `miniCrossword.js`, update the tests in `tests/miniCrossword.test.js`.

---

## Dependencies

The project has a single runtime dependency:

| Package | Version | Purpose |
|---------|---------|---------|
| `astro` | `^5.0.0` | Site framework and build tool |

Do not add dependencies without a compelling reason. The lightweight footprint is intentional.

---

## Build & Deployment

- **Build output:** `dist/` (static HTML/CSS/JS, ignored by git)
- **Primary deployment:** Cloudflare Pages → `griffmathews.com`
  - Build command: `npm run build`
  - Output directory: `dist`
- **Games subdomain:** Second Cloudflare Pages project → `games.griffmathews.com`

There is no CI/CD pipeline. Deployments are triggered manually via Cloudflare Pages.

---

## What to Avoid

- Do not add SSR, API routes, or server middleware — this is a pure static site.
- Do not introduce new npm dependencies without explicit need.
- Do not access the DOM inside `src/lib/` functions.
- Do not mutate state objects — return new state from every function.
- Do not hardcode colours or spacing — use CSS variables.
- Do not modify `public/styles.css` global variables without checking all pages that rely on them.
