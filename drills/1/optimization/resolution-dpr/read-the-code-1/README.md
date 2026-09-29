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

> **In short:** The pixel ratio decides how many device pixels the canvas draws for each CSS pixel, and the GPU's pixel work grows with its square, so capping it, and lowering it while the view moves, is one of the biggest savings in three.js.
>
> **Used for:** Keeping a product viewer smooth on phones; big 4K monitors and high-density laptop screens; a softer picture for a moment while the user orbits, zooms, or drags; and a fallback for low-end devices.

## A · The basics

### Two kinds of pixels

The camera and projection domain named them: **CSS pixels**, the page's own units, and **device pixels**, the screen's real dots. A screen's **device pixel ratio**, or DPR, is how many device pixels fit across one CSS pixel. The browser reports it as `window.devicePixelRatio`: MDN gives 1 for a classic display and 2 for a high-density one, and as a rule of thumb, many phones report 3.

`renderer.setPixelRatio(r)` is the renderer's own choice, set once in the setup lines on the renderer settings tour. The canvas keeps its size on the page in CSS pixels. What changes is how many pixels are drawn to fill it: its width times `r`, by its height times `r`.

### The cost grows with the square

Double the ratio and the width and the height both double, so the canvas holds four times the pixels. Every one of them runs the fragment shader for everything that covers it (the pipeline stages page), so the pixel work is four times too, and so is the memory of the canvas's own buffers. At a ratio of 3 it's nine times. None of this is a display setting: it's work the GPU does every frame.

**Analogy: a mosaic.** Tiles half the size make a finer picture, but it takes four times the tiles, and four times the work of laying them. Once you stand far enough back that you can't see the tiles, smaller ones only add work.

Change the ratio. The readout counts the pixels drawn each frame. Past this screen's own `devicePixelRatio`, the browser shrinks the picture back down to fit, so the extra pixels cost as much as any others and add little you can see.

<div data-scene="pixels"></div>

<details>
<summary>The math, if you're curious</summary>

Pixels drawn = (width × ratio) × (height × ratio) = width × height × ratio². A 1920 × 1080 canvas at a ratio of 2 draws 3840 × 2160, about 8.3 million pixels, in every pass over the screen. How many pixels a GPU can write per second is called its **fill rate**, and a scene limited by it is **fill-rate-bound**.

</details>

### Lowering it while the view moves

A picture in motion hides softness. So a common trick is to drop the ratio while the user orbits and put it back when they let go. Halving it cuts the pixels to a quarter for as long as the drag lasts.

Orbit around the plate with the mouse, or with the slider, under each button. The readout shows the ratio and the pixels drawn right now.

<div data-scene="orbit"></div>

## B · Working knowledge

### Capping the ratio

```js
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
```

- On a phone that reports 3, this draws 4 times the pixels of a ratio of 1 instead of 9, less than half the work. As a rule of thumb, few people can tell 2 from 3 at arm's length.
- A heavy scene can cap lower, at 1.5. The adaptive quality page, later in this domain, picks the ratio from how the frames are going.

### Lowering it while orbiting

```js
const full = Math.min(devicePixelRatio, 2);
controls.addEventListener('start', () => renderer.setPixelRatio(full / 2));
controls.addEventListener('end', () => renderer.setPixelRatio(full));
```

- `setPixelRatio` resizes the canvas's buffers, so change it when a drag starts and ends, not every frame.
- If you render only when something changes (the render on demand page), render once more after putting the ratio back, or the last soft frame stays on screen.

### Everything sized to the canvas pays too

- **Render targets.** An `EffectComposer` sizes its two pictures from the renderer's size times its pixel ratio, read once when it's created: call `composer.setPixelRatio(r)` as well when you change the ratio. A full-screen target you make yourself should be sized from `renderer.getDrawingBufferSize(size)`, in device pixels. Sized in CSS pixels, it comes out soft on a high-density screen.
- **Every full-screen pass** costs pixel work at the full count, so a post effect at a ratio of 2 costs four times what it does at 1 (the multi-pass and post-processing page).
- **Not shadow maps.** Their size is `light.shadow.mapSize`, whatever the ratio.

### Which space is it in?

| Value | Space |
| --- | --- |
| `window.devicePixelRatio` | Device pixels per CSS pixel, on this screen |
| `renderer.getPixelRatio()` | Device pixels the canvas draws per CSS pixel |
| `renderer.setSize(w, h)`, `renderer.getSize(v)`, `canvas.clientWidth` | CSS pixels |
| `renderer.getDrawingBufferSize(v)`, `canvas.width` | Device pixels |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
