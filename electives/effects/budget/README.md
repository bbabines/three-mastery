---
id: effects.budget.page
elective: effects
kind: page
concepts: [effects.budget]
renderer: webgpu
---

# Choosing effects for a frame budget

> **In short:** Pick the few effects that show on the product, one set for moving and one for still, and measure them on the screen that runs them.
>
> **Used for:** product configurators, hero shots on a landing page, viewers that must run on phones, and deciding what to cut when a page stutters.

## What it adds

### A budget, a moving view, and a still view

A screen shows a new picture 60 times a second, or 120 on some. That leaves 16.7 ms a frame, or 8.3, for everything: your code, the browser, and the GPU. The GPU's share is the **frame budget**. An effect is worth its slice only if it shows on the product.

A viewer spends its time in two states. While the view **moves**, every frame is new and has to fit. Once it's **still**, the progressive average (the progressive smoothing page) can carry effects the moving view can't afford, because after 32 frames it stops drawing and only shows the average. So each effect gets one of three answers: off, still only, or always.

Think of packing a carry-on. Everything has to fit the same small bag, so you choose what you'll actually wear, not everything you own.

Pick each **preset** while the watch is **turning**, then **still**. Watch the third line: passes and draws stay the same every frame, and once 32 frames are in, the still view draws nothing new. Press **time it** for each preset; it times the moving view, the still view while averaging, and the still view once it's done. **Every setting** opens each effect's off, still, and always.

<div data-scene="budget"></div>

The **WebGi showcase** is what the live webgi.dev page turns on for this watch: smoothing over frames while moving, 32 averaged frames when still, ambient occlusion, screen-space reflections on a polished floor, bloom, a soft ground shadow, and the key light's shadow. Bounced light and depth of field are off. The **desktop configurator** keeps what reads on a product (ambient occlusion, both shadows, glass, brushed metal) and drops reflections and bloom: a matte floor has nothing to reflect, and at WebGi's threshold bloom barely shows on this watch. The **phone configurator** draws the scene once while moving, with multisampling, moves ambient occlusion to the still view, keeps only the baked shadow, and caps the pixel ratio at 1.5. The presets are picked by judgment, as starting points to measure.

## What it costs

### What a frame grows with

Three things. **Pixels**: pixel ratio 2 has four times the pixels of 1, and every full-screen effect pays per pixel. **Scene draws**: each pass that draws the watch again (the key light's shadow map, the depth pass for ambient occlusion) repeats every triangle, which is why the counts read 367k triangles for a 120k-triangle watch. **Passes**: each full-screen effect writes a whole picture and the next one reads it back. Bloom and rough reflections take several passes each, so the WebGi showcase runs 25 passes a frame to the desktop configurator's 6. On a phone, moving those pictures through memory is often what runs out first.

### Measuring it honestly

three.js can ask the GPU to time each pass (`trackTimestamp`), and adds the passes up. But the GPU runs passes partly at the same time: on an M4 Pro Mac a later pass started almost at once and ended when the one before it did, so the sum counted the same time over and over. For the WebGi showcase it read 97 to 124 ms a frame on WebGPU, while whole frames took about 11. It can also read short: when the CPU is the slow part, sending hundreds of draws, the GPU sits idle between passes and the sum leaves that out.

**Time it** uses the clock on the wall instead. It draws frames back to back, as a page does while the view moves, and waits for the GPU once at the end: the average is what a frame costs, CPU and GPU together. Then it draws frames one at a time and waits for each, which adds the wait itself, so the second number on the readout usually reads longer. A warm-up comes first, since the first frames after a change compile shaders and a GPU that has been idling runs slow until it's kept busy.

Timed on that Mac in Chrome on WebGPU, two to four runs each, at pixel ratio 2 (1.82 million pixels; the phone preset 1.03 million), in ms a frame, back to back:

| Preset | Moving | Still, averaging | Still, 32 in |
| --- | --- | --- | --- |
| WebGi showcase | 7.7–10.7 | 6.0–8.6 | about 0.05 |
| Desktop configurator | 2.5–3.6 | 2.2–3.2 | about 0.05 |
| Phone configurator | 0.4–0.5 | 1.0–1.5 | about 0.05 |

On WebGL 2 the same presets took 9 to 12 ms moving (one run of four read 24), 3.5 to 6, and 1.3 to 1.6. Runs differ by up to a third, more on WebGL 2, so press **time it** twice. Every preset fits a desktop's 16.7 ms, and each still view settles to almost nothing: a copy of the average. None of that says anything about a phone, whose GPU is far smaller: open the page on the phone (the dev server's `--host` option serves it on your network) and time it there.

### Everything on, at a lower resolution

