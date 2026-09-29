---
id: 1.gpu.readback.read-the-code.1
loop: 1
tier: light
concepts: [gpu.readback]
mode: read-the-code
context: gpu.readback/gpu-picking
lenses: []
misconceptions:
  - gpu.readback/one-pixel-free
---

# Readback

> **In short:** Reading pixels back from the GPU makes JavaScript wait until the GPU has finished everything queued before the read, even for a single pixel, unless you use the async version and take the answer a little later.
>
> **Used for:** Finding which object is under the mouse by its color (GPU picking); saving a screenshot of the scene; an eyedropper that picks a color off the rendered picture; and checking what a render target holds while debugging.

## A · The basics

### Asking the GPU a question

`renderer.render` doesn't draw anything itself. It sends commands to the GPU, which carries them out a little later, while JavaScript moves on to the next thing (the frame budget page covers why that overlap matters). Most of the time nothing needs to wait.

Reading pixels is different. The pixels depend on every command queued before the read, so `renderer.readRenderTargetPixels` makes JavaScript stop until the GPU has worked through the whole queue, then copies the pixels over. Reading one pixel waits as long as reading a thousand: the wait is for the queue, not for the size. MDN's WebGL best practices list `readPixels` among the calls that are usually synchronous for this reason.

**Analogy: asking a print shop for one page of a job still in the queue.** You wait at the counter until every job ahead of yours is printed, whether you want one page or a hundred. The async version is leaving your number: they call when it's ready, and you get on with your day.

Move the pointer over the boxes (or use the sliders). Each move asks the GPU which box is under it, by rendering the boxes in ID colors into a 1 × 1 render target and reading that pixel. Compare the two ways of reading it.

<div data-scene="picking"></div>

## B · Working knowledge

### GPU picking

```js
camera.setViewOffset(width, height, x, y, 1, 1); // only the pixel under the pointer
renderer.setRenderTarget(pickTarget);           // a 1 × 1 WebGLRenderTarget
renderer.render(idScene, camera);                // each object in its own flat color
renderer.setRenderTarget(null);
camera.clearViewOffset();
const pixel = await renderer.readRenderTargetPixelsAsync(pickTarget, 0, 0, 1, 1, new Uint8Array(4));
```

- **Prefer the async version** for hover and clicks: the answer arrives a frame or so later, and the page never freezes waiting for it. It still makes the GPU work through its queue; it just doesn't make JavaScript sit and wait.
- **Read from an 8-bit RGBA target.** Other formats may not be readable, and three.js logs an error instead of reading.
- GPU picking's cost doesn't grow with triangle count the way raycasting does (the BVH page): it's one tiny render. The cost is the readback.

### Screenshots

```js
const url = renderer.domElement.toDataURL('image/png');
```

The canvas's picture is cleared once the browser has shown it, so calling this later, from a button click, gives a blank image. Either create the renderer with `preserveDrawingBuffer: true`, or call `renderer.render(scene, camera)` and `toDataURL` one straight after the other. `toDataURL` is a readback too, and encoding the PNG is more CPU time on top.

### Color sampling

A render target holds linear colors (the render targets page), not the sRGB values a color picker shows. Convert the bytes before showing them: `new Color().setRGB(r / 255, g / 255, b / 255).getHexString()`.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
