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

A frame has to be ready by the display's next refresh, 16.67 ms at 60 Hz and 8.33 ms at 120 Hz; the CPU prepares one frame while the GPU draws the one before, so the slower of the two sets the frame time, and an FPS counter stops at the refresh rate however much of the budget is left.

## Cost lens

CPU time and GPU time each have to fit within the budget; because they overlap, they don't add up. Saving time on the side that isn't the slower one leaves the frame time where it was.
