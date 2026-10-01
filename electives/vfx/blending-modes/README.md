---
id: vfx.blending-modes.page
elective: vfx
kind: page
concepts: [vfx.blending-modes]
renderer: webgpu
---

# Additive vs alpha blending

> **In short:** Alpha blending replaces some background color; additive blending adds light, so it can brighten but never darken.
>
> **Used for:** Smoke, fire, and stacked glows.

## A · The basics

Overlay orange on blue. On the left, alpha mixing trades some blue for orange. On the right, additive mixing leaves the blue and adds orange light. A dark additive pixel contributes almost nothing, which lets a glow sit on a rectangular plane without a visible black square.

<div data-scene="preview"></div>

## B · Going deeper

### The material settings

```js
const glow = new THREE.MeshBasicNodeMaterial({
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
```

| TSL / three.js | GLSL | Unreal | Purpose |
| --- | --- | --- | --- |
| `NormalBlending` | `dst*(1-a) + src*a` | Translucent | Replaces part of the background. |
| `AdditiveBlending` | `dst + src*a` | Additive | Adds source light. |
| `depthWrite: false` | disable depth writes | Disable depth writes | Lets later transparent layers remain visible. |

With depth writes off, additive color addition is insensitive to the order of its overlapping layers; alpha layering is order dependent and needs sorting. Both modes still shade every covered pixel. Keep large transparent sheets to a minimum and use cutout geometry when a hard edge is enough.

**Common mistake:** calling additive blending free because it needs less sorting. It can still be fill-rate bound when many glows cover the same pixels.

## Exercise · Build it

Write `composite` in `drill.ts` using linear-light `Color` values. Return a new color for alpha or additive mixing without changing either input or clipping light above 1. Run `npm run drill -- electives/vfx/blending-modes`.
