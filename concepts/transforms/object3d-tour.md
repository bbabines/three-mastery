---
id: transforms.object3d-tour
name: 'Tour: the Object3D API'
domain: transforms
tier: light
prerequisites: [math.point-vs-direction]
misconceptions:
  position-assign: '"object.position = v sets the position." It''s read-only and throws; use set or copy.'
  rotation-quaternion-separate: '"rotation and quaternion are two separate turns." They''re two views of one turn and stay in sync.'
contexts:
  place-product: Placing and turning a product
  hide-part: Hiding a part
  tag-sku: Tagging a part with its SKU
---

## Definition

Everything in a three.js scene, including meshes, lights, cameras, and groups, is an Object3D, so they all share one set of properties and methods for placing, attaching, hiding, and tagging them.

## Space lens

`position`, `rotation`, `quaternion`, and `scale` are measured from the parent. `getWorldPosition` and the other `getWorld…` methods answer in the world, and `lookAt` takes a spot in the world.
