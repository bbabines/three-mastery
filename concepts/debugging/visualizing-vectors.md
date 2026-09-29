---
id: debugging.visualizing-vectors
name: Visualizing vectors
domain: debugging
tier: light
prerequisites: [debugging.helpers, transforms.local-vs-world, transforms.points-vs-directions]
misconceptions:
  parent-irrelevant: '"A helper shows the value no matter where it''s parented."'
contexts:
  normal-direction: Normal direction
  ray-direction: Ray direction
  velocity: Velocity
---

## Definition

To see a direction, draw it with an ArrowHelper that starts at the right point and sits under the object whose space the direction is measured in.

## Space lens

An ArrowHelper reads its start point, its direction, and its length in its parent's space. A direction measured from an object itself, like a vertex normal, goes on an arrow added to that object; a direction in the world, like a ray or a world velocity, goes on an arrow added to the scene.
