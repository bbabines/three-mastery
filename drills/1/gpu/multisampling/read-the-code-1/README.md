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

> **In short:** Multisampling smooths jagged edges by testing several points in each pixel, and the canvas gets it from `antialias` but render targets don't.
>
> **Used for:** Smooth edges after adding post-processing, thin cables and wires, the memory antialiasing costs, and clean offscreen thumbnails.

## A · The basics

### Why edges are jagged

Rasterization counts a pixel as covered when its center is inside a triangle, so each pixel along an edge is fully in or fully out. A slanted edge becomes a staircase, called **jaggies** (or aliasing), and it crawls when the camera moves. **Multisampling**, or **MSAA**, tests several points in each pixel instead, usually 4. A pixel with 2 of its 4 points inside gets half the triangle's color, so the staircase softens. The fragment shader usually still runs about once per pixel for each triangle; only coverage and depth are tested at every point.

**Analogy: a rug on a tiled floor.** Look only at each tile's center, and every tile is either rug or floor, so the rug's diagonal edge becomes a staircase of whole tiles. Look at four spots per tile, and a tile half under the rug counts as half.

### Render targets start with none

`antialias: true` multisamples only the canvas. A render target has its own `samples` setting, and it defaults to 0. An `EffectComposer` draws the scene into targets like that, so adding post-processing quietly brings the jaggies back.

Try the three buttons, and watch the thin cables and the shelf edges.

<div data-scene="edges"></div>

## B · Working knowledge

### Getting antialiasing back after adding a composer

```js
const size = renderer.getDrawingBufferSize(new Vector2());
const target = new WebGLRenderTarget(size.width, size.height, { type: HalfFloatType, samples: 4 });
const composer = new EffectComposer(renderer, target);
composer.setSize(innerWidth, innerHeight); // the composer's own sizes are in CSS pixels
```

An `FXAAPass` or `SMAAPass` at the end smooths the finished picture instead, with less memory but softer detail. `samples` is capped by the GPU at `renderer.capabilities.maxSamples`, and any other target, like a mirror or a thumbnail, needs `samples` too.

### Thin lines

WebGL draws `Line` and `LineSegments` one pixel wide on almost every platform, whatever `linewidth` says. That makes them the first thing to look jagged without MSAA. For real thickness, `Line2` and `LineMaterial` from `three/addons/lines/` build lines from triangles.

### What it costs

Each sample keeps its own color and depth, so a 4-sample target takes about 4 times the memory of a plain one, plus the plain picture the samples are averaged into. At a pixel ratio of 2 on a large screen, that's tens of megabytes per target, and a composer has two.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
