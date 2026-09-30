---
id: debugging.isolation
name: Isolation
domain: debugging
tier: core
prerequisites: [debugging.triage, scene-graph.visibility-layers, scene-graph.material-override]
misconceptions:
  read-until: '"Read the code until you see it."'
contexts:
  z-fighting: Z-fighting source
  hotspot: Performance hotspot
  bad-material: Bad material
---

## Definition

Isolation is narrowing a bug down by changing what the scene draws, one thing at a time, until a single change turns the bug on or off.

## Cost lens

`renderer.info` counts what the last render drew, so hiding a group and comparing its draw calls and triangles shows what that group adds. Whether those counts are what makes a frame slow takes measuring, in the GPU pipeline domain.
