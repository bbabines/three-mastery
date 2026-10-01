---
id: 2.queries.closest-point.apply.1
loop: 2
tier: light
concepts: [queries.closest-point]
mode: apply
context: queries.closest-point/distance-measure
lenses: []
misconceptions: []
---

# Closest point: snap to an edge

> **The job:** Snap a pointer point to the nearest point on a finite edge.

## Task

Return the nearest point on a finite Line3 segment to a world point. Clamp to the endpoints, and do not change the inputs.

| Function | Return |
| --- | --- |
| `snapToEdge(point: THREE.Vector3, edge: THREE.Line3)` | The nearest point on the finite edge. |

Try the scene. The readout changes when your function gives an answer.

<div data-scene="practice"></div>

## Your code

Write it in `drills/2/queries/closest-point/apply-1/drill.ts`. Save, and the scene runs it. To check it as you go:

```
npm run drill -- drills/2/queries/closest-point/apply-1
```

## The check

The test snaps before, inside, and beyond an angled segment without changing its endpoints.

<details><summary>Hint</summary>

Line3.closestPointToPoint takes a flag that clamps to the segment.

</details>

## Where else?

Where else is a finite edge different from an endless line?

<details><summary>A few answers</summary> Rail snapping, proximity hover, or a short drag track. </details>
