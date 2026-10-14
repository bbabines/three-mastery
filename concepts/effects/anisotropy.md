---
id: effects.anisotropy
name: Brushed metal
domain: effects
prerequisites: [materials.pbr, geometry.tangent-space, geometry.uvs]
misconceptions:
  painted-brushing: '"A brushed-looking color map makes brushed metal."'
contexts:
  watch-dial: A sunburst watch dial
  appliance: A brushed-steel appliance or laptop lid
  hair: Hair and satin, which stretch highlights too
---

## Definition

Anisotropy stretches a material's highlights in one direction across the surface, the way fine brushing grooves do on metal, instead of leaving them round.

## Cost lens

It adds a little shading work for every pixel of the brushed part, and needs a direction across the surface: tangents from the mesh, or from its UVs, turned by a rotation or a direction map. It costs nothing on parts that don't use it.
