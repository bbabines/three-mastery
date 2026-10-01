---
id: 4.queries.placement
loop: 4
domain: queries
parts:
  - queries.ray
  - queries.ray-from-pointer
  - queries.intersection-anatomy
  - queries.filtering
  - queries.ray-plane
  - queries.ray-sphere
  - queries.ray-triangle
  - queries.ray-aabb
  - queries.bounds-primitives
  - queries.aabb-vs-obb
  - queries.closest-point
  - queries.bvh
---

# Placement check: Spatial queries

A no-docs check of the decisions in this domain. Write every function in `placement/4/queries/check.ts` from memory, then run `npm run pick -- done` once. The first attempt is the one that counts. Passing every part suggests skipping this domain's practice; misses point to useful drills. Nothing is timed.

| Function | Decision |
| --- | --- |
| `pointAlongRay` | Find a point forward along a ray. |
| `pointerRay` | Build a world ray from a pointer's NDC position. |
| `hitPoint` | Take the world-space hit point from an intersection. |
| `selectableHits` | Raycast only a chosen target list, including descendants. |
| `floorPoint` | Find a ray hit on a horizontal plane. |
| `spherePoint` | Find the first point where a ray meets a sphere. |
| `trianglePoint` | Intersect a ray with a front-facing triangle. |
| `boxPoint` | Find a ray's first hit on an axis-aligned box. |
| `objectSphere` | Find a world bounding sphere for nested objects. |
| `worldAabb` | Return an axis-aligned world box after a turn. |
| `nearestOnSegment` | Find the closest point on a finite segment. |
| `nearestAcceleratedHit` | Keep the nearest hit from an accelerated query. |
