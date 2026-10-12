---
id: product.tactile-materials
name: Tactile materials and texture scale
domain: product
prerequisites: [product.geometry-fidelity, materials.pbr, materials.texture-sampling]
misconceptions:
  stronger-normal: Increasing normal strength always makes grain more realistic.
  color-roughness: Color brightness universally describes surface roughness.
  universal-pattern: One grain texture can represent leather, wood, and fabric.
  leather-metal: The reference's nonzero metalness is physically correct for ordinary leather.
contexts:
  straps: Leather watch straps
  upholstery: Fabric upholstery
  handles: Wood handles and rubber grips
  brushing: Brushed metal surfaces
---

## Definition

Tactile appearance combines surface pattern and scale, normal and roughness response, and illumination that reveals detail at the available screen resolution.

## Cost lens

Textures add download and GPU memory costs. Extra physical-material layers add per-pixel shading work; invisible detail still costs resources.
