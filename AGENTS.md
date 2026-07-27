# Pocket Models — Agent Guide

> Interactive on-device AI stack builder for Android engineers. Compare open and open-weight models, then assemble a deployment stack — no backend, no build step, just HTML.

---

## 1. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML + CSS + JavaScript (zero frameworks, zero dependencies) |
| Styling | CSS custom properties for theming and responsive layout |
| Logic | Client-side filtering and recommendation in `app.js` |
| Deployment | GitHub Pages via `gh-pages` branch |

## 2. Project Structure

```
pocket-models/
├── index.html          Main page — stack builder UI
├── app.js             Client-side recommendation logic + filtering
├── style.css           Design system + responsive layout
├── README.md           Project overview and quick start
├── LICENSE             MIT
└── IDEAS.md            Feature and content roadmap
```

## 3. Key Scripts

There are no build tools or package managers. The site is a single-page static app.

| Action | Command |
|---|---|
| Dev server | `python3 -m http.server 4173` |
| Open in browser | `http://localhost:4173` |

## 4. Development

- No build step — edit the HTML/CSS/JS directly and refresh
- All data (model cards, filters, recommendations) lives in `app.js` as plain objects
- CSS custom properties (`--color-primary`, `--color-bg`, etc.) control theming in `style.css`
- The full page is under 2KB of HTML, 8KB of CSS, and 30KB of JS

## 5. Build & Deploy

Deployed via GitHub Pages:

```bash
# Deploy current main branch to gh-pages:
git checkout gh-pages
git merge main
git push origin gh-pages
```

Published at: https://teckedd-code2save.github.io/pocket-models/

## 6. Code Conventions

- **No external dependencies** — the entire site must work offline after a single page load. No CDN links, no npm packages, no API calls.
- **Vanilla JS only** — `app.js` uses no frameworks. Data filtering is done with `Array.filter()` and `Array.sort()`.
- **Accessible HTML** — use semantic elements (`<main>`, `<section>`, `<dialog>`, `<button>`) and proper ARIA attributes.
- **Responsive** — the layout uses CSS Grid and media queries to work on mobile and desktop.
- **No `<script>` tags in `<head>`** — load `app.js` at the bottom of `<body>`.
