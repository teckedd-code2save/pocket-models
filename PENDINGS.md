# PENDINGS — Known Sharp Edges

This is a living document for Pocket Models. Add entries when you discover a sharp edge, constraint, or failure mode; remove them once the underlying issue is resolved.

---

## 1. `main` doesn't go live until it's merged into `gh-pages` [Severity: HIGH]

**What:** Deployment is a manual branch merge: `git checkout gh-pages && git merge main && git push origin gh-pages`.

**Why it matters:** Commits to `main` are invisible on the published site (https://teckedd-code2save.github.io/pocket-models/) until the `gh-pages` merge happens. Forgetting the merge is the most common way a "deployed" change silently never ships.

**Mitigation:** After pushing to `main`, immediately merge to `gh-pages` and confirm the published page updates.

## 2. Zero-dependency rule is the product [Severity: HIGH]

**What:** The site must work offline after a single page load — no CDN links, no npm packages, no external API calls, no build step.

**Why it matters:** Adding any external dependency breaks the core promise ("no backend, no dependencies, just a single HTML page") and the offline guarantee.

**Mitigation:** Reject dependencies that "would be easier" with a library. If the site needs external data, that's a product decision, not an implementation detail.

## 3. All model data lives in `app.js` [Severity: MEDIUM]

**What:** Every model card, filter tag, recommendation, `best`/`caution` note, and source URL is a plain object in `app.js`. The recommendation engine is client-side filtering over that array.

**Why it matters:** Adding a model means updating the data array AND checking the filter tags (`tiny`, `multimodal`, etc.) so it appears in the right stack-builder branches. A model with a wrong tag is silently invisible in some modes.

**Mitigation:** When adding a model, verify it appears under every relevant filter combination before committing.

## 4. Size budget is tight [Severity: MEDIUM]

**What:** The full page is under ~2 KB of HTML, ~8 KB of CSS, and ~30 KB of JS by design.

**Why it matters:** The small footprint is part of the pitch for mobile/on-device audiences. Large additions degrade the "field guide you can open anywhere" value.

**Mitigation:** Keep additions lean. If a feature would add significant weight, discuss it in IDEAS.md before implementing.

## 5. Model license and size caveats must stay accurate [Severity: MEDIUM]

**What:** Model cards carry `license` and `caution` fields — e.g., LFM is not Apache/MIT, and Gemma 4 E2B's "E2B" is effective compute, not stored size.

**Why it matters:** This is a decision-making guide for Android engineers. Outdated licenses or misleading size claims can cause real legal or engineering mistakes downstream.

**Mitigation:** Re-verify model licenses, sizes, and availability against the source model cards before editing data; note the verification date in the commit message.

## 6. Accessibility is a first-class constraint [Severity: MEDIUM]

**What:** The page uses semantic elements (`<main>`, `<section>`, `<dialog>`, `<button>`) with proper ARIA attributes, per AGENTS.md.

**Why it matters:** New UI that skips semantic HTML or ARIA regresses the page's accessibility and its "accessible HTML" convention.

**Mitigation:** Follow the existing patterns in `index.html`; run a quick keyboard/screen-reader pass for new interactive elements.

## 7. `app.js` loads at the end of `<body>` [Severity: LOW]

**What:** AGENTS.md requires no `<script>` tags in `<head>`; `app.js` loads at the bottom of `<body>`.

**Why it matters:** Moving the script into `<head>` (or adding inline scripts) can block rendering or break the no-dependency ordering assumptions.

**Mitigation:** Keep script loading at the bottom of `<body>`, before `</body>`.

## 8. No build tools — edit and refresh [Severity: LOW]

**What:** There is no package.json, no bundler, no test runner. Development is `python3 -m http.server 4173` and a browser refresh.

**Why it matters:** "Fix the build" is not a valid failure mode here; if something doesn't work, it's a syntax error or a browser-compatibility issue in the plain JS/CSS.

**Mitigation:** Validate with `node --check app.js` for syntax and manual browser testing. Do not introduce a build step to "fix" this.

---

## Deferred Work Items

Items explicitly tracked as future work, not sharp edges:

1. CI workflow to automate the `main` → `gh-pages` merge — issue #5 was closed as covered by #4's validation CI (2026-08-10); the deploy automation itself is now tracked in IDEAS.md idea #18.
2. Test setup and automated checks for the recommendation logic — **done** in `bb342dc` (2026-08-10): CI workflow + Vitest smoke tests + ESLint.
3. Content roadmap (new models, comparison features) — tracked in IDEAS.md.
