---
id: debugging.triage
name: Triage
domain: debugging
tier: core
prerequisites: [camera.frustum, gpu.multi-pass, materials.materials-tour]
misconceptions:
  black-screen-shader: '"A black screen means a broken shader."'
contexts:
  black-screen: Black screen
  missing-object: Missing object
  wrong-color: Wrong color
---

## Definition

Triage is sorting a rendering bug into one of five buckets, transform, geometry, material (lights included), camera, or pipeline, before changing any code.
