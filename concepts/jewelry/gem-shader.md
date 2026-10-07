---
id: jewelry.gem-shader
name: The gem shader
domain: jewelry
prerequisites: [queries.bvh, shaders.built-in-functions, shaders.built-in-matrices, jewelry.pro-file, jewelry.two-environments]
misconceptions:
  transmission: '"Transmission makes a convincing diamond."'
  more-bounces: '"More bounces always look better."'
contexts:
  diamonds: Diamonds in a product viewer
  colored-stones: Rubies, emeralds, and sapphires
  crystal-glass: Crystal and glass objects
---

## Definition

A gem shader traces light inside a stone: it bends the light in at the surface, bounces it off the insides of the back facets until it can leave, and looks up the environment in the direction it leaves.

## Cost lens

GPU work for every pixel the stones cover: each bounce is a BVH search through the stone's triangles, and dispersion triples it. The BVH costs GPU memory once per cut.
