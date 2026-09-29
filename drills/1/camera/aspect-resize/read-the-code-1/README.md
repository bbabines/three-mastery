---
id: 1.camera.aspect-resize.read-the-code.1
loop: 1
tier: light
concepts: [camera.aspect-resize]
mode: read-the-code
context: camera.aspect-resize/window-resize
lenses: []
misconceptions:
  - camera.aspect-resize/setsize-aspect
---

# Aspect and resize

> **In short:** When the canvas changes shape, resize the renderer and also give the camera the new shape, `camera.aspect = w / h` then `camera.updateProjectionMatrix()`, or the picture stretches.
>
> **Used for:** Browser windows that resize and phones that rotate; split screens and side-by-side views; saving a thumbnail or screenshot at a set size; and side panels that open and close beside the 3D view.

## A · The basics

### Two things have a shape

- **The canvas** has a size in pixels: how many there are to draw into. `renderer.setSize(w, h)` sets it.
- **The camera** has an `aspect`: the width ÷ height of the view it projects, from the projection matrix page.

They're separate. `setSize` changes the canvas and nothing else: it doesn't know about any camera, since one renderer can draw many cameras. When the canvas gets wider but the camera's `aspect` stays the same, the camera's picture is stretched to fill the new shape, and circles become ovals.

**Analogy: a photo in a frame.** Put a square photo in a wide frame and stretch it to fit, and every face in it gets wider. A wide frame needs a wide photo. `setSize` changes the frame; `aspect` is the shape of the photo the camera takes.

The picture in the corner stands in for a canvas. Widen it with the slider. With only `setSize`, the ball turns into an oval; with the camera updated too, it stays round and the camera sees more from side to side.

<div data-scene="stretch"></div>

## B · Working knowledge

### The resize handler

```js
const resize = () => {
  const w = container.clientWidth;
  const h = container.clientHeight;
  if (w === 0 || h === 0) return; // hidden: 0 / 0 would put NaN in the camera
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
};
new ResizeObserver(resize).observe(container);
```

- **`setSize` takes CSS pixels** and multiplies them by the pixel ratio set once at startup with `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`.
- **The `false`** tells `setSize` to leave the canvas's CSS size alone, for a canvas the page's CSS already sizes, like one at 100% of its container. Without it, `setSize` writes the width and height into the canvas's style too.
- **`ResizeObserver`** catches every change of the container's size, including a side panel opening; `window.addEventListener('resize', resize)` only catches the window. The scenes on these pages resize this way, zero check included.
- **The zero check** matters for anything that can be hidden. A collapsed panel measures 0 by 0, and 0 / 0 is NaN in JavaScript, with no error: NaN gets into the projection matrix, and nothing draws properly until the next resize.

### Orthographic cameras

An orthographic camera has no `aspect`. Keep the height it shows and widen or narrow its box to match the canvas:

```js
const halfHeight = 3; // shows 6 world units from top to bottom
camera.left = -halfHeight * (w / h);
camera.right = halfHeight * (w / h);
camera.top = halfHeight;
camera.bottom = -halfHeight;
camera.updateProjectionMatrix();
```

### Split views

For two views side by side in one canvas, like a floor plan next to a 3D view, each camera draws into its own part, picked with `renderer.setViewport` and `renderer.setScissor`. Each camera's `aspect` is its own part's width ÷ height, not the whole canvas's: two halves of a 1600 × 600 canvas are each 800 × 600.

### A thumbnail at a new size

To render a square thumbnail from a wide view's camera, draw into a render target of the thumbnail's size with `camera.aspect = 1` and `updateProjectionMatrix()`, then set them back. Anything the camera draws into has to match its aspect, or the thumbnail stretches the same way. The render targets page in the GPU domain covers drawing into one.

### Which space is it in?

This page matches two ends of the trip: the shape of the view the camera projects into **clip space**, and the shape of the **screen pixels** it's stretched over.

| Value | Space |
| --- | --- |
| `w` and `h` passed to `renderer.setSize` | CSS pixels |
| `renderer.domElement.width`, `height` | Device pixels: CSS pixels times the pixel ratio |
| `camera.aspect` | A ratio, width ÷ height, with no unit |
| An OrthographicCamera's `left`, `right`, `top`, `bottom` | World units, measured from the camera's center |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
