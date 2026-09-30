---
id: 2.math.dot-product.apply.1
loop: 2
tier: core
concepts: [math.dot-product]
mode: apply
context: math.dot-product/front-behind
lenses: []
misconceptions:
  - math.dot-product/always-unit-range
---

# Dot product: hotspots on the far side

> **The job:** tell whether a surface faces the camera, so the hotspots on the back of a product can hide.

## Task

A product viewer pins hotspots to a model: clickable dots, each with a label. As you orbit, the ones on the far side of the model should hide. Write `facesCamera(spot, normal, cameraPosition)`, which returns `true` when the camera is on the side the surface faces at that hotspot.

- `spot` is where the hotspot sits on the surface.
- `normal` is the way the surface faces there, at any length.
- `cameraPosition` is where the camera is.

All three are in the world. Don't change any of them.

Orbit around the box. Hotspots that `facesCamera` keeps turn yellow; the rest go grey.

<div data-scene="hotspots"></div>

## Your code

Write it in `drills/2/math/dot-product/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/math/dot-product/apply-1
```

## The check

It passes when `facesCamera` agrees with three.js's own `angleTo` for hotspots facing every way and cameras near and far, with normals of any length, and the inputs come back unchanged.

<details>
<summary>Hint</summary>

Only the sign matters here, so nothing needs normalizing. Which two directions do you compare?

</details>

## Where else?

Where else does the sign of a dot product answer a yes-or-no question?

<details>
<summary>A few answers</summary>

Whether a target is in front of a guard or behind. Whether a point is above or below a floor. Whether a light reaches a surface at all.

</details>
