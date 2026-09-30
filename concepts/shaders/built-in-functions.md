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

GLSL comes with small built-in functions for blending, cutting, fading, and repeating values, which shaders chain together to make patterns and effects.

## Cost lens

In a fragment shader they're GPU work for every pixel. Each one is usually cheap, so choosing between `step` and `smoothstep` is about how the edge looks, not what it costs.
