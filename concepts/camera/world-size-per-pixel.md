---
id: camera.world-size-per-pixel
name: World size per pixel
domain: camera
tier: light
prerequisites: [camera.clip-ndc-screen]
misconceptions:
  constant-size: '"On-screen size is constant across depth."'
contexts:
  hotspots: Constant-size hotspots
  lod: LOD selection
  gizmo: Gizmo scaling
---

## Definition

At a given depth in front of a perspective camera, one pixel covers a certain width of the world, and that width grows in step with the depth, so something that should stay the same size on screen has to be scaled with its depth.

## Space lens

The depth is view depth, along the camera's forward axis, not straight-line distance. The answer is world units per pixel, in whatever kind of pixels (CSS or device) the height you divide by is measured in.
