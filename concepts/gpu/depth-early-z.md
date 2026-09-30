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

The depth buffer keeps the nearest depth drawn so far at every pixel, and GPUs can often test fragments against it before shading them, which a shader that discards can stop.

## Cost lens

A hidden object still costs CPU time for its draw call and GPU vertex work for its vertices. Its fragments cost GPU work for every pixel too, unless something nearer was drawn first and the GPU rejects them early.
