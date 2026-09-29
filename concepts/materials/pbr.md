---
id: materials.pbr
name: PBR metal and roughness
domain: materials
tier: core
prerequisites: [materials.specular]
misconceptions:
  half-metal: '"Metalness 0.5 is a realistic semi-metal."'
contexts:
  steel-coat-rubber: Bare steel vs powder coat vs rubber
  chrome: Chrome
  brushed: Brushed finishes
---

## Definition

Physically based rendering (PBR) describes a surface with two numbers that follow how real materials behave: metalness says whether it's a metal, which has no diffuse color and tints its reflections, or a non-metal, which has its own diffuse color under faint, untinted reflections; roughness says how sharp or blurry the reflections and highlights are.

## Cost lens

`MeshStandardMaterial` does more GPU work for every pixel than Lambert or Phong. Its reflections read an environment map, which three.js prefilters once so that each pixel only reads the blur level its roughness needs.
