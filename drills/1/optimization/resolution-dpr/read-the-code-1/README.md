---
id: 1.optimization.resolution-dpr.read-the-code.1
loop: 1
tier: core
concepts: [optimization.resolution-dpr]
mode: read-the-code
context: optimization.resolution-dpr/phones
lenses: []
misconceptions:
  - optimization.resolution-dpr/display-setting
---

# Resolution and DPR

> **In short:** Doubling the pixel ratio draws four times the pixels, and the GPU shades every one, so capping it is a big saving.
>
> **Used for:** Smooth viewers on phones, 4K monitors, a softer picture while the user orbits, and low-end laptops.

## A · The basics

### Two kinds of pixels

**CSS pixels** are the page's own units, and **device pixels** are the screen's real dots. A screen's **device pixel ratio**, `devicePixelRatio`, is how many device pixels fit across one CSS pixel: usually 1 on a classic display, 2 on a high-density one, and 3 on many phones.

`renderer.setPixelRatio(r)` sets the renderer's own **pixel ratio**. The canvas keeps its size on the page. What changes is how many pixels it draws to fill it: its width times `r`, by its height times `r`.

### The cost grows with the square

Double the ratio and the width and the height both double, so the canvas draws four times the pixels. Each one runs the fragment shader, so the pixel work is four times too, and at a ratio of 3 it's nine times. It isn't a display setting: it's work the GPU does every frame.

**Analogy: a mosaic.** Tiles half the size make a finer picture, but it takes four times the tiles to cover the same wall. Stand far enough back and the smaller tiles only add work.

Change the pixel ratio and watch the pixel count. Past this screen's own ratio, the extra pixels cost just as much and add little you can see.

<div data-scene="pixels"></div>

<details>
<summary>The math, if you're curious</summary>

Pixels drawn = width × height × ratio². A 1920 × 1080 canvas at a ratio of 2 draws about 8.3 million. How many pixels a GPU can shade in a second is its **fill rate**.

</details>

### Lowering it while the view moves

A moving picture hides softness. So a common trick drops the ratio while the user orbits and puts it back when they let go. Halving it cuts the pixels to a quarter for as long as the drag lasts.

Pick a button, then orbit with the mouse or the orbit slider, and watch the pixel count.

<div data-scene="orbit"></div>

## B · Working knowledge

### Capping the ratio

```js
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
```

On a phone that reports 3, this draws four times the pixels of a ratio of 1 instead of nine, less than half the work, and the difference is usually hard to see at arm's length. A heavy scene can cap lower, at 1.5, and the adaptive quality page picks the ratio from how the frames are going.

### Lowering it while orbiting

```js
const full = Math.min(devicePixelRatio, 2);
controls.addEventListener('start', () => renderer.setPixelRatio(full / 2));
controls.addEventListener('end', () => renderer.setPixelRatio(full));
```

`setPixelRatio` resizes the canvas's buffers, so change it when a drag starts and ends, not every frame. If you render only on demand, render once more after putting the ratio back, or the last soft frame stays on screen.

### Sizing a full-screen render target

A render target ignores the pixel ratio. Size a full-screen one in device pixels, or it comes out soft on a high-density screen:

```js
const size = renderer.getDrawingBufferSize(new Vector2()); // device pixels
const picture = new WebGLRenderTarget(size.x, size.y);
```

### Which space is it in?

| Value | Space |
| --- | --- |
| `devicePixelRatio` | Device pixels per CSS pixel, on this screen |
| `renderer.getPixelRatio()` | Device pixels drawn per CSS pixel |
| `renderer.getSize(v)`, `canvas.clientWidth` | CSS pixels |
| `renderer.getDrawingBufferSize(v)`, `canvas.width` | Device pixels |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
