---
id: interaction.frame-rate-independence
name: Frame-rate-independent motion
domain: interaction
tier: core
prerequisites: [math.lerp]
misconceptions:
  lerp-per-frame: '"lerp(x, target, 0.1) each frame is fine." It runs twice as fast at 120 Hz.'
contexts:
  camera-smoothing: Camera smoothing
  hover-scale: Hover scale
  drag-smoothing: Drag smoothing
---

## Definition

Anything that moves a little every frame has to be scaled by how long the frame took, so it moves the same at any frame rate; for easing toward a goal, that means damping with `MathUtils.damp` instead of a fixed `lerp` fraction.

## Cost lens

None to speak of: `damp` is one `Math.exp` per value per frame. The cost of getting it wrong is behavior, not time.
