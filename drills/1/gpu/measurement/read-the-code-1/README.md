---
id: 1.gpu.measurement.read-the-code.1
loop: 1
tier: core
concepts: [gpu.measurement]
mode: read-the-code
context: gpu.measurement/info-counts
lenses: []
misconceptions:
  - gpu.measurement/render-time-gpu
---

# Measurement tools

> **In short:** Each performance tool sees only part of a frame: a stopwatch around `render()` times the CPU, and `renderer.info` counts work without timing it.
>
> **Used for:** Timing a frame before and after a fix, counting draw calls, capturing one frame, and spotting GPU memory that keeps growing.

## A · The basics

### render() returns before the GPU is done

`renderer.render` sends WebGL commands and returns, and the GPU carries them out afterwards while JavaScript moves on. So `performance.now()` around it times only the CPU's side: three.js's JavaScript and handing the commands over. The GPU's share could be far bigger, and that stopwatch can't see it.

**Analogy: timing a letter by how long it takes to post.** Dropping it in the mailbox takes seconds, and the delivery happens later, out of sight. A stopwatch around `render()` times the posting.

Add work per pixel with the slider. The GPU still finishes after `render()` has returned.

<div data-scene="queue"></div>

### Counts, not times

`renderer.info` counts work instead of timing it: draw calls and triangles in `info.render`, geometries and textures in `info.memory`. `info.render` is cleared at the start of every `render()` call, so a frame with several, like the picture in the corner here, only shows the last one.

Switch to counting the whole frame, and watch the draw calls.

<div data-scene="counts"></div>

## B · Working knowledge

### Counting a whole frame

```js
renderer.info.autoReset = false;
renderer.info.reset();                   // once per frame, before rendering
composer.render();                       // however many render() calls this makes
console.log(renderer.info.render.calls); // the whole frame
```

`info.memory` counts geometries and textures on the GPU, not bytes. A count that keeps growing as the user moves between products is a leak.

### Timing the CPU's side

```js
const start = performance.now();
renderer.render(scene, camera);
const submit = performance.now() - start; // CPU time to send the frame, not GPU time
```

That number also swallows any stall inside the call, like a shader compiling or a pixel readback. `Stats`, from three.js's addons, times the same way: its milliseconds are CPU time.

### Seeing the GPU's side

`renderer.extensions.has('EXT_disjoint_timer_query_webgl2')` says whether the browser offers GPU timer queries, whose results arrive a frame or two later. Chrome's Performance panel shows GPU activity without any code. Spector.js, a browser extension, records every WebGL command in one frame, with its textures and shaders.

### Measuring fairly

Compare the same view, window size, and pixel ratio, over a few seconds rather than one frame, with stats panels and helpers removed. Watch frame time in milliseconds, not FPS.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
