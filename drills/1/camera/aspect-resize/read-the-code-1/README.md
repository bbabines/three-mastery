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

> **In short:** The canvas and the camera each have a shape, and a resize has to update both, or the picture stretches.
>
> **Used for:** Browser windows and rotating phones, side panels that open, split screens, and thumbnails at a set size.

## A · The basics

### Two things have a shape

The canvas has a size in CSS pixels, set with `renderer.setSize(w, h)`. The camera has an `aspect`: the width ÷ height of the view it projects. They're separate. `setSize` changes the canvas and nothing else, since one renderer can draw many cameras. When the canvas gets wider but `aspect` stays the same, the picture is stretched to fill it, and circles become ovals.

**Analogy: a photo in a frame.** Stretch a square photo to fill a wide frame, and every face in it gets wider. `setSize` changes the frame; `aspect` is the shape of the photo.

The picture in the corner is the canvas. Widen it with the slider, then try both buttons: with only `setSize`, the ball turns into an oval.

<div data-scene="stretch"></div>

## B · Working knowledge

### The resize handler

```js
if (w === 0 || h === 0) return; // hidden
renderer.setSize(w, h, false);
camera.aspect = w / h;
camera.updateProjectionMatrix();
```

`w` and `h` are the container's `clientWidth` and `clientHeight`, in CSS pixels, and `false` leaves the canvas's CSS size alone, for a canvas the page's CSS already sizes. Run it from a `ResizeObserver` on the container, which also catches a side panel opening; the window's `resize` event doesn't.

The first line matters for anything that can be hidden. A hidden container measures 0 by 0, and 0 / 0 is NaN in JavaScript, with no error: NaN gets into the projection matrix, and nothing draws properly until the next resize.

### Orthographic cameras

An orthographic camera has no `aspect`. Keep the height it shows, and widen or narrow its box to match:

```js
const halfHeight = 3; // shows 6 world units from top to bottom
camera.left = -halfHeight * w / h;
camera.right = halfHeight * w / h;
camera.updateProjectionMatrix();
```

### Split views and thumbnails

Each camera's `aspect` matches what it draws into. In a split view, picked with `setViewport` and `setScissor`, that's its own part of the canvas, not the whole. A square thumbnail from a wide view's camera needs `camera.aspect = 1` and `updateProjectionMatrix()` for that render, or it stretches the same way.

### Which space is it in?

This page works between **clip space**, where the camera's view has its shape, and **screen pixels**.

| Value | Space |
| --- | --- |
| `w` and `h` passed to `setSize` | CSS pixels |
| `renderer.domElement.width`, `height` | Device pixels: CSS pixels times the pixel ratio |
| `camera.aspect` | A ratio, width ÷ height, with no unit |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
