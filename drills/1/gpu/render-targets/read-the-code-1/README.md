---
id: 1.gpu.render-targets.read-the-code.1
loop: 1
tier: core
concepts: [gpu.render-targets]
mode: read-the-code
context: gpu.render-targets/mirrors
lenses: []
misconceptions:
  - gpu.render-targets/always-screen
---

# Render targets

> **In short:** A render target is an offscreen picture: three.js draws into it instead of the canvas, and you use the result as a texture.
>
> **Used for:** Mirrors and security-camera monitors, product thumbnails, picking objects by color, and post-processing.

## A · The basics

### Drawing somewhere other than the screen

Rendering goes to the canvas by default. `renderer.setRenderTarget(target)` points every draw after it into the target instead: a picture of its own, with a **color texture** and a depth buffer. `setRenderTarget(null)` points back to the canvas.

```js
renderer.setRenderTarget(target);       // target: new WebGLRenderTarget(512, 512)
renderer.render(scene, securityCamera); // into the target, not the canvas
renderer.setRenderTarget(null);         // back to the canvas
monitor.material.map = target.texture;  // show it on a mesh
```

three.js does this for you too: each shadow-casting light renders its shadow map into a render target.

**Analogy: a painting within a painting.** An artist paints a small study on a separate board, then paints that board hanging on a wall of the big picture. The render target is the separate board.

Change the target's width. Small targets look blocky on the monitor, and every size costs a second render each frame.

<div data-scene="monitor"></div>

### Render once, use many times

A render target keeps its picture until something draws into it again. A thumbnail rendered once costs nothing per frame afterwards except drawing the card it's on. A mirror or a monitor that follows the scene costs a full render every frame.

Compare rendering the three swatches once with rendering them every frame.

<div data-scene="thumbnails"></div>

## B · Working knowledge

### Creating one

```js
const target = new WebGLRenderTarget(512, 512, { type: HalfFloatType, samples: 4 });
target.setSize(1024, 1024); // when the canvas or the need changes
target.dispose();           // frees its GPU memory; garbage collection doesn't
```

By default it has 8-bit color, a depth buffer, and no antialiasing. `HalfFloatType` keeps colors brighter than white, which bloom and tone mapping need. Match the camera to the target's shape: `camera.aspect = target.width / target.height`.

### Common mistakes

Forgetting `setRenderTarget(null)` sends every later render, the main one included, into the target, and the canvas stops changing. A mesh can't show a target while it's being drawn into, so hide it during that render, the way a mirror hides itself. And a render into a target skips tone mapping and the sRGB conversion: on a material it looks right, but read back as raw pixels it looks too dark.

### GPU memory

8-bit color takes 4 bytes a pixel, and the depth buffer usually about as much again. So a 2048 × 2048 target holds about 16.8 MB of color alone, until `dispose()`.

### Picking by color

Render every object in its own flat color into a tiny target, then read the pixel under the pointer: its color says which object it is. The readback page covers the wait that reading costs.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
