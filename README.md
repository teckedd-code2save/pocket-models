# Pocket Models

**Compare open and open-weight models for Android, then assemble an on-device or hybrid AI stack — no backend, no dependencies, just a single HTML page.**

Pocket Models is a field guide for Android engineers evaluating small language and multimodal models for mobile deployment. Instead of another leaderboard, it provides an interactive stack builder that asks about your deployment mode, target device memory, required modality, and product priority — then recommends a concrete stack with tradeoff notes.

The shortlist covers six models worth profiling (Gemma 4 E2B, LFM 2.5, Phi-4-mini, SmolVLM, Qwen2.5-VL, Whisper) with filter options for tiny-footprint, multimodal, and permissive-license models. Each model card opens a detail panel with fit assessment, caution flags, and source links.

Architecture view switches between fully on-device and hybrid .NET patterns, showing where intelligence runs and what that means for privacy, latency, and cost.

## Tech stack

- Vanilla HTML + CSS + JavaScript — no frameworks, no build step
- CSS custom properties for theming and responsive layout
- Client-side filtering and recommendation logic in `app.js`

## Quick start

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

The page is fully client-side — no server, no API calls, no install beyond the HTTP server.

## Testing

The site has no build step, but the recommendation and filtering logic is guarded by smoke tests (Vitest + jsdom) that load the real `index.html` and `app.js` and drive the stack builder, filters, dialog, and architecture toggle:

```bash
npm ci
npm run check   # node --check app.js (syntax)
npm run lint    # ESLint
npm test        # Vitest smoke tests
```

CI (`.github/workflows/ci.yml`) runs all three on every push and pull request to `main`.

## Interactive features

- **Stack builder** — recommendations update from deployment mode (on-device / hybrid), device memory (4 GB to 12+ GB), core capability (text / vision / audio), and product priority (quality, latency, privacy, tool use, licensing).
- **Model card filters** — filter by footprint (tiny), multimodality, or permissive licensing.
- **Detail panel** — each model opens a dialog with fit assessment, tradeoff warnings, and HuggingFace source link.
- **Architecture view** — switches between on-device and hybrid patterns with visual diagram.

## License

MIT
