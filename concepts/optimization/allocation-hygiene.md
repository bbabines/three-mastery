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

Allocation hygiene is making code that runs every frame reuse a few scratch vectors, matrices, and arrays instead of creating new ones on every call, so the garbage collector has little to clean up.

## Cost lens

CPU time on the main thread. Creating an object is quick; the cost comes later, when the garbage collector finds and frees the objects nothing uses anymore, at a moment the browser picks, which can be the middle of a frame. As a rule of thumb, thousands of throwaway objects a frame make collections frequent enough to cause regular stutters.
