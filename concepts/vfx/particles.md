---
id: vfx.particles
name: Particle fundamentals
domain: vfx
prerequisites: [math.lerp, interaction.frame-rate-independence]
misconceptions:
  per-frame: '"Spawn rate is per frame." A rate is particles per second and must use elapsed seconds.'
contexts:
  sparks: Sparks
  dust: Dust
  ui-bursts: UI bursts
---

## Definition

A particle emitter creates small objects at a rate per second, gives each a lifetime, and changes properties using its normalized age.

## Cost lens

Particle count, transparent overdraw, and per-frame updates grow with rate times lifetime; reuse geometry and materials.
