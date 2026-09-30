---
id: 1.queries.closest-point.read-the-code.1
loop: 1
tier: light
concepts: [queries.closest-point]
mode: read-the-code
context: queries.closest-point/edge-snap
lenses: []
misconceptions:
  - queries.closest-point/nearest-vertex
---

# Closest-point queries

> **In short:** three.js can find the spot on any simple shape nearest to a point, and it's rarely a corner.
>
> **Used for:** Snapping cables to edges, measuring gaps to walls, hovering near tiny markers, and keeping cameras off surfaces.

## A · The basics

### The nearest spot, not the nearest corner

Ask "what's the nearest spot on this triangle to that point?" and the answer is usually not one of its corners. Stand in front of a wall and the nearest spot on it is straight ahead, in the middle of the wall. It's a corner only when the point is off past that corner.

three.js has a method for each shape, and each one writes the nearest spot into a target you pass:

```js
triangle.closestPointToPoint(p, spot);      // on the face, an edge, or a corner
segment.closestPointToPoint(p, true, spot); // true: stop at the segment's ends
```

**Analogy: walking to a straight road.** The shortest way to a road from a field meets it at a right angle, somewhere along it, almost never at a mile marker. The mile markers are the corners.

Move the point. The white lines run to the nearest spot on the triangle and on the rail; the gray line runs to the triangle's nearest corner, which is almost always farther.

<div data-scene="nearestSpot"></div>

## B · Working knowledge

### One method per shape

| Code | Gives back |
| --- | --- |
| `ray.closestPointToPoint(p, spot)` | The nearest spot on the ray |
| `line.closestPointToPoint(p, true, spot)` | The nearest spot on a `Line3` |
| `box.clampPoint(p, spot)` | The nearest spot in a `Box3`: `p` if inside |
| `sphere.clampPoint(p, spot)` | The same for a `Sphere` |
| `triangle.closestPointToPoint(p, spot)` | The nearest spot on a `Triangle` |

### Snapping to an edge

```js
const edge = new Line3(cornerA, cornerB);
edge.closestPointToPoint(dragged, true, snap);
if (snap.distanceTo(dragged) < 0.1) cable.position.copy(snap); // close enough: snap to the edge
```

### Hovering near something tiny

A pin or a point in a scan is too small to hit exactly. Measure how close the pointer's ray passes instead:

```js
raycaster.setFromCamera(pointer, camera);
const near = raycaster.ray.distanceToPoint(pin.getWorldPosition(v)) < 0.2;
```

That's how three.js raycasts `Points`: a point counts as hit when the ray passes within `raycaster.params.Points.threshold` of it.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
