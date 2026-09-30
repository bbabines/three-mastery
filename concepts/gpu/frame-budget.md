---
id: gpu.frame-budget
name: Frame budget
domain: gpu
tier: core
prerequisites: [gpu.draw-call-anatomy]
misconceptions:
  fps-headroom: '"FPS shows headroom." Vsync caps it; measure frame time.'
contexts:
  setting-targets: Setting targets
  comparing-devices: Comparing devices
  judging-fix: Judging a fix
---

## Definition

A frame has to be ready by the screen's next refresh, and because the CPU and the GPU work side by side, the slower of the two sets the frame time.

## Cost lens

CPU time and GPU time each have to fit within the budget, and because they overlap, they don't add up. Saving time on the faster side leaves the frame time where it was.
