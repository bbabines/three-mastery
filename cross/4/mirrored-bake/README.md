---
id: 4.geometry.winding-order.cross.1
loop: 4
tier: core
concepts: [transforms.trs-order, geometry.winding-order, materials.materials-tour, transforms.negative-scale]
mode: cross-domain
context: transforms.negative-scale/mirrored-import
lenses: []
misconceptions: []
---

# Mirrored variant renders inside-out after baking

> **The job:** Bake a mirrored part without turning its front faces inward.

## Task

A negative-scale transform from an imported part is baked into vertex data for a left-hand variant. Write `bakeMirror(geometry, transform)` to return a clone with the transform applied. If the transform reverses handedness, reverse each triangle's winding, for both indexed and non-indexed geometry. Swap every non-indexed vertex attribute together, so UVs and normals stay with their corners. Do not change the original.

<div data-scene="mirror"></div>

## Your code

Write it in `cross/4/mirrored-bake/drill.ts`. Save to update the scene. Check it with:

```
npm run drill -- cross/4/mirrored-bake
```

## The check

The check raycasts the front of both indexed and non-indexed triangles after a mirror and checks the original geometry is unchanged.

<details><summary>Hint</summary>

A negative determinant reverses handedness. Inspect what that does to each triangle and all attributes at its corners.

</details>

## Where else?

Where else can a baked mirror invert front faces?

<details><summary>A few answers</summary>

A left-hand part variant, an imported mirrored axis system, or a reflected prop.

</details>
