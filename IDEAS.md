# Pocket Models — Ideas

Forward-looking ideas for Pocket Models, the interactive Android AI stack explorer.

---

## New Features

### 1. Model benchmark integration
Pull real benchmark numbers (MMLU, GSM8K, etc.) from HuggingFace or Open LLM Leaderboard via a small serverless function so users see actual scores next to each model card.

### 2. On-device runtime comparison
Add a column comparing LiteRT runtime characteristics per model: estimated peak memory, inference latency on mid-range Snapdragon, and quantization support (INT4, INT8, FP16).

### 3. Model card expand/collapse with more detail
Each model card could expand to show full HuggingFace model card summary, training data notes, known failure modes, and community-reported edge cases.

### 4. Save/shared stack configs
Allow users to bookmark their stack selection via URL hash (base64-encoded) so they can share configurations with teammates.

### 5. Android project scaffold export
After selecting a stack, export a minimal `build.gradle.kts` snippet with the right LiteRT/AIDL dependencies and model download URLs.

### 6. Device profile presets
Add common device profiles (Pixel 8, Galaxy S24, Nothing Phone, Tecno, Infinix) that pre-fill RAM, SoC, and OS version for realistic filtering.

### 7. Hybrid pattern architecture diagrams
Replace the current text-based architecture toggle with SVG architecture diagrams showing on-device vs edge vs cloud split.

### 8. "What changed" diff view
When new models are released, show a changelog/diff view highlighting what's new vs the previous version.

### 9. Model comparison table
A side-by-side table view comparing 2-3 selected models across metrics: size, RAM, modalities, license, benchmark scores.

### 10. Offline-first PWA
Convert to a service-worker-backed PWA so the stack builder works without network (fonts and model card images cache on first visit).

## Content & Data

### 11. Expand model shortlist regularly
Cycle in new models as they release: LLaMA 4 variants, Gemma 4 updates, new Whisper versions, and emerging small multimodal models.

### 12. Regional model spotlight
Highlight models fine-tuned for African languages, Indian languages, or other under-represented language groups — relevant for Android OEMs in emerging markets.

### 13. Licensing filter expansion
Add a "commercial use" severity filter that flags models with any non-standard license caveat beyond the standard Apache 2.0 / MIT / CC-BY.

## Architecture & Quality

### 14. Unit tests for stack builder logic — ✅ done in `bb342dc` (2026-08-10)

The recommendation logic in `app.js` now has a Vitest + jsdom smoke-test suite in `test/app.test.js` covering the stack builder matrix, model filters, detail dialog, architecture toggle, and copy action.

### 15. Accessibility audit
Run axe-core or Lighthouse on the page and fix any ARIA, focus-trap, or colour-contrast issues found.

### 16. Dark/light theme toggle
Add a theme toggle that respects `prefers-color-scheme` and lets users override manually.

### 17. Translation framework
Structure text strings so the tool can be translated to French, Spanish, Arabic, and Hindi — target markets for Android.

## Distribution

### 18. GitHub Pages deployment
Set up a GitHub Actions workflow to deploy `index.html` + `styles.css` + `app.js` to GitHub Pages on push to main.

### 19. Embeddable widget
Create a lightweight `<script>` embed version that other Android development blogs or docs sites can embed as an iframe.

### 20. Android Studio plugin reference
Write a short companion README section on how to use the stack builder output when setting up an Android Studio project.
