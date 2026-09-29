---
id: debugging.nothing-renders
name: Nothing-renders checklist
domain: debugging
tier: light
prerequisites: [debugging.triage, camera.frustum, geometry.winding-order]
misconceptions:
  loaded-visible: '"If it loaded, it''s visible."'
contexts:
  invisible-model: Invisible loaded model
  invisible-geometry: Invisible custom geometry
  black-post: Black post-processing output
---

## Definition

When something doesn't show up, run the same seven checks in order: in the scene, between near and far, in view, a sensible size, facing the camera, lit, and free of NaN.
