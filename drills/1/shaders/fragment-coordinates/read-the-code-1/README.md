---
id: 1.shaders.fragment-coordinates.read-the-code.1
loop: 1
tier: light
concepts: [shaders.fragment-coordinates]
mode: read-the-code
context: shaders.fragment-coordinates/vignette
lenses: []
misconceptions:
  - shaders.fragment-coordinates/css-pixels
---

# Fragment coordinates

> **In short:** `gl_FragCoord` tells a fragment shader which pixel it's coloring, counted in device pixels from the bottom-left corner, so anything laid out on the screen needs the canvas size in device pixels too.
>
> **Used for:** A vignette that darkens the corners of the view; dithered fades and other patterns that stay put on the screen; post-processing passes that work pixel by pixel; and a glow that follows the mouse.

## A · The basics

### Which pixel am I?

Every run of the fragment shader can read `gl_FragCoord`, the spot of the pixel it's coloring. Its `x` and `y` count pixels from the **bottom-left** corner, with y going up, unlike CSS, whose y goes down from the top. The bottom-left pixel's center is (0.5, 0.5). Its `z` is the fragment's depth, from 0 to 1, as on the depth precision page.

The pixels it counts are **device pixels**, the canvas's real pixels, not CSS pixels. The clip space, NDC, screen page showed the difference: with `renderer.setPixelRatio(2)`, an 800 × 600 CSS canvas is 1600 × 1200 device pixels, and `gl_FragCoord.x` runs up to 1600.

**Analogy: counting floor tiles.** "Tile 400 from the left wall" says nothing about meters until you know the tile size. Lay smaller tiles, twice as many across the same room, and tile 400 is only a quarter of the way over instead of halfway.

Change the pixel ratio. The yellow line is drawn where `gl_FragCoord.x` is 400, and it moves, because 400 device pixels cover fewer CSS pixels at a higher ratio. The vignette and its ring should stay centered; switch to measuring the canvas with `getSize()` and they slide toward the bottom-left, except at a ratio of 1, where the bug hides.

<div data-scene="screen"></div>

## B · Working knowledge

### From gl_FragCoord to 0-to-1 across the canvas

```js
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));    // device pixels per CSS pixel, capped at 2
const size = renderer.getDrawingBufferSize(new Vector2()); // the canvas in device pixels
material.uniforms.uResolution.value.copy(size);            // and again after every resize
```

```glsl
vec2 screenUv = gl_FragCoord.xy / uResolution; // 0 to 1 across and up, from the bottom-left
float dark = smoothstep(0.4, 0.8, distance(screenUv, vec2(0.5))); // a vignette
```

- `renderer.getSize()` gives CSS pixels: right for layout, wrong next to `gl_FragCoord`. The bug hides on a screen with a pixel ratio of 1.
- The cap at 2 is about cost: the number of pixels grows with the square of the ratio, so a ratio of 3 means 9 times the fragments of 1. The resolution and DPR page in the optimization domain covers it.

### Pointer positions: flip y and scale

Pointer events are CSS pixels from the top-left. For a shader, scale by the pixel ratio and flip y:

```js
const ratio = renderer.getPixelRatio();
const rect = canvas.getBoundingClientRect();
uMouse.value.set((event.clientX - rect.left) * ratio, (rect.bottom - event.clientY) * ratio);
```

### In a render target

Drawing into a render target, as post-processing passes do, `gl_FragCoord` counts the target's pixels, so pass the target's size instead of the canvas's (the render targets page).

### Which space is it in?

| Value | Space |
| --- | --- |
| `gl_FragCoord.xy` | Device pixels from the bottom-left of the canvas or render target, y up |
| `renderer.getDrawingBufferSize(v)` | Device pixels |
| `renderer.getSize(v)`, `canvas.clientWidth` | CSS pixels |
| `event.clientX`, `event.clientY` | CSS pixels from the window's top-left, y down |
| `screenUv` | 0 to 1 across and up the canvas |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
