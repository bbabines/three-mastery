---
id: 1.gpu.multi-pass.read-the-code.1
loop: 1
tier: core
concepts: [gpu.multi-pass]
mode: read-the-code
context: gpu.multi-pass/bloom
lenses: []
misconceptions:
  - gpu.multi-pass/cheap-filters
---

# Multi-pass and post-processing

> **In short:** Post-processing draws the scene into an offscreen picture, then runs passes over the whole screen, and each pass is GPU work for every pixel.
>
> **Used for:** Glows around bright screens, selection outlines, smoothing edges after the fact, and color grading.

## A · The basics

### A chain of pictures

Some effects need the whole finished frame: a glow spreads past an object's edges, and an outline has to know where one object ends. So the frame is built in steps called **passes**. The first draws the scene into a render target. Each pass after it draws one triangle covering the whole screen, whose fragment shader reads the last picture and writes a new one. The last pass writes to the canvas. `EffectComposer` runs the chain, with effects added between the first and last passes:

```js
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));    // the scene, into a render target
composer.addPass(new OutputPass());                  // tone mapping and sRGB, onto the canvas
renderer.setAnimationLoop(() => composer.render()); // instead of renderer.render
```

**Analogy: a print shop that reprints the whole poster for each touch-up.** Adding a glow isn't a quick stroke on top. The whole poster goes through the machine again, every square inch.

### Why it isn't a cheap filter

A full-screen pass runs its fragment shader once for every pixel of its picture, the untouched middle as well as the edges. At 1920 × 1080 and a pixel ratio of 2, that's 8.3 million fragments per pass, every frame. And effects are chains: `UnrealBloomPass` runs 13 passes, most at half size or smaller, and `OutlinePass` renders the scene twice more before its own passes.

Add the effects one at a time, and watch the counts.

<div data-scene="chain"></div>

### The last pass puts the color back

Rendering into a render target skips tone mapping and the sRGB conversion, so a composer's picture stays linear until something converts it. `OutputPass` does that, at the end of the chain. Without it, the frame reaches the screen too dark.

Try all three buttons. The middle one leaves out `OutputPass`.

<div data-scene="output"></div>

## B · Working knowledge

### Setting up a composer

`OutputPass` goes at the end, and only passes that expect sRGB colors, like `FXAAPass`, go after it. The composer copies the renderer's size once, when it's created, so resize both:

```js
renderer.setSize(w, h);
composer.setSize(w, h); // it doesn't follow the renderer by itself
```

Its render targets have no antialiasing, so jagged edges come back; the multisampling page covers the fixes.

### What each effect costs

| Pass | What it runs |
| --- | --- |
| `RenderPass` | The whole scene, once |
| `FXAAPass` | 1 full-screen pass |
| `UnrealBloomPass` | 13 passes, most at half size or smaller |
| `OutlinePass` | 2 more scene renders and 8 full-screen passes |
| `OutputPass` | 1 full-screen pass |

Selection outlines are the classic trade-off: `OutlinePass` works on any shape and can show through walls, but a stencil outline costs one draw call.

### Effects on the renderer

```js
const renderer = new WebGLRenderer({ antialias: true, outputBufferType: HalfFloatType });
renderer.setEffects([new UnrealBloomPass(new Vector2(w, h), 0.8, 0.4, 0.85)]);
renderer.render(scene, camera); // tone mapping and the color space are applied for you
```

This newer option skips the composer. The renderer converts the colors itself, so there's no `OutputPass`, and with `antialias: true` the edges stay smooth. `setEffects` needs `outputBufferType` set in the constructor.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
