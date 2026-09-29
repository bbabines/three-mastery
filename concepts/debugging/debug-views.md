---
id: debugging.debug-views
name: Debug views
domain: debugging
tier: light
prerequisites: [debugging.helpers, geometry.vertex-normals, geometry.uvs, camera.depth-precision]
misconceptions:
  normals-lighting: '"Bad normals only look like bad lighting."'
contexts:
  normal-problems: Normal problems
  uv-stretching: UV stretching
  depth-issues: Depth issues
---

## Definition

A debug view draws hidden data as the picture itself: wireframe shows the triangles, MeshNormalMaterial colors each surface by the way it faces the camera, a depth material shades by distance from the camera, and a checker texture shows how the UVs lay a picture over the shape.

## Space lens

MeshNormalMaterial's colors are normals measured from the camera (view space), so they change as the camera orbits. World-space normals as colors take a small shader of your own.

## Cost lens

Wireframe draws lines three.js builds from the triangles, so it adds memory and changes the drawing work; switch debug views off before measuring.
