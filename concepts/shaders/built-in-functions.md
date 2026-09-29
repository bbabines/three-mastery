---
id: shaders.built-in-functions
name: Built-in functions
domain: shaders
tier: core
prerequisites: [shaders.attributes-uniforms-varyings, math.lerp]
misconceptions:
  step-smoothstep: '"step and smoothstep are interchangeable."'
contexts:
  stripes: Stripes
  rings: Rings
  falloff: Falloff masks
---

## Definition

GLSL comes with small built-in functions, like `mix`, `step`, `smoothstep`, `clamp`, `fract`, `mod`, `dot`, and `reflect`, that shaders combine to make patterns, edges, fades, and blends, working on each part of a vector at once.

## Cost lens

In a fragment shader they're GPU work for every pixel. As a rule of thumb each one is cheap, so choosing between `step` and `smoothstep` is about how the edge looks, not what it costs.
