---
id: gpu.depth-early-z
name: Depth buffer and early-z
domain: gpu
tier: core
prerequisites: [gpu.state-sorting, camera.depth-precision]
misconceptions:
  hidden-free: '"Hidden objects cost nothing."'
contexts:
  overdraw: Overdraw
  alpha-tested: Alpha-tested mesh panels
  depth-prepass: Depth prepass
---

## Definition

The depth buffer keeps the nearest depth drawn so far at every pixel, and the depth test throws away fragments behind it; GPUs can often run that test before the fragment shader ("early-z") and skip shading hidden fragments, but a shader that discards (as `alphaTest` does) or writes its own depth can stop that.

## Cost lens

An object hidden behind another still costs CPU time for its draw call and GPU vertex work for its vertices. Its fragments cost GPU work for every pixel too, unless something nearer was drawn first and the GPU rejects them before shading.
