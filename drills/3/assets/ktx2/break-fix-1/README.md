---
id: 3.assets.ktx2.break-and-fix.1
loop: 3
tier: light
concepts: [assets.ktx2, assets.reuse-caching]
mode: break-and-fix
context: assets.ktx2/swatch-library
lenses: [cost]
misconceptions:
  - assets.reuse-caching/same-url-free
---

# KTX2 swatches: duplicate transcodes for one URL

> **The job:** share a loaded compressed swatch texture whenever variants use the same URL.

## Task

`loadSwatches(urls, loader)` returns a texture for each URL in order. A KTX2 loader can transcode one image for the GPU, but the starter asks it to do the same work twice when two swatches refer to one URL.

Fix the per-batch reuse, including requests that are still pending. Name the duplicate work in `cause.md`, then write a regression assertion in `check.ts`. The scene shows the number of transcodes requested for three swatches.

<div data-scene="swatches"></div>

## Measure

Record loader calls and texture count for repeated swatches. KTX2 can keep texture data compressed in VRAM when a supported GPU format is available, but repeated loads still spend decode/transcode time and may allocate duplicate GPU textures.

## Your code

Edit `drills/3/assets/ktx2/break-fix-1/drill.ts`, `cause.md`, and `check.ts`.

    npm run drill -- drills/3/assets/ktx2/break-fix-1

## The check

The acceptance test asks for repeated and distinct URLs before any load finishes. It expects one request per unique URL and the same texture object for repeated URLs. The regression check rejects duplicate work.

<details><summary>Hint</summary> Store the promise as soon as the loader starts, not only after it resolves. </details>

## Where else?

Where else should in-flight work be shared?

<details><summary>A few answers</summary> Repeated geometry parts, variant preview images, and an HDR environment used by several scenes. </details>
