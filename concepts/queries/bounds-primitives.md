---
id: queries.bounds-primitives
name: Bounds primitives
domain: queries
tier: light
prerequisites: [geometry.bounding-volumes, camera.frustum]
misconceptions:
  plane-distance-positive: '"Plane distance is always positive." It''s signed.'
contexts:
  placement-overlap: Placement overlap
  visibility: Visibility
  trigger-volumes: Trigger volumes
---

## Definition

Boxes, spheres, planes, and camera frustums are simple shapes that answer "is this inside?" and "do these overlap?" quickly, and a plane's distance to a point is signed.

## Space lens

The shapes and the points you test must be in the same space, normally the world. Bounds stored on a geometry are measured from the object itself until you move them with `applyMatrix4(object.matrixWorld)`.

## Cost lens

Each test is a few comparisons or multiplications, cheap enough to run for every object every frame, unlike testing triangles.
