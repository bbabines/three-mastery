---
id: 1.camera.depth-precision.read-the-code.1
loop: 1
tier: core
concepts: [camera.depth-precision]
mode: read-the-code
context: camera.depth-precision/coplanar-decals
lenses: []
misconceptions:
  - camera.depth-precision/far-plane
---

# Depth precision

> **In short:** Depth is stored in a fixed number of steps, crowded near the camera, so a tiny `near` makes distant surfaces flicker through each other.
>
> **Used for:** Decals and floor markings, huge scenes like cities or terrain, picking `near` and `far`, and logarithmic depth buffers.

## A · The basics

### How the GPU knows what's in front

When two surfaces cover the same pixel, the GPU keeps the nearer one. For every pixel it remembers the depth of the nearest thing drawn there so far, in the **depth buffer**, and a new surface only draws over it if it's nearer.

Each depth is stored as a value from 0 at the near plane to 1 at the far plane, in a fixed number of steps, usually about 16.7 million. Two surfaces closer together than one step get the same value, so which one wins flips from pixel to pixel and frame to frame, and they flicker through each other in stripes: **z-fighting**.

### Most of the steps are near the camera

The steps aren't spread evenly over the distance. With `near` 0.1 and `far` 10, a surface 1 unit away already has a depth value of 0.909, so everything from 1 to 10 units shares the last 9% of the steps.

**Analogy: a ruler with its marks crowded at one end.** Near the crowded end you can measure a hair's width; at the far end, two things a finger apart read the same. `near` sets how crowded that end is.

Drag `camera.near`. Each bar is the depth value a surface gets at that distance, up to 1 at the gray line: a small `near` pushes every bar to the top.

<div data-scene="depthRuler"></div>

<details>
<summary>The math, if you're curious</summary>

depth = (1/near − 1/d) ÷ (1/near − 1/far), for a surface d units in front of the camera. Because the steps bunch up near the camera, this is called **non-linear** depth.

</details>

## B · Working knowledge

### Z-fighting: near is the lever

The fix for z-fighting is usually `near`, not `far`: raising `near` from 0.001 to 0.1 gives about 100 times more steps at every distance, while lowering `far` barely helps. An orthographic camera, like a directional light's shadow camera, is the exception: it spreads its steps evenly, so there `far` matters as much.

```js
const camera = new PerspectiveCamera(50, width / height, 0.1, 1000); // near 0.1, not 0.0001
```

The sticker sits 0.001 in front of the wall, and the readout counts the depth steps between them. Raise `near` until the sticker is clean, then try `far`: it barely changes the count.

<div data-scene="zFight"></div>

### Stickers and decals

Two surfaces at exactly the same depth, like a sticker placed right on a wall, fight at any `near`. Nudge the sticker's depth toward the camera when it's drawn:

```js
stickerMaterial.polygonOffset = true;
stickerMaterial.polygonOffsetFactor = -1; // negative pulls it toward the camera
stickerMaterial.polygonOffsetUnits = -1;
```

The nudge is measured in depth steps, not world units, so it keeps working far away, where a small lift off the wall runs out of steps.

### Large scenes

A city or a terrain may need a small `near` and a huge `far`. Raise `near` as far as the camera allows first; a walking camera rarely needs it below 0.1. If that isn't enough, `new WebGLRenderer({ logarithmicDepthBuffer: true })` spreads the steps over the whole distance. Its cost is GPU work for every pixel: depth is written from the fragment shader, so the GPU can't skip hidden pixels before shading them.

### Which space is it in?

This page works between **measured from the camera** and **NDC**.

| Value | Space |
| --- | --- |
| `camera.near`, `camera.far` | Distances in front of the camera, in world units |
| NDC z | −1 at the near plane, 1 at the far plane |
| The depth buffer's value | NDC z squeezed into 0 to 1 |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
