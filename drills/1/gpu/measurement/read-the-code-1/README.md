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

> **In short:** Every performance tool sees only part of a frame: a stopwatch around `renderer.render` times the CPU's side, the GPU's side needs a GPU timer or the browser's profiler, and `renderer.info` counts work instead of timing it.
>
> **Used for:** Timing a frame before and after a fix; counting a model's draw calls and triangles while optimizing it; capturing one frame to see exactly which draw calls, textures, and shaders it used; and spotting GPU memory that keeps growing as a shopper browses.

## A · The basics

### What each tool can see

| Tool | What it tells you | What it can't |
| --- | --- | --- |
| `performance.now()` around `renderer.render` | CPU time to prepare and send the frame | When the GPU finishes |
| `Stats` from `three/addons/libs/stats.module.js` | FPS, and the milliseconds between its `begin()` and `end()` | GPU time: its milliseconds are CPU time |
| `renderer.info.render` | Draw calls, triangles, lines, and points in the last `render()` call | Time |
| `renderer.info.memory` | How many geometries and textures are on the GPU | Bytes |
| A GPU timer query, `EXT_disjoint_timer_query_webgl2` | How long the GPU spent on a stretch of commands, a frame or two later | Anything, in browsers that don't offer it |
| Chrome's Performance panel | The main thread and the GPU on one timeline, and which frames were dropped | three.js's names for things |
| Spector.js, a browser extension | Every WebGL command in one frame, with its state, textures, and shaders | Timing |

**Analogy: a restaurant's records.** The till receipts say how many dishes went out (the counts), the kitchen clock says how long the cooks took (GPU time), and the waiter's watch only says how long it took to hand the order in (the time `render()` takes). A security camera over the pass shows every plate in order (a frame capture). None of them alone says why dinner was slow.

### render() returns before the GPU is done

`renderer.render` sends WebGL commands and returns. The GPU carries them out afterwards, while JavaScript moves on (MDN's WebGL best practices describe commands being queued this way). So `performance.now()` around it times the CPU's side only: three.js's JavaScript and handing the commands over. The GPU's share could be far bigger, and that stopwatch can't see it.

The scene asks the GPU to report when it has finished (a WebGL "fence") right after `render()` returns, then checks on later frames. Add pixel work with the slider: the GPU always finishes after `render()` has already returned.

<div data-scene="queue"></div>

### renderer.info counts only the last render()

`renderer.info.render` is cleared at the start of every `render()` call. A frame with several, like the camera's picture in the corner here, which is a second render into a render target, only shows the last one. Turn off `autoReset` and clear it yourself once per frame to count the whole frame.

<div data-scene="counts"></div>

## B · Working knowledge

### Counting a whole frame

```js
renderer.info.autoReset = false;
renderer.setAnimationLoop(() => {
  renderer.info.reset();                    // once per frame
  composer.render();                        // however many render() calls this makes
  console.log(renderer.info.render.calls);  // the whole frame
});
```

- `renderer.info.memory.geometries` and `.textures` are counts of objects on the GPU, not bytes. A count that keeps growing as the user moves between products is a leak; the leak detection page covers finding it.
- `renderer.info.programs.length` is how many shader programs have been compiled.

### Timing each side

```js
const start = performance.now();
renderer.render(scene, camera);
const submit = performance.now() - start; // CPU time to send the frame, not GPU time
```

- As a rule of thumb, that number also swallows any stall inside the call, like a shader compiling or a pixel readback, so a spike there can be either.
- **GPU time:** `renderer.extensions.has('EXT_disjoint_timer_query_webgl2')` says whether the browser offers GPU timer queries. Their results arrive a frame or two later, and three.js's WebGLRenderer doesn't read them for you. Chrome's Performance panel shows GPU activity without any code.
- Loop 3's proof experiments put these to work: change one thing, and watch which side's time moves.

### Capturing a frame

Spector.js records every WebGL command in one frame, with the state around it and the textures and shaders it used: how to find a doubled render, a wrong texture, or a draw call you didn't expect. The frame capture page in the debugging domain covers reading one.

### Measuring fairly

Take numbers from the same view, window size, and pixel ratio before and after, over a few seconds rather than one frame, with helpers, stats panels, and debug views removed. Watch frame time in milliseconds, not FPS, as the frame budget page explains.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
