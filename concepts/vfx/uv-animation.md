---
id: vfx.uv-animation
name: UV animation
domain: vfx
prerequisites: [geometry.uvs, shaders.fragment-coordinates]
misconceptions:
  raw-time-forever: '"Scrolling by raw time runs forever." Large float phases lose precision; wrap repeated motion.'
contexts:
  energy: Scrolling energy
  vortex: Vortex
  water: Flowing water
---

## Definition

UV animation changes the coordinates used to sample a pattern over time, so the pattern moves while the mesh stays put.

## Cost lens

Simple UV offset and rotation cost little; a flow map adds a texture read and often a second blended sample.
