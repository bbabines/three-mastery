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

Physically based rendering (PBR) describes a surface with two numbers that act like real materials: metalness, whether it's a metal, and roughness, how sharp or blurry its reflections are.

## Cost lens

`MeshStandardMaterial` does more GPU work for every pixel than Lambert or Phong. Its reflections read an environment map, which three.js prefilters once so that each pixel only reads the blur level its roughness needs.
