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

A closest-point query gives the spot on a ray, segment, box, sphere, or triangle that's nearest to a given point, usually on an edge or a face.

## Space lens

The shape and the point must be in the same space, and the answer comes back in that space too.
