---
id: vfx.domain-warping.page
elective: vfx
kind: page
concepts: [vfx.domain-warping]
renderer: webgpu
---

# Domain warping and curl noise

> **In short:** Domain warping bends a pattern by moving where it is sampled; curl noise is a swirling flow field that can carry those sample points or particles.
>
> **Used for:** Swirling smoke, portal energy, and particle drift.

## A · The basics

Picture drawing a circle on a flexible sheet, then pushing and pulling the sheet before reading the circle. The drawing rule stays a circle; the coordinates fed into it have moved. That's domain warping. The left square is the untouched circle and the right samples the same rule through two noise offsets.

<div data-scene="preview"></div>

## B · Going deeper

### The TSL you type

```js
const offset = vec2(mx_noise_float(p), mx_noise_float(p.add(vec2(17, 31))));
const warped = uv().add(offset.mul(amount));
const mask = oneMinus(smoothstep(0, 0.03, length(warped.sub(0.5)).sub(0.28)));
```

| TSL | GLSL | Unreal | What it does |
| --- | --- | --- | --- |
| `mx_noise_float(p)` | noise function | Noise | Supplies a smooth displacement. |
| `vec2(a,b)` | `vec2(a,b)` | AppendVector | Gives X and Y separate offsets. |
| `curlNoise(vec3(...))` | curl of a vector field | Material Function | Supplies a swirling direction rather than another gray noise value. |

The pinned three.js version provides `curlNoise` in `three/addons/tsl/math/curlNoise.js`. Curl is built from changes in a noise field; a two-dimensional slice turns around features rather than pointing straight into them. For a moving portal, use that direction to shift UVs over time. One warp already needs extra noise samples before the main shape, so keep the amount and sample count modest.

**Common mistake:** treating curl noise as a second grayscale layer. It is a direction field; use its components to move coordinates or particles.

## Exercise · Build it

Write `warpedCircle` in `drill.ts`. Use two independent smooth-noise samples to offset the circle's coordinates, then return a soft radius-0.28 mask. The viewer checks three warp amounts; its lowest match must reach 95% to log the page once.

<div data-exercise></div>
