---
id: queries.closest-point
name: Closest-point queries
domain: queries
tier: light
prerequisites: [queries.bounds-primitives, math.projection-rejection]
misconceptions:
  nearest-vertex: '"The closest point is the nearest vertex."'
contexts:
  edge-snap: Snapping to an edge
  distance-measure: Distance measurement
  proximity-hover: Proximity hover
---

## Definition

Closest-point methods give the spot on a shape, a ray, a line segment, a box, a sphere, or a triangle, that's nearest to a given point, and that spot is usually on an edge or a face, not at a corner.

## Space lens

The shape and the point must be in the same space, and the answer comes back in that space too.
