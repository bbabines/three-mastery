---
id: vfx.fbm.page
elective: vfx
kind: page
concepts: [vfx.fbm]
renderer: webgpu
---

# fBm: detail at several scales

> **In short:** fBm layers smooth noise at rising frequencies and falling strengths, adding fine detail without losing the broad shape.
>
> **Used for:** Smoke, eroded terrain edges, and a rough dissolve boundary.

## A · The basics

Think of a coastline: from far away it has one outline, while walking closer reveals smaller bays and rocks. One noise sample gives only one size of feature. Adding weaker samples at twice and four times the frequency gives several sizes in one field.

The left square is one octave of noise. The right adds two weaker octaves. Change the starting scale and watch both pictures together.

<div data-scene="preview"></div>

## B · Going deeper

### The TSL you type

```js
const p = uv().mul(scale);
const field = mx_noise_float(p)
  .add(mx_noise_float(p.mul(2)).mul(0.5))
  .add(mx_noise_float(p.mul(4)).mul(0.25))
  .div(1.75);
```

| TSL | GLSL | Unreal | What it does |
| --- | --- | --- | --- |
| `mx_noise_float(p)` | gradient noise function | Noise | Gives one octave. |
| `p.mul(2)` | `p * 2.0` | Multiply | Doubles feature frequency. |
| `.add(...)` | `+` | Add | Combines octaves. |

The weights sum to 1.75, so dividing by that keeps the total range controlled before remapping it to zero-to-one. Each octave adds a noise evaluation per pixel. More octaves cost more, and ones finer than a pixel can alias instead of helping.

**Common mistake:** adding equally strong octaves. The smallest features then dominate the broad shape, and the result becomes harsh rather than richer.

## Exercise · Build it

Write `layeredMask` in `drill.ts`: three octaves with weights 1, 0.5, and 0.25; normalize, remap, then threshold with a 0.16-wide smooth transition. The lowest of three reference comparisons must reach 95% to log the page once.

<div data-exercise></div>
