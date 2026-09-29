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

> **In short:** A render target is an offscreen picture on the GPU: three.js can draw a scene into it instead of onto the canvas, and the result is a texture you can put on any material or read back.
>
> **Used for:** A security-camera monitor or a mirror inside a scene; product thumbnails for a variant picker; working out which object is under the mouse by color (GPU picking); and post-processing, shadows, and every other effect that draws in more than one pass.

## A · The basics

### Drawing somewhere other than the screen

The canvas is only where `renderer.render` draws by default. `renderer.setRenderTarget(target)` points every draw after it at the target instead: a picture of its own, with a **color texture** and a depth buffer. `renderer.setRenderTarget(null)` points back at the canvas.

```js
const target = new WebGLRenderTarget(512, 512);
renderer.setRenderTarget(target);
renderer.render(scene, securityCamera); // into the target, not the canvas
renderer.setRenderTarget(null);         // back to the canvas
monitor.material.map = target.texture;  // show it on a mesh
```

three.js already does this for you in places. Each shadow-casting light renders into a render target, its shadow map. The picture in the top-right corner on the camera domain's pages, what the camera in the scene sees, was a render target shown on a small panel.

**Analogy: a painting within a painting.** An artist can paint a small study on a separate board, then paint that board hanging on a wall of the big picture. The render target is the separate board: painted first, then used like any other image.

A security camera watches the product, and its picture plays on the monitor. Change the target's size: small targets look blocky on the monitor, and every size costs GPU memory and a second render of the scene each frame.

<div data-scene="monitor"></div>

### Render once, use many times

A render target keeps its picture until you draw into it again. A thumbnail rendered once at startup costs nothing per frame afterwards except drawing the card it's on; a mirror or monitor that has to follow the scene costs a full render every frame.

Three swatch cards show the product in three finishes, each rendered into its own small target. Compare rendering them once with rendering them every frame.

<div data-scene="thumbnails"></div>

## B · Working knowledge

### Creating one

```js
const target = new WebGLRenderTarget(512, 512, { type: HalfFloatType, samples: 4 });
target.setSize(1024, 1024); // when the canvas or the need changes
target.dispose();           // frees its GPU memory; garbage collection doesn't
```

- **Defaults:** a depth buffer yes, a stencil buffer no, `samples: 0` (no antialiasing, which the multisampling page covers), 8-bit color, no mipmaps.
- **`HalfFloatType`** keeps colors brighter than white, which bloom and tone mapping need; 8-bit color clips them to 1.
- **The camera you render with should match the target's shape:** `camera.aspect = target.width / target.height`.

### Common mistakes

- **Forgetting `setRenderTarget(null)`.** Every render after it, including the main one, keeps going into the target, and the canvas stops changing.
- **Drawing a target into itself.** WebGL won't read and write the same texture in one draw. Hide the mesh that shows the target while rendering into it, the way a mirror hides itself.
- **Expecting the canvas's color handling.** A render into a target skips tone mapping and the sRGB conversion, so the texture holds linear colors. Put on a material, it's converted on its way to the canvas and looks right; read back as raw pixels, it looks too dark. The multi-pass page covers how post-processing puts both back.

### GPU memory

8-bit color is width × height × 4 bytes, and `HalfFloatType` twice that. The depth buffer is 24 bits, which GPUs usually store in 4 bytes a pixel. So a 2048 × 2048 target is about 16.8 MB of color and as much again for depth, and a canvas-sized target at pixel ratio 2 on a 1920 × 1080 screen is 3840 × 2160 × 4 bytes, about 33 MB of color alone.

### GPU picking

Render every object in its own flat color into a tiny target, then read the pixel under the mouse: its color says which object it is. Reading pixels back makes the CPU wait for the GPU, which the readback page covers.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
