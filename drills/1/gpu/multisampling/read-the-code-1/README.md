---
id: 1.gpu.multisampling.read-the-code.1
loop: 1
tier: light
concepts: [gpu.multisampling]
mode: read-the-code
context: gpu.multisampling/jaggies-post
lenses: []
misconceptions:
  - gpu.multisampling/composer-keeps-aa
---

# Multisampling

> **In short:** Multisampling smooths jagged edges by checking several points inside each pixel along a triangle's edge; the canvas gets it from `antialias: true`, but render targets, and so every post-processing chain, have none unless you ask.
>
> **Used for:** Keeping edges smooth after adding post-processing; thin lines like cables and wires that break into dashes; knowing what an antialiasing setting costs in GPU memory; and clean thumbnails and screenshots rendered offscreen.

## A · The basics

### Why edges are jagged

The pipeline stages page showed rasterization covering a pixel when its center is inside a triangle. So each pixel along an edge is either fully in or fully out, and a slanted edge becomes a staircase. Those steps are called **jaggies** (the technical name is aliasing), and they crawl when the camera moves.

**Multisampling**, or **MSAA**, tests several points in each pixel instead of one, commonly 4. A pixel on an edge with 2 of its 4 points inside gets half the triangle's color and half the background, so the staircase softens into a gradient. As a rule of thumb, the fragment shader still runs about once per pixel for each triangle; only the coverage and the depth are tested at every point.

**Analogy: deciding whether a floor tile is under a rug.** Look only at each tile's center and every tile is either rug or floor, so the rug's diagonal edge becomes a staircase of whole tiles. Look at four spots per tile and a tile half under the rug counts as half.

### Render targets start with none

`new WebGLRenderer({ antialias: true })` multisamples the canvas. A render target is separate, with its own `samples` setting, and it defaults to 0. An `EffectComposer` draws the scene into targets like that, so adding post-processing quietly brings the jaggies back.

Compare the canvas, a composer with its default targets, and a composer with a 4-sample target. Watch the thin cables and the rack's slanted edges; the readout shows the samples and the memory the composer's pictures take.

<div data-scene="edges"></div>

## B · Working knowledge

### Getting antialiasing back after adding a composer

```js
const size = renderer.getDrawingBufferSize(new Vector2());
const target = new WebGLRenderTarget(size.width, size.height, { type: HalfFloatType, samples: 4 });
const composer = new EffectComposer(renderer, target);
composer.setSize(innerWidth, innerHeight); // the composer's own sizes are in CSS pixels
```

- **Other options:** an `FXAAPass` or `SMAAPass` at the end smooths the finished picture instead, with less memory but slightly softer detail; r186's `outputBufferType: HalfFloatType` with `renderer.setEffects` multisamples by itself when `antialias` is on (the multi-pass page).
- **`samples` is capped by the GPU** at `renderer.capabilities.maxSamples`.
- The same goes for any render target: a thumbnail or a mirror rendered offscreen is jagged unless its target has `samples`.

### Thin lines

`Line` and `LineSegments` are always drawn one pixel wide in WebGL: three.js's docs say `linewidth` is ignored. One-pixel lines are the worst case for jaggies, so they show MSAA's absence first. For lines of real thickness, `Line2` and `LineMaterial` from `three/addons/lines/` build them from triangles.

### What it costs

Each sample keeps its own color and depth, so a 4-sample target's multisampled buffers take about 4 times the memory of a plain one, plus the plain picture the samples are averaged into. At a pixel ratio of 2 on a large screen that's tens of megabytes per target, and a composer has two. The texture budget page and the resolution and DPR page, in the optimization domain, weigh it against the rest of GPU memory.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
