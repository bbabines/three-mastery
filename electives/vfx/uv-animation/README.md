---
id: vfx.uv-animation.page
elective: vfx
kind: page
concepts: [vfx.uv-animation]
renderer: webgpu
---

# UV animation

> **In short:** Move a pattern by changing the coordinates sent to it, while the mesh stays in place.
>
> **Used for:** Scrolling energy, a rotating vortex, and flowing water.

## A · The basics

Imagine a stencil held over paper. Sliding the stencil changes where its marks land without moving the paper. UV animation moves the sampling stencil in the same way. The left square has fixed bands; the right adds a time phase, so the bands slide.

<div data-scene="preview"></div>

## B · Going deeper

### The TSL you type

```js
const phase = fract(uv().x.mul(4).add(fract(time.mul(speed))));
const band = oneMinus(smoothstep(0.2, 0.3, abs(phase.sub(0.5))));
```

| TSL | GLSL | Unreal | What it does |
| --- | --- | --- | --- |
| `fract(x)` | `fract` | Frac | Wraps a repeated coordinate into one cycle. |
| `time.mul(speed)` | `time * speed` | Time × Multiply | Advances the pattern in turns per second. |
| `atan(p.y,p.x)` | `atan(y,x)` | Arctangent2 | Converts centered UVs to an angle for a vortex. |

Subtract the center before rotating UVs; otherwise the pattern spins around a corner. Polar coordinates use angle and radius to turn horizontal scrolling into circular motion. A flow map adds a texture lookup to steer each region differently. Simple offsets are cheap; repeated texture samples and overdraw cost more.

**Common mistake:** adding raw, ever-growing time to UV. Wrap a repeating phase with `fract`; float precision eventually makes a huge raw phase stutter.

## Exercise · Build it

Write `flowBands` in `drill.ts`. Make four soft vertical bands move with wrapped time at `speed` turns per second. The page freezes time for three speed settings and requires a 95% worst-case pixel match before logging once.

<div data-exercise></div>
