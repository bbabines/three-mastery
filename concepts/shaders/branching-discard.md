---
id: shaders.branching-discard
name: Branching and discard
domain: shaders
tier: light
prerequisites: [shaders.built-in-functions, gpu.depth-early-z]
misconceptions:
  if-free: '"An if statement is free."'
contexts:
  alpha-cutout: Alpha cutout
  masks: Masks
  conditional-effects: Conditional effects
---

## Definition

A shader can take different paths with an if, and a fragment shader can throw its fragment away, leaving no color and no depth, and both have a cost that depends on the situation.

## Cost lens

An `if` that goes different ways for neighboring pixels can make the GPU run both sides for them, while one on a uniform runs only one side. `discard` saves none of the work already done, and can stop the GPU from rejecting hidden fragments before shading them.
