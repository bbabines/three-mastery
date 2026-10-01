---
id: 4.geometry.winding-order.cross.1
loop: 4
tier: core
concepts: [transforms.trs-order, geometry.winding-order, materials.materials-tour]
mode: cross-domain
context: geometry.winding-order/mirrored
lenses: []
misconceptions: []
---

# Mirrored variant renders inside-out after baking

> **The job:** combine ideas from several domains in one small piece of code.

## Task

A negative-scale transform is baked into vertex data for a left-hand variant. Write `bakeMirror(geometry, transform)` to return a clone with the transform applied. If the transform reverses handedness, reverse each triangle's winding, for both indexed and non-indexed geometry. Swap every non-indexed vertex attribute together, so UVs and normals stay with their corners. Do not change the original.

<div data-scene="mirror"></div>

## Your code

Write it in `cross/4/mirrored-bake/drill.ts`. Save to update the scene. Check it with:

```
npm run drill -- cross/4/mirrored-bake
```

## The check

The check raycasts the front of both indexed and non-indexed triangles after a mirror and checks the original geometry is unchanged.

<details><summary>Hint</summary>

Use the relevant three.js methods shown on the concept pages. Check the behavior rather than only the code shape.

</details>

## Where else?

Where else would this choice appear in a product viewer or tool?
