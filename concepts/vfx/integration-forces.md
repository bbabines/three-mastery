---
id: vfx.integration-forces
name: Integration and forces
domain: vfx
prerequisites: [vfx.particles, interaction.frame-rate-independence]
misconceptions:
  order-doesnt-matter: '"Position and velocity update order does not matter." Semi-implicit Euler moves by the new velocity.'
contexts:
  gravity: Gravity sparks
  wind: Wind
  motes: Orbiting motes
---

## Definition

Semi-implicit Euler integration advances velocity from acceleration, then advances position from that new velocity over the elapsed time.

## Cost lens

Each particle gets a few vector operations per step; large or irregular time steps cause greater error than many small steady steps.
