---
id: 4.camera.project-unproject.cross.1
loop: 4
tier: core
concepts: [camera.project-unproject, camera.world-size-per-pixel, queries.filtering, interaction.anchoring]
mode: cross-domain
context: camera.project-unproject/labels-3d
lenses: [space]
misconceptions: []
---

# Constant-size labels that hide when occluded

> **The job:** combine ideas from several domains in one small piece of code.

## Task

Write `labelState(point, camera, width, height, pixelsTall, blockers)` for a world point. Return its screen x/y, the world height that would cover `pixelsTall` pixels at that depth, and whether it is visible. Hide it if it is behind the camera, outside the view, or a blocker lies between the camera and point. Update camera and blocker world matrices first.

<div data-scene="labels"></div>

## Spaces

| Value | Space |
| --- | --- |
| `point`, blockers | World space |
| `point.project(camera)` | Normalized device coordinates |
| `x`, `y` | Canvas pixels from top left |
| `worldHeight` | World units at the point's depth |

## Your code

Write it in `cross/4/occluded-label/drill.ts`. Save to update the scene. Check it with:

```
npm run drill -- cross/4/occluded-label
```

## The check

The check covers a visible point, one behind the camera, and a near blocker. It compares screen projection and world size with the perspective camera's geometry.

<details><summary>Hint</summary>

Use the relevant three.js methods shown on the concept pages. Make the result observable before trying to optimize it.

</details>

## Where else?

Where else would this choice appear in an interactive 3D tool?