A common shortcut is to turn every effect on and lower the pixel ratio until it's fast. Compare it with a deliberate pick at full resolution, at the **crown, 4× closer**, then press **time it** on each.

<div data-scene="everything"></div>

On the M4 Pro, everything at pixel ratio 1 took about as long as the desktop configurator at 2, or longer: 3.5 against 2.0 ms moving on WebGPU, and 2.8 against 4.2 on WebGL 2. Everything at 2 took 10 to 11. For the same time, the crown's ridges turn to blocks and the sub-dial numerals blur, and the 27 passes and 87 draws don't shrink at all, since only per-pixel work scales with resolution. Detail is what a product viewer sells; most of those effects barely show on a watch on a plain floor.

## When to use it

Choose per effect, from what each page measured and what showed on the watch:

| Effect | Use it | Skip it |
| --- | --- | --- |
| Progressive smoothing | Always: it ends at almost nothing | Animations that never stop |
| Smoothing over frames (TRAA) | Moving view on desktop, and noisy effects | Phones, unless measured; use multisampling |
| Ambient occlusion | Parts that nest, always on desktop | Phones while moving: still only |
| Screen-space reflections | Polished floors, desktop showcases | Matte floors, configurators, phones |
| Bounced light | Colored props close by | A product on a plain backdrop |
| Contact shadows | A shadow camera that can't be fitted | One product with a fitted key light |
| Baked ground shadow | Everywhere the product sits still | Parts that move every few seconds |
| Glass (transmission) | A crystal over a dial | Thin flat glass on a phone that's over budget |
| Brushed metal | Brushed parts seen up close | Polished parts |
| Bloom | Showcase highlights | Configurators: it barely shows on steel |

For the Shopify viewer, which is WebGLRenderer, the closest route to the desktop configurator is the product elective's finishing chain, `createFinishing` in `electives/product/finishing.ts`: `ProductAOPass` (GTAO applied to environment light only) and `AccumulatePass` (32 jittered frames, then only a copy), with 4× multisampling on the moving frame since WebGL has no TRAA. Leave its `UnrealBloomPass` off, keep the baked ground shadow (the jewelry elective's `bakedGroundShadow`), and for a polished floor use a planar mirror, as the product stage's `ground.ts` does, rather than `SSRPass`.

## The code

### Two pipelines, one picked each frame

```ts
const moving = new THREE.RenderPipeline(renderer); // TRAA + ambient occlusion
const still = new THREE.RenderPipeline(renderer);  // the same, averaged over 32 frames
const moved = moveWatcher(camera); // compares the camera with the last frame's
// each frame:
const viewMoved = moved();
if (viewMoved) average.restart();      // any move starts the average over
(viewMoved ? moving : still).render(); // once 32 are in, still only shows the average
```

The whole bench is `electives/effects/budget/chain.ts`; each effect is built with the same settings as its own page.

### Cap the pixels

```ts
renderer.setPixelRatio(Math.min(devicePixelRatio, isPhone ? 1.5 : 2));
```

### Time whole frames on the device

```ts
const start = performance.now();
for (let i = 0; i < 60; i++) {
  nodeFrame.update(); // a new frame for three.js's passes, as the animation loop starts one
  renderPipeline.render();
}
await renderer.backend.device.queue.onSubmittedWorkDone(); // WebGPU: all 60 are finished
const ms = (performance.now() - start) / 60;
```

`nodeFrame` is `renderer._nodes.nodeFrame`: three.js runs each pass once a frame, so a second draw without a new frame skips them and times nothing. On WebGL 2 the wait is a fence (`gl.fenceSync`) checked until it's signaled. `stage.timeIt` in `electives/effects/stage.ts` is the full version: a warm-up first, then five rounds of back-to-back frames, then frames one at a time.

## How it goes wrong

| Symptom | Cause | Fix |
| --- | --- | --- |
| Soft, blocky detail after making it fast | Everything on, resolution lowered | Keep the resolution; drop effects that don't show |
| Smooth on the desktop, stutters on a phone | A desktop GPU is far bigger | Time it on the phone; cap the pixel ratio |
| The GPU timer reads 150 ms, but it runs smoothly | It adds up the passes, which the GPU runs partly at once | Time whole frames by the clock, back to back |
| A still view keeps the GPU busy | The chain is drawn every frame when nothing changes | Stop after 32 frames and show the average |
| The first timing is much slower | Shaders compiling for the new settings | Time it twice |
| Errors: "color attachment bytes per sample exceeds 32" | Too many pictures from one scene pass | Pack values into spare channels, as `chain.ts` does |
| An effect pops in when the view stops | It's still only | Keep still-only effects subtle, like ambient occlusion |

<div data-mark-done></div>
