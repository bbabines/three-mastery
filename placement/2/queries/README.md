---
id: 2.queries.placement
loop: 2
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

# Placement check: queries

No docs or three.js source. Write every function from memory, then run `npm run pick -- done` once. The check records missed parts, and passing all parts suggests skipping this domain's drills.

| Function | Returns |
| --- | --- |
| `pointAhead(ray: THREE.Ray, distance: number)` | The point at that distance along the forward ray. |
| `pointerNdc(clientX: number, clientY: number, rect: { left: number; top: number; width: number; height: number })` | The pointer as canvas-relative NDC. |
| `worldHitNormal(normal: THREE.Vector3, object: THREE.Object3D)` | The hit face normal in world space. |
| `firstTargetName(ray: THREE.Ray, targets: THREE.Object3D[])` | The nearest name among only the target objects. |
| `planeDragPoint(ray: THREE.Ray, plane: THREE.Plane)` | The world hit point or ray origin on a miss. |
| `hotspotPoint(ray: THREE.Ray, sphere: THREE.Sphere)` | The hotspot hit in front of the ray, or its origin on a miss. |
| `frontFacePoint(ray: THREE.Ray, a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3)` | The front-face triangle hit or ray origin on a miss. |
| `rayTouchesBox(ray: THREE.Ray, box: THREE.Box3)` | Whether the forward ray touches the box. |
| `positiveSide(plane: THREE.Plane, point: THREE.Vector3)` | Whether the point lies on the positive side of the plane. |
| `worldAabbSize(mesh: THREE.Mesh)` | The axis-aligned world box size of a rotated Mesh. |
| `snapToEdge(point: THREE.Vector3, edge: THREE.Line3)` | The nearest point on the finite edge. |
| `candidateLeafIds(ray: THREE.Ray, root: THREE.Object3D)` | IDs of leaf boxes touched by the ray. |
