---
id: scene-graph.visibility-layers
name: Visibility, removal, layers
domain: scene-graph
tier: light
prerequisites: [scene-graph.traverse]
misconceptions:
  invisible-raycast: '"Invisible objects can''t be raycast." They can.'
contexts:
  hide-part: Hiding a part
  exclude-helpers: Excluding helpers from picks
  per-view: Per-view visibility
---

## Definition

Hiding an object stops it and everything under it being drawn while raycasts still hit it, removing takes it out of the scene, and layers let each camera and raycaster pick which objects it deals with, one object at a time.

## Cost lens

A hidden object isn't drawn, but it still costs CPU time, since every render refreshes its matrices and scene-wide raycasts still test it. A removed object costs neither, but its geometry, materials, and textures stay in memory until they're disposed.
