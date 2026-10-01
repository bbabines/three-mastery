---
id: vfx.mask-compositing.page
elective: vfx
kind: page
concepts: [vfx.mask-compositing]
renderer: webgpu
---

# Mask remapping and compositing

> **In short:** A mask says where an effect appears; remapping changes its edge, and compositing combines several masks into a new shape.
>
> **Used for:** Dissolving a part, layered magic, and stylized fire.

## A · The basics

Cut a hole from a paper disc. The outer edge says where the disc begins; the inner edge says where the hole begins. Both can be signed distances. Taking the larger of the outer distance and the *negated* hole distance keeps only points inside the disc and outside the hole.

Move the smaller circle. The left square remains one disc; the right shows the cutout.

<div data-scene="preview"></div>

## B · Going deeper

### The TSL you type

```js
const cut = max(outerDistance, holeDistance.negate());
const mask = oneMinus(smoothstep(0, softness, cut));
```

| TSL | GLSL | Unreal | What it does |
| --- | --- | --- | --- |
| `max(a,b)` | `max` | Max | Intersects two signed regions; with a negated hole, cuts it out. |
| `a.mul(b)` | `a * b` | Multiply | Keeps overlap between two ordinary masks. |
| `oneMinus(x)` | `1.0 - x` | OneMinus | Flips a fade from outside to inside. |
| `smoothstep(a,b,x)` | smoothstep | SmoothStep | Sets edge softness or an erosion threshold. |

For ordinary zero-to-one masks, `max(a,b)` keeps either region, multiply keeps their overlap, and screen (`1 - (1-a)(1-b)`) brightens their union. Changing a threshold erodes or expands a mask without changing its source texture. The arithmetic is cheap; the noise or texture reads that produced the masks, and translucent overdraw, usually cost more.

**Common mistake:** multiplying every pair of masks. That removes anything not in both, which is wrong when the job is to keep either effect.

## Exercise · Build it

Write `cutoutMask` in `drill.ts`: a radius-0.32 disc with a radius-0.14 hole, moved right by `gap`, with `softness` at the resulting edge. Match three offsets and edge widths at 95% or more to log the page once.

<div data-exercise></div>
