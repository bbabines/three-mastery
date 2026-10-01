---
id: vfx.cellular-noise.page
elective: vfx
kind: page
concepts: [vfx.cellular-noise]
renderer: webgpu
---

# Cellular noise

> **In short:** Cellular noise reports how close a point is to the nearest scattered feature point, so cells and cracks can appear without a texture.
>
> **Used for:** Cracked shields, scale patterns, and watery caustics.

## A · The basics

Imagine dropping seeds on a floor. Every spot belongs to its nearest seed. Measuring that distance across the floor makes a dark center around each seed and brighter space between them. A threshold can keep just the neighborhoods near seeds, or invert the rule to show borders.

The left square shows nearest-seed distance; the right keeps the close regions. Change the cell count. Unlike a random number per pixel, nearby points share a cell and make a visible shape.

<div data-scene="preview"></div>

## B · Going deeper

### The TSL you type

```js
const distance = mx_worley_noise_float_2d(uv().mul(cells));
const nearSeed = oneMinus(smoothstep(edge.sub(0.05), edge.add(0.05), distance));
```

| TSL | GLSL | Unreal | What it does |
| --- | --- | --- | --- |
| `mx_worley_noise_float_2d(p)` | Worley/Voronoi function | Voronoi-style material function | Returns a feature-point distance. |
| `smoothstep(a,b,d)` | smoothstep | SmoothStep | Fades across a distance band. |
| `oneMinus(x)` | `1.0 - x` | OneMinus | Makes near points bright instead of far points. |

This is a procedural pattern, so the cell layout is repeatable at fixed UVs. Each pixel checks neighboring feature points; that costs more shader math than one simple noise sample. Scale the UV only as far as the displayed resolution can show.

**Common mistake:** looking for a cellular image to load. A texture may be faster when the pattern is fixed, but the shader can compute cells when you need to change their scale or threshold live.

## Exercise · Build it

Write `cellMask` in `drill.ts`. Keep regions close to each feature point, fading over a 0.10-wide band centered on `edge`. Test at three cell counts and edges in the viewer; the lowest match must reach 95% to log the page once.

<div data-exercise></div>
