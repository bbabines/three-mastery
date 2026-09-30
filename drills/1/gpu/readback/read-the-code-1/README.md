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

> **In short:** Reading pixels back from the GPU makes JavaScript wait for all the GPU's queued work, even for one pixel, unless you use the async version.
>
> **Used for:** Picking objects by color, saving screenshots, eyedropper color pickers, and checking a render target while debugging.

## A · The basics

### Asking the GPU a question

`renderer.render` doesn't draw anything itself. It sends commands to the GPU, which carries them out a little later while JavaScript moves on, so most of the time nothing waits.

Reading pixels is different. The pixels depend on every command queued before the read, so `readRenderTargetPixels` makes JavaScript stop until the GPU has worked through the whole queue. Reading one pixel waits as long as reading a thousand: the wait is for the queue, not the size.

**Analogy: asking a print shop for one page of a job still in the queue.** You wait at the counter until every job ahead of yours is printed, whether you want one page or a hundred. The async version is leaving your number and getting on with your day.

Move the pointer over the boxes, or use the sliders, and compare the two ways of reading.

<div data-scene="picking"></div>

## B · Working knowledge

### Picking by color

```js
renderer.setRenderTarget(pickTarget); // 1 × 1, each object in its own flat color
renderer.render(idScene, camera);
renderer.setRenderTarget(null);
const pixel = await renderer.readRenderTargetPixelsAsync(pickTarget, 0, 0, 1, 1, new Uint8Array(4));
```

`camera.setViewOffset` narrows the render to the pixel under the pointer, and `camera.clearViewOffset()` undoes it afterwards. Prefer the async read for hover and clicks: the answer arrives a frame or so later, and the page never freezes. Read from an 8-bit RGBA target, since other formats may not be readable.

### Screenshots

```js
const url = renderer.domElement.toDataURL('image/png');
```

The canvas's picture is cleared once the browser has shown it, so calling this later, from a button click, gives a blank image. Render and call `toDataURL` straight after, or create the renderer with `preserveDrawingBuffer: true`. It's a readback too, plus the PNG encoding.

### Color sampling

A render target holds linear colors, not the sRGB values a color picker shows. Convert the bytes before showing them: `new Color().setRGB(r / 255, g / 255, b / 255).getHexString()`.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
