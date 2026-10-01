---
id: 2.interaction.anchoring.implement.1
loop: 2
tier: core
concepts: [interaction.anchoring]
mode: implement
context: interaction.anchoring/price-tags
lenses: [space]
misconceptions: []
---

# Anchor: place an HTML label

> **The job:** Project a world point to CSS pixels and hide it when behind the camera.

## Task

Return `{x, y, visible}` for a world point in a canvas rectangle. Update the camera matrix first. A point behind the camera must be hidden even when its projected x and y look onscreen.

| Function | Return |
| --- | --- |
| `labelPosition(world: THREE.Vector3, camera: THREE.Camera, rect: { left: number; top: number; width: number; height: number })` | CSS position and visibility for a projected world point. |

The blue hotspot is in front of the camera; the yellow one is behind it. Your visible flag should hide the rear label while the front label lands over its hotspot.

<div data-scene="practice"></div>

## Spaces

| Value | Space |
| --- | --- |
| Inputs and answer | World space unless named otherwise in the task. |

## Your code

Write it in `drills/2/interaction/anchoring/implement-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/interaction/anchoring/implement-1
```

## The check

The check verifies that the code places a front point in CSS pixels and hides one behind. It also rejects an unanswered function.

<details><summary>Hint</summary>

A projection alone does not decide whether a point lies behind the camera.

</details>

## Where else?

How would this change for a hotspot on an occluded moving part?
