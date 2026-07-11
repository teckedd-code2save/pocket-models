# Pocket Models

A responsive, dependency-free one-page explorer for choosing open and open-weight models for Android apps.

## Run locally

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## What is interactive

- Stack recommendations update from deployment mode, device memory, modality, and product priority.
- Model cards filter by footprint, multimodality, and permissive licensing.
- Each model opens a tradeoff/source detail panel.
- Architecture view switches between fully on-device and hybrid .NET patterns.

The recommendations are starting points. Profile model size, peak memory, thermal behavior, and generation speed on the minimum Android device you support.
