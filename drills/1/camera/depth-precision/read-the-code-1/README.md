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

> **In short:** The GPU tells which surface is in front by comparing stored depths, and a perspective camera spends most of its depth values just past the near plane, so a tiny `near` leaves too few for distant surfaces, which then flicker through each other.
>
> **Used for:** Stickers, decals, and floor markings on a surface; huge scenes like cities, terrain, or space; choosing `near` and `far` for a camera; and deciding when a logarithmic depth buffer is worth its cost.

## A · The basics

### How the GPU knows what's in front

When two surfaces cover the same pixel, the GPU keeps the nearer one. For every pixel it remembers how far away the nearest thing drawn there so far is, in the **depth buffer**, and a new surface only draws over a pixel if it's nearer.

Each depth is stored as a value from 0 at the near plane to 1 at the far plane: NDC z from the clip space, NDC, screen page, squeezed from −1 to 1 into 0 to 1. The buffer holds a fixed number of steps between 0 and 1, usually 24 bits' worth, about 16.7 million (WebGL only promises at least 16 bits). Two surfaces closer together than one step get the same value, and the GPU can't tell which is in front.

### Most of the steps are near the camera

The steps aren't spread evenly over the distance. A perspective camera uses up most of them just past `near`: with `near` 0.1 and `far` 10, a surface 1 unit away already has a depth value of 0.909. Everything from 1 unit to 9 units shares the next 9% of the steps.

**Analogy: a ruler with its marks crowded at one end.** Near the crowded end, you can measure a hair's width. At the far end, two things a finger apart read the same. The depth buffer is that ruler, with the crowded end at the camera, and `near` sets how crowded that end is: the smaller `near`, the more of the marks pile up right at the camera.

Each bar stands at a distance in front of the camera, and its height is the depth value a surface there gets; the gray line is 1, the far plane's value. At `near` 0.1, every bar is already close to the top: the first unit uses up almost all the steps. Lower `near` and they crowd the top even more. Raise it and the bars climb gradually, sharing the steps out.

<div data-scene="depthRuler"></div>

<details>
<summary>The math, if you're curious</summary>

The names you'll see in docs and forums: the depth buffer is also called the **z-buffer**, and surfaces flickering through each other is **z-fighting**. Because the steps bunch up near the camera, perspective depth is called **non-linear**. The depth value stored for a surface d units in front of the camera is:

depth = (1/near − 1/d) ÷ (1/near − 1/far)

When `far` is much bigger than `near`, the 1/far part hardly matters: the value depends almost entirely on `near` and the distance.

</details>

## B · Working knowledge

### Z-fighting: near is the lever

When two surfaces are so close that their depths round to nearly the same step, which one wins flips from pixel to pixel and from frame to frame. They flicker through each other in stripes: **z-fighting**.

The fix is usually `near`, not `far`. Raising `near` from 0.001 to 0.1 gives about 100 times more steps at every distance. Lowering `far` from 100,000 to 100 changes almost nothing, as long as `far` stays much bigger than `near`. Set `near` to the closest the camera ever needs to see, and no closer:

```js
const camera = new PerspectiveCamera(50, width / height, 0.1, 1000); // near 0.1, not 0.0001
```

The yellow sticker sits 1 millimeter (0.001 units) in front of the wall, and the readout counts the depth steps between them. At less than about one step, the wall shows through in speckles. Raise `near` until the sticker is clean, then try `far` at every setting: it barely changes the count. Orbit closer and farther too; the count falls fast with distance.

<div data-scene="zFight"></div>

### Stickers, decals, and floor markings

Two surfaces at exactly the same depth, like a sticker placed right on a wall, fight at any `near`: no amount of precision separates them. Either lift the sticker a little off the surface, by a gap that's many steps at the distance it's seen from, or nudge its depth toward the camera when it's drawn:

```js
stickerMaterial.polygonOffset = true;
stickerMaterial.polygonOffsetFactor = -1; // negative pulls it toward the camera
stickerMaterial.polygonOffsetUnits = -1;
```

The nudge is measured in depth-buffer steps, not world units, so it keeps working at any distance, where a fixed lift runs out of steps far away.

### Large scenes

A city, a terrain, or a solar system often needs a small `near` for things close by and a huge `far` for the horizon. In order of what to try:

1. **Raise `near`** as far as the camera allows. A walking camera rarely needs it below 0.1.
2. **A logarithmic depth buffer,** `new WebGLRenderer({ logarithmicDepthBuffer: true })`, spreads the steps out over the whole distance. The cost: three.js then writes each pixel's depth from the fragment shader, which stops the GPU from skipping hidden pixels before shading them. That's GPU work for every pixel, including ones that end up hidden. The depth buffer and early-z page in the GPU domain covers that skipping.
3. **A reversed depth buffer,** `new WebGLRenderer({ reversedDepthBuffer: true })`, which three.js's docs call faster and more accurate than the logarithmic one. It needs the browser's `EXT_clip_control` extension; without it, three.js warns and falls back to a normal depth buffer.

Both are renderer settings, chosen when the renderer is created.

### Orthographic cameras are different

An orthographic camera spreads its depth steps evenly from `near` to `far`. There, `far` is the lever: with `far` at 100,000 each step is about 6 millimeters, so layers a centimeter apart are less than two steps apart and can fight. That matters for the orthographic cameras that directional lights use for shadows, which the shadows page covers.

### Which space is it in?

This page works between **measured from the camera**, where a surface has a depth in world units, and **NDC** z, which the depth buffer stores squeezed into 0 to 1.

| Value | Space |
| --- | --- |
| NDC z | −1 at the near plane, 1 at the far plane |
| The depth buffer's value for a pixel | 0 at the near plane, 1 at the far plane: NDC z squeezed into 0 to 1 |
| `camera.near`, `camera.far` | Distances in front of the camera, in world units |
| `polygonOffsetFactor`, `polygonOffsetUnits` | Depth-buffer steps, not world units |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
