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

> **The job:** Keep a label the same screen size and hide it behind nearer geometry.

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

Projection gives the screen position; visibility also depends on what lies between the camera and the point.

</details>

## Where else?

What other overlay needs both projection and an occlusion check?

<details><summary>A few answers</summary>

Product hotspots, building annotations, or a measurement marker anchored to a hidden part.

</details>
