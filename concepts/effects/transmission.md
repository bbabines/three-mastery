---
id: effects.transmission
name: Glass
domain: effects
prerequisites: [materials.pbr, gpu.blending, gpu.render-targets]
misconceptions:
  opacity-is-glass: '"Lower opacity makes glass."'
  sees-transparent: '"Glass shows other see-through parts behind it."'
contexts:
  watch-crystal: A watch crystal over a dial
  bottle: A perfume bottle or a glass of water
  headlight: A car headlight cover
---

## Definition

Transmission makes a material let light through the way glass does: it shows what's behind it, bent by its thickness and index of refraction, while keeping full-strength reflections on its surface.

## Cost lens

Each frame the renderer copies what's already drawn, with blurred smaller copies for rough glass, and the glass reads that copy; double-sided glass draws its back faces too, with a second copy. The copy holds only what was drawn before it, so other see-through parts can be missing from it.
