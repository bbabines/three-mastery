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

> **In short:** Post-processing draws the scene into an offscreen picture first, then runs full-screen passes over it, each one a full screen of pixel work, before the result reaches the canvas.
>
> **Used for:** A glow around bright lights and screens (bloom); an outline around the part a shopper picked; smoothing jagged edges after the fact (FXAA); and looks like depth of field, ambient occlusion, and color grading.

## A · The basics

### A chain of pictures

Some effects need the whole finished frame: a glow has to spread past an object's edges, and an outline has to know where one object ends and the next begins. So the frame is built in steps, called **passes**. The first draws the scene into a render target (the render targets page). Each pass after it draws one triangle covering the whole screen, whose fragment shader reads the previous picture and writes a new one. The last pass writes to the canvas.

three.js's `EffectComposer` runs the chain:

```js
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));      // the scene, into a render target
composer.addPass(new UnrealBloomPass(new Vector2(w, h), 0.8, 0.4, 0.85));
composer.addPass(new OutputPass());                    // tone mapping and sRGB, onto the canvas
renderer.setAnimationLoop(() => composer.render());    // instead of renderer.render
```

**Analogy: a print shop that reprints the whole poster for each touch-up.** Adding a glow isn't a quick stroke on top: the whole poster goes through the machine again, every square inch, and a glow takes several extra small prints to blur. The poster is the frame, and every trip through the machine is a pass.

### Why it isn't a cheap filter

A full-screen pass runs its fragment shader once for every pixel of its picture. At 1920 × 1080 and a pixel ratio of 2, that's 8.3 million fragments per pass, every frame. Effects are chains of passes: `UnrealBloomPass` runs 13, most at half size or smaller, and `OutlinePass` renders the whole scene twice more before its own eight full-screen passes.

Add effects to the scene one at a time. The readout counts the scene renders and full-screen passes the composer ran last frame; this scene draws each frame itself, through the composer.

<div data-scene="chain"></div>

### The last pass puts the color back

Rendering into a render target skips tone mapping and the sRGB conversion (the render targets page), so a composer's picture is linear until something converts it. `OutputPass` does that, and it has to come last. Without it, the frame reaches the screen with no tone mapping and in the wrong color space: too dark and too contrasty.

<div data-scene="output"></div>

## B · Working knowledge

### Setting up a composer

- **`OutputPass` goes last.** Passes that expect sRGB colors, like `FXAAPass`, go after it.
- **The composer copies the renderer's size and pixel ratio when it's created** and doesn't follow later changes: call `composer.setSize(w, h)` in your resize code, next to `renderer.setSize`.
- **Its render targets have no antialiasing,** so jagged edges come back. The multisampling page covers the fixes.
- **`renderer.info.render` shows only the last `render()` call,** which with a composer is one full-screen pass. The measurement tools page covers counting a whole frame.

### What each effect costs

| Pass | What it runs | Notes |
| --- | --- | --- |
| `RenderPass` | The whole scene, once | The same draw calls as `renderer.render` |
| `FXAAPass` | 1 full-screen pass | Cheap antialiasing, after `OutputPass` |
| `UnrealBloomPass` | 13 passes, most at half size or smaller | Works best on `HalfFloatType` targets, the composer's default |
| `OutlinePass` | 2 more scene renders and 8 full-screen passes | The stencil page draws an outline in one draw call |
| `OutputPass` | 1 full-screen pass | Required at the end |

Selection outlines are the classic trade-off: `OutlinePass` works on any shape and can show the outline through walls, at the cost above; a stencil outline costs one draw call.

### New in r186: effects on the renderer

```js
const renderer = new WebGLRenderer({ antialias: true, outputBufferType: HalfFloatType });
renderer.setEffects([new UnrealBloomPass(new Vector2(w, h), 0.8, 0.4, 0.85)]);
renderer.render(scene, camera); // tone mapping and the color space are applied for you
```

No `OutputPass`: three.js applies both itself and warns if you add one. With `antialias: true`, the buffer the scene is drawn into is multisampled, so edges stay smooth. `outputBufferType` goes in the constructor; `setEffects` logs an error without it.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
