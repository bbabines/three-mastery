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

> **In short:** Each fragment knows its spot on the canvas, `gl_FragCoord`, in device pixels from the bottom-left, so screen effects need sizes in the same units.
>
> **Used for:** Vignettes, dithered fades that stay put on screen, post-processing passes, and a glow that follows the mouse.

## A · The basics

### Which pixel am I?

Every run of the fragment shader can read `gl_FragCoord`, the spot of the pixel it's coloring. Its `x` and `y` count **device pixels from the bottom-left**, with y going up, unlike CSS, whose y goes down from the top.

Device pixels are the canvas's real pixels, not CSS pixels. With `renderer.setPixelRatio(2)`, an 800 × 600 CSS canvas is 1600 × 1200 device pixels, and `gl_FragCoord.x` runs up to 1600.

**Analogy: counting floor tiles.** "Tile 400 from the left wall" says nothing about meters until you know the tile size. Lay tiles half as wide, and tile 400 is only a quarter of the way across instead of halfway.

Change the pixel ratio, and the yellow line at 400 device pixels moves. Switch to `getSize()`, and the vignette slides toward the bottom-left.

<div data-scene="screen"></div>

## B · Working knowledge

### From gl_FragCoord to 0-to-1 across the canvas

```js
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));    // capped at 2: pixel cost grows with its square
const size = renderer.getDrawingBufferSize(new Vector2()); // the canvas in device pixels
material.uniforms.uResolution.value.copy(size);            // and again after every resize
```

```glsl
vec2 screenUv = gl_FragCoord.xy / uResolution;                    // 0 to 1 across and up
float dark = smoothstep(0.4, 0.8, distance(screenUv, vec2(0.5))); // a vignette
```

`renderer.getSize()` gives CSS pixels: right for layout, wrong next to `gl_FragCoord`, and the bug hides on a screen with a pixel ratio of 1. In a render target, `gl_FragCoord` counts the target's pixels, so pass the target's size instead.

### Pointer positions: flip y and scale

Pointer events are CSS pixels from the top-left, so scale by the pixel ratio and flip y:

```js
const ratio = renderer.getPixelRatio();
const rect = canvas.getBoundingClientRect();
uMouse.value.set((event.clientX - rect.left) * ratio, (rect.bottom - event.clientY) * ratio);
```

### Which space is it in?

| Value | Space |
| --- | --- |
| `gl_FragCoord.xy` | Device pixels from the bottom-left, y up |
| `renderer.getDrawingBufferSize(v)` | Device pixels |
| `renderer.getSize(v)`, `canvas.clientWidth` | CSS pixels |
| `event.clientX`, `event.clientY` | CSS pixels from the window's top-left, y down |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
