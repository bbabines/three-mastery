---
id: optimization.allocation-hygiene
name: Allocation hygiene
domain: optimization
tier: core
prerequisites: [math.point-vs-direction, gpu.frame-budget]
misconceptions:
  gc-too-small: '"GC pauses are too small to notice."'
contexts:
  raycast-loops: Raycast loops
  per-frame-updates: Per-frame updates
  bounds-checks: Bounds checks
---

## Definition

Allocation hygiene is making code that runs every frame reuse scratch objects made once, instead of creating new ones on every call.

## Cost lens

CPU time on the main thread, paid later, when the garbage collector frees what was thrown away at a moment the browser picks. Thousands of throwaway objects a frame usually make that often enough to stutter.
