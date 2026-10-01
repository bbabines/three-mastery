---
id: vfx.value-noise.page
elective: vfx
kind: page
concepts: [vfx.value-noise]
renderer: webgpu
---

# Value and gradient noise

> **In short:** Noise is a repeatable field of smoothly changing values; a shader can use those values to make clouds or an uneven edge without a painted image.
>
> **Used for:** Clouds, heat shimmer, and irregular dissolve edges.

## A · The basics

Imagine many nearby weather stations reporting numbers. If neighboring readings change gently, drawing their values across a map makes broad hills and valleys, not isolated random dots. Gradient noise makes that sort of smooth field from coordinates. The same coordinate gets the same value whenever it is sampled: motion comes from moving the coordinate, not from noise changing on its own.

The left square shows the field; the right keeps only values above a cutoff. Change the scale to see large clouds become small patches.

<div data-scene="preview"></div>

## B · Going deeper

### The TSL you type

```js
const field = mx_noise_float(uv().mul(scale)).mul(0.5).add(0.5);
const cloud = smoothstep(cutoff.sub(0.08), cutoff.add(0.08), field);
```

| TSL | GLSL | Unreal | What it does |
| --- | --- | --- | --- |
| `uv()` | interpolated UV | TexCoord | Gives the surface coordinate. |
| `mx_noise_float(p)` | noise function | Noise | Samples smooth gradient noise at `p`. |
| `smoothstep(a,b,x)` | smoothstep | SmoothStep | Softens the threshold into a mask. |

The MaterialX noise node produces a signed field; the multiply and add put it in a useful zero-to-one range. A larger UV scale makes smaller features. Noise is math for every covered pixel and uses no texture memory; high frequencies can shimmer when details become smaller than a pixel. A painted noise texture trades that shader work for memory and a texture read.

**Common mistake:** adding time to the result, as if noise itself had a clock. Move the input coordinate when you want a pattern to flow, and keep a fixed coordinate when you need a stable cloud.

## Exercise · Build it

Write `cloudMask` in this page's `drill.ts`. It receives a UV, scale, and cutoff. Remap gradient noise to zero-to-one and use a 0.16-wide smooth transition centered on the cutoff. The page compares your mask with the reference at three settings; its lowest match must reach 95% to log the page once.

The three.js docs and source are fine to use. AI tools and `/solutions` aren't.

<div data-exercise></div>
