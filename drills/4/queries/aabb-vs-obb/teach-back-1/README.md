---
id: 4.queries.aabb-vs-obb.teach-back.1
loop: 4
tier: light
concepts: [queries.aabb-vs-obb]
mode: teach-back
context: queries.aabb-vs-obb/rotated-parts
lenses: [space, cost]
misconceptions: [queries.aabb-vs-obb/box3-tight]
---

# Rotated parts: explain the bounds choice

> **The job:** choose a bound for two long rotated parts whose world boxes overlap.

## Task

Two long, rotated parts have overlapping world `Box3` bounds, yet the parts appear separate. Explain which bound answers a quick rejection and which gives a tighter overlap test. No docs for this one. Write your answer in the box, then reveal the key points and compare. Nothing is graded.

## Spaces

| Bound | Space and shape |
| --- | --- |
| `Box3().setFromObject(part)` | World-space, axis-aligned box |
| `geometry.boundingBox` | Geometry's local-space, axis-aligned box |
| OBB after `applyMatrix4(part.matrixWorld)` | World-space, oriented box |

## Measure

Count how many candidates survive the cheap AABB rejection before running OBB intersections, and measure the total query time for the actual scene. Timing is evidence for the choice, not a pass threshold.

<div data-teach-back>
<ol>
<li>Update world transforms before computing bounds for moving or rotated parts.</li>
<li>A world `Box3` stays aligned to world axes, so a rotated skinny part can leave large empty corners inside it.</li>
<li>Use AABB overlap first to reject pairs that definitely cannot touch.</li>
<li>Build an OBB from each geometry's local bounding box and transform it by that part's `matrixWorld` for a tighter test.</li>
<li>Run the more costly OBB intersection only for surviving candidates; even tight bounds are a proxy for the actual mesh.</li>
</ol>
</div>

## Where else?

Which box would you draw to show a user a rotated part's tight bounds?
