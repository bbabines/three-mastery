---
id: tactile.metal
name: 'Metal: all light, no maps'
domain: tactile
prerequisites: [tactile.before-you-light, materials.pbr, materials.environment-maps]
misconceptions:
  light-makes-it-shine: '"A light will make metal shine."'
  any-hdri: '"Any HDRI will do for metal."'
  metal-per-light: '"Different metals need different lighting setups."'
contexts:
  jewelry-viewer: A jewelry viewer with gold, silver, platinum, and rose gold options
  chrome-hardware: Chrome faucets and hardware in a product configurator
  watch-case: A polished watch case
---

## Definition

Polished metal is a tinted mirror: with metalness 1 and a low roughness, its look comes almost entirely from what it reflects. The HDRI decides the bright bands and dark lines, tone mapping decides whether the bright reflections clip, and extra lights add only a dot (directional, point) or a band (RectAreaLight); ambient light does nothing to it.

## Cost lens

No textures, so metal costs almost nothing in memory. The HDRI's prefiltering (PMREM) runs once when it's set. A RectAreaLight adds per-pixel work on every lit material, and casts no shadow.
