---
id: jewelry.small-textures
name: Small tiling textures and triplanar mapping
domain: jewelry
prerequisites: [geometry.uvs, materials.color-spaces, shaders.extending-materials, jewelry.polished-metal]
misconceptions:
  need-4k: '"Realistic textures have to be 4K."'
  roughness-is-color: '"Every texture should be marked sRGB."'
  needs-uvs: '"A texture needs the mesh''s UVs."'
  color-is-enough: '"The color map is what makes it look real."'
contexts:
  wood-inlay: Wood or stone inlays on a ring
  cad-no-uvs: CAD exports with no usable UVs
  swatch-library: A library of material swatches in a configurator
---

## Definition

A small seamless photo of a material, repeated and projected onto a part from three sides, with a gray copy of it controlling the shine, gives a realistic surface without UVs or big files.

## Cost lens

Two 1024² JPGs are about 0.7 MB to download and about 11 MB of GPU memory with mipmaps; 4K versions would be 16 times the GPU memory. Projecting reads each map three times instead of once, which is GPU work for every pixel the part covers.
